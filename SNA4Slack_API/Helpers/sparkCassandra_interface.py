#!/usr/local/bin/python

import os
import findspark


class sparkCassandraHelper():

    def main(self):
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

        print spark

        try:
            df = spark.read\
                .format("org.apache.spark.sql.cassandra")\
                .options(table="slack_archive_dev", keyspace="sna4slack_metrics").load()
            df.show(10)
        except Exception as error:
            print "Error occured"

if __name__ == '__main__':
    sch = sparkCassandraHelper()
    sch.main()
