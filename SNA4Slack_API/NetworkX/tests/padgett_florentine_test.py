#!/usr/bin/env python
import sys

sys.path.append('../src')

from Subscription_graph import SubscriptionGraph
from padgett_florentine_business_data import TEST_DATA


class TestClass(object):
    graph_builder = SubscriptionGraph(TEST_DATA["filename"], False)

    def test_node_count(self):
        assert len(self.graph_builder.graph.nodes) == TEST_DATA["node_count"]

    def test_edge_count(self):
        assert len(self.graph_builder.graph.edges) == TEST_DATA["edge_count"]
    
    def compute_avg_clustering(self):
        ac = nx.average_clustering(self.graph)
        self.graph.graph[AVERAGE_CLUSTERING] = ac
        logging.debug(self.__class__.__name__ + ": Clustering computed.")
    
    '''
    def test_degree_centrality(self):
        self.graph_builder.compute_degree_centrality()
        for node in TEST_DATA["degree_centrality"].keys():
            assert round(
                self.graph_builder.graph.nodes[node]["degree_centrality"],
                5) == \
                   round(TEST_DATA["degree_centrality"][node], 5)

     
    def test_betweeness_centrality(self):
        self.graph_builder.compute_betweenness_centrality()
        for node in TEST_DATA["betweenness_centrality"].keys():
            assert round(self.graph_builder.graph.nodes[node][
                             "betweenness_centrality"], 5) == \
                   round(TEST_DATA["betweenness_centrality"][node], 5)

    def test_closeness_centrality(self):
        self.graph_builder.compute_closeness_centrality()
        for node in TEST_DATA["closeness_centrality"].keys():
            assert round(self.graph_builder.graph.nodes[node][
                             "closeness_centrality"], 5) == \
                   round(TEST_DATA["closeness_centrality"][node], 5)
    '''
    
    def test_average_clustering(self):
        self.graph_builder.compute_avg_clustering()
        assert round(self.graph_builder.graph.graph[
                         "average_clustering"], 5) == \
               round(TEST_DATA["average_clustering"], 5)

    '''def test_average_connectivity(self):
        self.graph_builder.compute_avg_connectivity()
        assert round(self.graph_builder.graph.graph[
                         "average_connectivity"], 5) == \
               round(TEST_DATA["average_connectivity"], 5)
            
    def test_density(self):
        self.graph_builder.compute_density()
        assert round(self.graph_builder.graph.graph[
                         "density"], 5) == \
               round(TEST_DATA["density"], 5)
    '''

t = TestClass()
t.test_node_count()
