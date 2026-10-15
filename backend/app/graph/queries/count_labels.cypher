// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (n) RETURN labels(n)[0] AS label, count(n) AS n
