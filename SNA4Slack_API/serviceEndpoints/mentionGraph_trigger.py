import uuid
import json
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack

from NetworkX.src.mention_graph import MentionGraph
from Helpers.mongoHelper import MongoHelper


class MentionGraphTrigger(Resource):

    def post(self):
        """Initializes crawler to get team data and save in database
        Implemented in flask for python 2.7
        ---
        parameters:
          - name: team_Name
            in: header
            type: string
            required: true
            default: flatartagency
            description: Enter team name
          - name: channel
            in: header
            type: string
            required: false
            default:
            description: Narrow down graph nodes to a channel within team
          - name: directed
            in: header
            type: boolean
            required: true
            default: True
            description: Choose directed/undirected graph
        operationId: generateGraph
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
        team_Name = request.headers.get('team_Name')
        directed = request.headers.get('directed')
        directed = directed in ("True", "true")

        graph_gen = MentionGraph(team_Name, directed)
        return graph_gen.generateGraph()
