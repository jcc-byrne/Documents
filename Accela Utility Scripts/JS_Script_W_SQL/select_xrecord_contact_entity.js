var agency = aa.getServiceProviderCode();
var sql = "SELECT top 100 * \n" +
"FROM XRECORD_CONTACT_ENTITY c \n" +
"JOIN B1PERMIT B ON 1=1 AND B.B1_PER_ID1 = C.B1_PER_ID1 AND B.B1_PER_ID2 = C.B1_PER_ID2 AND B.B1_PER_ID3 = C.B1_PER_ID3 " + 
"WHERE c.SERV_PROV_CODE = ?  AND B.B1_ALT_ID = '2301074' \n" 
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
} else {
    logDebug(result.getErrorMessage())
}

function logDebug(str){
    aa.print(str);
}
