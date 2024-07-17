

try {
    var agency = aa.getServiceProviderCode();
    var sql = 'select top 100 * from xrecord_contra where serv_prov_code = ? ';
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