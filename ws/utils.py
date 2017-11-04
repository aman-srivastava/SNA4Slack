from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine import columns, connection

class Utils:
    #UTILITY FUNCTIONS
    @classmethod
    def get_Connection_SNA4Slack(self):
        ap = PlainTextAuthProvider(username='cassandra', password='e3tKNaYVPE3M')
        node_ips = ['35.192.53.69']
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(['35.192.53.69'], "sna4slack_metrics", protocol_version=3, auth_provider=ap)
    pass
    @classmethod
    def getCredential(self):
        return {'username': 'cassandra', 'password': 'e3tKNaYVPE3M'} 
