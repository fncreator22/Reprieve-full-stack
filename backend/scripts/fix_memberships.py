import asyncio

from app.graph.client import get_db


async def main():
    db = get_db()
    g = db.select_graph("dev_platform")
    await g.query("MATCH (u:User)-[r:MEMBER_OF]->(w:Workspace) SET r.status = 'active'")
    await g.query(
        "MATCH (u:User {email: 'dev@localhost'}), (w:Workspace {id: 'ws_01m4kk3bkc65abxckx2kyes57p'}) "
        "MERGE (u)-[r:MEMBER_OF]->(w) SET r.role = 'owner', r.status = 'active'"
    )
    res = await g.query("MATCH (u:User)-[r:MEMBER_OF]->(w:Workspace) RETURN u.name, w.name, r.role, r.status")
    print("Updated memberships:")
    for row in res.result_set:
        print(" ", row)


if __name__ == "__main__":
    asyncio.run(main())
