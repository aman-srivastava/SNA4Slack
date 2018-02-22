from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine import columns, connection

class Utils:
    #UTILITY FUNCTIONS
    @classmethod
    def get_Connection_SNA4Slack(self):
        ap = PlainTextAuthProvider(username='cassandra', password='LYN1bQNCds3T')
        node_ips = ['104.155.179.66']
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(['104.155.179.66'], "sna4slack_metrics", protocol_version=3, auth_provider=ap)
    pass
    
    @classmethod
    def getCredential(self):
        return {'username': 'cassandra', 'password': 'LYN1bQNCds3T'} 
