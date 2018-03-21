from datetime import datetime
from flasgger import Swagger
from flask import Flask, jsonify, abort, make_response, request
from flask_restful import Api, Resource, reqparse, fields, marshal

from  serviceEndpoints.crawler_trigger import CrawlerTrigger
from  serviceEndpoints.subscriptionGraph_trigger import SubscriptionGraphTrigger 
from  serviceEndpoints.mentionGraph_trigger import MentionGraphTrigger
from  serviceEndpoints.dashboardAnalytics import DashboardTrigger


app = Flask(__name__)
api = Api(app)
app.config['SWAGGER'] = {
    'title': 'SNA4Slack API',
    'uiversion': 2
}
swagger = Swagger(app)

#logging.basicConfig(filename='../logs/crawler.log',level=logging.DEBUG)

#URL DEFINITIONS
#----------------
SNA_URL = "/sna4slack-ws/metrics"


# CRAWLER ENDPOINTS
#----------------------------------------------------------------
api.add_resource(CrawlerTrigger, SNA_URL + '/crawl')


# GRAPHGENERATOR ENDPOINTS
#----------------------------------------------------------------
api.add_resource(SubscriptionGraphTrigger, SNA_URL + '/subscription_graph')
api.add_resource(MentionGraphTrigger, SNA_URL + '/mention_graph')


# Dashboard Trigger ENDPOINTS
#----------------------------------------------------------------
api.add_resource(DashboardTrigger, SNA_URL + '/DashboardTrigger')

if __name__ == '__main__':
    app.run(debug=True)
