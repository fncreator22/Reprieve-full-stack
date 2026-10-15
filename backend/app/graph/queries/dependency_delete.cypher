// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (:Service {id: $from_id})-[d:DEPENDS_ON]->(:Service {id: $to_id}) DELETE d
