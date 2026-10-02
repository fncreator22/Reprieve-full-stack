"""The only module that executes Cypher (02 §6 rule 2). Queries live in queries/*.cypher, referenced by file stem."""

from functools import lru_cache
from pathlib import Path
from typing import Any

from falkordb.asyncio import FalkorDB

QUERIES = Path(__file__).parent / "queries"
READ_TIMEOUT_MS = 2000
ALGO_TIMEOUT_MS = 5000
WRITE_TIMEOUT_MS = 10000
BATCH = 500

# Labels a query may be templated with via the `$$LABEL$$` token. Code constants only, never user input.
TEMPLATABLE_LABELS = frozenset(
    {
        "Person",
        "Team",
        "Service",
        "Control",
        "CompensatingControl",
        "CustomerPath",
        "Runbook",
        "Evidence",
        "Exception",
        "Alert",
        "Review",
    }
)

Row = dict[str, Any]


@lru_cache
def load(qid: str, label: str | None = None) -> str:
    text = (QUERIES / f"{qid}.cypher").read_text()
    if "$$LABEL$$" in text:
        if label not in TEMPLATABLE_LABELS:
            raise ValueError(f"label {label!r} not allowed for {qid}")
        text = text.replace("$$LABEL$$", label)
    return text


def _rows(result: Any) -> list[Row]:
    names = [h[1] for h in result.header]
    return [dict(zip(names, r, strict=True)) for r in result.result_set]


class Repo:
    """Executes named queries against one graph."""

    def __init__(self, db: FalkorDB, graph: str):
        self.db = db
        self.graph_name = graph
        self.g = db.select_graph(graph)

    async def read(
        self, qid: str, *, label: str | None = None, timeout: int = READ_TIMEOUT_MS, **params: Any
    ) -> list[Row]:
        return _rows(await self.g.ro_query(load(qid, label), params, timeout=timeout))

    async def write(self, qid: str, *, label: str | None = None, **params: Any) -> list[Row]:
        return _rows(await self.g.query(load(qid, label), params, timeout=WRITE_TIMEOUT_MS))

    async def write_batched(
        self, qid: str, rows: list[dict[str, Any]], *, label: str | None = None, **params: Any
    ) -> None:
        for i in range(0, len(rows), BATCH):
            await self.write(qid, label=label, rows=rows[i : i + BATCH], **params)

    # --- schema DDL (labels/props come from graph/schema.py constants) ---

    async def indexed(self) -> set[tuple[str, str]]:
        res = await self.g.query("CALL db.indexes() YIELD label, properties RETURN label, properties")
        return {(label, p) for label, props in res.result_set for p in props}

    async def create_index(self, label: str, prop: str) -> None:
        await self.g.query(f"CREATE INDEX FOR (n:{label}) ON (n.{prop})")

    async def constraints(self) -> list[dict[str, Any]]:
        return list(await self.g.list_constraints())

    async def create_constraint(self, kind: str, label: str, prop: str) -> None:
        if kind == "UNIQUE":
            await self.g.create_node_unique_constraint(label, prop)
        else:
            await self.g.create_node_mandatory_constraint(label, prop)

    async def exists(self) -> bool:
        return self.graph_name in await self.db.list_graphs()

    async def drop(self) -> None:
        if await self.exists():
            await self.g.delete()
