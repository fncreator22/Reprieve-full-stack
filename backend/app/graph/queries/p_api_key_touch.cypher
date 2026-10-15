// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (k:ApiKey {id: $id})
SET k.last_used_at = $now
RETURN k.id AS id
