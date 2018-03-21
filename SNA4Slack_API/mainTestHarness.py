from NetworkX.src.mention_graph import MentionGraph
from NetworkX.src.subscription_graph import SubscriptionGraph
from SlackCrawler.slack_spyder import SlackSpider
from NetworkX.src.mention_graph import MentionGraph
from Helpers.mongoHelper import MongoHelper
from Helpers.sparkCassandra_interface import sparkCassandraHelper
from NetworkX.src.subscription_graph import SubscriptionGraph
import json


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


def mentionGraphGer(team_Name, directed):
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
    teams = ['flatartagency', 'punecoders', 'openaddresses', 'zipperglobal', 'bitcoinhivemind',
             'sqlcommunity', 'steam-makers', 'apachecloudstack', 'buffercommunity']
    for team_Name in teams:
        sch = sparkCassandraHelper(team_Name)
        print 'Batch for team {0}'.format(team_Name)
        print 'DataAnalytics: ' + sch.main()

        '''for directed in [True, False]:
            mentionGraphGen(team_Name, directed)

            if team_Name not in ['buffercommunity', 'sqlcommunity']:
                subscriptionGraphGen(team_Name, directed)'''
        print '_________________________________________________________________________________________________'


if __name__ == "__main__":
    bulkInsert()
