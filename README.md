# Twitch Discovery


## Summary  
Twitch Discovery pulls an array of livestreams from the Twitch API every 35 minutes or so. After each update it increments the offset value (how many streams I skip over) by .0025. 
This allows you to discover new twitch streams and find out the percentage they fall in. The off-canvas menu also provides more data into the list of streamers it pulled. 

## Navigating
./go-backend - the Golang backend server
./node-backend - NodeJS backend server (No longer being updated)
./frontend - React

## Use it yourself
1. Clone the Repo
2. In "./go-backend" run  "go run *.go"
3. In "./frontend" run "npm i"
4. In "./frontend" run npm start