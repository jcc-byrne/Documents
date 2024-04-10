//Ticket 58 - JCC
if (wfTask == "Zoning Review" && wfStatus == "Denied") {
    var params = aa.util.newHashtable();
    getRecordParams4Notification(params);
    addParameter(params, '$$wfComment$$', wfComment)

    sendNotification("", "", "", "EVANSTON_HB_ZONING_DENIED", params, new Array());
}

//Ticket 59 - JCC
if (wfTask == "Zoning Review" && wfStatus == "Compliant") {
    closeTask("Issuance", "Certificate Issued", "Zoning Review Compliant", "Updated via script");
    sendLicenseCert();

}

//Ticket 61 - JCC

if (wfTask == "Issuance" && wfStatus == "Certificate Issued") {
    sendLicenseCert();
}

function sendLicenseCert() {
    var rFiles = new Array();
    var rptParams = aa.util.newHashMap();
    var module = "Licenses";

    var altId = capId.getCustomID();

    logDebug("Running Report...");
    //rptParams.put("p1Value", altId);
    var reportFile = generateReport(capId, "Home Based Certificate", module, rptParams);
    rFiles.push(reportFile);

    var params = aa.util.newHashtable();
    getRecordParams4Notification(params);
    var toEmail = "";

    logDebug("Getting Contact....");
    //GET APPLICANT INFO
    capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
        var conArray = capContactResult.getOutput();
        firstName4Email = conArray[0].getPeople().firstName;
        addParameter(params, "$$ContactName$$", firstName4Email);

        for (c in conArray) {
            conType = conArray[c].getPeople().contactType;
            lastName = conArray[c].getPeople().lastName;
            firstName = conArray[c].getPeople().firstName;
            middleName = conArray[c].getPeople().middleName;
            emailAddr = conArray[c].getPeople().email;

            if (emailAddr != undefined && conType == "Applicant") {
                toEmail = toEmail + emailAddr + ';';
                aa.print("APPLICANT: " + toEmail);
            }
        }
    }
    addParameter(params, "$$emailTo$$", toEmail)
    sendNotification("", "", "", "EVANSTON_HB_ISSUED", params, rFiles, capId);
    runReportAttach(capId, "Home Based Certificate");

}
	