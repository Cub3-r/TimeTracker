
const express = require('express')
const app = express()
const db = require('./database.js')
const ts = require('./trackerService.js')
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
  ts.sayHello()
  ts.sayHelloWithMyName("Tester")
  ts._initDB();
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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

