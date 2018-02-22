# SNA4Slack
Social Network Analysis and Visualization for Slack Teams

# Slack-Spyder Installation (Crawler)
* Clone the repository
```
git clone https://github.com/aman-srivastava/SNA4Slack.git
```
* Go to crawler directory
```
cd Crawlers
```
* Run the crawler
```
python slack_spyder.py
```
* Check the scraper output at :Crawler\<teamname>.csv

# Graph Analyser
The SNA4SLack graph analysis is done using NetworkX library on the backend. The python source code is located in /NetworkX folder.

## Graph Analyser Installation
* Install NetworkX  : [link](https://networkx.github.io/documentation/stable/install.html)
* Install MatPlotLib : [link](https://matplotlib.org/users/installing.html)
* The main class is in /NetworkX/src/graph_generator.py

## Graph Analyzer testing
* Navigate to /NetworkX/tests
* Run `pytest` in terminal

# Web Services installation
* Clone the repository
```
git clone https://github.com/aman-srivastava/SNA4Slack.git
```
* Go to ws directory
```
cd ws
```
* Install python dependencies: This will install Flask and Cassandra DB Engine
```
pip install requirements.txt
```
* Start the server
```
python main.py
```
* Check the server at ```http://localhost:5000```
* Current server hosted on cloud at: http://sna4slack-dot-sna4slack-asu.appspot.com/apidocs/#/default
* Sandbox server hosted on cloud at: https://sna4slack-sandbox-dot-sna4slack-asu.appspot.com
