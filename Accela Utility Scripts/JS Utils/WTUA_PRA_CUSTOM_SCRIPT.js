//script inside includes custom
if(vEventName){

    if (matches(vEventName, 'WorfklowTaskUpdateAfter', 'PaymentReceiveAfter')){
        aa.runScript('WTUA_PRA_CUSTOM_SCRIPT');
    }

}


//script inside WTUA_PRA_CUSTOM_SCRIPT
var eParams = aa.util.newHashtable()

getRecordParams4Notification(eParams);
getPrimaryAddressLineParam4Notification(eParams);
getPrimaryOwnerParams4Notification(eParams);

if(vEventName=='WorkflowTaskUpdateAfter'){

    getWorkflowParams4Notification(eParams)
    
} else if (vEventName == 'PaymentReceiveAfter'){

}

//update expiration date

function updateExirationDates(updateASI, updateB1Exp){

    var currentDate = new Date();

    if (updateB1Exp){
        var expResult = aa.expiration.getLicensesByCapID(capId);
        var b1License = expResult.getOutput().b1Expiration;
        b1License.setExpDate(currentDate);

        licEditExpInfo(null, formataddDate(dateAdd(null,180)));

    } 

    if (updateASI){
        var ASIexpirationDate = 'Permit Expiration Date'; //name of the custom field to update
        editAppSpecific(ASIexpirationDate,formataddDate(dateAdd(null,180)), capId);
    }




}