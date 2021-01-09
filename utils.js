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
  }
}
