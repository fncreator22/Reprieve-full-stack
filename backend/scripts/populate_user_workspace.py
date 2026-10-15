import asyncio

from app.graph.client import get_db
from app.graph.repo import Repo
from app.services.workspaces import provision, set_fields


async def main():
    db = get_db()
    platform = Repo(db, "dev_platform")
    ws_id = "ws_01m4kk3bkc65abxckx2kyes57p"
    user_email = "cobaj32492@herclan.com"

    print(f"Populating workspace {ws_id} (Raiyan-workspace) with full sample dataset...")
    await set_fields(platform, ws_id, data_mode="sample", clock_mode="simulated")
    await provision(platform, ws_id, data_mode="sample")
    print("Provisioning Raiyan-workspace completed successfully!")

    # Grant membership to Northwind Pay as well
    g = db.select_graph("dev_platform")
    query = """
    MATCH (u:User {email: $email}), (w:Workspace {id: $northwind_id})
    MERGE (u)-[r:MEMBER_OF]->(w)
    SET r.role = 'owner'
    """
    await g.query(query, {"email": user_email, "northwind_id": "ws_01m40d2pp9yc08y8cz6e5tnanm"})
    print(f"Granted user {user_email} owner access to Northwind Pay!")


if __name__ == "__main__":
    asyncio.run(main())
