#!/bin/python
# -*- coding: utf-8 -*-
import json
from time import sleep
from random import randint
from selenium import webdriver
from pyvirtualdisplay import Display

class SlackSpider():
	def __init__(self):
		self.url_to_crawl = "https://kubernetes.slackarchive.io/kubernetes-users/page-1"
		self.all_items = []

	# Open headless chromedriver
	def start_driver(self):
		print('starting driver...')
		self.display = Display(visible=0, size=(800, 600))
		self.display.start()
		self.driver = webdriver.Chrome("/var/chromedriver/chromedriver")
		sleep(4)

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
		sleep(randint(4,5))

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
			single_item_info = {
				'msg_sender': msg_sender,
				'msg_time': msg_time,
				'msg_body': msg_body
			}
			return single_item_info
		else:
			return False

	def parse(self):
		self.start_driver()
		self.get_page(self.url_to_crawl)
		self.grab_list_items()
		self.close_driver()

		if self.all_items:
			return self.all_items
		else:
			return False, False


if __name__ == "__main__":
	# Run spider
	slackSpider = SlackSpider()
	items_list = slackSpider.parse()

	# Export the touched data
	jsonOut= open("jsonOutput.json","w+")
	jsonOut.write(json.dumps(items_list))
	jsonOut.close()
