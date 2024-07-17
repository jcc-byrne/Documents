var agency = aa.getServiceProviderCode();
var scriptKeywords = '%lic%' //e.g. '%text from script%' 

var sql = "SELECT top 100 * \n" +
"FROM RPF_GROUP d \n" +
"WHERE d.SERV_PROV_CODE = ?  \n" +
"and UPPER(d.pf_group_code) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[agency, scriptKeywords]);

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

function logDebug(str) {aa.print(str);}


