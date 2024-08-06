

try {
    var agency = aa.getServiceProviderCode();
    var sql = "select top 100 B1_ACCESS_BY_ACA, b1_alt_id, * from b1permit where serv_prov_code = ? and b1_alt_id in ('d02-0010', 'PREAPP24-0023') ";
    //sql = "select B1_ACCESS_BY_ACA, * from b1permit where b1_access_by_aca <> 'Y' and serv_prov_code = ? and B1_MODULE_NAME = 'Planning' "
    //sql = "select top 1000 count(*) from b1permit where b1_access_by_aca = 'Y' and serv_prov_code = ? and B1_MODULE_NAME = 'Planning' "
sql = "select top 10 * from aa_objects  "
    var result = aa.db.select(sql, [])

    if (result.getSuccess()) {
        var data = result.getOutput();
        logDebug("Count:" + data.size());
        for (var d = 0; d < data.size(); d++) {
            logDebug("Row " + d + ": " + data.get(d));
        }
    } else {
        aa.print(result.getErrorMessage())
    }



} catch (error) {
    logDebug(error)
}

function logDebug (str){aa.print(str)};