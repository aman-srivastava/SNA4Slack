#!/usr/local/bin/python

import os
import findspark


class sparkCassandraHelper():

    def createSparkSession(self):
        findspark.init(os.environ['SPARK_HOME'])
        import pyspark
        from pyspark.sql import SQLContext, SparkSession

        spark = None
        try:
            spark = SparkSession.builder\
                .appName("SNA4Slack_sparksession")\
                .config("spark.cassandra.connection.host", "104.155.179.66")\
                .config("spark.cassandra.auth.username", "cassandra")\
                .config("spark.cassandra.auth.password", "LYN1bQNCds3T")\
                .master("local[*]").getOrCreate()
        except Exception as error:
            print error

        return spark

    def main(self):
        spark = self.createSparkSession()
        try:
            df = spark.read\
                .format("org.apache.spark.sql.cassandra")\
                .options(table="slack_archive_dev", keyspace="sna4slack_metrics").load()
            df.createOrReplaceTempView("archives")

            jsonOut = spark.sql("SELECT max(teamName) as teamName,messageSender, count(messageBody) as msgCount \
                FROM archives \
                WHERE teamName= 'openaddresses' \
                GROUP BY  messageSender \
                ORDER BY msgCount").toJSON()

            jsonOut.collect()

        except Exception as error:
            print "Error occured"
        spark.stop()

if __name__ == '__main__':
    sch = sparkCassandraHelper()
    sch.main()
