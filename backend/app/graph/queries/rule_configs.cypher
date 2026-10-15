// Reprieve Graph Engine · Parameterized FalkorDB Cypher
MATCH (r:RuleConfig) RETURN r.rule_id AS rule_id, r.enabled AS enabled, r.params_json AS params_json
