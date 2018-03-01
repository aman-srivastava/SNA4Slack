from flask_cassandra import CassandraCluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster


class Utils:
        # UTILITY FUNCTIONS

    def get_Connection_Productivity():
        ap = PlainTextAuthProvider(
            username='cassandra', password='e3tKNaYVPE3M')
        node_ips = ['35.192.53.69']
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(['35.192.53.69'], "atlas_productivity",
                         protocol_version=3, auth_provider=ap)
    pass

    def get_Connection_Journal():
        ap = PlainTextAuthProvider(
            username='cassandra', password='e3tKNaYVPE3M')
        node_ips = ['35.192.53.69']
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(['35.192.53.69'], "atlas_journal",
                         protocol_version=3, auth_provider=ap)
    pass

    def getCredential(self):
        return {'username': 'cassandra', 'password': 'e3tKNaYVPE3M'}
