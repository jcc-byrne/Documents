var capIdScriptModel = aa.cap.createCapIDScriptModel(capId.ID1, capId.ID2, capId.ID3);

var capPrimaryContact = aa.cap.getCapPrimaryContact(capIdScriptModel);

if (capPrimaryContact.getSuccess()){
    capPrimaryContact = capPrimaryContact.getOutput();
    if (capPrimaryContact == null){
        logDebug('Primary Contact does not exist for this application, getting Applicant');
        var capApplicant = getContactByType('Applicant', capId);
        contactEmail = capApplicant.getEmail();
        contactName = capApplicant.getFirstName();

    } else {
        logDebug('Successfully Retrieved Primary Contact');
        contactEmail = capPrimaryContact.getEmail();
        contactName = capPrimaryContact.getFirstName();
        // exploreObject(capPrimaryContact)
    }

} else {
    logDebug('Failed to retrieve primary contact')
    var capApplicant = getContactByType('Applicant', capId);
    contactEmail = capApplicant.getEmail();
    contactName = capApplicant.getFirstName();
}