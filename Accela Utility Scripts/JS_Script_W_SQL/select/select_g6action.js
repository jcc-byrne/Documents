

try {
    var agency = aa.getServiceProviderCode();
    var sql = 'select top 100 * from g6action where serv_prov_code = ? and g6_act_num = 364737 order by G6_REC_DD desc ';
    var result = aa.db.select(sql, [agency])

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