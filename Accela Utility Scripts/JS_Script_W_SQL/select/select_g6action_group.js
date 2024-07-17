

try {
    var agency = aa.getServiceProviderCode();
    var sql = 'SELECT G6_STATUS, COUNT(*) FROM G6ACTION WHERE DATEDIFF(day, G6_COMPL_DD, GETDATE()) < 365 and serv_prov_code = ? group by G6_STATUS     ';
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