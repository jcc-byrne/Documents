  /**
 * Require APO and Contacts
 * 
 */


  var update = "update RPF_COMPONENT \n"+
  // "set display_order = '3' \n"+
  "set REQUIRED_FLG = 'Y' \n" + 
  "FROM RPF_COMPONENT c \n" +
  "WHERE c.SERV_PROV_CODE = ? and c.component_name in ('Applicant', 'Contact 1','Address','Parcel', 'Owner') \n" +
  "and c.REQUIRED_FLG = 'N' and (PF_GROUP_CODE like 'Lic_Bus%' OR PF_GROUP_CODE like 'LIC Transportation%') and PF_GROUP_CODE not like '%Sup%' and PF_GROUP_CODE <> 'LIC Business Renewal with address' "
   
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
  
  
  var update = "update RPF_COMPONENT \n"+
  // "set display_order = '3' \n"+
  "set REQUIRED_FLG = 'N' \n" + 
  "FROM RPF_COMPONENT c \n" +
  "WHERE c.SERV_PROV_CODE = ?  and c.component_name in ('Applicant', 'Contact 1', 'Contact List', 'Address','Parcel', 'Owner') \n" +
  "and c.REQUIRED_FLG = 'Y' and (PF_GROUP_CODE like 'Lic_Bus%' OR PF_GROUP_CODE like 'LIC Transportation%') and PF_GROUP_CODE not like '%Sup%' and PF_GROUP_CODE <> 'LIC Business Renewal with address' "
   
  var result = aa.db.update(update, [aa.getServiceProviderCode()]);
  
  if (result.getSuccess())
  {
    aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
  }
  else
    aa.print(result.getErrorMessage());
  