var agency = aa.getServiceProviderCode();
var sql = "SELECT top 100 * \n" +
"FROM r2chckbox c \n" +
"WHERE c.SERV_PROV_CODE = ? and R1_CHECKBOX_DESC = 'Nearest Major Cross Street:' \n" 
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
