// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (u:User {id: $user_id})
RETURN u AS u
