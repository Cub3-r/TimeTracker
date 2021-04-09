console.log("Intializing the java script coding for node express");
  async function getConfig(){
    console.log("content loaded");
    let result = await fetch('/loadDashboardTimes',{method:'GET'});
    /*.then(function(res){
      console.log(res);
      if (res.ok) {
          console.log("loaded");

              console.log(res.json());
          // set the values in the break and work time
          //$("#div_time_val").text("Love you")
          //$("#div_break_val").text("Love you")
          return;
      }
      throw new Error('Request failed');
    }).catch(function(error){
      console.log(error);
    });*/
    //console.log(result);
    //console.log(result.json());
    return result.json();
  }

  async function getTimes(oFilter){
    var lv_req_path = '/allEntries';
    // default case: filter is not defined getting all elements
    if(oFilter !== undefined)
    {
    }

    let resp = await fetch(lv_req_path,{method:'GET'});
    return resp.json();
  }

document.addEventListener('DOMContentLoaded', function(oEvent){
  getConfig().then(res => {
    console.log(res);
    $("#div_time_val").text(res.workTime);
    $("#div_break_val").text(res.break);
  });

  // verify if the table exists
      // true: calling the getTimes function
      // false: do nothing
  if($("#timeRecTable").length == 1){
    getTimes(undefined).then(res => {
      console.log(res);
      // process with each data
      $(res.data).each((oIdx,oEle)=>{
        var tmp_val = '';
        var lv_row = "<tr>";
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.ID);
        lv_row = lv_row.concat("</td>");

        // Empty
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.USER);
        lv_row = lv_row.concat("</td>");

        // Date
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat('');
        lv_row = lv_row.concat("</td>");

        // Start
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.START);
        lv_row = lv_row.concat("</td>");

        // End

        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.END=== undefined?tmp_val:oEle.END);
        lv_row = lv_row.concat("</td>");

        // Topic
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.TOPIC=== undefined?tmp_val:oEle.TOPIC);
        lv_row = lv_row.concat("</td>");

        // Comment
        lv_row = lv_row.concat("<td>");
        lv_row = lv_row.concat(oEle.COMMENT=== undefined?tmp_val:oEle.COMMENT);
        lv_row = lv_row.concat("</td>");
        lv_row = lv_row.concat("</tr>");
        // adding the record to the table body with an own tr
        $($($("#timeRecTable")[0]).find("tbody")[0]).append($.parseHTML(lv_row));
      } );
    });
  }

}, false);

// logic of the export from the html table
function doExport(oCurrentTableExport){
  var viewTableExport = oCurrentTableExport === undefined? false:oCurrentTableExport;
  var lv_req_path = 'csvExport';

  if (viewTableExport) {
    // building up the json object and set append it on the request
    // you need a empty object and use the index to append a new value, therefore each object needs to be an own array

    // getting the different properties, which are listed in the th tags
    var properties = [];
    Object.values($("#timeRecTable").find("th")).forEach(oObj => {if(oObj.innerText !== undefined)properties.push(oObj.innerText)});

    var tabJson = {rows:[]};
    var rowJson = {};
    var lastIdx = 0;
    Object.values($("#timeRecTable").find("td")).forEach((oObj)=>{
      if(lastIdx !== $($(oObj).parent()).index()){
        // verify if the rowJson has entries
        if(Object.keys(rowJson).length > 0)
          tabJson.rows.push(rowJson);
        // at first reset the currently values of the json
        rowJson = {};
        lastIdx = ($(oObj).parent()).index();
      }
      rowJson[properties[$(oObj).index()]] = oObj.innerText;
    });
  }
  // do the request
  // ajax call?

}
