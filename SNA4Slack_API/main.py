from datetime import datetime
from flasgger import Swagger
from flask import Flask, jsonify, abort, make_response, request, render_template
from flask_restful import Api, Resource, reqparse, fields, marshal

from serviceEndpoints.crawler_trigger import CrawlerTrigger
from serviceEndpoints.subscriptionGraph_trigger import SubscriptionGraphTrigger
from serviceEndpoints.mentionGraph_trigger import MentionGraphTrigger
from serviceEndpoints.dashboardAnalytics import DashboardTrigger
from serviceEndpoints.bulk_Insert import BulkInsert

#app = Flask(__name__, template_folder='/home/shuchir/SER517/SNA4Slack/SNA4Slack/SNA4Slack/html/ltr/vertical-menu-template')
app = Flask(__name__)
api = Api(app)
app.config['SWAGGER'] = {
    'title': 'SNA4Slack API',
    'uiversion': 2
}
swagger = Swagger(app)

'''@app.route('/')
def home():
   return render_template('search-page.html')'''

# URL DEFINITIONS
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

# Bulk Insert
#----------------------------------------------------------------
api.add_resource(BulkInsert, SNA_URL + '/BulkInsertTrigger')
if __name__ == '__main__':
    app.run(debug=True)
