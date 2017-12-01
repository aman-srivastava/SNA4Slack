CREATE TABLE sna4slack_metrics.nodes_relationships (
    id uuid PRIMARY KEY,
    centrality_metrices map<text, int>,
    distances map<text, int>,
    mentions map<text, int>,
    node_name text,
    team_name text,
    weight int
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';
CREATE INDEX nodes_relationships_team_name_idx ON sna4slack_metrics.nodes_relationships (team_name);
CREATE INDEX nodes_relationships_node_name_idx ON sna4slack_metrics.nodes_relationships (node_name);
