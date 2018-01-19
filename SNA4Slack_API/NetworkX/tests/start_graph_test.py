#!/usr/bin/env python
import sys

sys.path.append('../src')

from graph_generator import GraphGenerator
from padgett_florentine_business_data import TEST_DATA


class TestClass(object):
    graph_builder = GraphGenerator(TEST_DATA["filename"])

    def test_node_count(self):
        assert len(self.graph_builder.graph.nodes) == TEST_DATA["node_count"]

    def test_edge_count(self):
        assert len(self.graph_builder.graph.edges) == TEST_DATA["edge_count"]

    def test_degree_centrality(self):
        self.graph_builder.compute_degree_centrality()
        for node in TEST_DATA["degree_centrality"].keys():
            assert self.graph_builder.graph.nodes[node]["degree_centrality"] == \
                   TEST_DATA["degree_centrality"][node]

    def test_betweeness_centrality(self):
        self.graph_builder.compute_betweenness_centrality()
        for node in TEST_DATA["betweenness_centrality"].keys():
            assert self.graph_builder.graph.nodes[node][
                       "betweenness_centrality"] == \
                   TEST_DATA["betweenness_centrality"][node]

    def test_closeness_centrality(self):
        self.graph_builder.compute_closeness_centrality()
        for node in TEST_DATA["closeness_centrality"].keys():
            assert self.graph_builder.graph.nodes[node][
                       "closeness_centrality"] == \
                   TEST_DATA["closeness_centrality"][node]