/**
 * RSTATE_LIC has details of a Reference License Professional condition
Row 0: {LIC_SEQ_NBR=182038, SERV_PROV_CODE=COLA, LIC_STATE=FL, LIC_TYPE=Mechanical, LIC_NBR=123456, CAE_FNAME=Joe, CAE_MNAME=null, CAE_LNAME=Smith, SUFFIX_NAME=null, BUS_NAME=JOE'S MECHANICAL, BUS_LIC=null, LIC_ORIG_ISS_DD=null, LIC_EXPIR_DD=2025-12-11 00:00:00.0, BUS_LIC_EXP_DT=null, LAST_UPDATE_DD=null, LAST_RENEWAL_DD=null, EIN_SS=null, SELF_INS=null, ADDRESS1=1234 Main, ADDRESS2=null, ADDRESS3=null, CITY=Orlando, STATE=FL, COUNTRY=null, ZIP=12345, PHONE1=null, PHONE2=null, FAX=null, EMAIL=null, AGENCY_CODE=null, COUNTY_CODE=null, CITY_CODE=null, G1_PRIM_STATUS_CODE=null, HOLD_CODE=null, HOLD_DESC=null, WC_EXEMPT=null, WC_INS_CO_CODE=null, WC_POLICY_NO=null, WC_EFF_DT=null, WC_EXP_DT=null, WC_CANC_DT=null, WC_INTENT_TO_SUSP_NTC_SENT_DT=null, WC_SUSPEND_DT=null, CONTR_LIC_NO=null, CONT_LIC_BUS_NAME=null, LIC_COMMENT=null, UDF1=null, UDF2=null, UDF3=null, UDF4=null, INS_CO_NAME=null, INS_POLICY_NO=null, INS_EXP_DT=null, INS_AMMOUNT=null, REC_SECURITY=null, REC_LOCK=null, REC_DATE=2023-12-11 00:00:00.0, REC_FUL_NAM=ADMIN, REC_STATUS=A, GA_IVR_PIN=null, L1_SALUTATION=null, L1_GENDER=null, L1_POST_OFFICE_BOX=null, BUS_NAME2=null, L1_BIRTH_DATE=null, PHONE1_COUNTRY_CODE=null, PHONE2_COUNTRY_CODE=null, FAX_COUNTRY_CODE=null, LIC_BOARD=null, LIC_TYPE_FLAG=null, LIC_SOCIAL_SECURITY_NBR=null, LIC_FEDERAL_EMPLOYER_ID_NBR=null, PHONE3=null, PHONE3_COUNTRY_CODE=null, ACA_PERMISSION=null, L1_TITLE=null, PAST_DAYS=null, AUDIT_INIT_BY=null, AUDIT_INIT_DATE=null, AUDIT_MOD_BY=null, AUDIT_MOD_DATE=null}
 */

var agency = aa.getServiceProviderCode();

var sql = "SELECT top 10 * from r3apptyp where serv_prov_code = ? and r1_per_group = '--Select--' \n"
var result = aa.db.select(sql,[agency]);

aa.print('Getting sql');
// exploreObject(result)
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
} else {
    aa.print(result.getErrorMessage())
}

function logDebug(str){
    aa.print(str);
}





function logDebug(str) {aa.print(str);}


/*
    var theURL = "https://aca-supp.accela.com/stockton";
    
    addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(theURL));
    */