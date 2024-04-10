var parmArray = new Array();
// parmArray[0] = "Thomas";
// parmArray[1] = 18;
var recArray = ['ABC_FMB_A',
'ABC_FMB_R',
'LIC_CIG_APP',
'LIC_HIC_APP',
'LIC_MHP_APP',
'LIC_PAS',
'LIC_PKLG_APP',
'LIC_SHD_APP',
'LIC_TBP_APP',
'LIC_TEMPBARR',
'LIC_TMPTBP',
'LIC_TSCB_APP',
'LIC_TSCB_REN',
'LIC_UCAR_APP',
'ABC_FMB_L',
'LIC_AMD_BTR',
'LIC_EHRS_APP',
'LIC_SIDE_App',
'LIC_PEDL_REN',
'LIC_PEDL_APP',
'LIC_PEDL_LIC',
'LIC_CBM',
'LIC_CDO',
'LIC_HIS',
'LIC_ICE',
'LIC_PUB_PASS',
'LIC_IND_LOAD',
'LIC_E_APP',
'LIC_FILL_AP',
'LIC_HM_APP',
'LIC_MAS_APP',
'LIC_MICRO_AP',
'LIC_PKLG_REN',
'LIC_REST_APP',
'LIC_ROOM_APP',
'LIC_SIDE_REN',
'LIC_SIDEAPPL',
'LIC_SSL_APP',
'LIC_W&M_APP',
'LIC_ZONE_APP',
'LIC_BB_LIC',
'LIC_CIG_LIC',
'LIC_EHRS_LIC',
'LIC_ENTE_APP',
'LIC_FILL_LIC',
'LIC_MICRO_LI',
'LIC_PKLG_LIC',
'LIC_REST_LIC',
'LIC_SIDE_LIC',
'LIC_VIS_LIC',
'LIC_W&M_LIC',
'LIC_BB_APP',
'LIC_CVIS_APP',
'LIC_VIS_APP',
'LIC_W&M_SUPP',
'LIC_PASALES',
'LIC_PASDR',
'LIC_RSTP',
'LIC_RSTPAY',
'LIC_RSTV',
'LIC_SPB_APP',
'LIC_TPEP_APP',
'LIC_HSLO',
'LIC_LIMS_APP',
'LIC_PDCB_APP',
'LIC_PPV',
'LIC_SHTL',
'LIC_TAXS_APP']

for (i in recArray){
    
    var sql = "insert into R2CHCKBOX (SERV_PROV_CODE, R1_CHECKBOX_CODE, R1_CHECKBOX_TYPE, R1_CHECKBOX_DESC, R1_CHECKBOX_GROUP, REC_DATE, REC_FUL_NAM, R1_DISPLAY_ORDER, R1_CHECKBOX_IND, REC_STATUS, R1_ATTRIBUTE_VALUE_REQ_FLAG, R1_SEARCHABLE_FLAG, MAX_LENGTH, DISPLAY_LENGTH, R1_GROUP_DISPLAY_ORDER, VCH_DISP_FLAG, R1_TABLE_GROUP_NAME, LOCATION_QUERY_FLAG, R1_REQ_FEE_CALC, R1_SUPERVISOR_EDIT_ONLY_FLAG, R1_SEARCHABLE_FOR_ACA) values ('MILWAUKEE', ?, 'LICENSE INFORMATION', 'License Effective Date', 'APPLICATION', GETDATE(), 'JACLAY', 55, 2, 'A', 'N', 'N', 0, 0, 105, 'N', 'LIC_BUS', 'N', 'N','N', 'N')";
 
    var qry = aa.util.update(null, sql, [recArray[i]])
    
    if (qry.getSuccess())
    {
      aa.print('Success for: ' + recArray[i]); // 48634 parcels fixed out of 54633 total
    }
    else
      aa.print('ERROR '+ recArray[i] + ' ' + qry.getErrorMessage());


}


