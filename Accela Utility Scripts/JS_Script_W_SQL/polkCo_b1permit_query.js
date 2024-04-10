var agency = aa.getServiceProviderCode();
var sql = "select top 100 count(b1_alt_id), b1_appl_status from b1permit where b1_per_group = 'Enforcement' and serv_prov_code = ? and b1_appl_status not like '%close%' and b1_appl_status not in ('Void', 'Referred', 'Duplicate', 'Violation Case Generated')  group by b1_appl_status  \n" 
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
