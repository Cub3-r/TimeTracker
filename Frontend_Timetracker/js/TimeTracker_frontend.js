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

document.addEventListener('DOMContentLoaded', function(oEvent){
  getConfig().then(res => {
    console.log(res);
    $("#div_time_val").text(res.workTime);
    $("#div_break_val").text(res.break);
  });
}, false);
