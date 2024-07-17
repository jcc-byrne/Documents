var agency = aa.getServiceProviderCode();
// rbizdomain
// var sql = "SELECT bizdomain, rec_date, rec_ful_nam, rec_status from rbizdomain where serv_prov_code = ? and bizdomain like 'inspector%' \n" 

// rbizdomain_value
var sql = "SELECT bizdomain, bizdomain_value, rec_date, rec_ful_nam, audit_init_date, audit_init_by, audit_mod_date, audit_mod_by, rec_status from rbizdomain_value where serv_prov_code = ? and bizdomain like 'emsetoolconfig%' order by audit_mod_date desc \n" 


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



/**
 * Standard Choice Value
 *  
 */

var agency = aa.getServiceProviderCode();
// rbizdomain
// var sql = "SELECT bizdomain, rec_date, rec_ful_nam, rec_status from rbizdomain where serv_prov_code = ? and bizdomain like 'inspector%' \n" 

// rbizdomain_value
var sql = "SELECT top 10 bizdomain, bizdomain_value,value_desc, rec_date, rec_ful_nam, audit_init_date, audit_init_by, audit_mod_date, audit_mod_by, rec_status, * from rbizdomain_value where serv_prov_code = ? and value_desc like '%syncAPOLinks%'  \n" 


var result = aa.db.select(sql,[agency]);
aa.sendMail('noreply@accela.com', 'jcc@byrnesoftware.com', '', 'test',  'debugggg');

aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
    }
} else {
    aa.print(result.getErrorMessage())
}

function logDebug(str){
    aa.print(str);
}
