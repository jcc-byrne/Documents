var agency = aa.getServiceProviderCode();
var sql = "select top 10 * from REXPRESSION_FIELD where EXPRESSION_NAME like '%%' and VARIABLE_KEY <> 'ASI::USE::Performing Work' and SERV_PROV_CODE = ? and FIELD_USAGE = 'Execute_field' \n"
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

/*
'This license is not required. See the Food Dealer License Information form to determine if a license is needed for offsite processing.'
*/