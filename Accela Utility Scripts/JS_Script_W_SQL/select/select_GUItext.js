var agency = aa.getServiceProviderCode();
var scriptKeywords = '%To add a new licensed professional, click th%' //e.g. '%3.0 convenience fee%' 

var sql = "SELECT top 100 STRING_VALUE, CATEGORY_NAME, rec_status, COUNTRY_CODE, LANG_CODE, STRING_KEY \n" +
"FROM GUI_TEXT d \n" +
"WHERE UPPER(d.STRING_VALUE) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[scriptKeywords]);

aa.print('Getting sql');
// exploreObject(result)
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
} else {
    aa.print(result.getErrorMessage())
}

function logDebug(str){
    aa.print(str);
}




 




function logDebug(str) {aa.print(str);}


/*
    var theURL = "https://aca-supp.accela.com/stockton";
    
    addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(theURL));
    */