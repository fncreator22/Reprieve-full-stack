MATCH (u:User {id: $user_id})-[m:MEMBER_OF {status: 'active'}]->(w:Workspace {id: $ws_id})
SET m.person_id = $person_id
RETURN m.person_id AS person_id
