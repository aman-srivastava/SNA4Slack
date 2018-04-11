#!/usr/bin/env python
import sys

sys.path.append('../src')


from single_node_data import TEST_DATA

from tree_graph import TreeGraph

class TestClass(object):
    graph_builder = TreeGraph(TEST_DATA["filename"], False)

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

    def test_member_addition(self):
        for sample in TEST_DATA["user_node"].values():
            assert self.graph_builder.graph.nodes[node] == sample

    def test_for_density(self):
        self.graph_builder.compute_density()
         assert round(self.graph_builder.graph.graph["density"], 5) == \
                round(TEST_DATA["density"], 5)
