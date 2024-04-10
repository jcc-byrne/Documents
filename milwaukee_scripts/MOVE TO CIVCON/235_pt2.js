/*----------------------------------------------------------------------------------/
|   Program     : CTRCA;LICENSES!BUSINESS!LOADING ZONE!APPLICATION.js
|
|   Script Code : CTRCA:LICENSES/BUSINESS/LOADING ZONE/APPLICATION
|   Script Title: CTRCA:LICENSES/BUSINESS/LOADING ZONE/APPLICATION
|   Client      : Milwaukee License Division
    TASK: MKEBL-235
|   
----------------------------------------------------------------------------------*/

// Update current Record ID if it is a nonprofit loading zone

logDebug("Current Cap ID String: " + capIDString);

try {
    if (publicUser){
        updateNPOAltId();
    }
} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}

function updateNPOAltId(){
    var appRecIdString = capIDString;
    var indexSrch = appRecIdString.indexOf("-");
    
    if (indexSrch > 0) {
        var appRecIdSubString;
        appRecIdSubString = appRecIdString.substring(indexSrch);
    
        var vNewCapAltID;
        // check for type of application
        var vNPOstatus = AInfo["Non Profit Loading Zone"];
        if (vNPOstatus == "Yes") {
            // "LZNP-A-$$SEQ05$$";
            vAppTypePrefix = "LZNP-A"; //+ appRecIdSubString;
            vSC_Value = lookup("LIC_LOADING_ZONE_ID_TRACKER", "NONPROFIT_LZ");
            
            vSC_SeqNbr = parseInt(vSC_Value) + 1;
            var vSeqNbr = padZeros(vSC_SeqNbr, 5);
            logDebug("New Loading Zone Sequence: " + vSeqNbr);
            vYear = new Date().getFullYear().toString().substring(2);

            // Check if it is the first app of the year
            // LZNP-A24-00001
            var capCheck = aa.cap.getCapID(vAppTypePrefix + vYear + '-00001')

            if (capCheck.getSuccess()){
                // CAP exists and needs to be incremented
                vNewCapAltID = vAppTypePrefix + vYear + "-" + vSeqNbr;
                editLookup("LIC_LOADING_ZONE_ID_TRACKER", "NONPROFIT_LZ", vSeqNbr);
            } else {
                // This is the first one of the year, reset sequencing
                vSeqNbr = '00001'
                vNewCapAltID = vAppTypePrefix + vYear + "-" + vSeqNbr;
                editLookup("LIC_LOADING_ZONE_ID_TRACKER", "NONPROFIT_LZ", vSeqNbr);
            }
            // vNewCapAltID = vAppTypePrefix + '-' + vSeqNbr;
            logDebug("New Loading Zone AltID: " + vNewCapAltID);
    
        }
        var updateResult = aa.cap.updateCapAltID(capId, vNewCapAltID);
        if (updateResult.getSuccess()) {
           logDebug("New Loading Zone Record Id: " + vNewCapAltID);
        } else {
    
        }
    }
}

function padZeros(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

// EOF