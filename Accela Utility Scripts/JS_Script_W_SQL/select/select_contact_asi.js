var agency = aa.getServiceProviderCode();
var scriptKeywords = '%DEPARTMENT_INFORMATION%' //e.g. '%text from script%' 

var sql = "SELECT top 100 * from GTMPL_ATTRIBUTE where serv_prov_code = ? and res_id = 315045 \n"
var result = aa.db.select(sql,[agency]);

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