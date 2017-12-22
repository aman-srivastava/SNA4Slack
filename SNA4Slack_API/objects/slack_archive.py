#Object mapper for SNA4Slack.archive

from cassandra.cqlengine import columns
from cassandra.cqlengine import connection
from datetime import datetime
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine.usertype import UserType

class SlackArchive(Model):
	__key_space__ = 'sna4slack_metrics'  # Not Required
	__table_name__ = 'slack_archive'
	id = columns.UUID(primary_key = True)
	#teams = columns.List(columns.UserDefinedType(slackTeam))
	teamName = columns.Text(index=True)
	channelName = columns.Text(index=True)
	messageSender = columns.Text()
	messageBody = columns.Text()
	messageTime = columns.DateTime()

	def __iter__(self):
		return iter([self.id, 
					 self.teamName.encode("utf-8"), 
					 self.channelName.encode("utf-8"), 
					 self.messageSender.encode("utf-8"), 
					 "\""+self.messageBody.encode("utf-8")+"\"", 
					 self.messageTime])

