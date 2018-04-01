#!/usr/bin/env python
import networkx as nx
# import matplotlib.pyplot as plt
from networkx.readwrite import json_graph
import sys
import re
import json
import logging
import timeit
import csv

sys.path.append('../../')

from utils import Utils
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from objects.slack_archive import SlackArchive

SENDER_COLUMN = "messageSender"
MESSAGE_COLUMN = "messageBody"
CHANNEL_NAME = "channelName"
EDGE_WEIGHT_LABEL = "weight"
DEGREE_CENTRALITY = "degree_centrality"
USER_PROFILE_PIC = "senderAvatar"


# Initializing logger
# logging.basicConfig(filename='../logs/graph_generator_logs.log', level=logging.DEBUG)


class TreeGraph(object):
    def __init__(self, team_name):
        self.graph = nx.DiGraph()
        self.team_name = team_name
        self.build_graph()

    def build_graph(self):
        self.build_root_node()
        self.build_nodes()

    def build_root_node(self):
        self.graph.add_node(self.team_name)

    def build_nodes(self):
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        # instances = csv.DictReader(csvfile)
        instances = SlackArchive.objects.filter(teamName=self.team_name)

        memo = set()
        node_id  = 0
        for row in instances:
            self.graph.add_node(row[CHANNEL_NAME])
            self.graph.add_edge(self.team_name, row[CHANNEL_NAME],
                                weight=1)

            if (row[CHANNEL_NAME], row[SENDER_COLUMN]) not in memo:
                self.graph.add_node(node_id)
                self.graph.node[node_id]["name"] = row[SENDER_COLUMN]
                memo.add((row[CHANNEL_NAME], row[SENDER_COLUMN]))
                self.graph.add_edge(row[CHANNEL_NAME], node_id,
                                    weight=1)
                self.graph.node[node_id][USER_PROFILE_PIC] = row[
                    USER_PROFILE_PIC]
                node_id += 1
    def compute_degree_centrality(self):
        if len(self.graph.nodes) == 1:
        #this check is to ensure that zerodivision error is not thrown for single node
            node_name = self.graph.nodes.keys()[0]
            nx.set_node_attributes(self.graph, {node_name: 0},
                                   DEGREE_CENTRALITY)
            return

        dc = nx.degree_centrality(self.graph)
        nx.set_node_attributes(self.graph, dc, DEGREE_CENTRALITY)
        logging.debug(
            self.__class__.__name__ + ": Degree centrality computed.")

    def print_graph(self):
        print self.graph.nodes
        for ed in self.graph.edges:
            print str(ed) + " " + str(
                self.graph[ed[0]][ed[1]][EDGE_WEIGHT_LABEL])

    def draw_graph(self):
        nx.draw(self.graph, with_labels=True)  # default spring_layout
        # plt.show()

    def json(self):
        return json_graph.tree_data(self.graph, root=self.team_name)


def run():
    team = "buffercommunity"
    graph_gen = TreeGraph(team)
    print 'Graph done'
    graph_gen.print_graph()
    graph_gen.compute_degree_centrality()
    print 'Compute centrality'
    print graph_gen.json()

    with open('treedata.json', 'w') as outfile:
        outfile.write(str(graph_gen.json()))
