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
from objects.sna4slack_metrics import SNASlackMetrics
from utils import Utils

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

if __name__ == '__main__':
    app.run(debug=True)