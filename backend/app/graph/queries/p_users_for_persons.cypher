// map org Person ids to workspace users (for notifications)
MATCH (u:User)-[m:MEMBER_OF {status: 'active'}]->(w:Workspace {id: $ws_id})
WHERE m.person_id IN $person_ids
RETURN u.id AS user_id, m.person_id AS person_id
