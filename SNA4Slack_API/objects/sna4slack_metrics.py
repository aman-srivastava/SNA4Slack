#Object mapper for atlas_productivity.todo table

from cassandra.cqlengine import columns
from cassandra.cqlengine import connection
from datetime import datetime
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model

class SNASlackMetrics(Model):
	__key_space__ = 'sna4slack_metrics'  # Not Required
	__table_name__ = 'nodes_relationships'

	id = columns.UUID(primary_key = True)
	node_name = columns.Text(index=True)
	weight = columns.Integer()
	mentions = columns.Map(columns.Text(), columns.Integer())
	distances = columns.Map(columns.Text(), columns.Integer())
	centrality_metrices = columns.Map(columns.Text(), columns.Integer())
	team_name = columns.Text(index=True)