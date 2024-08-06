var agency = aa.getServiceProviderCode();
var scriptKeywords = '%void%' //e.g. '%text from script%' 

var sql = "SELECT SCRIPT_TITLE \n" +
"FROM REVT_AGENCY_SCRIPT d \n" +
"WHERE d.SERV_PROV_CODE = ?  \n" +
"and UPPER(d.SCRIPT_TEXT) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[agency, scriptKeywords]);

aa.print('Getting sql');
// exploreObject(result)
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        //data.get(d) actual output = 'WTUA:Licenses/Business/Temporary Change of Plan/Application'
        //expected output is like this = 'https://milwaukee-civcon-aa.accela.com/admin/eventmanager/index.cfm?FUSEACTION=UpdateScript&SCRIPT_CODE=WTUA%3ALICENSES%2FBUSINESS%2FTEMPORARY%20CHANGE%20OF%20PLAN%2FAPPLICATION'
    }
} else {
    aa.print(result.getErrorMessage())
}

function logDebug(str) {aa.print(str);}


/*
    var theURL = "https://aca-supp.accela.com/stockton";
    
    addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(theURL));
    */
