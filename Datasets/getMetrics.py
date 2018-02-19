import pandas as pd
import numpy as np

#Loading CSV File and converting it into pandas dataframe
table = pd.read_csv('/Users/sanchitnarang94/Desktop/SER 517/SNA4Slack-master/Datasets/clean_kubernetes-users.csv')
df1 = pd.DataFrame(table)

#Count of messages by each of senders
df1['Sender'].value_counts()

#Count of max messages in channel.
df1['Sender'].value_counts().max()

#User with max messages.
df1['Sender'].value_counts().argmax()

#User with highest message count
df1['Sender'].value_counts().index[0]
#Highest message count
df1['Sender'].value_counts()[0]


#User with 3rd highest message count
df1['Sender'].value_counts().index[2]
#3rd highest message count
df1['Sender'].value_counts()[2]


#User with 2nd highest message count
df1['Sender'].value_counts().index[1]
#2nd highest message count
df1['Sender'].value_counts()[1]


#User with 3rd highest message count
df1['Sender'].value_counts().index[2]
#3rd highest message count
df1['Sender'].value_counts()[2]
