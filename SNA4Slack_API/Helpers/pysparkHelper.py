sc.stop
import org.apache.spark
import org.apache.spark._
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.cassandra
import org.apache.spark.sql.cassandra._
import com.datastax.spark
import com.datastax.spark._
import com.datastax.spark.connector
import com.datastax.spark.connector._
import com.datastax.spark.connector.cql
import com.datastax.spark.connector.cql._
import com.datastax.spark.connector.cql.CassandraConnector
import com.datastax.spark.connector.cql.CassandraConnector._

findspark.init(os.environ['SPARK_HOME'])
import pyspark
from pyspark.sql import SQLContext, SparkSession

spark = SparkSession.builder\
    .appName("understanding_sparksession")\
    .config("spark.cassandra.connection.host", "104.155.179.66")\
    .config("spark.cassandra.auth.username", "cassandra")\
    .config("spark.cassandra.auth.password", "LYN1bQNCds3T")\
    .master("local[*]").getOrCreate()

print spark

load_options = {"table": "slack_archive_dev", "keyspace": "sna4slack_metrics",
                "spark.cassandra.input.split.size_in_mb": "10"}

df = spark.read.format("org.apache.spark.sql.cassandra")\
    .options(**load_options).load()
df.show()
