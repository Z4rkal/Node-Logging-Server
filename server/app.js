const express = require('express');
const fs = require('fs');
const app = express();

//Function to clear logs, disabled aside from while testing
function clearLogs() {
    fs.createWriteStream('server/log.csv',{ flags: 'w'}).write('Agent,Time,Method,Resource,Version,Status\n');
}

clearLogs();

function removeCommas(str) {
    var newStr = '';
    str.match(/[^\,]+/g).forEach((element) => {
        newStr += element;
    })
    //console.log(newStr);
    return newStr;
}

function formatLogs(logs) {
    var labels = logs.match(/[^\n]+/)[0];
    labels = labels.match(/[^\,]+/g);
    console.log(`Labels: ${labels}`);
    logs = logs.slice(41);
    logs = logs.match(/[^\n]+/g);
    var logJSON = `[
    `;
    logs.forEach((element) => {
        element = element.match(/[^\,\ ].+[^\,]/g);
        //console.log(element);
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
    logJSON = logJSON.slice(0,logJSON.length-1);
    logJSON += `
]`;
    //console.log(logJSON);
    return logJSON;
}

app.use((req, res, next) => {
    // write your logging code here
    toLog = `${removeCommas(req.get('User-Agent'))}, `;// + req.get('Time') + req.get('Method') + req.get('Resource') + req.get('Version') + req.get('Status');
    toLog += `${new Date().toISOString()}, `;
    toLog += `${req.method}, `;
    toLog += `${req.path}, `;
    console.log(req.path);
    toLog += `HTTP/${req.httpVersion}, `;
    toLog += `${res.statusCode}\n`;
    fs.createWriteStream('server/log.csv', { flags: 'a' }).write(toLog);
    next();
    // console.log(toLog);
});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.status(200).end('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('server/log.csv', 'utf8', function (err, data) {
        if (err) throw err;
        data = formatLogs(data);
        data = JSON.parse(data);
        res.json(data);
    });
});

module.exports = app;
