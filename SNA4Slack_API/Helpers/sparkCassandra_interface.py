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

        # MongoHelper.manageInsert(self.teamName,
        # jsonOut.collect().encode("ascii","replace"))

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

        # 4. Get member count per channel in a team
        jsonOut = spark.sql("SELECT SUM(key) AS memberCount, channelName \
            FROM ( \
                    SELECT 1 as key, \
                        messageSender, \
                        channelName \
                    FROM archives \
                    GROUP BY channelName, messageSender) AS innerQuery \
            GROUP BY channelName")
        data = data + '"memberCount_channel":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "") + ','

        # 5. Get message distribution over a year
        jsonOut = spark.sql("SELECT Year, Month,COUNT(*) AS msgCount \
            FROM (\
                    SELECT month(messageTime) AS Month, year(messageTime) AS Year \
                    FROM archives) AS innerQuery \
            GROUP BY Year, Month\
            ORDER BY Year, Month")

        data = data + '"messageCount_yearlyDist":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()
                ).replace("'", "") + ','

        # 6. Get member join and last active date, hashtag count
        jsonOut = spark.sql("SELECT MIN(messageTime) AS joinDateTime\
            , MAX(messageTime) AS lastActiveDateTime \
            , messageSender \
            FROM archives \
            GROUP BY messageSender")

        data = data + '"memberActivity":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        # 7. Get first message sent time and user in the team
        jsonOut = spark.sql("SELECT MIN(messageTime) as messageTime, channelName \
            FROM archives \
            WHERE teamName ='{0}' \
            GROUP BY channelName".format(self.teamName))
        data = data + '"firstMessage":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        # 8. Get top 20 urls and urls count
        lines = df.rdd.map(lambda r: r["messageBody"])
        tokenized = lines.flatMap(lambda x: re.findall(
            'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+', x))
        jsonOut = tokenized.map(lambda x: (x, 1)).reduceByKey(add).toDF(
            ['url', 'urlCount']).sort(col("urlCount").desc()).limit(20)

        data = data + '"sharedURLs":' + \
            str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + ','

        # 9. Get top 20 Emoji count per team
        emojiCode = u'[\U0001F191-\U0001F19A]|[\U0001F1E6-\U0001F1FF]|[\U0001F232-\U0001F23A]\
        |[\U0001F300-\U0001F321]|[\U0001F324-\U0001F393]|[\U0001F399-\U0001F39B]\
        |[\U0001F39E-\U0001F3F0]|[\U0001F3F3-\U0001F3F5]|[\U0001F3F7-\U0001F3FA]\
        |[\U0001F400-\U0001F53D]|[\U0001F549-\U0001F54E]|[\U0001F549-\U0001F54E]\
        |[\U0001F550-\U0001F567]|[\U0001F573-\U0001F57A]|[\U0001F587-\U0001F588]\
        |[\U0001F58A-\U0001F58D]|[\U0001F58A-\U0001F58D]|[\U0001F5C2-\U0001F5C4]\
        |[\U0001F5D1-\U0001F5D3]|[\U0001F5DC-\U0001F5DE]|[\U0001F5DC-\U0001F5DE]\
        |[\U0001F5FA-\U0001F5FF]|[\U0001F600-\U0001F64F]|[\U0001F680-\U0001F6C5]\
        |[\U0001F6CB-\U0001F6D2]|[\U0001F6E0-\U0001F6E5]|[\U0001F6F3-\U0001F6F9]\
        |[\U0001F910-\U0001F93A]|[\U0001F940-\U0001F945]|[\U0001F947-\U0001F970]\
        |[\U0001F973-\U0001F976]|[\U0001F97C-\U0001F9A2]|[\U0001F9B0-\U0001F9B9]\
        |[\U0001F9C0-\U0001F9C2]|[\U0001F9D0-\U0001F9FF]\
        |\U0001F170|\U0001F171|\U0001F17E|\U0001F17F|\U0001F18E|\U0001F6E9|\U0001F6EB \
        |\U0001F6EC|\U0001F6F0|\U0001F93C|\U0001F93D|\U0001F93E|\U0001F97A|\U0001F201 \
        |\U0001F202|\U0001F21A|\U0001F22F|\U0001F250|\U0001F396|\U0001F397|\U0001F56F \
        |\U0001F570|\U0001F590|\U0001F595|\U0001F596|\U0001F5A4|\U0001F5A5|\U0001F5A8 \
        |\U0001F5B1|\U0001F5B2|\U0001F5BC|\U0001F5E1|\U0001F5E3|\U0001F5E8|\U0001F5EF|\U0001F5F3'

        lines = df.rdd.map(lambda r: r["messageBody"])
        jsonOut = lines.flatMap(lambda x: re.findall(emojiCode, x)).map(lambda x: (x, 1)) \
            .reduceByKey(add).toDF(['emoji', 'emojiCount']).sort(col("emojiCount").desc()).limit(20)

        data = data + '"emojiCount":'+str(jsonOut.toJSON(use_unicode=False).collect()).replace("'", "") + '} }'

        data = data.replace("\\", "\\\\\\\\")
        spark.stop()
        return MongoHelper.manageInsert(self.teamName, json.loads(data), "dataAnalytics")


if __name__ == '__main__':
    sch = sparkCassandraHelper('buffercommunity')
    sch.main()
