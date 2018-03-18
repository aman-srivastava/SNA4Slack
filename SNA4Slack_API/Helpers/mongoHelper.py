from pymongo import MongoClient
from config import Config


class MongoHelper:

    @classmethod
    def manageInsert(self, collectionName, data):
        client = MongoClient(Config.MONGO_CLIENTURI)
        db = client[Config.MONGO_DB_NAME]
        collection = db[collectionName]
        post_id = collection.insert_one(data).inserted_id
        return str(post_id)

    @classmethod
    def manageAppend(self, collectionName, data):
        client = MongoClient(Config.MONGO_CLIENTURI)
        db = client[Config.MONGO_DB_NAME]
        collection = db[collectionName]
        post_id = collection.insert_one(data).inserted_id
        return str(post_id)
