var agency = aa.getServiceProviderCode();
var sql = "select CAP_MASK_NAME, R1_APP_TYPE_ALIAS from R3APPTYP where r1_per_group = 'building' and cap_mask_name <> 'Building Permits' \n" +
"and SERV_PROV_CODE = ?  and REC_STATUS = 'A' \n" 
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
