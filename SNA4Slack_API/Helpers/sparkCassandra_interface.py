#!/usr/local/bin/python

import os
import findspark
import re
from operator import add
from mongoHelper import MongoHelper
import json
import pyspark
from pyspark.sql import SQLContext, SparkSession
from pyspark.sql.functions import col


class sparkCassandraHelper():

    def __init__(self, teamName):
        self.teamName = teamName

    def createSparkSession(self):
        spark = None
        try:
            spark = SparkSession.builder\
                .appName("SNA4Slack_sparksession")\
                .config("spark.cassandra.connection.host", "104.155.179.66")\
                .config("spark.cassandra.auth.username", "cassandra")\
                .config("spark.cassandra.auth.password", "LYN1bQNCds3T")\
                .master("local[*]")\
                .getOrCreate()
        except Exception as error:
            print error
        return spark

    def main(self):
        spark = self.createSparkSession()

        df = spark.read\
            .format("org.apache.spark.sql.cassandra")\
            .options(table="slack_archive_dev", keyspace="sna4slack_metrics").load()
        df = df.where(df.teamName == self.teamName)
        df.createOrReplaceTempView("archives")

        # 1. Get message count per team, per channel, per user
        jsonOut = spark.sql("SELECT channelName, messageSender, COUNT(messageBody) AS msgCount \
            FROM archives \
            GROUP BY channelName, messageSender \
            ORDER BY msgCount")
        data = '{"documentType": "dataAnalytics","dataAnalytics": {"messageCount_channel_sender":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        #MongoHelper.manageInsert(self.teamName, jsonOut.collect().encode("ascii","replace"))

        # 2. Get message count per team, per user
        jsonOut = spark.sql("SELECT messageSender, COUNT(messageBody) AS msgCount \
            FROM archives \
            GROUP BY teamName, messageSender \
            ORDER BY msgCount")
        data = data + '"messageCount_sender":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "") + ','

        # 3. Get message count per team, per channel
        jsonOut = spark.sql("SELECT channelName, COUNT(messageBody) AS msgCount \
            FROM archives \
            GROUP BY teamName, channelName \
            ORDER BY msgCount")

        data = data + '"messageCount_channel":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "") + ','

        # 4. Get message distribution over a year
        jsonOut = spark.sql("SELECT Year, Month,COUNT(*) AS msgCount \
            FROM (\
                    SELECT month(messageTime) AS Month, year(messageTime) AS Year \
                    FROM archives) AS innerQuery \
            GROUP BY Year, Month\
            ORDER BY Year, Month")

        data = data + '"messageCount_yearlyDist":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "") + ','

        # 5. Get first message sent time and user in the team
        jsonOut = spark.sql("SELECT MIN(messageTime) as messageTime, channelName \
            FROM archives \
            GROUP BY channelName".format(self.teamName))

        data = data + '"firstMessage":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        # 6. Get urls and count
        #urlR = re.compile('^(https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+).*')
        lines = df.rdd.map(lambda r: r["messageBody"])
        tokenized = lines.flatMap(lambda x: re.findall(
            'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', x))
        jsonOut = tokenized.map(lambda x: (x, 1)).reduceByKey(add).toDF(
            ['url', 'urlCount']).sort(col("urlCount").desc()).limit(20)

        data = data + '"sharedURLs":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        # 7. Get Emoji count per team
        highpoints = re.compile(
            u'[\U00000000-\U0000009F]|\
            [\U00000020-\U0000007E]|\
            [\U000000A0-\U000000FF]|\
            [\U00000100-\U0000017F]|\
            [\U00000180-\U0000024F]|\
            [\U00001E02-\U00001EF3]|\
            [\U00000259-\U00000292]|\
            [\U000002B0-\U000002FF]|\
            [\U00000370-\U000003FF]')

        lines = df.rdd.map(lambda r: r["messageBody"])
        jsonOut = lines.flatMap(lambda x: re.sub(highpoints, '', x)) \
            .map(lambda x: (x, 1)) \
            .reduceByKey(add).toDF(['emoji', 'emojiCount']).sort(col("emojiCount").desc()).limit(20)

        data = data + '"emojiCount":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "").replace("\\", "\\\\") + '} }'

        spark.stop()
        print data
        return MongoHelper.manageInsert(self.teamName, json.loads(data), "dataAnalytics")


if __name__ == '__main__':
    sch = sparkCassandraHelper('buffercommunity')
    sch.main()
