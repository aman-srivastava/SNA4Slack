import uuid
import json
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, make_response

from objects.slack_archive import SlackArchive
from Helpers.mongoHelper import MongoHelper
from Helpers.sparkCassandra_interface import sparkCassandraHelper


class DashboardTrigger(Resource):

    def post(self):
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
        return sch.main()
