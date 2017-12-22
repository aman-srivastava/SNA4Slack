import os
import timeit

from graph_generator import GraphGenerator

csv_list = os.listdir("../resources")
print "== Performance Testing GraphGenerator =="


def runner(file):
    graph_gen = GraphGenerator("../resources/" + file,
                               directed=False)
    graph_gen.compute_closeness_centrality()
    graph_gen.compute_betweenness_centrality()
    graph_gen.compute_degree_centrality()


def file_len(fname):
    i = -1
    with open("../resources/" + fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1


counter = 1
for csv_file in csv_list:
    length = file_len(csv_file) - 1
    print "\tTest " + str(counter) + " : file = " + csv_file
    t = timeit.timeit("runner(csv_file)",
                      setup='from __main__ import runner; csv_file = "' +
                            csv_file + '"', number=20)
    print"\tResult = " + str(t) + " seconds for " + str(length) + " rows"
    counter += 1
