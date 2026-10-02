"""Memory graph: built-in playbooks, review outcomes, precedent recall (03 §6.1, FR-MEM-01/02)."""

import json
from typing import Any

from app.graph.repo import Repo

PLAYBOOKS = [
    {
        "id": "pbk_owner_orphaned",
        "name": "Owner orphaned",
        "trigger_rule_id": "R2",
        "steps": ["Route the review to the current team lead", "Notify the original approver"],
    },
    {
        "id": "pbk_renewal_treadmill",
        "name": "Renewal treadmill",
        "trigger_rule_id": "R5",
        "steps": ["Require a written rationale", "Escalate at chain length 3 or more"],
    },
    {
        "id": "pbk_single_fallback",
        "name": "Single fallback",
        "trigger_rule_id": "R3",
        "steps": ["Propose a second fallback person or runbook"],
    },
]


async def seed_playbooks(mem: Repo) -> None:
    rows = [{**{k: v for k, v in p.items() if k != "steps"}, "steps_json": json.dumps(p["steps"])} for p in PLAYBOOKS]
    await mem.write("mem_playbooks_seed", rows=rows)


async def record_outcome(mem: Repo, **fields: Any) -> None:
    await mem.write("mem_outcome_write", **fields)


async def precedent(mem: Repo, control_id: str, service_id: str | None, limit: int = 5) -> list[dict[str, Any]]:
    rows = await mem.read(
        "precedent", control_key=f"Control:{control_id}", service_key=f"Service:{service_id or ''}", limit=limit
    )
    return [
        {
            "outcome_id": r["id"],
            "decision": r["decision"],
            "note": r["note"],
            "decided_at": r["decided_at"],
            "same_service": r["same_service"],
            "renewal_depth": r["renewal_depth"],
            "exception_id": r["exception_id"],
        }
        for r in rows
    ]
