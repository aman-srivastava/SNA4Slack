# SNA4Slack
Social Network Analysis and Visualization for Slack Teams

* For any Infrastructure issues/changes, submit a request at:
```https://docs.google.com/spreadsheets/d/1XTPtCFGlhUDkLeMu0U_h4tPwMXAdcMkpnwTkn3bDI1U/edit#gid=0```

# Install application using Docker Image
## Install the front end:

* Pull the public image from dockerhub with command:
For Beta image: 
```
docker pull ishandikshit/sna4slack_frontend:poc
```
For Live version image:
```
docker pull ishandikshit/sna4slack_frontend:v1
```
* Run the image:
```
docker run --name sna4slack -p 80:80 -d ishandikshit/sna4slack_frontend:poc
```
* Navigate to http://localhost/SNA4Slack/html/ltr/vertical-menu-template/search-page.html

## Install the backend APIs 
* Pull the public image from dockerhub with command:
```
docker pull ishandikshit/sna4slack_backend:v1
```
* Run the image:
```
docker run --name sna4slackAPI -p 4000:80 -d ishandikshit/sna4slack_backend:v1
```
* cURL to http://localhost:4000/ to make REST requests
* Open http://localhost:4000/apidocs/#/ for Swagger UI of all APIs


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
