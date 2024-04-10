//item 148 - jcc - email assigned record staff that case has been assigned to them
logDebug('Executing WTUA:Enforcement/Property Maintenance/Case/NA')
if (task == 'Case Intake' && wfStatus == 'Assigned'){

        //email record assigned 
        var emailParams = aa.util.newHashtable();
        var emailTo;
        logDebug('retrieving cap detail')

        var capDetail = aa.cap.getCapDetail(capId);
    
        if (capDetail.getSuccess()) {
            capDetail = capDetail.getOutput()
            var asgnStaff = capDetail.getAsgnStaff();
            if (!matches(asgnStaff, null, undefined, '')) {
    
                asgnStaff = aa.person.getUser(asgnStaff).getOutput();
                staffEmail = asgnStaff.getEmail();
                emailTo = staffEmail;
            }
        }
        getRecordParams4Notification(emailParams);
        getWorkflowParams4Notification(emailParams);
    
        logDebug('Email To: ' + emailTo)
        logDebug('Available Params: ' + emailParams)
        sendNotification('', emailTo, '', 'ENF_CASE_ASSIGNED', emailParams, null)
}
