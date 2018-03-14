#!/usr/local/bin/python

import os
import findspark


def main():
    findspark.init(os.environ['SPARK_HOME'])
    import pyspark
    from pyspark.sql import SQLContext, SparkSession

    sparkSession = SparkSession.builder\
        .appName("understanding_sparksession")\
        .config("spark.cassandra.connection.host", "104.155.179.66")\
        .config("spark.cassandra.auth.username", "cassandra")\
        .config("spark.cassandra.auth.password", "LYN1bQNCds3T")\
        .master("local[*]").getOrCreate()
    print sparkSession

    load_options = {"table": "slack_archive_dev", "keyspace": "sna4slack_metrics",
                    "spark.cassandra.input.split.size_in_mb": "10"}

    try:
        df = sparkSession.read\
            .format("org.apache.spark.sql.cassandra")\
            .options(table="slack_archive_dev", keyspace="sna4slack_metrics").load().show()
    except Exception as error:
        print "Error occured"
        print error

    #tables = spark.catalog.listTables()

    #conf = SparkConf().setAppName("PySpark Cassandra Driver")
    #spark = SparkSession.builder\
    #    .master("local[*]")\
    #    .config("spark.driver.cores", 1)\
    #    .appName("Word Count")\
    #    .getOrCreate()
    #d = [{'name': 'Alice', 'age': 1}]
    # spark.createDataFrame(d).collect()

'''
spark.read.format("org.apache.spark.sql.cassandra")\
    .option("spark.cassandra.connection.host", "104.155.179.66")\
    .option("spark.cassandra.auth.username", "cassandra")\
    .option("spark.cassandra.auth.password", "LYN1bQNCds3T")\
    .options(table="slack_archive_dev", keyspace="sna4slack_metrics")\
    .load().show()'''
# set("spark.cassandra.connection.host", "104.155.179.66").\
# set("spark.cassandra.auth.username", "cassandra").\
# set("spark.cassandra.auth.password", "LYN1bQNCds3T")

# df = sqlContext.read.format("org.apache.spark.sql.cassandra").\
#    option("spark.cassandra.connection.host", "104.155.179.66").\
#    option("spark.cassandra.auth.username", "cassandra"). \
#    option("spark.cassandra.auth.password", "LYN1bQNCds3T"). \
# options(table="sna4slack_metrics", keyspace="slack_archive_dev").load()
# user = sqlContext.read.format("org.apache.spark.sql.cassandra").load(keyspace="sna4slack_metrics", table="slack_archive_dev")
# user.show()
# table1 = sqlContext.sql("select * from sna4slack_metrics.slack_archive_dev")
# table1 = sqlContext.read.format("org.apache.spark.sql.cassandra").options(table="slack_archive_dev", keyspace="sna4slack_metrics").load()
# table1.show()
# spark = SparkSession.builder.master("local").config(conf=conf).getOrCreate()
# df = spark.sql("select * from sna4slack_metrics.slack_archive_dev")

if __name__ == '__main__':
    main()
