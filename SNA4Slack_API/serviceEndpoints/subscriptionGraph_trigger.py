import uuid
import json
import dateutil.parser
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack

from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection

from utils import Utils
from NetworkX.src.subscription_graph import SubscriptionGraph


class SubscriptionGraphTrigger (Resource):

    def get(self):
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
        #channel = request.headers.get('channel')
        #directed = request.headers.get('directed')

        graph_gen = SubscriptionGraph(team_Name, directed=False)
        print 'Graph done'
        graph_gen.compute_closeness_centrality()
        print 'Compute closeness'
        graph_gen.compute_betweenness_centrality()
        print 'Compute betweenness'
        graph_gen.compute_degree_centrality()
        print 'Compute centrality'
        graph_gen.compute_density()
        print 'Compute density'
        graph_gen.compute_avg_connectivity()
        print 'Compute connectivity'
        graph_gen.compute_avg_clustering()
        print 'Compute clustering'

        return json.dumps(graph_gen.json())
