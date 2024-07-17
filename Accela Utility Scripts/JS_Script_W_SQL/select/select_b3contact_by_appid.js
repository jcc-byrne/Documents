var agency = aa.getServiceProviderCode();
var sql = "SELECT h.* \n" +
"FROM b1permit p join b3contact h on h.b1_per_id1 = p.b1_per_id1 and h.b1_per_id2 = p.b1_per_id2 and h.b1_per_id3 = p.b1_per_id3 \n" +
"WHERE p.SERV_PROV_CODE = ? \n" +
"AND  p.b1_alt_id like 'FREST-24-00007' \n" 
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
