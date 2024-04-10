/*------------------------------------------------------------------------------------------------------/
| Program  : LIC_TATTOO_ISSUANCE_AFTERTASKS
| Event    : LIC_TATTOO_ISSUANCE_AFTERTASKS
|
| Client   : MILWAUKEE 198
| Author   : Jacob Clay
| Date	   : 02/04/2024
|
/------------------------------------------------------------------------------------------------------*/
var br = "<BR>"; // Break Tag 
var message = "";
try {
    logDebug('begin LIC_TATTOO_ISSUANCE_AFTERTASKS')
    if (appMatch('Licenses/Business/Tattoo and Body Piercing/*')){
        updateLicExpiration();
    }
    logDebug('end LIC_TATTOO_ISSUANCE_AFTERTASKS')
}
catch (err) {
    aa.print("A system error has occured: " + err.message + err.stack + br);
}

function updateTatLicExpiration() {
    var newExpYear = "";
    var currYear = sysDate.getYear();
    var currMonth = sysDate.getMonth();
    newExpYear = currYear + 1;
    var newExpDate = "";
    var itemCap = capId;

    var pCapId = false;
    if (appMatch("Licenses/Business/Tattoo and Body Piercing/Application"))
        pCapId = getParent(itemCap);

    if (appMatch("Licenses/Business/Tattoo and Body Piercing/Renewal"))
        pCapId = getParentLicenseCapID(itemCap);

    if (!pCapId) {
        logDebug("UNABLE to find parent record for " + itemCap.getCustomID());
        // return false;
    }

    pCapId = aa.cap.getCapID(pCapId.getID1(), pCapId.getID2(), pCapId.getID3()).getOutput();
    var pAltId = pCapId.getCustomID();
    var licObj = new licenseObject(pAltId, pCapId, appTypeArray[2]);

    if (!licObj) {
        logDebug("UNABLE to get license object for " + itemCap.getCustomID());
        //  return false;
    }
    if (newExpYear != "") {
        if (matches(currMonth, 4, 5, 6)) {
            newExpDate = "06/30/" + newExpYear;
            logDebug('set exp year for next year')
        } else {
            newExpDate = "06/30/" + currYear;
            logDebug('set exp for this year')
        }
        licObj.setExpiration(newExpDate);
    }
}