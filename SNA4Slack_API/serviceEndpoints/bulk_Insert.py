from NetworkX.src.mention_graph import MentionGraph
from NetworkX.src.subscription_graph import SubscriptionGraph
from SlackCrawler.slack_spyder import SlackSpider
from NetworkX.src.mention_graph import MentionGraph
from Helpers.mongoHelper import MongoHelper
from Helpers.sparkCassandra_interface import sparkCassandraHelper
from NetworkX.src.subscription_graph import SubscriptionGraph
import json
from utils import Utils
from objects.slack_archive import SlackArchive
from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack


class BulkInsert (Resource):

    def post(self):
        """Initialize crawler(optional), generate SNA metric data and save to Mongo DB
        Implemented in flask for python 2.7
        ---
        parameters:
          - name: team_Names
            in: header
            type: string
            required: true
            default: openaddresses, zipperglobal
            description: Enter comma separated list of team names
          - name: crawl_archives
            in: header
            type: boolean
            required: true
            default: False
            description: Choose either to crawl and get new dataset or use existing data
        operationId: grabDatasetGenerateGraph
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
        teams = request.headers.get('team_Names').split(',')
        crawlArchive = request.headers.get('crawl_archives')
        crawlArchive = crawlArchive in ("True", "true")
        responseString = ''
        if crawlArchive == True:
            slackSpider = SlackSpider()
            slackSpider.start_driver()
            for team_Name in teams:
                team_Name = team_Name.strip()
                try:
                    print 'Crawling team {0}'.format(team_Name)
                    slackSpider.runSpider(team_Name)
                except:
                    print 'error occured'

                slackSpider.close_driver()
        for team_Name in teams:
            sch = sparkCassandraHelper(team_Name)
            spark = sch.createSparkSession()
            responseString += 'Batch for team {0} \n'.format(team_Name)
            try:
                responseString += 'Data analytics: {0} \n'.format(
                    sch.main(spark))
            except Exception as error:
                responseString += 'Data analytics: {0} \n'.format(
                    'Failed to generate. Reason:' + str(error))

            try:
                responseString += 'Subscription graph: {0} \n'.format(
                    sch.getSubscriptionGraphInverse(spark))
            except Exception as error:
                responseString += 'Subscription graph: {0} \n'.format(
                    'Failed to generate. Reason:' + str(error))
        
            for directed in [True, False]:
                graph_gen = MentionGraph(team_Name, directed)
                if directed:
                    try:
                        responseString += 'directed-mention-graph : {0} \n'.format(
                            graph_gen.generateGraph())
                    except Exception as error:
                        responseString += 'directed-mention-graph: {0} \n'.format(
                            'Failed to generate. Reason:' + str(error))
                else:
                    try:
                        responseString += 'undirected-mention-graph : {0} \n'.format(
                            graph_gen.generateGraph())
                    except Exception as error:
                        responseString += 'undirected-mention-graph: {0} \n'.format(
                            'Failed to generate. Reason:' + str(error))
            spark.stop()

        return responseString
