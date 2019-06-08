This is a simple express server that records activity in a log.csv file and can serve up that log file as a JSON 
when it receives GET requests to '/logs'.

You can clone this project to your system with `git clone "git@github.com:Z4rkal/Node-Logging-Server.git"`.
In order to run the server you will need NodeJS and Node Package Manager (npm), so that you can run 
`npm install` and to download the dependencies and `npm start` to start the server.

The server listens on port 3000 and will write all activity to `log.csv` in the `/server/` folder. It will create `log.csv` if it doesn't exist already and initialize it properly, so don't create an empty `log.csv`.

A working example of the project running is located [here as a Now deploy](https://node101-log-all-the-things.zarkal.now.sh/), change the route to `/logs` to see a JSON of the logged activity.