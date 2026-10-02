MATCH (u:User)-[m:MEMBER_OF {status: 'active'}]->(w:Workspace {id: $ws_id})
RETURN u.id AS user_id, u.email AS email, u.name AS name, m.role AS role, m.person_id AS person_id
ORDER BY m.joined_at ASC
