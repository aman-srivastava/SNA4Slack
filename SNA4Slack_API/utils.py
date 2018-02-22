from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine import columns, connection
from config import Config


class Utils:
    # UTILITY FUNCTIONS

    @classmethod
    def get_Connection_SNA4Slack(self):
        ap = PlainTextAuthProvider(
            username=Config.DB_USER, password=Config.DB_PASSWORD)
        node_ips = [Config.NODE_IP]
        cluster = Cluster(node_ips, auth_provider=ap)
        session = cluster.connect()
        connection.setup(node_ips, Config.KEYSPACE_NAME,
                         protocol_version=3, auth_provider=ap)
    pass

    @classmethod
    def getCredential(self):
        return {'username': Config.DB_USER, 'password': Config.DB_PASSWORD}
