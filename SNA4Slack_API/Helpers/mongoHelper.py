from pymongo import MongoClient
from config import Config


class MongoHelper:

    @classmethod
    def manageInsert(self, collectionName, data, documentType):
        client = MongoClient(Config.MONGO_CLIENTURI)
        db = client[Config.MONGO_DB_NAME]
        collection = db[collectionName]
        if collection.count({"documentType": documentType}) > 0:
            collection.delete_one({"documentType": documentType})
        post_id = collection.insert_one(data).inserted_id
        return str(post_id)
