MATCH (u:User {id: $user_id})-[m:MEMBER_OF {status: 'active'}]->(w:Workspace)
WHERE w.status <> 'deleting'
RETURN w.id AS workspace_id, w.slug AS slug, w.name AS name, m.role AS role, m.person_id AS person_id, w.status AS status
ORDER BY w.created_at ASC
