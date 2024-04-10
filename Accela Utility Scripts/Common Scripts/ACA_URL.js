var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
var buildRecURL = getACARecordURL(acaSite, capId);
addParameter(eParams, "$$acaRecordUrl$$", buildRecURL);
