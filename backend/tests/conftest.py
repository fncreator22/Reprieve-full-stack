import os

import pytest
from falkordb.asyncio import FalkorDB

from app.graph.repo import Repo

os.environ.setdefault("GRAPH_PREFIX", "test_")


@pytest.fixture
async def db():
    d = FalkorDB(host=os.getenv("FALKORDB_HOST", "localhost"), port=int(os.getenv("FALKORDB_PORT", "6379")))
    yield d
    for name in await d.list_graphs():
        if name.startswith("test_"):
            await d.select_graph(name).delete()
    await d.aclose()


@pytest.fixture
async def repo(db, request):
    return Repo(db, f"test_{request.node.name[:40]}")
