MATCH (u:User)-[m:MEMBER_OF {status: 'active'}]->(w:Workspace {id: $ws_id})
WHERE m.role IN ['owner', 'admin']
RETURN u.id AS user_id, u.name AS name, u.email AS email, m.person_id AS person_id
