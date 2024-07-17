var agency = aa.getServiceProviderCode();
var sql = "SELECT top 100 * \n" +
"FROM b1permit p \n" +
"WHERE p.SERV_PROV_CODE = ? \n" +
"AND  p.b1_alt_id like 'TMP-2023-00012' \n" 
var result = aa.db.select(sql,[agency]);


aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
}

function logDebug(str){
    aa.print(str);
}


/**
 * SELECT BY APP TYPE
 */


var agency = aa.getServiceProviderCode();
var sql = "SELECT top 10 * \n" +
"FROM b1permit p \n" +
"WHERE p.SERV_PROV_CODE = ? \n" +
"AND  B1_PER_TYPE='Converted' \n" 
var result = aa.db.select(sql,[agency]);


aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
}

function logDebug(str){
    aa.print(str);
}