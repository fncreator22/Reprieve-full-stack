// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (r:SentinelRun) RETURN r AS r ORDER BY r.started_at DESC LIMIT $limit
