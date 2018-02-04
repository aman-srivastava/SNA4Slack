# sna4slack-ws
Web Service repository for SNA4Slack

install dependencies using
pip install -r requirements.txt

Deployment steps:
1. Login to gcloud and launch app engine console
2. cd ws/sna4slack-ws
4. git pull origin master
5. gcloud app deploy app.yaml 
(app.yaml has deploy configs)
