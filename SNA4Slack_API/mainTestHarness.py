from NetworkX.src.mention_graph import MentionGraph
from NetworkX.src.subscription_graph import SubscriptionGraph

if __name__ == "__main__":
    # print timeit.timeit("run()", setup="from __main__ import run", number=10)
    team_Name = 'openaddresses'
    mentionGraph = MentionGraph(team_Name,
                                directed=False)
    mentionGraph.run()

    subscriptionGraph = SubscriptionGraph(team_Name,
                                          directed=False)
    subscriptionGraph.run()
