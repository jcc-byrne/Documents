/*------------------------------------------------------------------------------------------------------/
| Program  : CTRCA:LICENSES/BUSINESS/LOADING ZONE
| Event    : CTRCA:LICENSES/BUSINESS/LOADING ZONE
|
| Client   : MILWAUKEE 235
| Author   : Jacob Clay
| Date	   : 02/05/2024
|
/------------------------------------------------------------------------------------------------------*/
var br = "<BR>"; // Break Tag 
var message = "";
try {
    logDebug('begin CTRCA:LICENSES/BUSINESS/LOADING ZONE')
    if (appMatch('Licenses/Business/Loading Zone/*')){
        updateLZaltId();
    }
    logDebug('end CTRCA:LICENSES/BUSINESS/LOADING ZONE')
}
catch (err) {
    aa.print("A system error has occured: " + err.message + err.stack + br);
}

function updateLZaltId() {
    var itemCap = capId;
  
    var pCapId = false;
    if (appMatch("Licenses/Business/Loading Zone/Application"))
        pCapId = getParent(itemCap);
  
    if (appMatch("Licenses/Business/Loading Zone/Renewal"))
        pCapId = getParentLicenseCapID(itemCap);
  
    if (!pCapId) {
        logDebug("UNABLE to find parent record for " + itemCap.getCustomID());
        // return false;
    }
  
  
      if (getAppSpecific('Non Profit Loading Zone', pCapId) == 'Yes'){
  
        var altArray = pCapId.getCustomID().split('-');
        altArray[0] = 'LZNP'
        altArray = altArray.join('-') 
        var updateResult = aa.cap.updateCapAltID(pCapId, altArray);
        if (updateResult.getSuccess()) {
           logDebug("New Loading Zone Record Id: " + altArray);
        } else {
            logDebug('Error updating record id')
        }
      }
  }