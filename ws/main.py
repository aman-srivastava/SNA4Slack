import uuid
import json
from flask import Flask, jsonify, abort, request
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from datetime import datetime
from flasgger import Swagger
from utils import Utils
from objects.sna4slack_metrics import SNASlackMetrics
from objects.slack_archive import *
from slack_spyder import SlackSpider

app = Flask(__name__)
app.config['SWAGGER'] = {
    'title': 'SNA4Slack API',
    'uiversion': 2
}
swagger = Swagger(app)

#URL DEFINITIONS
#----------------
SNA_URL = "/sna4slack-ws/metrics"
JOURNAL_URL = "/atlas-ws/journal"


#PRODUCTIVITY ENDPOINTS
#-----------------------


#GET
@app.route(SNA_URL+"/node/<node_id>", methods=['GET'])
def get_metrics(node_id):
    """Returns list of Journal articles by user
    Implemented in flask for python 2.7
    ---
    parameters:
      - name: node_id
        in: path
        type: string
        required: true
        default: ishan2610
        description: Enter node id
    operationId: get_metrics
    consumes:
      - string
    produces:
      - application/json
    
    deprecated: false
    externalDocs:
      description: Project repository
      url: https://github.com/aman-srivastava/SNA4Slack
    responses:
      200:
        description: SNA Metrics of a user
    """
    Utils.get_Connection_SNA4Slack()
    sync_table(SNASlackMetrics)
    instances = SNASlackMetrics.objects.filter(node_name=node_id)
    print instances
    node_name = columns.Text()
    weight = columns.Integer()
    mentions = columns.Map(columns.Text(), columns.Integer())
    distances = columns.Map(columns.Text(), columns.Integer())
    centrality_metrices = columns.Map(columns.Text(), columns.Integer())

    output = []
    for q in instances:
        temp={
            'id' : str(q.id), 
            'node_name' : str(q.node_name),
            'weight' : str(q.weight),
            'mentions' : str(q.mentions),
            'distances' : str(q.distances),
            'centrality_metrices' : str(q.centrality_metrices)
            }
        output.append(temp)
    return json.dumps(output)


#POST
@app.route(SNA_URL+'/node-post/', methods=['POST'])
def post_nodes():
    """Saves Journal object for a user
    Implemented in flask for python 2.7
    ---
    parameters:
      - name: SNASlackMetrics
        in: body
        type: application/json
        required: true
        default: ishan2610
        description: SNASlackMetrics object
    operationId: post_nodes
    consumes:
      - application/json
    produces:
      - application/json
    
    deprecated: false
    externalDocs:
      description: Project repository
      url: https://github.com/aman-srivastava/SNA4Slack
    responses:
      201:
        description: POST node data obtained by parsing slack archives
        schema:
          $ref: '#/definitions/SNASlackMetrics'
        examples:
            [
                {
                    "distances": "{'@abhimanyu': 0, '@aman': 2, '@sanchit': 2, '@nikhil': 2, '@shuchir': 1}",
                    "weight": "None",
                    "node_name": "@ishan",
                    "centrality_metrices": "{'betweenness': 31, 'closeness': 22, 'harmony': 71, 'eigenvector': 10}",
                    "mentions": "{'@abhimanyu': 4, '@aman': 31, '@sanchit': 12, '@nikhil': 65, '@shuchir': 2}"
                }
            ]

    """
    if not request.json:
        abort(400)

    Utils.get_Connection_SNA4Slack()
    sync_table(SNASlackMetrics)
    
    print request.json['mentions']

    obj_node_name = request.json['node_name']
    obj_node_weight = int(request.json['weight'])
    obj_node_mentions = dict(request.json['mentions'])
    obj_node_distances = dict(request.json['distances'])
    obj_node_centrality_metrices = dict(request.json['centrality_metrices'])
    obj_node_team_name = request.json['team_name']

    node_object = SNASlackMetrics(id = uuid.uuid1(), 
                                    node_name = obj_node_name,
                                    weight = obj_node_weight,
                                    mentions = obj_node_mentions,
                                    distances = obj_node_distances,
                                    centrality_metrices = obj_node_centrality_metrices,
                                    team_name =obj_node_team_name)
    node_object.save()
    return "Success!"


@app.route(SNA_URL+"/crawl/<team_Name>", methods=['GET'])
def putArchiveData(team_Name):
    """Initializes crawler to get team data and save in database 
    Implemented in flask for python 2.7
    ---
    parameters:
      - name: team_Name
        in: path
        type: string
        required: true
        default: kubernetes
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
    slackSpider = SlackSpider()
    slackSpider.start_driver()
    
    for i in range(1, 2):
        items_list  = slackSpider.parse("https://kubernetes.slackarchive.io/kubernetes-users/page-"+str(i))
    slackSpider.close_driver()

    Utils.get_Connection_SNA4Slack()
    sync_table(SlackArchive)
    
    for i in range(0,len(items_list)):
        node_object = SlackArchive( id = uuid.uuid1(),
                                    teamName = "kubernetes",
                                    channelName = "kubernetes-users",
                                    messageSender = items_list[i].messageSender.rstrip().lstrip(),
                                    messageBody = items_list[i].messageBody.rstrip().lstrip(),
                                    messageTime = datetime.strptime(items_list[i].messageTime, "%b %d, %Y %I:%M")
                               )
        node_object.save()
    return "Success"


if __name__ == '__main__':
    app.run(debug=True)