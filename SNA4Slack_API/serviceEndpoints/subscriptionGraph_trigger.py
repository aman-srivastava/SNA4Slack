import uuid
import json
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack

from utils import Utils
from NetworkX.src.subscription_graph import SubscriptionGraph
from Helpers.mongoHelper import MongoHelper


class SubscriptionGraphTrigger (Resource):

    def post(self):
        """Generates Subscription graph of a specific Team using crawled data saved to Cassandra DB
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
            required: falsez
            default:
            description: Narrow down graph nodes to a channel within team
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
        # channel = request.headers.get('channel')

        graph_gen = SubscriptionGraph(team_Name, True)
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
        # graph_gen.compute_avg_clustering()
        print 'Compute clustering'
        documentType = "directed-subscription-graph"
        data = '{"documentType" :"directed-subscription-graph", "directed-subscription-graph":' + \
            json.dumps(graph_gen.json()) + '}'
        return MongoHelper.manageInsert(team_Name, json.loads(data), documentType)
