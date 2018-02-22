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

#Number of messages on each date
df1['Date'].value_counts()

#Date with maximum message count - Most active date
df1['Date'].value_counts().argmax()

#Number of messages on most active date
df1['Date'].value_counts().max()

#Split Time to Hour and Minutes
df1['Hour'] = df1.Time.str[:2]
df1['Minute'] = df1.Time.str[3:5]

#Message count for each hour in the channel.
df1['Hour'].value_counts()

#Most active hour for most active date in the channel.
df1[df1['Date'] == df1['Date'].value_counts().argmax()]['Hour'].value_counts().argmax()
