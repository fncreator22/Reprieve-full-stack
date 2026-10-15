// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MERGE (m:SchemaMeta {key: 'schema'}) SET m.version = $version, m.applied_at = $now
