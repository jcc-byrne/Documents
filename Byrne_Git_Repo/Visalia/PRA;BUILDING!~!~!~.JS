//DVG20200130 - For "Building/Various Others/Plumbing/Commercial", issue if bal is zero

var condCheck = appHasCondition("Building Permit","Applied","Required: Soft Hold - Permit Issuance",null);

if(appMatch("Building/*/*/*") && isTaskActive("Pending Issuance")){
	var condCheck = appHasCondition("Building Permit","Applied","Required: Soft Hold - Permit Issuance",null);
	if(condCheck){
		showMessage = true; comment(<font color='red'><b>"This is a requirement that must be met before permit can be issued. Check with applied user for more details."</b></font>);
	}
}

if(isTaskActive("Pending Issuance") && balanceDue <= 0 && AInfo["5 yr Deferral"] != "CHECKED" && !condCheck){
   closeTask("Pending Issuance","Issued","Issued by PRA Script",null);
   updateAppStatus("Issued","Set by PRA Script");

//EMAIL APPLICANT
contactTypes = new Array("Applicant");
iCon = null; contactArray = new Array(); parameters = aa.util.newHashMap();
contactArray = getContactArray();
for (iCon in contactArray)
						
if (exists(contactArray[iCon]["contactType"],contactTypes));{
reportParams = null; newReport = null; tContact = contactArray[iCon];
params = aa.util.newHashtable(); getRecordParams4Notification(params); 
getPrimaryAddressLineParam4Notification(params); getPrimaryOwnerParams4Notification(params); getContactParams4Notification(params,tContact);
reportParams = aa.util.newHashtable(); addParameter(reportParams,"RecordID",capIDString); addParameter(params,"$$balDue$$",balanceDue);
sendNotification("permits@visalia.city",tContact["email"],"","BUILDING_ISSUED",params,null);
}
}

if(isTaskActive("Pending Issuance") && balanceDue <= 0 && AInfo["5 yr Deferral"] == "CHECKED" && !condCheck){
   closeTask("Pending Issuance","Issued Deferred","Issued by PRA Script",null);
   updateAppStatus("Issued Deferred","Set by PRA Script");	

//EMAIL APPLICANT
contactTypes = new Array("Applicant");
iCon = null; contactArray = new Array(); parameters = aa.util.newHashMap();
contactArray = getContactArray();
for (iCon in contactArray)
						
if (exists(contactArray[iCon]["contactType"],contactTypes));{
reportParams = null; newReport = null; tContact = contactArray[iCon];
params = aa.util.newHashtable(); getRecordParams4Notification(params); 
getPrimaryAddressLineParam4Notification(params); getPrimaryOwnerParams4Notification(params); getContactParams4Notification(params,tContact);
reportParams = aa.util.newHashtable(); addParameter(reportParams,"RecordID",capIDString); addParameter(params,"$$balDue$$",balanceDue);
sendNotification("permits@visalia.city",tContact["email"],"","BUILDING_ISSUED_DEFERRAL",params,null);
}
}

if (appMatch("Engineering/*/*/*") && AInfo["5 yr Deferral"] != "CHECKED") 
	{
		if(capStatus == "Pending Issuance" && balanceDue <= 0)
		{
			closeTask("Pending Issuance","Issued","Set by PRA Script",null);	
			updateAppStatus("Issued","Set by PRA Script");			
		}
	}
	
if (appMatch("Engineering/*/*/*") && AInfo["5 yr Deferral"] == "CHECKED") 
	{
		if(capStatus == "Pending Issuance" && balanceDue <= 0)
		{
			closeTask("Pending Issuance","Issued Deferred","Set by PRA Script",null);	
			updateAppStatus("Issued Deferred","Set by PRA Script");			
		}
	}

//PRA New 3/25/2019
if(appMatch("Building/*/*/*")){
	var workflowStructure = lookup("Workflow_Reviews_By_Rec_Type",appTypeString);
	if(workflowStructure != undefined){
		if(workflowStructure.indexOf("OTC") >= 0 && capStatus == "Pending" && balanceDue <= 0){
			closeTask("Application Submittal","Issued","Set by PRA Building","");
			updateAppStatus("Issued","Set by PRA Building");
		}
	}
}



if (appMatch("Building/Various Others/Plumbing/Commercial") && balanceDue == 0)
	{
		if(capStatus != "Issued")
		{
			//closeTask("Pending Issuance","Issued Deferred","Set by PRA Script",null);	
			updateAppStatus("Issued","Set by PRA Script");
			aa.sendMail("david.vangilluwe@visalia.city", "david.vangilluwe@visalia.city", null, "PRA Script Fired P1", "Paid to zero, set to issued");
		}
	}


//Residential SolarApp - Issue Permit
// 08/28/2023 added by Jacob Clay - Byrne Software

if(appMatch("Building/Residential/SolarPV/SolarApp") && balanceDue <= 0 && isTaskActive('Permit Issuance') && publicUser){
    editAppSpecific("Expiration Date",dateAdd(null,365));
    closeTask('Permit Issuance', 'Issued', 'Permit Auto Issued via CRCA', null);

    var scriptName = "BLD_RUNREPORTASYNC";
    var reportName = "PermitCard_Solar";
    var reportModule = "Building"
    var reportParams = aa.util.newHashMap();
    addParameter(reportParams, "RECORD_ID", capId.getCustomID());
    /* 	RUN REPORT AND ATTACH IT TO RECORD */		
    generateASYNCReport(capId,reportName,reportModule,reportParams,scriptName);
    aa.sendMail('noreply@accela.com', 'jcc@byrnesoftware.com', '', 'VISALIA PRA 1', debug);
}
