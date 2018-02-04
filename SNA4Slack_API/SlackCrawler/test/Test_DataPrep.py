#!/bin/python
# -*- coding: utf-8 -*-
import json
import csv
import uuid
import sys
from time import sleep
from random import randint
from selenium import webdriver
from pyvirtualdisplay import Display
from objects.slack_archive import *
import datetime

from objects.slack_archive import *
from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from utils import Utils


class DataPrep():

    def LoadTextData(self, csv_file):
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        msg_sender = ''
        msg_time = ''
        msg_body = ''
        msg_sender_avatar = ''

        with open(csv_file, 'rb') as csvfile:
            fileReader = csv.reader(csvfile)
            for row in fileReader:
                if row:
                    if len(row) > 2:
                        channelName = row[2]
                    else:
                        channelName = 'TestData_' + \
                            csv_file.split('/')[-1].split('.')[0]
                    node_object = SlackArchive(id=uuid.uuid1(),
                                               teamName=csv_file.split(
                                                   '/')[-1].split('.')[0],
                                               channelName=channelName,
                                               messageSender=str(row[0]),
                                               senderAvatar='https://buffercommunity.slack.com/archives/-general/p1458841440001473',
                                               messageBody=str(row[1]),
                                               messageTime=datetime.strptime(
                        'Oct 25, 2017 05:41', "%b %d, %Y %I:%M"))
                    print str(node_object)
                    node_object.save()
                print row

if __name__ == '__main__':
    dataPrep = DataPrep()
    dataPrep.LoadTextData(
        '~/SNA4Slack/SNA4Slack_API/NetworkX/resources/padgett_florentine_business.csv')
