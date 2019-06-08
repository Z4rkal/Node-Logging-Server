const express = require('express');
const fs = require('fs');
const app = express();

//Function to clear logs, disabled aside from while testing
function clearLogs() {
    fs.createWriteStream('server/log.csv',{ flags: 'w'}).write('Agent,Time,Method,Resource,Version,Status\n');
}

//clearLogs();

//This function is placeholder in case I decide to implement log rotation
function logToFile(logs) {
    fs.createWriteStream('server/log.csv', { flags: 'a' }).write(toLog);
}

//Function for formatting log inputs, only gets called for the user-agent but should really be called for everything just to be safe
function removeCommas(str) {
    var newStr = '';
    //Splits the input into parts by matching until a comma
    str.match(/[^\,]+/g).forEach((element) => {
        newStr += element; //And then stitch each part back together without the commas
    })
    //Finally return the new comma-less string
    return newStr;
}

//Function that formats the logs into a JSON for the /logs endpoint
function formatLogs(logs) {
    var labels = logs.match(/[^\n]+/)[0]; //Pulls the first line containing the member labels out of the log file
    labels = labels.match(/[^\,]+/g); //Splits the labels into different elements
    logs = logs.slice(41); //Removes the first line from the logs
    logs = logs.match(/[^\n]+/g); //Splits the logs into separate elements for each line
    //Initialize the JSON string that we'll construct with an open bracket
    var logJSON = `[
    `;
    logs.forEach((element) => {
        element = element.match(/[^\, ][^\,]*/g); //Splits up the current log line by matching between ', ' and ','
        //And then adds an object containing the line to the JSON we're constructing
        logJSON += 
    `{
        "${labels[0]}": "${element[0]}",
        "${labels[1]}": "${element[1]}",
        "${labels[2]}": "${element[2]}",
        "${labels[3]}": "${element[3]}",
        "${labels[4]}": "${element[4]}",
        "${labels[5]}": "${element[5]}"
    },`
    });
    logJSON = logJSON.slice(0,logJSON.length-1); //Removes the extra comma from the last object
    //And then caps off the JSON string with a closing bracket
    logJSON += `
]`;
    //Then returns the completed JSON string to the caller
    return logJSON;
}

app.use((req, res, next) => {
    //Create a string to be logged piece by piece and separate each piece with ', '
    toLog = `${removeCommas(req.get('User-Agent'))}, `;
    toLog += `${new Date().toISOString()}, `;
    toLog += `${req.method}, `;
    toLog += `${req.path}, `;
    toLog += `HTTP/${req.httpVersion}, `;
    toLog += `${res.statusCode}\n`;
    logToFile(toLog); //And then send the log string to a function for writing to the log file
    next();
});

//Since this project doesn't have a front-end, the / route is just used for the unit tests and is largely placeholder
app.get('/', (req, res) => {
    // write your code to respond "ok" here
    console.log(toLog);
    res.status(200).end('ok');
});

//Route for the exposed endpoint that returns the log file as a JSON
app.get('/logs', (req, res) => {
    //First we read the log file
    fs.readFile('server/log.csv', 'utf8', function (err, data) {
        if (err) throw err;
        data = formatLogs(data); //We need to use formatLogs to turn it into a JSON string
        data = JSON.parse(data); //Then we turn it into a JSON object with JSON.parse
        res.json(data); //Finally we respond to the GET request with our new JSON object
    });
});

//Any other route 404's
app.get('*',(req,res) => {
    res.status('404').send('404: Resource not found');
});

module.exports = app;
