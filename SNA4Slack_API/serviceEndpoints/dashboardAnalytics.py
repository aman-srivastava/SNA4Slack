import uuid
import json
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack

from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from utils import Utils

from objects.slack_archive import SlackArchive


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
            default: "kubernetes"
            description: Enter team name
          - name: channel_name
            in: header
            type: string
            required: false
            default: "test"
            description: Enter team name
          - name: member
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
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        instances = SlackArchive.objects.filter(teamName=self.team_name)
        channel_Count = instances.distinct(channelName)
        user_Count = instances.distinct(messageSender)

        if request.headers.get('channel_name'):
            instances = instances.filter(channelName=self.channel_name)
        
        if request.headers.get('channel_name'):
            instances = instances.filter(channelName=self.channel_name)

        return "Success"