#!/usr/bin/env python
import networkx as nx
# import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import sys
import re
import json
import logging
import timeit

sys.path.append('../../')

from utils import Utils
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from objects.slack_archive import SlackArchive
from Helpers.mongoHelper import MongoHelper

SENDER_COLUMN = "messageSender"
MESSAGE_COLUMN = "messageBody"
EDGE_WEIGHT_LABEL = "weight"
CLOSENESS_CENTRALITY = "closeness_centrality"
DEGREE_CENTRALITY = "degree_centrality"
BETWEENNESS_CENTRALITY = "betweenness_centrality"
GRAPH_DENSITY = "density"
AVERAGE_CLUSTERING = "average_clustering"
AVERAGE_CONNECTIVITY = "average_connectivity"
USER_PROFILE_PIC = "senderAvatar"
CHANNEL_NAME = "channelName"
MENTION_COUNT = "mention_count"
BEST_FRIEND = "best_friend"


# Initializing logger
# logging.basicConfig(filename='../logs/graph_generator_logs.log', level=logging.DEBUG)


class MentionGraph(object):

    def __init__(self, team_name, directed=True):
        if directed:
            self.graph = nx.DiGraph()
        else:
            self.graph = nx.Graph()
        self.team_name = team_name
        self.directed = directed
        self.build_graph()

    def build_graph(self):
        self.build_user_nodes()
        self.build_reference_edges()

    def build_user_nodes(self):
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        instances = SlackArchive.objects.filter(teamName=self.team_name)
        for row in instances:
            self.graph.add_node(row[SENDER_COLUMN])
            self.graph.node[row[SENDER_COLUMN]][USER_PROFILE_PIC] = row[
                USER_PROFILE_PIC]
            self.graph.node[row[SENDER_COLUMN]][MENTION_COUNT] = {}

    def build_reference_edges(self):
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        instances = SlackArchive.objects.filter(teamName=self.team_name)
        pattern = re.compile("@([a-zA-Z0-9]+)")
        for row in instances:
            match_list = pattern.findall(row[MESSAGE_COLUMN])
            if match_list:
                for elem in match_list:
                    if self.graph.has_node(elem):
                        if self.graph.has_edge(row[SENDER_COLUMN], elem):
                            self.graph[row[SENDER_COLUMN]][elem][
                                EDGE_WEIGHT_LABEL] += 1
                        else:
                            self.graph.add_edge(row[SENDER_COLUMN], elem,
                                                weight=1)
                    if row[CHANNEL_NAME] in \
                            self.graph.node[row[SENDER_COLUMN]][
                                MENTION_COUNT].keys():
                        self.graph.node[row[SENDER_COLUMN]][
                            MENTION_COUNT][row[CHANNEL_NAME]] += 1
                    else:
                        self.graph.node[row[SENDER_COLUMN]][
                            MENTION_COUNT][row[CHANNEL_NAME]] = 1

    def print_graph(self):
        print self.graph.nodes
        for ed in self.graph.edges:
            print str(ed) + " " + str(
                self.graph[ed[0]][ed[1]][EDGE_WEIGHT_LABEL])

    def draw_graph(self):
        nx.draw(self.graph, with_labels=True)  # default spring_layout
        # plt.show()

    def compute_closeness_centrality(self):
        cc = nx.algorithms.centrality.closeness_centrality(self.graph)
        nx.set_node_attributes(self.graph, cc, CLOSENESS_CENTRALITY)

        logging.debug(
            self.__class__.__name__ + ": Closeness centrality computed.")

    def compute_betweenness_centrality(self):
        bc = nx.algorithms.centrality.betweenness_centrality(self.graph)
        nx.set_node_attributes(self.graph, bc, BETWEENNESS_CENTRALITY)
        logging.debug(
            self.__class__.__name__ + ": Betweeness centrality computed.")

    def compute_degree_centrality(self):
        # NetworkX throws ZeroDivisionError if there is only one node
        if len(self.graph.nodes) == 1:
            node_name = self.graph.nodes.keys()[0]
            nx.set_node_attributes(self.graph, {node_name: 0},
                                   DEGREE_CENTRALITY)
            return

        dc = nx.degree_centrality(self.graph)
        nx.set_node_attributes(self.graph, dc, DEGREE_CENTRALITY)
        logging.debug(
            self.__class__.__name__ + ": Degree centrality computed.")

    def compute_density(self):
        den = nx.density(self.graph)
        self.graph.graph[GRAPH_DENSITY] = den
        logging.debug(self.__class__.__name__ + ": Density computed.")

    def compute_avg_connectivity(self):
        anc = nx.average_node_connectivity(self.graph)
        self.graph.graph[AVERAGE_CONNECTIVITY] = anc
        logging.debug(
            self.__class__.__name__ + ": Connectivity computed.")

    def compute_avg_clustering(self):
        try:
            ac = nx.average_clustering(self.graph)
            self.graph.graph[AVERAGE_CLUSTERING] = ac
            logging.debug(self.__class__.__name__ + ": Clustering computed.")
        except Exception as e:
            self.graph.graph[AVERAGE_CLUSTERING] = 0

    def compute_friends(self):
        for node in self.graph.nodes:
            top_five = []
            for neigh in self.graph.neighbors(node):
                if len(top_five) < 5:
                    top_five = sorted(top_five + [neigh],
                                          key=lambda x:
                                          self.graph[node][x][EDGE_WEIGHT_LABEL])
                elif self.graph[node][neigh][EDGE_WEIGHT_LABEL] > \
                        self.graph[node][top_five[4]][EDGE_WEIGHT_LABEL]:
                    top_five = sorted(top_five[:4] + [neigh],
                                      key=lambda x:
                                      self.graph[node][x][EDGE_WEIGHT_LABEL])
            self.graph.nodes[node]["top_friends"] = top_five





    def json(self):
        return json_graph.node_link_data(self.graph)

    def generateGraph(self):
        documentType = ''
        print 'Graph done'
        self.compute_closeness_centrality()
        print 'Compute closeness'
        self.compute_betweenness_centrality()
        print 'Compute betweenness'
        self.compute_degree_centrality()
        print 'Compute centrality'
        self.compute_density()
        print 'Compute density'
        self.compute_avg_connectivity()
        print 'Compute connectivity'
        self.compute_avg_clustering()
        print 'Compute clustering'
        self.compute_friends()
        print 'Compute best friends'
        if self.directed == True:
            documentType = "directed-mention-graph"
            data = '{"documentType": "directed-mention-graph", "directed-mention-graph":' + \
                json.dumps(self.json()) + '}'
        else:
            documentType = "undirected-mention-graph"
            data = '{"documentType": "undirected-mention-graph", "undirected-mention-graph":' + \
                json.dumps(self.json()) + '}'

        return MongoHelper.manageInsert(self.team_name, json.loads(data), documentType)


def run():
    graph_gen = MentionGraph("bitcoinclassic",
                             directed=True)
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
    # print 'Compute clustering'

    # graph_gen.print_graph()

    graph_gen.compute_friends()
    # with open('data.json', 'w') as outfile:
    # json.dumps(graph_gen.json(), outfile)
    #   outfile.write(graph_gen.json())
    print graph_gen.json()
    graph_gen.draw_graph()

run()

