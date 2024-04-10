/**
 * l1condit has details of a Reference Parcel condition
Row 0: {SERV_PROV_CODE=COLA, SOURCE_SEQ_NBR=600640, L1_PARCEL_NBR=882, L1_CON_NBR=122, L1_CON_COMMENT=Core Improvement Area TEST, L1_CON_DES=Core Improvement Area TEST, L1_CON_EFF_DD1=null, L1_CON_EXPIR_DD=null, L1_CON_IMPACT_CODE=Notice, L1_CON_ISS_AGENCY_CODE=ADMIN, L1_CON_ISS_BUREAU_CODE=NA, L1_CON_ISS_DIVISION_CODE=NA, L1_CON_ISS_SECTION_CODE=NA, L1_CON_ISS_GROUP_CODE=NA, L1_CON_ISS_OFFICE_CODE=NA, L1_CON_ISS_DD=2024-03-04 00:00:00.0, L1_CON_ISS_FNAME=Accela, L1_CON_ISS_MNAME=null, L1_CON_ISS_LNAME=Administrator, L1_CON_REF_NUM1=null, L1_CON_REF_NUM2=null, L1_CON_STAT_AGENCY_CODE=ADMIN, L1_CON_STAT_BUREAU_CODE=NA, L1_CON_STAT_DIVISION_CODE=NA, L1_CON_STAT_SECTION_CODE=NA, L1_CON_STAT_GROUP_CODE=NA, L1_CON_STAT_OFFICE_CODE=NA, L1_CON_STAT_DD=null, L1_CON_STAT_FNAME=null, L1_CON_STAT_MNAME=null, L1_CON_STAT_LNAME=null, L1_CON_STATUS=Applied, L1_CON_TYP=CSET, R3_AGENCY_ADDR_SEQ_NBR=0, REC_DATE=2024-03-04 09:06:38.347, REC_FUL_NAM=ADMIN, REC_STATUS=A, L1_CON_LONG_COMMENT=null, L1_CON_DIS_CON_NOTICE=Y, L1_CON_INC_CON_NAME=Y, L1_CON_INC_SHORT_DESC=N, L1_CON_INHERITABLE=null, L1_CON_STATUS_TYP=Applied, L1_CON_GROUP=CSET, L1_CON_DIS_NOTICE_ACA=Y, L1_CON_DIS_NOTICE_ACA_FEE=N, RES_ID=null}


 */

var agency = aa.getServiceProviderCode();

var sql = "SELECT top 100 * from l1condit where serv_prov_code = ?  \n"
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