var agency = aa.getServiceProviderCode();

var update = "update b6condit \n"+
// "set b1_con_des = 'HISTORICAL' where serv_prov_code = ? and B1_PER_ID1 LIKE '%HIS' AND REC_STATUS = 'A'\n"
"set B1_CON_DIS_CON_NOTICE = 'Y', B1_CON_INC_CON_NAME = 'N' where serv_prov_code = ? and B1_PER_ID1 LIKE '%HIS' AND REC_STATUS = 'A'\n"



var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());