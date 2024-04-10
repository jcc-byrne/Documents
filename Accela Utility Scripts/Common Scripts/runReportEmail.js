
if (appMatch('Health/Day Care/NA/License') || appMatch('Health/Apiary/NA/License') || appMatch('Health/Collection Boxes/NA/License') || appMatch('Health/Hen/NA/License') || appMatch('Health/Temporary Event/NA/License'))
{
var reportName = "Health License Report";
var reportParams = aa.util.newHashMap();
var reportModule = "Health"
addParameter(reportParams, "altID", capId.getCustomID());
runReportAttach(capId, reportName, reportParams);


var rFiles = new Array();
var rFile = generateReport(capId, reportName, reportModule, reportParams);
rFiles.push(rFile);

var emailFrom = '';
var emailTo = '';
var emailCC = '';
var emailTemplate = 'Evanston_Health_License_Renewed';
var emailParams = aa.util.newHashtable();

getRecordParams4Notification(emailParams);
getContactParams4Notification(emailParams, "Applicant");
getPrimaryAddressLineParam4Notification(emailParams);
getPrimaryOwnerParams4Notification(emailParams);
//getInspectionResultParams4Notification(emailParams); //only use on Inspection Result
//getInspectionScheduleParams4Notification(emailParams); //only use on Inspection Schedule
//getWorkflowParams4Notification(emailParams); //only use on Workflow Task Update After



var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
var buildRecURL = getACARecordURL(acaSite, capId);
addParameter(eParams, "$$acaRecordUrl$$", buildRecURL);

sendNotification(emailFrom, emailTo, emailCC, emailTemplate, emailParams, rFiles);
}

