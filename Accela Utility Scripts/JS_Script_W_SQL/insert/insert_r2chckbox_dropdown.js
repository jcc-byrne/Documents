var parmArray = new Array();
// parmArray[0] = "Thomas";
// parmArray[1] = 18;
var recArray = [['ABC_FMB_A', ''],
['ABC_FMB_L', 'ABC_BUS_LIC'],
['ABC_FMB_R', ''],
['LIC_AMD_CPO', 'LIC_AMD_CPO'],
['LIC_CIG_APP', ''],
['LIC_CIG_LIC', 'LIC_HOME_LIC'],
['LIC_CVIS_APP', 'LIC_HOME_NSU'],
['LIC_E_APP', 'LIC_HOME_APP'],
['LIC_EHRS_APP', 'LIC_BUS'],
['LIC_EHRS_LIC', 'LIC_HOME_LIC'],
['LIC_ENTE_APP', 'LIC_HOME_LIC'],
['LIC_ENTE_LIC', 'LIC_HOME_LIC'],
['LIC_FILL_AP', 'LIC_HOME_APP'],
['LIC_FILL_LIC', 'LIC_HOME_LIC'],
['LIC_HM_APP', 'LIC_HOME_APP'],
['LIC_MAS_APP', 'LIC_HOME_APP'],
['LIC_PKLG_APP', ''],
['LIC_PKLG_LIC', 'LIC_HOME_LIC'],
['LIC_PKLG_REN', 'LIC_HOME_APP'],
['LIC_REST_APP', 'LIC_HOME_APP'],
['LIC_REST_LIC', 'LIC_HOME_LIC'],
['LIC_ROOM_APP', 'LIC_HOME_APP'],
['LIC_RSTP', 'LIC_RST'],
['LIC_RSTPAY', 'LIC_RSTPAY'],
['LIC_SHD_APP', ''],
['LIC_SIDE_App', 'LIC_BUS'],
['LIC_SIDE_LIC', 'LIC_HOME_LIC'],
['LIC_SIDE_REN', 'LIC_HOME_APP'],
['LIC_SIDEAPPL', 'LIC_HOME_APP'],
['LIC_SSL_APP', 'LIC_HOME_APP'],
['LIC_TBP_APP', ''],
['LIC_UCAR_APP', ''],
['LIC_VIS_APP', 'LIC_HOME_NSU'],
['LIC_VIS_LIC', 'LIC_HOME_LIC'],]

for (i in recArray){
  
    var sql = "insert into R2CHCKBOX (SERV_PROV_CODE, R1_CHECKBOX_CODE, R1_CHECKBOX_TYPE, R1_CHECKBOX_DESC, R1_CHECKBOX_GROUP, REC_DATE, REC_FUL_NAM, R1_DISPLAY_ORDER, R1_CHECKBOX_IND, REC_STATUS, R1_ATTRIBUTE_VALUE_REQ_FLAG, R1_SEARCHABLE_FLAG, MAX_LENGTH, DISPLAY_LENGTH, R1_GROUP_DISPLAY_ORDER, VCH_DISP_FLAG, R1_TABLE_GROUP_NAME, LOCATION_QUERY_FLAG, R1_REQ_FEE_CALC, R1_SUPERVISOR_EDIT_ONLY_FLAG, R1_SEARCHABLE_FOR_ACA) values ('MILWAUKEE', ?, 'PREMISES DESCRIPTION', 'Describe Surrounding Area', 'APPLICATION', GETDATE(), 'JACLAY', 88, 5, 'A', 'N', 'N', 0, 0, 9, 'Y', ?, 'N', 'N','N', 'N')";
 
    var qry = aa.util.update(null, sql, [recArray[i][0], recArray[i][1]])
    
    if (qry.getSuccess())
    {
      aa.print('Success for: ' + recArray[i]); // 48634 parcels fixed out of 54633 total
    }
    else
      aa.print('ERROR '+ recArray[i] + ' ' + qry.getErrorMessage());


}


