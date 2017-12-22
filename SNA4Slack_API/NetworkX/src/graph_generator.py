#!/usr/bin/env python

import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph

import sys
import re
import csv
import json
import logging
import timeit

SENDER_COLUMN = "Sender"
MESSAGE_COLUMN = "Message"
EDGE_WEIGHT_LABEL = "weight"
CLOSENESS_CENTRALITY = "closeness_centrality"
DEGREE_CENTRALITY = "degree_centrality"
BETWEENNESS_CENTRALITY = "betweenness_centrality"

# Initializing logger
logging.basicConfig(filename='../logs/graph_generator_logs.log',
                    level=logging.DEBUG)


class GraphGenerator(object):
    def __init__(self, csv_path, directed=True):
        if directed:
            self.graph = nx.DiGraph()
        else:
            self.graph = nx.Graph()
        self.csv_path = csv_path
        self.verify_csv()
        self.build_graph()

    def verify_csv(self):
        try:
            with open(self.csv_path) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    assert SENDER_COLUMN in row.keys()
                    assert MESSAGE_COLUMN in row.keys()
        except Exception as e:
            error_msg = self.__class__.__name__ + ": Invalid csv :"
            print str(e), error_msg
            logging.error(error_msg + str(e))
            sys.exit(0)

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

    def json(self):
        return json.dumps(json_graph.node_link_data(self.graph))

def run():
    graph_gen = GraphGenerator("../resources/kubernetes_test_data.csv",
                               directed=False)
    graph_gen.compute_closeness_centrality()
    graph_gen.compute_betweenness_centrality()
    graph_gen.compute_degree_centrality()
    graph_gen.print_graph()
    with open('data.json', 'w') as outfile:
        json.dump(graph_gen.json(), outfile)

if __name__ == "__main__":
    print timeit.timeit("run()", setup="from __main__ import run", number=10)
