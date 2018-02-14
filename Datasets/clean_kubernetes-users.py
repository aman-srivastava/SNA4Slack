import pandas as pd
import numpy as np

#Loading CSV File and converting it into pandas dataframe
table = pd.read_csv('/Users/sanchitnarang94/Desktop/SER 517/SNA4Slack-master/Datasets/kubernetes_kubernetes-users.csv',header=0)
df1 = pd.DataFrame(table)

#Drop column with if
df1 = df1.drop(['if'], axis=1)

#Remove all rows with no Sender
df1['Sender'].replace('', np.nan, inplace=True)
df1.dropna(subset=['Sender'], inplace=True)

df1.to_csv('/Users/sanchitnarang94/Desktop/SER 517/SNA4Slack-master/Datasets/clean_kubernetes-users.csv')