#!/bin/python
# -*- coding: utf-8 -*-
import json
import csv
import uuid
from time import sleep
from random import randint
from selenium import webdriver
from pyvirtualdisplay import Display
from objects.slack_archive import *

class SlackSpider():
	def __init__(self):
		self.all_items = []

	# Open headless chromedriver
	def start_driver(self):
		print('starting driver...')
		self.display = Display(visible=0, size=(800, 600))
		self.display.start()
		self.driver = webdriver.Chrome("/var/chromedriver/chromedriver")
		sleep(randint(5,9))

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
		sleep(randint(4,10))

	def grab_list_items(self):
		print('grabbing list of items...')
		
		for div in self.driver.find_elements_by_xpath('//ul[@class="messages"]//li[@class="msg-type-"]'):
			data = self.process_elements(div)
			if data:
				self.all_items.append(data)
			else:
				pass

	def process_elements(self, div):
		msg_sender = ''
		msg_time = ''
		msg_body = ''
		try:
			msg_sender = div.find_element_by_xpath('.//*[@class="msg-user"]').text
			msg_time = div.find_element_by_xpath('.//*[@class="msg-time"]').text
			msg_body = div.find_element_by_xpath('.//*[@class="msg-body"]').text
		except Exception:
			pass

		if msg_sender and msg_time and msg_body:
			archiveObj = SlackArchive()
			archiveObj.teamName = "kubernetes"
			archiveObj.channelName = "kubernetes-users" 
			archiveObj.messageSender = msg_sender
			archiveObj.messageBody = msg_body
			archiveObj.messageTime = msg_time

			return archiveObj
		else:
			return None

	def parse(self, url_to_crawl):
		self.get_page(url_to_crawl)
		self.grab_list_items()
		
		if self.all_items:
			return self.all_items
		else:
			return False, False

	

if __name__ == "__main__":
	# Run spider
	csv_file = open("csvOutput.csv","wb")
	wr = csv.writer(csv_file)
	
	slackSpider = SlackSpider()
	slackSpider.start_driver()
	
	wr.writerow(["if","Team Name","Channel Name", "Sender", "Message", "Time"])
	
	for i in range(1, 101):
		print str(i)
		items_list=slackSpider.parse("https://kubernetes.slackarchive.io/kubernetes-users/page-"+str(i))
		for cdr in items_list:
			wr.writerow(list(cdr))

	slackSpider.close_driver()
	# Export the touched data
	csv_file.close()

	

	'''with open("csvOutput.csv","wb") as csv_file:
		wr = csv.writer(csv_file)
		wr.writerow(["if","Team Name","Channel Name", "Sender", "Message", "Time"])
		for cdr in items_list:
			wr.writerow(list(cdr))'''