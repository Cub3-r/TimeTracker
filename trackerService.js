var _config = require('./config.js')
var _sqllite3 = require('sqlite3').verbose()
var _md5 = require('md5');
const config = require('./config.js');
var _utils = require('./utils.js');


module.exports = {
    /**
    * Initialize the database in a new file.
    */
    _initDB:function(){
        var lv_db = this.openDBConnection();
        lv_db.serialize(function() {
            var qry = _config.db.recTabCreate;
            console.log(qry);
           lv_db.run(qry);
        });
        this.closeDBConnection(lv_db);
    },
    /**
    * Builds the update set part of the database sql update command.
    * @param {String} oPropertyName The name of the property.
    * @param {String} oPropertyValue The value of the property.
    * @return: The merged string of the sql update command. Sample oPropertyName = END oPropertyValue= 0815 --> END=0815
    */
    _buildUpdateSetPart:function(oPropertyName,oPropertyValue){
        var lv_part='';
        if(oPropertyName !== undefined && oPropertyValue !== undefined)
        {
            lv_part = oPropertyName.concat('=').concat(oPropertyValue).concat(' ');
        }
        return lv_part;
    },
    /**
      * Converts the record times of a track entry.
      * @oJSONResult: The json results
    **/
    _convertRecordTimes:function(oJSONResult){
      if (oJSONResult !== undefined || oJSONResult.length > 0) {
        // helper method to convert all date time objects
        var fn_convertDateTime = function(oTimeObject){
          if (oTimeObject!== undefined || oTimeObject !== null) {
            return _utils.getDateObject(oTimeObject);
          }
          return oTimeObject;
        };
          for (var oItmIdx = 0; oItmIdx < oJSONResult.length; oItmIdx++) {
            oItm = oJSONResult[oItmIdx];
            oItm['END'] = fn_convertDateTime(oItm['END']);
            oItm['START'] = fn_convertDateTime(oItm['START']);
          }
        return oJSONResult;
      }
    },
    /**
    * Opens the database connection.
    * @return: The open database connection.
    */
    openDBConnection: function(){
        var lv_db = new _sqllite3.Database(_config.db.name);
        return lv_db;
    },
    /**
    * Closes the database connection.
    * @param {sqllite3.Database} oConnection The Database.
    */
    closeDBConnection: function(oConnection){
        oConnection.close();
    },
    /**
    * Creates a new time track entry.
    * @param {String} oTopic The topic of the entry.
    * @param {String} oUser The reported user.
    * @param {Date} oJSDate The date in a javascript object.
    * @return: The flag-state of the inserting action.
    */
    createNewEntry : function(oTopic, oUser, oJSDate){
      var lv_successfully = false;
        // Adding only a new entry with valid params
        if (oTopic !== undefined && oUser !== undefined && oJSDate !== undefined) {
          var lv_db = openDBConnection();
          var lv_qry = _config.db.recTabInsertStart;
          console.log("------- input params -------");
          console.log("--oTopic       ------ " + oTopic);
          console.log("--oUser       ------ " + oUser);
          console.log("--oJsDate      ------ " + oJSDate);
          console.log("--IntegerTime  ------ " + _utils.getIntegerTime(oJsDate) );
          lv_db.run(lv_qry,[oTopic,oUser,oStart,_utils.getIntegerTime(oJsDate)]);
          this.closeDBConnection(lv_db);
          lv_successfully = true;
        }
      return lv_successfully;
    },
    /**
    * Getting all entries of the table.
    * @param {Response} oRes The response of the express engine.
    * @return: All entries in the time track table.
    */
    gettingAllEntries : function (oRes) {
        var lv_db= this.openDBConnection();
        var lv_qry = _config.db.recTabSelect;
        var that = this;
        lv_db.all(lv_qry,(err,rows)=>{
            if(err === null || !err){
              var finalResult =that._convertRecordTimes(rows);
                oRes.json({
                    "message":"success",
                    "data":finalResult
                });
            }
        },);
    },
    /**
    * Getting all entries of the table.
    * @param {Response} oRes The response of the express engine.
    * @param {Integer} oTimeFrom The integer value of the time object from.
    * @param {Integer} oTimeTo The integer value of the time object to.
    * @return: All entries in the time track table with the filter of the start time.
    */
    gettingSelectiveEntries : function(oRes,oTimeFrom, oTimeTo) {
      var lv_qry = `SELECT * FROM TimeTrack WHERE START BETWEEN ${oTimeFrom} AND ${oTimeTo}`;
      var lv_db = this.openDBConnection();
      lv_db.all(lv_qry,(err,rows)=>{
          console.log(rows);
          oRes.json(
              {
                  "data": rows
              }
          );
      });
    },

    /**
    * Updates the existing time track entry. Only the values, which are not undefined will be update. Please make sure, that the topic Id is not empty!
    * @param {Integer} oTrackId The id of the time track.
    * @param {String} oTopic The Topic of the time track.
    * @param {String} oUser The User of the time track.
    * @param {Integer} oStart The integer value of the time object start.
    * @param {Integer} oEnd The integer value of the time object End.
    * @param {String} oComment The additional comment for the track.
    * @return: The state if the entry is updated.
    */
    updateEntry: function(oTrackId, oTopic, oUser,oStart,oEnd,oComment) {
      var lv_updated_successfully = false;
        if(oTrackId !== undefined){
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
              lv_updated_successfully = true;
          }
      }
      return lv_updated_successfully;
    },
    /**
    * Starts a track
    * @param {String} oTopic The Topic of the time track.
    * @param {String} oUser The User of the time track.
    */
    startTrack : function(oTopic,oUser){
      this.createNewEntry(oTopic,oUser,new Date());
    },
    /**
    * Ends a track
    * @param {Integer} oTrackId The Id of the time track.
    */
    endTrack : function(oTrackId){
      return this.updateEntry(oTrackId,undefined,undefined,undefined,new Date().getTime(),undefined);
    },

    sayHello : function () {
        console.log("hello");
    }
    ,
    sayHelloWithMyName: function(oName){
        console.log("hello " + oName);
    }

}
