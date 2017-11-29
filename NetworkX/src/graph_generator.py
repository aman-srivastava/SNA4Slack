#!/usr/bin/env python

import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph

import re
import csv
import json

SENDER_COLUMN = "Sender"
MESSAGE_COLUMN = "Message"
EDGE_WEIGHT_LABEL = "weight"
CLOSENESS_CENTRALITY = "closeness_centrality"
DEGREE_CENTRALITY = "degree_centrality"
BETWEENNESS_CENTRALITY = "betweenness_centrality"


class GraphGenerator(object):
    def __init__(self, csv_path, directed=True):
        if directed:
            self.graph = nx.DiGraph()
        else:
            self.graph = nx.Graph()
        self.csv_path = csv_path
        self.build_graph()

    def build_graph(self):
        self.build_user_nodes()
        self.build_reference_edges()

    def build_user_nodes(self):
        with open(self.csv_path) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.graph.add_node(row[SENDER_COLUMN])

    def build_reference_edges(self):
        pattern = re.compile("@([a-zA-Z0-9]+)")

        with open(self.csv_path) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
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
        print cc
        nx.set_node_attributes(self.graph, cc, CLOSENESS_CENTRALITY)

    def compute_betweenness_centrality(self):
        bc = nx.algorithms.centrality.betweenness_centrality(self.graph)
        print bc
        nx.set_node_attributes(self.graph, bc, BETWEENNESS_CENTRALITY)

    def compute_degree_centrality(self):
        dc = nx.degree_centrality(self.graph)
        print dc
        nx.set_node_attributes(self.graph, dc, DEGREE_CENTRALITY)

    def json(self):
        return json.dumps(json_graph.node_link_data(self.graph))


if __name__ == "__main__":
    graph_gen = GraphGenerator("../resources/star_graph.csv",
                               directed=False)
    graph_gen.compute_closeness_centrality()
    graph_gen.compute_betweenness_centrality()
    graph_gen.compute_degree_centrality()
    graph_gen.print_graph()

    print graph_gen.json()
    graph_gen.draw_graph()
