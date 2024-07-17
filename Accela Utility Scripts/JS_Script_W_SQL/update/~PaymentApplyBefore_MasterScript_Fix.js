var agency = aa.getServiceProviderCode();
var sql = "select * from revt_agency_event where serv_prov_code = ? order by rec_date desc";
var result = aa.db.select(sql, [agency]).getOutput();
for (var r = 0; r < result.size(); r++)
aa.print(result.get(r));



var sql = "update revt_agency_event set udf1='MASTER SCRIPT - 8.0.0.0.0' where EVENT_NAME='PaymentApplyBefore' and serv_prov_code=?"
var result = aa.db.update(sql, [agency]);
aa.print(result.getSuccess());
aa.print(result.getOutput());