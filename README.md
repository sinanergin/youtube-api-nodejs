<h1>Node.JS Client for Youtube Data API queries</h1>

(You need to a Youtube API KEY for send queries. I removed the key for privacy. Please open the '.env' file and enter API_KEY value then save the file.)

1- The application works on Docker containers.
First of all lets install docker our computer

https://docs.docker.com/get-docker/


2- Wait installation to complete. Then check out the github repo.


3- Open the command line and change directory where the docker-compose.yml file.


4- We suppose docker client is working on your system. Type this command and wait complete of download:
docker-compose up -d


5- When containers installed your computer, you can send the Rest API requests.
Node app works on localhost:3001
Mysql works on localhost:3306

Your password and connection information are in the ".env" file.


6- Here are Rest API endpoints:

- Get all videos from YouTube Channels and save to DB:
  localhost:3001/video/pullAllVideos (GET request)

- Retrive of all videos from db:
  localhost:3001/video/getAllVideos (GET request)

- Get a video by ID:
  localhost:3001/video/getVideo/1 (GET request)

- Delete a video by ID:
  localhost:3001/video/getVideo/1 (DELETE request)


7- If you want to shut down all the containers, please type this command:
docker-compose down
