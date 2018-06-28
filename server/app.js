
const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    var agent = req.headers['user-agent']
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version =  'HTTP/' + req.httpVersion;
    var status = '200';

    fs.appendFile('logs.csv', agent + ',' + time + ',' + req.method + ',' + resource + ',' + version + ',' + status + '\n', function(err, data){
        console.log( agent + ',' + time + ',' + req.method + ',' + resource + ',' + version + ',' + status );
     
        next();
    });
 
});

app.get('/', (req, res) => {

    res.status(200).send('ok');
});

app.get('/logs', function(req,res) {
    fs.readFile('logs.csv', 'utf8', function(err, data){

        if (err) throw err;
        
       let lines = data.split('\n');
       lines.shift();

       let jsonData = []
        lines.forEach(line => {
        let contents = line.split(',');

        let linejson = {

            "Agent": contents[0],
            "Time": contents[1],
            "Method": contents[2],
            "Resource": contents[3],
            "Version": contents[4],
            "Status": contents[5],
        }

        if(contents[0] !=="") {
            jsonData.push(linejson);
            }
        });

res.json(jsonData);
    
})
})

module.exports = app;