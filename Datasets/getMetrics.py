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
