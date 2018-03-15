#!/usr/local/bin/python

import os
import findspark


def main():
    findspark.init(os.environ['SPARK_HOME'])
    import pyspark
    from pyspark.sql import SQLContext, SparkSession

    spark = SparkSession.builder\
        .master("local[*]")\
        .config("spark.driver.cores", 1)\
        .appName("understanding_sparksession")\
        .getOrCreate()

if __name__=='__main__':
	main()