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
		"""Initializes crawler generates SNA data and saves to Mongo DB
        Implemented in flask for python 2.7
        ---
        parameters:
          - name: team_Names
            in: header
            type: string
            required: true
            default: blockstack, buffercommunity
            description: Enter list of team names
          - name: crawl_archives
            in: header
            type: boolean
            required: true
            default: True
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

		teams = request.headers.get('team_Name').split(',')
		crawlArchive = request.headers.get('crawl_archives')

	    # Batch Crawl
	    if crawlArchive == True:
	    	slackSpider = SlackSpider()
	    	slackSpider.start_driver()
	    	for team_Name in teams:
	    		try:
	    			print 'Crawling team {0}'.format(team_Name)
		            slackSpider.runSpider(team_Name)
		        except:
		            print 'error occured'
		    slackSpider.close_driver()

	    for team_Name in teams:
	        sch = sparkCassandraHelper(team_Name)
	        spark = sch.createSparkSession()
	        print 'Batch for team {0}'.format(team_Name)
	        print 'Subscription graph: ' + sch.getSubscriptionGraphInverse(spark)
	        print 'Data analytics: ' + sch.main(spark)

	        for directed in [True, False]:
	            mentionGraphGen(team_Name, directed)
	    return True
