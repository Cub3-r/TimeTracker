function getJSONSample(){
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
    return o;
}

function convertJSONToArray(oJSONObject,oRowName){
    var finArr = [];
    var tmpArr = [];
    var propArr = [];

    $(oJSONObject[oRowName]).each((oJSonIdx,oJSonEle,) =>{
        // getting the keys of the element
        // and add these for the headline
        
        if(propArr.length === 0 ){
            propArr = Object.keys(oJSonEle);
            finArr.push(propArr);
            }
            
        $(propArr).each((oPIdx,oProp)=>
        {tmpArr.push(oJSonEle[oProp])});
        console.log("I want to add the following array " + tmpArr);
        
        finArr.push(tmpArr);
        // reinitialize the array
        tmpArr= [];
    });
    return finArr;
}
convertJSONToArray(getJSONSample(),"rows");

// requires the libs of xlsx.full.min.js
function exportJSONToExcelFile(oJSONObject,oRowName,oFileName){
    if (oJSONObject === undefined || oRowName === undefined || oFileName === undefined) {
      return;  
    }

    var exportData = convertJSONToArray(oJSONObject,oRowName);
    if (exportData.length > 0) {
        var wb = XLSX>utils.book_new(), ws = XLSX.utls.aoa_to_sheet(exportData);
        var ws_name = "Sheet1";
        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, oFileName);
    }
}


// Additionally functionalities could be an own configurable layout for the export.
// The next steps would be to create an export Method / JS File for the JSon -> excel
