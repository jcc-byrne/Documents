var agency = aa.getServiceProviderCode();
var sql = "SELECT top 100 * \n" +
"FROM b1permit p \n" +
"JOIN B3PARCEL b on 1=1 and p.b1_per_id1 = b.b1_per_id1 and p.b1_per_id2 = b.b1_per_id2 and p.b1_per_id3 = b.b1_per_id3 \n"+
"WHERE p.SERV_PROV_CODE = ? \n" +
"AND   \n" 
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
