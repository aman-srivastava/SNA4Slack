#!/bin/python
# -*- coding: utf-8 -*-
import json
import uuid
import sys
import dateutil.parser
from time import sleep
from random import randint
from datetime import datetime

from selenium import webdriver
from pyvirtualdisplay import Display
from objects.slack_archive import *

from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster
from cassandra.cqlengine.management import sync_table
from cassandra.cqlengine.models import Model
from cassandra.cqlengine import columns, connection
from utils import Utils


class SlackSpider():

    def __init__(self):
        #self.all_items = []
        self.channelList = []
        self.dataList = []
        self.pageSize = 0
        self.urlsToHit = []
        self.TeamName = ''
        self.ChannelName = ''

    # Open headless chromedriver
    def start_driver(self):
        print('starting driver...')
        self.display = Display(visible=0, size=(800, 600))
        self.display.start()
        self.driver = webdriver.Chrome("/var/chromedriver/chromedriver")
        sleep(randint(9, 10))

    # Close chromedriver
    def close_driver(self):
        print('closing driver...')
        self.display.stop()
        self.driver.quit()
        print('closed!')

    # Tell the browser to get a page
    def get_page(self, url):
        print('getting page...{0}'.format(url))
        self.driver.get(url)
        sleep(randint(9, 10))

    # Grab items from divisions
    def grab_list_items(self):
        print('grabbing list of items...')
        senderAvatar = ''
        all_items = []
        for div in self.driver.find_elements_by_xpath('//ul[@class="messages"]//li'):
            data = self.process_elements(div, senderAvatar)

            if data:
                all_items.append(data)
                if data.senderAvatar != '':
                    senderAvatar = data.senderAvatar
        return all_items

    # Process division elements
    def process_elements(self, div, senderAvatar):
        msg_sender_avatar = ''
        try:
            msg_sender = div.find_element_by_class_name(
                "msg-user").get_attribute('innerText')
            msg_time = div.find_element_by_class_name(
                "msg-time").get_attribute('innerText')
            msg_body = div.find_element_by_class_name(
                "msg-body").get_attribute('innerText')
        except Exception as error:
            print 'element not found exception'
            return None

        try:
            avatar = div.find_element_by_xpath('.//*[@class="msg-avatar"]')
            msg_sender_avatar = avatar.find_element_by_class_name(
                'msg-thumb').get_attribute('src')
        except Exception as error:
            msg_sender_avatar = senderAvatar

        if msg_sender and msg_time and msg_body:
            archiveObj = SlackArchive()
            archiveObj.teamName = self.TeamName
            archiveObj.channelName = self.ChannelName
            archiveObj.messageBody = msg_body
            archiveObj.senderAvatar = msg_sender_avatar
            archiveObj.messageTime = msg_time
            archiveObj.messageSender = msg_sender
            return archiveObj

        else:
            return None

    # Parse the URL
    def parse(self, url):
        self.get_page(url)
        return self.grab_list_items()
        pass

    # Get list of channels in a team
    def getChannelList(self):
        for channelName in self.driver.find_elements_by_xpath('//ul[@class="channels-list"]//li//a'):
            self.channelList.append(channelName.text)
        pass

    # Get the total number of pages in each channel in each page
    def getPageSize(self, url_Template):
        for page in self.driver.find_elements_by_xpath('//ul[@class="pagination pagination-vertical"]//li[@class="page-item active"]'):
            self.pageSize = int(page.text)
        pass

    # Build the list of URL's to hit
    def buildTarget(self, teamName):
        url_Template = "https://{0}.slackarchive.io/".format(teamName)
        self.get_page(url_Template)
        self.getChannelList()
        if teamName == 'buffercommunity':
            self.channelList = self.channelList[7:]
        for channel in self.channelList:
            channelName = channel[1:].strip()
            urlA = url_Template + channelName + "/"
            self.get_page(urlA)
            self.getPageSize(urlA)
            print 'Page size: {0}'.format(self.pageSize)
            for i in range(1, self.pageSize + 1):
                urlObject = []
                urlObject.append(teamName)
                urlObject.append(channelName)
                urlObject.append(urlA + "page-" + str(i))
                self.urlsToHit.append(urlObject)
        pass

    # Run the crawler
    def runSpider(self, teamName):

        self.buildTarget(teamName)
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)

        for url in self.urlsToHit:
            self.TeamName = url[0]
            self.ChannelName = url[1]
            count = 0
            for data in self.parse(url[2]):
                if data:
                    count += 1
                    node_object = SlackArchive(id=uuid.uuid1(),
                                               teamName=data.teamName,
                                               channelName=data.channelName,
                                               messageSender=data.messageSender.rstrip().lstrip(),
                                               messageBody=data.messageBody.rstrip().lstrip(),
                                               senderAvatar=data.senderAvatar,
                                               messageTime=dateutil.parser.parse(data.messageTime))
                    node_object.save()
            if count > 0:
                print '{0} rows saved'.format(count)

            else:
                print url[2]
                print 'No data found'
    pass


if __name__ == "__main__":
    # Run spider
    if len(sys.argv[0]) > 0:
        slackSpider = SlackSpider()
        slackSpider.start_driver()
        slackSpider.runSpider(sys.argv[1])
        slackSpider.close_driver()
    else:
        print 'Pass team name as parameter!'
