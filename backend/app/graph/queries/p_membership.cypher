// one workspace for one user (404 when absent)
MATCH (u:User {id: $user_id})-[m:MEMBER_OF {status: 'active'}]->(w:Workspace {id: $ws_id})
WHERE w.status <> 'deleting'
RETURN w AS w, m.role AS role, m.person_id AS person_id
