#!/usr/bin/env python
import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import sys
import re
import json
import logging
import timeit

from SNA4Slack.SNA4Slack_API.utils import Utils
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from SNA4Slack.SNA4Slack_API.objects.slack_archive import SlackArchive

SENDER_COLUMN = "messageSender"
MESSAGE_COLUMN = "messageBody"
EDGE_WEIGHT_LABEL = "weight"
CLOSENESS_CENTRALITY = "closeness_centrality"
DEGREE_CENTRALITY = "degree_centrality"
BETWEENNESS_CENTRALITY = "betweenness_centrality"

# Initializing logger
logging.basicConfig(filename='../logs/graph_generator_logs.log',
                    level=logging.DEBUG)


class MentionGraph(object):
    def __init__(self, team_name, directed=True):
        if directed:
            self.graph = nx.DiGraph()
        else:
            self.graph = nx.Graph()
        self.team_name = team_name
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

    def print_graph(self):
        print self.graph.nodes
        for ed in self.graph.edges:
            print str(ed) + " " + str(
                self.graph[ed[0]][ed[1]][EDGE_WEIGHT_LABEL])

    def draw_graph(self):
        nx.draw(self.graph, with_labels=True)  # default spring_layout
        plt.show()

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
        d = nx.density(self.graph)
        self.graph.graph["density"] = d
        # nx.set_node_attributes(self.graph, d, "DENSITY")
        logging.debug(self.__class__.__name__ + ": Density computed.")
    
    def compute_avg_connectivity(self):
        anc = nx.average_node_connectivity(self.graph)
        self.graph.graph["average_node_connectivity"] = anc
        # nx.set_node_attributes(self.graph, d, "DENSITY")
        logging.debug(
            self.__class__.__name__ + ": Connectivity computed.")

    def compute_avg_clustering(self):
        ac = nx.average_clustering(self.graph)
        self.graph.graph["average_clustering"] = ac
        logging.debug(self.__class__.__name__ + ": Clustering computed.")
            
    def json(self):
        return json.dumps(json_graph.node_link_data(self.graph))


def run():
    graph_gen = MentionGraph("openaddresses",
                             directed=False)
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

    graph_gen.print_graph()
    print graph_gen.json()
    with open('data.json', 'w') as outfile:
        # json.dumps(graph_gen.json(), outfile)
        outfile.write(graph_gen.json())
    # graph_gen.draw_graph()


if __name__ == "__main__":
    # print timeit.timeit("run()", setup="from __main__ import run", number=10)
    run()
