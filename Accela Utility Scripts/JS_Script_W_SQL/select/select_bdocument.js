/**
 * BDOCUMENT has details 
 * ENT_TYPE changes from CAP (capId), TMP_CAP (capId), INSPECTION (capId), LICENSEPROFESSIONAL (RSTATE_LIC.LIC_SEQ_NBR), REFCONTACT (G1_CONTACT_NBR), PARCEL (L3PARCEL.L1_PARCEL_NBR)
 * ENT_ID changes depending on what the ENT_TYPE is, see above value in parantheses 
 *    
 */

var agency = aa.getServiceProviderCode();

var sql = "SELECT top 100 * from BDOCUMENT where serv_prov_code = ?  \n"
// var sql = "SELECT ENT_TYPE from BDOCUMENT where serv_prov_code = ?  group by ENT_TYPE \n"

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