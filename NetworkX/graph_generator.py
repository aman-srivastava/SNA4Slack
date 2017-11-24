import networkx as nx
import matplotlib.pyplot as plt
from networkx.readwrite import json_graph

import re
import csv
import json

SENDER_COLUMN = "Sender"
MESSAGE_COLUMN = "Message"
EDGE_WEIGHT_LABEL = "weight"
CSV_PATH = "data1.csv"


class GraphGenerator(object):
    def __init__(self):
        self.graph = nx.DiGraph()

    def build_user_nodes(self):
        with open(CSV_PATH) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                self.graph.add_node(row[SENDER_COLUMN])

    def build_reference_edges(self):
        pattern = re.compile("@([a-zA-Z0-9]+)")

        with open(CSV_PATH) as csvfile:
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

    def closeness_centrality(self):
        print nx.closeness_centrality(self.graph)

    def betweenness_centrality(self):
        print nx.betweenness_centrality(self.graph)

    def degree_centrality(self):
        print nx.degree_centrality(self.graph)

    def json(self):
        return json.dumps(json_graph.node_link_data(self.graph))


if __name__ == "__main__":
    graph_gen = GraphGenerator()
    graph_gen.build_user_nodes()
    graph_gen.build_reference_edges()
    graph_gen.print_graph()
    graph_gen.closeness_centrality()
    graph_gen.betweenness_centrality()
    graph_gen.degree_centrality()
    graph_gen.draw_graph()
    print graph_gen.json()
