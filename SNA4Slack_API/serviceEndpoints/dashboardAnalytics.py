import uuid
import json
from datetime import datetime
from config import Config

from flask_restful import Resource, request
from flask import Flask, request, jsonify, make_response

from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection

from objects.slack_archive import SlackArchive
from Helpers.mongoHelper import MongoHelper
from Helpers.sparkCassandra_interface import sparkCassandraHelper


class DashboardTrigger(Resource):

    def get(self):
        """Initializes crawler to get team data and save in database 
        Implemented in flask for python 2.7
        ---
        parameters:
          - name: team_Name
            in: header
            type: string
            required: true
            default: "openaddresses"
            description: Enter team name
          - name: channel_name
            in: header
            type: string
            required: false
            default: "general"
            description: Enter team name
          - name: messageSender
            in: header
            type: string
            required: false
            default: "roffe"
            description: Enter team name
        operationId: putArchiveData
        consumes:
          - string
        produces:
          - string
        deprecated: false
        externalDocs:
          description: Project repository
          url: https://github.com/aman-srivastava/SNA4Slack
        responses:
          200:
            description: Parse Slack archive and save data to database
        """
        teamName = request.headers.get('team_Name')
        channelName = request.headers.get('channel_name')
        messageSender = request.headers.get('messageSender')
        sch = sparkCassandraHelper(teamName)
        sch.main()


        '''ap = PlainTextAuthProvider(
            username=Config.DB_USER, password=Config.DB_PASSWORD)
        node_ips = [Config.NODE_IP]
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(node_ips, Config.KEYSPACE_NAME,
                         protocol_version=3, auth_provider=ap)

        rows = session.execute(
            'SELECT "teamName","channelName","messageSender", COUNT(*) as "msgCount" \
             FROM {0}.{1} \
             WHERE "teamName" = {2} \
             GROUP BY "teamName", "channelName","messageSender";'.format(Config.KEYSPACE_NAME,
                                                                         Config.DB_COLUMN_FAMILY,
                                                                         '\'' + team_name + '\''))

        cluster.shutdown()
        output = []
        for row in rows:
            temp = {
                'teamName': str(row.teamName),
                'channelName': str(row.channelName),
                'messageSender': str(row.messageSender),
                'messageCount': str(row.msgCount)
            }
            output.append(temp)
        data = '{"dataAnalytics":' + json.dumps(output) + '}'
        

        return MongoHelper.manageInsert(teamName, json.loads(data))'''
        return "Success"