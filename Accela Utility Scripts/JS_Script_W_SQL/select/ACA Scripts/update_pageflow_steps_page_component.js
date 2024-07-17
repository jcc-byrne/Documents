/**
 * UPDATE PAGEFLOW STEP
 * Contains details of STEP_NAME AND DISPLAY_ORDER
 * 
 */
var pfGroupCode = 'LIC Transportation Horse Application'
var stepId = '25553'

var update = "update RPF_STEP \n"+
// "set display_order = '3' \n"+
"set step_name = 'Business License Info' \n" + //Business License Info
"FROM RPF_STEP c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.step_id = ? and c.pf_group_code= ? \n" 
 
var result = aa.db.update(update, [aa.getServiceProviderCode(), stepId, pfGroupCode]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());


  /**
 * UPDATE PAGEFLOW PAGE
 * Contains details of STEP_NAME AND DISPLAY_ORDER
 * 
 */
var pfGroupCode = 'LIC Transportation Horse Application'
var stepId = '25553'

var update = "update RPF_STEP \n"+
// "set display_order = '3' \n"+
"set step_name = 'Business License Info' \n" + //Business License Info
"FROM RPF_STEP c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.step_id = ? and c.pf_group_code= ? \n" 
 
var result = aa.db.update(update, [aa.getServiceProviderCode(), stepId, pfGroupCode]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());



  /**
 * Require APO and Contacts
 * 
 */

var pfGroupCode = 'LIC_Business_Parking_Application'

var update = "update RPF_COMPONENT \n"+
// "set display_order = '3' \n"+
"set REQUIRED_FLG = 'Y' \n" + 
"FROM RPF_COMPONENT c \n" +
"WHERE c.SERV_PROV_CODE = ? and c.component_name in ('Applicant', 'Contact 1', 'Contact List','Address','Parcel', 'Owner') \n" +
"and c.REQUIRED_FLG = 'N' and c.pf_group_code in ('LIC_Business_Parking_Application') "
 
var result = aa.db.update(update, [aa.getServiceProviderCode()]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());



  /**
 * Don't Require APO and Contacts
 * 
 */

var pfGroupCode = 'LIC_Business_Parking_Application'

var update = "update RPF_COMPONENT \n"+
// "set display_order = '3' \n"+
"set REQUIRED_FLG = 'N' \n" + 
"FROM RPF_COMPONENT c \n" +
"WHERE c.SERV_PROV_CODE = ?  and c.component_name in ('Applicant', 'Contact 1', 'Contact List', 'Address','Parcel', 'Owner') \n" +
"and c.REQUIRED_FLG = 'Y' and c.pf_group_code in ('LIC_Business_Parking_Application') "
 
var result = aa.db.update(update, [aa.getServiceProviderCode()]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());
