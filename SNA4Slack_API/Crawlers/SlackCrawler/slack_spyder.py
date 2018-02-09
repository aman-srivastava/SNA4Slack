#!/bin/python
# -*- coding: utf-8 -*-
import json
import uuid
import sys
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
        self.all_items = []
        self.channelList = []
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
        sleep(randint(5, 9))

    # Close chromedriver
    def close_driver(self):
        print('closing driver...')
        self.display.stop()
        self.driver.quit()
        print('closed!')

    # Tell the browser to get a page
    def get_page(self, url):
        print('getting page...')
        self.driver.get(url)
        sleep(randint(4, 10))

    def grab_list_items(self):
        print('grabbing list of items...')

        for div in self.driver.find_elements_by_xpath('//ul[@class="messages"]//li'):
            data = self.process_elements(div)

            if data:
                self.all_items.append(data)
            else:
                pass

    def process_elements(self, div):
        msg_sender = ''
        msg_time = ''
        msg_body = ''
        msg_sender_avatar = ''
        try:
            msg_sender = div.find_element_by_xpath(
                './/*[@class="msg-user"]').text
            msg_time = div.find_element_by_xpath(
                './/*[@class="msg-time"]').text
            msg_sender_avatar = div.find_element_by_xpath(
                './/*[@class="msg-thumb"]').get_attribute('src')
            msg_body = div.find_element_by_xpath(
                './/*[@class="msg-body"]').text
        except Exception:
            pass

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

    def parse(self, url):
        self.get_page(url)
        self.grab_list_items()
        if self.all_items:
            return self.all_items
        else:
            return False, False
        pass

    def getChannelList(self):
        for channelName in self.driver.find_elements_by_xpath('//ul[@class="channels-list"]//li//a'):
            self.channelList.append(channelName.text)
        pass

    def getPageSize(self, url_Template):
        for page in self.driver.find_elements_by_xpath('//ul[@class="pagination pagination-vertical"]//li[@class="page-item active"]'):
            self.pageSize = int(page.text)
        pass

    def buildTarget(self, teamName):
        url_Template = "https://{0}.slackarchive.io/".format(teamName)
        self.get_page(url_Template)
        self.getChannelList()
        for channel in self.channelList:
            channelName = channel[1:].strip()
            urlA = url_Template + channelName + "/"
            self.get_page(urlA)
            self.getPageSize(urlA)
            for i in range(1, self.pageSize + 1):
                urlObject = []
                urlObject.append(teamName)
                urlObject.append(channelName)
                urlObject.append(urlA + "page-" + str(i))
                self.urlsToHit.append(urlObject)
        pass

    def runSpider(self, teamName):
        self.buildTarget(teamName)
        count = 0
        returnList = []
        for url in self.urlsToHit:
            self.TeamName = url[0]
            self.ChannelName = url[1]

            for cdr in self.parse(url[2]):
                node_object = SlackArchive(id=uuid.uuid1(),
                                           teamName=cdr.teamName,
                                           channelName=cdr.channelName,
                                           messageSender=cdr.messageSender.rstrip().lstrip(),
                                           messageBody=cdr.messageBody.rstrip().lstrip(),
                                           senderAvatar=cdr.senderAvatar.rstrip().lstrip(),
                                           messageTime=datetime.strptime(
                                               cdr.messageTime, "%b %d, %Y %H:%M")
                                           )
                returnList.append(node_object)
        return returnList
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
