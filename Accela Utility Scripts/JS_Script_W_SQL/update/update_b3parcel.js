var agency = aa.getServiceProviderCode();

var update = "update r2chckbox \n"+
"set r1_checkbox_type = 'DocumentGroupforDPC' \n"+
"FROM r2chckbox c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.r1_checkbox_code='ZONANALYSIS' and c.r1_checkbox_type='GENERAL_INFO' and R1_CHECKBOX_DESC='DocumentGroupForDPC' \n" 
 
var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());