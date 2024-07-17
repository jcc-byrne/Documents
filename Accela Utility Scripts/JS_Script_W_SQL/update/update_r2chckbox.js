












//FOR MILWAUKEE

var update = "update R2CHCKBOX \n"+
// "set display_order = '3' \n"+
"set R1_CHECKBOX_DESC_ALIAS = 'Number of Garbage Cans Inside' \n" + 
"FROM R2CHCKBOX c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.R1_CHECKBOX_DESC= 'Number of Garbage Cans: Inside' and c.rec_Status = 'A' and R1_CHECKBOX_DESC_ALIAS is null "
 
var result = aa.db.update(update, [aa.getServiceProviderCode(),]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());




var update = "update R2CHCKBOX \n"+
// "set display_order = '3' \n"+
"set R1_CHECKBOX_IND = 1 \n" + 
"FROM R2CHCKBOX c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.R1_CHECKBOX_DESC= 'Secondary Street' and c.rec_Status = 'A' and R1_CHECKBOX_TYPE = 'PREMISES DESCRIPTION' "
 
var result = aa.db.update(update, [aa.getServiceProviderCode(),]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());