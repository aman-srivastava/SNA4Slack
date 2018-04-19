# Use an official Python runtime as a parent image
FROM python:2.7-slim


#Set ENV
ENV APP_HOME=./SNA4Slack_API


# Set the working directory to /app
WORKDIR $APP_HOME


# Copy the current directory contents into the container at /app
ADD . $APP_HOME


# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip
RUN pip install -r $APP_HOME/requirements.txt


# Make port 4000 available to the world outside this container
EXPOSE 4000


# Define environment variable
ENV NAME sna4slack


# Run app.py when the container launches
CMD ["python", "./SNA4Slack_API/main.py"]
