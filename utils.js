const _xlsx = require('xlsx')
const fs = require('fs')
module.exports = {
  /**
  * Getting the time of the JavaScript Date.
  * @param {Date} oJsDate The Date.
  * @return: The converted Date as an integer value.
  */
  getIntegerTime: function(oJSDate){
    if(oJSDate !== undefined && (oJSDate instanceof Date))
      return oJSDate.getTime();
    return 0;
  },
  /**
  * Getting the JavaScript Date Object of an integer value
  * @param {oIntTime} oIntTime The time as a integer value.
  * @return: The converted Date object.
  */
  getDateObject: function(oIntTime){
    var lv_do = new Date();
    if(oIntTime !== undefined){
      lv_do.setTime(oIntTime);
    }
    return lv_do;
  },
  /**
  * Converts the value of minutes into the local format date.
  * @param {Integer} oIntTime
  * @return: The minutes in a convert local formated date
  **/
  convertMinutesValueToFormat: function(oIntMinutes){
    if (oIntMinutes !== undefined) {
      var lv_dateObject = new Date();
      // initialiye the hours, minutes and seconds
      lv_dateObject.setHours(0);
      lv_dateObject.setMinutes(0);
      lv_dateObject.setSeconds(0);
      lv_dateObject.setMinutes(oIntMinutes);
      return lv_dateObject.toLocaleTimeString();
    }
  },
  /**
  * Converts the entities of JSON Object into an array.
  * @param {JSON} oJSONObject The JSON Object of the entity
  * @param {String} oRowName The name of the Row
  * @return: The converted array of the input JSON Object
  **/
  convertJSONToArray: function(oJSONObject,oRowName){
      var finArr = [];
      var tmpArr = [];
      var propArr = [];

      oJSONObject[oRowName].forEach((oJSonEle,oJSonIdx) =>{
          // getting the keys of the element
          // and add these for the headline

          if(propArr.length === 0 ){
              propArr = Object.keys(oJSonEle);
              finArr.push(propArr);
              }

          propArr.forEach((oProp,oPIdx)=>
          {tmpArr.push(oJSonEle[oProp])});
          //console.log("I want to add the following array " + tmpArr);

          finArr.push(tmpArr);
          // reinitialize the array
          tmpArr= [];
      });
      return finArr;
  },
  exportJSONToExcelFile: function(oJSONObject, oRowName, oFileName){
    if (oJSONObject === undefined || oRowName === undefined || oFileName === undefined) {
      return;
    }

    var exportData = this.convertJSONToArray(oJSONObject,oRowName);
    if (exportData.length > 0) {
        var wb = _xlsx.utils.book_new(), ws = _xlsx.utils.aoa_to_sheet(exportData);
        var ws_name = "Sheet1";
        /* add worksheet to workbook */
        _xlsx.utils.book_append_sheet(wb, ws, ws_name);
        _xlsx.writeFile(wb, oFileName);
        // hint for creating file https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
        console.log("finished");
        //var output_file_name = "out.csv";
        //var stream = _xlsx.stream.to_csv(ws);
        //stream.pipe(fs.createWriteStream(output_file_name));
    }
  }
}
