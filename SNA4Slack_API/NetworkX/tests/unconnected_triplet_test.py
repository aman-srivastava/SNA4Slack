#!/usr/bin/env python
import sys

sys.path.append('../src')

from graph_generator import GraphGenerator
from unconnected_triplet_data import TEST_DATA


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
	
	def compute_avg_clustering(self):
        ac = nx.average_clustering(self.graph)
        self.graph.graph[AVERAGE_CLUSTERING] = ac
        logging.debug(self.__class__.__name__ + ": Clustering computed.")

    def test_betweeness_centrality(self):
        self.graph_builder.compute_betweenness_centrality()
        for node in TEST_DATA["betweenness_centrality"].keys():
            assert self.graph_builder.graph.nodes[node]["betweenness_centrality"] == \
                   TEST_DATA["betweenness_centrality"][node]
    
    def test_for_density(self):
        self.graph_builder.compute_density()
         assert round(self.graph_builder.graph.graph["density"], 5) == \
                round(TEST_DATA["density"], 5)
	
	def test_for_average_clustering(self):
        self.graph_builder.compute_avg_clustering()
        assert round(self.graph_builder.graph.graph["average_clustering"], 5) == \
               round(TEST_DATA["average_clustering"], 5)

    def test_closeness_centrality(self):
        self.graph_builder.compute_closeness_centrality()
        for node in TEST_DATA["closeness_centrality"].keys():
            assert self.graph_builder.graph.nodes[node][
                       "closeness_centrality"] == \
                   TEST_DATA["closeness_centrality"][node]

    def test_average_clustering(self):
        self.graph_builder.compute_avg_clustering()
        assert round(self.graph_builder.graph.graph[
                         "average_clustering"], 5) == \
               round(TEST_DATA["average_clustering"], 5)

    def test_average_connectivity(self):
        self.graph_builder.compute_avg_connectivity()
        assert round(self.graph_builder.graph.graph[
                         "average_connectivity"], 5) == \
               round(TEST_DATA["average_connectivity"], 5)
