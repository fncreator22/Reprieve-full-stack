// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH ()-[r:DEPENDS_ON]->() RETURN count(r) AS n
