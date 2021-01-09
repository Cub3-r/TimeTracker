var _config = require('./config.js')
var _sqllite3 = require('sqlite3').verbose()
var _md5 = require('md5');
const config = require('./config.js');


module.exports = {
    
    _initDB:function(){
        var lv_db = this.openDBConnection();
        lv_db.serialize(function() {
            var qry = _config.db.recTabCreate;
            console.log(qry);
           lv_db.run(qry); 
        });
        this.closeDBConnection(lv_db);
    },
    _buildUpdateSetPart:function(oPropertyName,oPropertyValue){
        var lv_part='';
        if(oPropertyName !== undefined && oPropertyValue !== undefined)
        {
            lv_part = oPropertyName.concat('=').concat(oPropertyValue).concat(' ');
        }
        return lv_part;
    },
    openDBConnection: function(){
        var lv_db = new _sqllite3.Database(_config.db.name);
        return lv_db;
    },
    closeDBConnection: function(oConnection){
        oConnection.close();
    },

    gettingAllEntries : function (oRes) {
        var lv_db= this.openDBConnection();
        var qry = _config.db.recTabSelect;
        lv_db.all(qry,(err,rows)=>{
            console.log(err);
            console.log('logical expression ' + (err === null));
            if(err === null || !err){
                oRes.json({
                    "message":"success",
                    "data":rows
                });
            }
        });
    },
    gettingSelectiveEntries : function(oRes,oTimeFrom, oTimeTo) {
      var qry = `SELECT * FROM TimeTrack WHERE START BETWEEN ${oTimeFrom} AND ${oTimeTo}`;
      var lv_db = this.openDBConnection();
      lv_db.all(qry,(err,rows)=>{
          console.log(rows);
          oRes.json(
              {
                  "data": rows
              }
          );
      });

    },
    updateEntry: function(oTrackId, oTopic, oUser,oStart,oEnd,oComment) {
        var lv_dyn_up_set= '';
        lv_dyn_up_set=lv_dyn_up_set.concat(this._buildUpdateSetPart('TOPIC',oTopic));
        lv_dyn_up_set=lv_dyn_up_set.concat(this._buildUpdateSetPart('USER',oUser));
        lv_dyn_up_set=lv_dyn_up_set.concat(this._buildUpdateSetPart('START',oStart));
        lv_dyn_up_set=lv_dyn_up_set.concat(this._buildUpdateSetPart('END',oEnd));
        lv_dyn_up_set=lv_dyn_up_set.concat(this._buildUpdateSetPart('COMMENT',oComment));
        if(lv_dyn_up_set.length>0){
            var lv_qry = config.db.recTabUpdateGenericEntry.replace('COLSVALS',lv_dyn_up_set);
            console.log('UPDATE QUERY: ' + lv_qry);
            var lv_db = this.openDBConnection();
            lv_db.run(lv_qry,(oTrackId));
            this.closeDBConnection(lv_db);
        }
    },
    
    sayHello : function () {
        console.log("hello");
    }
    ,
    sayHelloWithMyName: function(oName){
        console.log("hello " + oName);
    }

}
