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


def graphHarness():
    # print timeit.timeit("run()", setup="from __main__ import run", number=10)
    team_Name = 'openaddresses'
    mentionGraph = MentionGraph(team_Name, directed=False)
    mentionGraph.run()
    subscriptionGraph = SubscriptionGraph(team_Name, directed=False)
    subscriptionGraph.run()


def crawlerHarness():

    slackSpider = SlackSpider()
    slackSpider.start_driver()
    print slackSpider.parse("https://kubernetes.slackarchive.io/community-sites/page-1")
    # slackSpider.runSpider(sys.argv[1])
    # "https://punecoders.slackarchive.io/general/page-2")
    slackSpider.close_driver()


def mentionGraphGen(team_Name, directed):
    graph_gen = MentionGraph(team_Name, directed)
    print 'Graph done'
    graph_gen.compute_closeness_centrality()
    print 'Compute closeness'
    graph_gen.compute_betweenness_centrality()
    print 'Compute betweenness'
    graph_gen.compute_degree_centrality()
    print 'Compute centrality'
    graph_gen.compute_density()
    print 'Compute density'
    graph_gen.compute_avg_connectivity()
    print 'Compute connectivity'
    graph_gen.compute_avg_clustering()
    print 'Compute clustering'

    if directed == True:
        documentType = "directed-mention-graph"
        data = '{"documentType": "directed-mention-graph", "directed-mention-graph":' + \
            json.dumps(graph_gen.json()) + '}'
        print
    else:
        documentType = "undirected-mention-graph"
        data = '{"documentType": "undirected-mention-graph", "undirected-mention-graph":' + \
            json.dumps(graph_gen.json()) + '}'

    print documentType + ': ' + MongoHelper.manageInsert(team_Name, json.loads(data), documentType)


def subscriptionGraphGen(team_Name, directed):
    graph_gen = SubscriptionGraph(team_Name, directed)
    print 'Graph done'
    graph_gen.compute_closeness_centrality()
    print 'Compute closeness'
    graph_gen.compute_betweenness_centrality()
    print 'Compute betweenness'
    graph_gen.compute_degree_centrality()
    print 'Compute centrality'
    graph_gen.compute_density()
    print 'Compute density'
    graph_gen.compute_avg_connectivity()
    print 'Compute connectivity'
    # graph_gen.compute_avg_clustering()
    print 'Compute clustering'

    if directed == True:
        documentType = "directed-subscription-graph"
        data = '{"documentType" :"directed-subscription-graph", "directed-subscription-graph":' + \
            json.dumps(graph_gen.json()) + '}'
    else:
        documentType = "undirected-subscription-graph"
        data = '{"documentType" :"undirected-subscription-graph","undirected-subscription-graph":' + \
            json.dumps(graph_gen.json()) + '}'

    print documentType + ': ' + MongoHelper.manageInsert(team_Name, json.loads(data), documentType)


def bulkInsert():
    teams = ['punecoders', 'openaddresses', 'flatartagency', 'zipperglobal', 'apachecloudstack',
             'steam-makers', 'bitcoinhivemind', 'shank-group', 'bitcoinclassic', 'sqlcommunity', 'buffercommunity']
    # Batch Crawl
    for team_Name in teams:
        try:
            slackSpider = SlackSpider()
            slackSpider.start_driver()
            slackSpider.runSpider(team_Name)
            slackSpider.close_driver()
        except:
            print 'error occured'

    for team_Name in teams:
        sch = sparkCassandraHelper(team_Name)
        print 'Batch for team {0}'.format(team_Name)
        spark = sch.createSparkSession()
        print sch.getSubscriptionGraph(spark)

        for directed in [True, False]:
            mentionGraphGen(team_Name, directed)
        subscriptionGraphGen(team_Name, False)
        print '_________________________________________________________________________________________________'
    return True

if __name__ == "__main__":
    bulkInsert()
