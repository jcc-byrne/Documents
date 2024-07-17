var agency = aa.getServiceProviderCode();

var update = "update r3apptyp \n"+
// "set r1_per_type = 'Planning', R1_MODULE_NAME = 'Planning' \n"+
"set r1_per_group = 'Building', r1_module_name = 'Building' \n"+
"FROM r3apptyp b where b.serv_prov_code = ? and r1_per_type = 'commercial' and r1_per_sub_type = 'condo recertification' \n" 


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());


  /*
  [12/6/23 8:41 AM] Steele, Kevin L.
Yeah so look at the top 2 items. They are missing the R1_PER_GROUP and R1_MODULE_NAME
*/

/*

"The UPDATE statement conflicted with the REFERENCE constraint "RDOCUMENT_R_S$R3APPTYP_FK". The conflict occurred in database "BABCOCK", table "dbo.RDOCUMENT_REQUIRED_SETTING".
*/