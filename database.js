// https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
var sqllite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSRC = "db.sqlite"

let db = new sqllite3.Database(DBSRC,(err)=>{
    if(err){
        console.error(err.message)
        throw err
    }
    console.log('Connected to the SQLite database.')
    db.run(`CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, 
        email text UNIQUE, 
        password text, 
        CONSTRAINT email_unique UNIQUE (email)
        )`,(err) => {
        if(!err){
            var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
            db.run(insert, ["admin","admin@example.com",md5("admin123456")])
        }
    })

});

module.exports = db