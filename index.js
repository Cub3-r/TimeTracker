
const express = require('express')
const app = express()
const ts = require('./trackerService.js')
const port = 3000
const path = require('path')
const config = require('./config.js');
const utils = require('./utils.js');
const fs = require('fs');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({extended: true})

// needed for the json bordy parser --. https://github.com/raynos/body
app.use(bodyParser.json())
app.use(express.static('./'))
app.use('/Frontend_Timetracker',express.static(__dirname+'/Frontend_Timetracker'))
app.use('/css',express.static(__dirname+'/Frontend_Timetracker/css'))
app.use('/js',express.static(__dirname+'/Frontend_Timetracker/js'))

/*app.use(function( req, res, next ) {
  var data = '';
  req.on('data', function( chunk ) {
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
    console.log( 'on end: ', data )
    if (data && data.indexOf('{') > -1 ) {
      req.body = JSON.parse(data);
    }
    next();
  });
});*/

app.post('/sample',(req, res) => {
  console.log("some action");
})

app.get('/loadDashboardTimes',(req, res) => {
  var times = { "break": utils.convertMinutesValueToFormat(parseInt(config.app.breakTime)),
                "breakMinutes": config.app.breakTime,
                "workTime" : utils.convertMinutesValueToFormat(parseInt(config.app.workTime)),
                "workTImeMinutes": config.app.workTime};
  res.json(times)
})

app.get('/', (req, res) => {
  // sending the html page
  //res.sendFile(path.join(__dirname+ '/public/test.html'))
  res.sendFile(path.join(__dirname+'/Frontend_Timetracker/TimeTracker_front_dashboard.html'))
})

app.get('/timesheet', (req, res) => {
  // sending the html page
  //res.sendFile(path.join(__dirname+ '/public/test.html'))
  res.sendFile(path.join(__dirname+'/Frontend_Timetracker/TimeTracker_front_timesheet.html'))
})

app.get('/start',(req, res) => {
 var topic = req.param("topic")
 res.send('starting the counter with topic '+ topic)
})

app.get('/dummystart',(req,res)=>{
  var topic ='myRun';
  var db = ts.openDBConnection();
  db.run('INSERT INTO TimeTrack (TOPIC, USER, START) VALUES(?,?,?)',[topic,"andi",new Date().getTime()]);
  ts.closeDBConnection(db);
  res.send('the inserting is finished');
})

app.get('/allEntries',(req,res)=>{

  ts.gettingAllEntries(res);
})
app.get('/allSelEntries',(req,res)=>{
  var lv_from = new Date('01 Jan 2021').getTime();
  var lv_to = new Date('2021-01-02T14:02:46').getTime();
  ts.gettingSelectiveEntries(res,lv_from,lv_to);
})
app.get('/usrs',(req, res) => {
  var sql = "select * from user"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
 })
 app.get('/end',(req, res) => {
   ts.endTrack(parseInt("5"));
  })
,
app.post('/csvExport', (req,res) => {
  ///https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
  // get the json object of the Request
//  console.log(req)
  console.log(req.body)
  var body = req.body
  // using the utils js
  console.log('received data ' + body);

  console.log('received data as string ' + JSON.stringify(body));

  var tabJson = body;
  console.log(tabJson);
  var fileName = 'timeExport'+ utils.getDateString(utils.getDateObject()) + '.xlsx';
  var fName = utils.exportJSONToExcelFile(tabJson,"rows",fileName,res);
  const stream = fs.createReadStream(fName);

  res.writeHead(200, {
      'Content-Disposition': 'attachment;filename=' + fName,
      'Content-Type': 'application/msexcel',
      'Content-Length': fs.statSync(fName).size
  });
  stream.pipe(res);

// To use the download function is also be possible, but you have to comment out setting the header and also the removing of the unlinkSync
//  res.download(fName);

  // the deletion of the File on filesysyem - async
  // how to --> https://flaviocopes.com/how-to-remove-file-node/
  try {
    fs.unlinkSync(fName);
    //file removed
  } catch(err) {
    console.error(err);
  }
})
,
// demo for the exporting function
// https://csvjson.com/json2csv
app.get('/dummyExport', (req,res) =>{
  var o = {rows:[{
              ID      :   "1",
              Name    :   "Mario",
              }
              ,{
                  ID   :   "2",
                  Name    :   "Luigi",
              },
              {
                  ID   :   "3",
                  Name    :   "Toad",
              },
              {
                  ID   :   "4",
                  Name    :   "Yoshi",
                  }
              ]};
    var fName = utils.exportJSONToExcelFile(o,"rows",'meinExport.xlsx',res);

    // the following commands are needed to configure the response type and set the stream as well
    const stream = fs.createReadStream(fName);         // create read stream
    res.writeHead(200, {
        'Content-Type': 'application/msexcel',
        'Content-Length': fs.statSync(fName).size
    });
    stream.pipe(res);
    // the deletion of the File on filesysyem - async
    // how to --> https://flaviocopes.com/how-to-remove-file-node/
    try {
      fs.unlinkSync(fName);
      //file removed
    } catch(err) {
      console.error(err);
    }

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
