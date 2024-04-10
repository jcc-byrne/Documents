var agency = aa.getServiceProviderCode();

var update = "update b6condit \n"+
"set B1_CON_DIS_CON_NOTICE = 'Y' where serv_prov_code = ? \n"


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());