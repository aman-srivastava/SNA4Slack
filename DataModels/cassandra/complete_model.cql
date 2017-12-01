CREATE KEYSPACE sna4slack_metrics WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TYPE sna4slack_metrics.slack_channel_message (
    "messageId" uuid,
    "messageSender" text,
    "messageBody" text,
    "messageTime" timestamp
);

CREATE TYPE sna4slack_metrics.slack_team_channel (
    "channelId" uuid,
    "channelName" text,
    "channelMessages" list<frozen<slack_channel_message>>
);

CREATE TYPE sna4slack_metrics.slack_team (
    "teamId" uuid,
    "teamName" text,
    "teamChannels" list<frozen<slack_team_channel>>
);

CREATE TABLE sna4slack_metrics.slack_archive (
    id uuid PRIMARY KEY,
    "channelName" text,
    "messageBody" text,
    "messageSender" text,
    "messageTime" timestamp,
    "teamName" text
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
CREATE INDEX "slack_archive_teamName_idx" ON sna4slack_metrics.slack_archive ("teamName");
CREATE INDEX "slack_archive_channelName_idx" ON sna4slack_metrics.slack_archive ("channelName");

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
