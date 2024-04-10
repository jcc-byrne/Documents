//Agencies will receive a PaymentApplyBefore bug. This generally happens because there is no event for PaymentApplyBefore and there is no Master Script for it


//Check to see what master scripts are on the DB
var agency = aa.getServiceProviderCode();
var sql = "select * from revt_agency_event where serv_prov_code = '" + agency + "' order by rec_date desc";
var result = aa.db.select(sql, []).getOutput();
for (var r = 0; r < result.size(); r++)
aa.print(result.get(r));




//Update event with a new version
var agency = aa.getServiceProviderCode();
var sql = "update revt_agency_event set udf1='MASTER SCRIPT - 8.0.0.0.0' where EVENT_NAME='PaymentApplyBefore' and serv_prov_code='" + agency + "'"
var result = aa.db.update(sql, []);
aa.print(result.getSuccess());
aa.print(result.getOutput());


//This will add the event to Events > Event. Remove the event and all should be in order