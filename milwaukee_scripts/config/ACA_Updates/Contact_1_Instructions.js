var statement = '<div style="font-size: 12px;">Agent-Sole Proprietor-1st Partner is the Agent that has been appointed by the business to represent the Business Entity. </div>'


var update = "update RPF_COMPONENT \n"+
// "set display_order = '3' \n"+
"set COMPONENT_INSTRUCTION = '" + statement + "' \n" +
"FROM RPF_COMPONENT c \n" +
"WHERE c.SERV_PROV_CODE = ?  and c.component_name = 'Contact 1' \n" +
"and (PF_GROUP_CODE like 'Lic_Bus%' OR PF_GROUP_CODE like 'LIC Transportation%') and PF_GROUP_CODE not like '%Sup%' and PF_GROUP_CODE <> 'LIC Business Renewal with address' "
 
var result = aa.db.update(update, [aa.getServiceProviderCode()]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());
