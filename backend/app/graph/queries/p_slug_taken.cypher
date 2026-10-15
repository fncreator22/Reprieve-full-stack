// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (w:Workspace {slug: $slug}) RETURN count(w) AS n
