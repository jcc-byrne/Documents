/**
 * l1condit has details of a Reference Parcel condition
Row 0: {L1_PARCEL_NBR=0913540000, SOURCE_SEQ_NBR=600640, L1_EVENT_ID=null, L1_GIS_SEQ_NBR=null, L1_PARCEL_STATUS=A, L1_BOOK=null, L1_PAGE=null, L1_PARCEL=null, L1_MAP_REF=null, L1_MAP_NBR=null, L1_LOT=null, L1_BLOCK=null, L1_TRACT=null, L1_LEGAL_DESC=CROSS TOWN ADDITION REPLAT 1 LOT 1 BLOCK 0 36994 SQFT, L1_PARCEL_AREA=40749.00, L1_PLAN_AREA=null, L1_CENSUS_TRACT=null, L1_COUNCIL_DISTRICT=null, L1_SUPERVISOR_DISTRICT=null, L1_INSPECTION_DISTRICT=null, L1_LAND_VALUE=74000.00, L1_IMPROVED_VALUE=761700.00, L1_EXEMPT_VALUE=null, L1_UDF1=null, L1_UDF2=null, L1_UDF3=null, L1_UDF4=null, REC_DATE=2018-03-19 21:23:38.0, REC_FUL_NAM=ADMIN, REC_STATUS=A, L1_SUBDIVISION=null, EXT_UID=null, L1_TOWNSHIP=null, L1_RANGE=null, L1_SECTION=null, L1_PRIMARY_PAR_FLG=Y}
 */

var agency = aa.getServiceProviderCode();

var sql = "SELECT count(*) from l3parcel    \n"
var result = aa.db.select(sql,[]);

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