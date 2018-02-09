import uuid
import json
from datetime import datetime

from flask_restful import Resource, request
from flask import Flask, request, jsonify, _request_ctx_stack

from utils import Utils
from objects.slack_archive import SlackArchive
from SlackCrawler.slack_spyder import SlackSpider


class CrawlerTrigger(Resource):

    def post(self):
        """Initializes crawler to get team data and save in database 
        Implemented in flask for python 2.7
        ---
        parameters:
          - name: team_Name
            in: header
            type: string
            required: true
            default: kubernetes
            description: Enter team name
        operationId: putArchiveData
        consumes:
          - string
        produces:
          - string

        deprecated: false
        externalDocs:
          description: Project repository
          url: https://github.com/aman-srivastava/SNA4Slack
        responses:
          200:
            description: Parse Slack archive and save data to database
        """
        team_Name = request.headers.get('team_Name')
        slackSpider = SlackSpider()
        slackSpider.start_driver()
        items_list = slackSpider.runSpider(team_Name)
        slackSpider.close_driver()
        Utils.get_Connection_SNA4Slack()
        sync_table(SlackArchive)
        for i in items_list:
            node_object = SlackArchive(id=uuid.uuid1(),
                teamName=cdr.teamName,
                channelName=cdr.channelName,
                messageSender=cdr.messageSender.rstrip().lstrip(),
                senderAvatar=cdr.senderAvatar.rstrip().lstrip(),
                messageBody=cdr.messageBody.rstrip().lstrip(),
                messageTime=datetime.strptime(cdr.messageTime, "%b %d, %Y %I:%M"))
            node_object.save()
        
        return "Success"
