import pandas as pd
import numpy as np
from django.template import Template, Context, loader
from django.http import HttpResponse
from django.shortcuts import render, render_to_response, redirect




def pass_data(request):

    # Loading CSV File and converting it into pandas dataframe
    table = pd.read_csv('/Users/sanchitnarang94/Desktop/SER 517/SNA4Slack-master/Datasets/clean_kubernetes-users.csv')
    df1 = pd.DataFrame(table)

    # Count of max messages in channel by a user.
    a = df1['Sender'].value_counts().max()

    # Number of messages by each user.
    b = df1['Sender'].value_counts()

    t = loader.get_template('/Users/sanchitnarang94/PycharmProjects/SNAService/templates/vertical-menu-template/channels.html')

    a1 = {'MaxMessages' :a, 'messageList': b}

    return HttpResponse(t.render(a1))


def pass_data_member(request):
    table = pd.read_csv('/Users/sanchitnarang94/Desktop/SER 517/SNA4Slack-master/Datasets/clean_kubernetes-users.csv')
    df2 = pd.DataFrame(table)

    # User with highest message count
    x = df2['Sender'].value_counts().index[0]
    # Highest message count
    y = df2['Sender'].value_counts()[0]

    temp = loader.get_template('/Users/sanchitnarang94/PycharmProjects/SNAService/templates/vertical-menu-template/MembersMain.html')

    a2 = {'HighestUser': x, 'HighestUserMessage': y}

    return HttpResponse(temp.render(a2))