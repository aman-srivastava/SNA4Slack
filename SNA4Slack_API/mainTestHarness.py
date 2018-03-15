from NetworkX.src.mention_graph import MentionGraph
from NetworkX.src.subscription_graph import SubscriptionGraph
from SlackCrawler.slack_spyder import SlackSpider


def graphHarness():
    # print timeit.timeit("run()", setup="from __main__ import run", number=10)
    team_Name = 'openaddresses'
    mentionGraph = MentionGraph(team_Name, directed=False)
    mentionGraph.run()
    subscriptionGraph = SubscriptionGraph(team_Name, directed=False)
    subscriptionGraph.run()


def crawlerHarness():

    slackSpider = SlackSpider()
    slackSpider.start_driver()
    slackSpider.parse("https://kubernetes.slackarchive.io/kubernetes-users/page-100")
    # slackSpider.runSpider(sys.argv[1])
    # "https://punecoders.slackarchive.io/general/page-2")
    slackSpider.close_driver()


if __name__ == "__main__":
    crawlerHarness()
