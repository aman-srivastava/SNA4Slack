#!/usr/bin/env python
import networkx as nx

from networkx.readwrite import json_graph
import sys
import re
import json
import logging
import timeit
sys.path.append('../../')

from utils import Utils
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from objects.slack_archive import SlackArchive

MESSAGE_TIMESTAMP = "messageTime"
SENDER_COLUMN = "messageSender"
MESSAGE_COLUMN = "messageBody"
EDGE_WEIGHT_LABEL = "weight"
CLOSENESS_CENTRALITY = "closeness_centrality"
DEGREE_CENTRALITY = "degree_centrality"
BETWEENNESS_CENTRALITY = "betweenness_centrality"
TIESTAMP = "timestamp"


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
        self.add_timestamp_values()
        
    def add_timestamp_values(self):
        Utils.get_Connection_SNA4Slack()
        tsvalues = SlackArchive.objects.filter(timeStamp=self.timeStamp)
        for val in tsvalues:
            if self.graph.has_node(val):
                self.graph[val][self.graph.node][MESSAGE_TIMESTAMP] += 1;
    
    def build_user_nodes(self):
        try:
            Utils.get_Connection_SNA4Slack()
            sync_table(SlackArchive)
            instances = SlackArchive.objects.filter(teamName=self.team_name)
            tsvalues = SlackArchive.objects.filter(timeStamp=self.timeStamp)
            for row in instances:
                self.graph.add_node(row[SENDER_COLUMN])
                for val in tsvalues:
                    self.graph.nodes.add_value(val)
        except Exception as e:
            print "exception found during node building: " + str(e)

    def print_graph(self):
        print self.graph.nodes
        for ed in self.graph.edges:
            print str(ed) + " " + str(
                self.graph[ed[0]][ed[1]][EDGE_WEIGHT_LABEL])

    def draw_graph(self):
        nx.draw(self.graph, with_labels=True)  # default spring_layout

    def json(self):
        return json_graph.node_link_data(self.graph)


def run():
    graph_gen = MentionGraph("single_node",
                             directed=True)
    print("generated the graph")

    graph_gen.print_graph()
    print graph_gen.json()
    with open('data.json', 'w') as outfile:
        outfile.write(graph_gen.json())
        #writing to json
    graph_gen.draw_graph()


