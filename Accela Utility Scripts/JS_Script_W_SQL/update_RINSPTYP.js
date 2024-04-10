var agency = aa.getServiceProviderCode();

var update = "update RINSPTYP \n"+
// "set r1_per_type = 'Planning', R1_MODULE_NAME = 'Planning' \n"+
"set INSP_RESULT_GROUP = 'BLD_RESULT' \n"+
"FROM RINSPTYP b where b.serv_prov_code = ? and insp_code = 'BLD_CONV' \n" 


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());

