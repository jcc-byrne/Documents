/*------------------------------------------------------------------------------------------------------/
| Program  : LIC_ISSUANCE_POSTSCRIPT
| Event    : LIC_ISSUANCE_POSTSCRIPT
|
| Client   : MILWAUKEE
| Author   : Jacob Clay
| Date	   : 02/09/2024
|
/------------------------------------------------------------------------------------------------------*/
var br = "<BR>"; // Break Tag 
var message = "";
try {
    logDebug('begin LIC_ISSUANCE_POSTSCRIPT')
    if (appMatch('Licenses/Business/*/Application')){
        // FIXME this was not working as a postscript, moved to WTUA
        // fillLicExpDate();
    }
    logDebug('end LIC_ISSUANCE_POSTSCRIPT')
}
catch (err) {
    aa.print("A system error has occured: " + err.message + err.stack + br);
}

function fillLicExpDate() {
    var itemCap = capId;
  
    var pCapId = false;
        pCapId = getParent(itemCap);
  
    // if (appMatch("Licenses/Business/Loading Zone/Renewal"))
    //     pCapId = getParentLicenseCapID(itemCap);
  
    if (!pCapId) {
        logDebug("UNABLE to find parent record for " + itemCap.getCustomID());
        // return false;
    }
  
    editAppSpecific('License Effective Date', sysDateMMDDYYYY, pCapId)
  
  }