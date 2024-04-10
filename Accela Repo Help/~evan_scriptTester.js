var myCapId = "2301216";
var myUserId = "ADMIN";

/* ASA  */  //var eventName = "ApplicationSubmitAfter";
/* WTUA */  //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "License Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */  //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */  var eventName = "PaymentReceiveAfter";  
/* CTRCA  */  //var eventName = "ConverToRealCAPAfter";  
//var eventName = 'WorkflowAssignTaskAfter'
//var eventName = 'InspectionCancelAfter'



var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName", eventName); var vEventName = eventName; var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput(); if (tmpID != null) { aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3()); } aa.env.setValue("CurrentUserID", myUserId); var preExecute = "PreExecuteForAfterEvents"; var documentOnly = false; var SCRIPT_VERSION = 3.0; var useSA = false; var SA = null; var SAScript = null; var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT"); if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); } } if (SA) { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript)); } else { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript)); } eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript)); if (documentOnly) { doStandardChoiceActions2(controlString, false, 0); aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed."); aa.abortScript(); } var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName); var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS"; var doStdChoices = true; var doScripts = false; var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0; if (bzr) { var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE"); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT"); doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; } function getScriptText(vScriptName, servProvCode, useProductScripts) { if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput(); try { if (useProductScripts) { var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName); } else { var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN"); } return emseScript.getScriptText() + ""; } catch (err) { return ""; } } logGlobals(AInfo); if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try { doStandardChoiceActions(controlString, true, 0); } catch (err) { logDebug(err.message) } if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g, "\r"); aa.print(z);


//Log All Environmental Variables as  globals
var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements())
{
 key = keys.nextElement();
 eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
 logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

//
// User code goes here
//


try {
    logDebug('>>>>>>>> Start of script test')

    showDebug = true;
    publicUser = true;

    var conn = aa.db.getConnection(); 
var licNbr = "";
var licType="";
    var sql = "select lic_nbr,lic_type from RSTATE_LIC where bus_name ='316 Concrete LLC' and SERV_PROV_CODE ='WICHITA'";
//var sql = "select lic_nbr,lic_type from RSTATE_LIC where bus_name like '"+organizationName+"' and SERV_PROV_CODE ='WICHITA'";
    var sSelect = conn.prepareStatement(sql);
    var rs = sSelect.executeQuery();
    while (rs.next()) {
		logDebug("inside query")
        licNbr = rs.getString("lic_nbr");
		licType = rs.getString("lic_type");
		logDebug(licNbr +""+licType);

	}

    var refLicObj = null;
	var refLicenseResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(),licNbr);

exploreObject(refLicenseResult.getOutput()[0])

    if (refLicenseResult.getSuccess()){
        refLicenseResult = refLicenseResult.getOutput() //retunrs array of licenseProfessionalScripModels
    }

	var lp =  aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput();
	logDebug(lp);
	for (i in lp){


		var list = lp[i];
	//	logDebug(list);

	}
	var LPArry = new Array();
	lp.setCapID(capId);
	lp.setLicenseNbr(licNbr);
	lp.setBusinessName('316 Concrete LLC');
	lp.setLicenseType(licType);
	LPArry.push(lp)

	aa.licenseProfessional.editLicensedProfessional(lp);
	logDebug(lp.getLicenseNbr()+lp.getCapID());
    //var createLP = aa.licenseProfessional.createLicensedProfessional(lp);
	// aa.cap.setLicenseProfessionalList(LPArry);

    // var setLP = cap.getCapModel().setLicenseProfessionalList(LPArry)
    // exploreObject(lp)
    // exploreObject(aa.licenseProfessional)
    var setLP = cap.getCapModel().setLicenseProfessionalList(LPArry)

    aa.cap.editCapByPK(cap.getCapModel())


    logDebug(setLP)
    // exploreObject(aa.cap)

// exploreObject(cap.getCapModel().setLicenseProfessionalModel())
}
catch (err) {
    logDebug("A JavaScript Error occured: " + err.message);
}
// end user code
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage", debug)

// END SCRIPT TESTER
// HELPER FUNCTIONS BELOW

function exploreObject(objExplore) {
    logDebug("Methods:");
    for (var x in objExplore) {
        try {
            if (typeof (objExplore[x]) === "function") {
                logDebug("<font color=blue><u><b>" + x + "</b></u></font> ");
                logDebug("   " + objExplore[x] + "<br>");
            }
        } catch (err) {
            logDebug("exploreObject(): **ERROR** in Functions: " + err.Message);
        }
        var counter = objExplore.length;
    }
    logDebug("");
    logDebug("Properties:");
    for (var y in objExplore) {
        try {
            if (typeof (objExplore[y]) !== "function") {
                logDebug("  <b> " + y + ": </b> " + objExplore[y]);
            }
        } catch (err) {
            logDebug("exploreObject(): **ERROR** in Properties: " + err.Message);
        }
    }
}

function getGISInfo_local(svc, layer, attributename) {
    // use buffer info to get info on the current object by using distance 0
    // usage: 
    //
    // x = getGISInfo("flagstaff","Parcels","LOT_AREA");
    //

    var distanceType = "feet";
    var retString;

    var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
    if (bufferTargetResult.getSuccess()) {
        var buf = bufferTargetResult.getOutput();
        buf.addAttributeName(attributename);
    }
    else { logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false }

    var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap

    if (gisObjResult.getSuccess())
        var fGisObj = gisObjResult.getOutput();
    else { logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false }



    for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
    {
        var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);
        if (bufchk.getSuccess())
            var proxArr = bufchk.getOutput();
        else { logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return false }
        exploreObject(proxArr[0])

        for (a2 in proxArr) {
            var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
            for (z1 in proxObj) {
                var v = proxObj[z1].getAttributeValues()
                retString = v[0];
            }

        }
    }
    return retString
}

function updateAppName(newSN) // option CapId
{
    var itemCap = capId
    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args
    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

    if (!cdScriptObjResult.getSuccess()) { logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()); return false; }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) { logDebug("**ERROR: No cap detail script object"); return false; }
    cd = cdScriptObj.getCapDetailModel();
    cd.setShortNotes(newSN);
    cdWrite = aa.cap.editCapDetail(cd)
    if (cdWrite.getSuccess()) { logDebug("updated short notes to " + newSN) }
    else { logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()); return false; }


}

function updateAltID(newAltID, itemCap) {

        var x = aa.cap.updateCapAltID(itemCap, newAltID);
        if (x.getSuccess()) {
            message += "New  Applied  ID: " + newAltID + br;
            var createdByUser = aa.cap.getCap(itemCap).getOutput().getCapModel().getCreatedBy();
            if (createdByUser != null && createdByUser != '') {
                editCreatedBy(createdByUser, itemCap);
                logDebug("License Id: " + newAltID + " Created by: " + createdByUser);
            }
            var editresult = aa.cap.editCapByPK(aa.cap.getCap(itemCap).getOutput().getCapModel());
            if (editresult.getSuccess()) {
                logDebug("SUCCESS: " + message);
            }
            else {
                logDebug("ERROR CAP NOT UPDATED: " + editresult.getErrorType() + "::" + editresult.getErrorMessage());
            }
        }
        else {
            message += x.getErrorMessage() + br;
            logDebug(message);
        }
        logDebug("New Alt ID: " + newAltID);
    
}


function SendPermitBldLOCAL()
{
	if(balanceDue <= 0)
	{
		if(!isTaskActive("Permit Issuance"))
		{
			activateTask("Permit Issuance");
		}

		//updateTask("Permit Issuance","Fees Paid","Updated by Fees Paid on ACA","");
		//closeTask("Permit Issuance", "Fees Paid", "Updated by Fees Paid on ACA", "");
		resultWorkflowTask("Permit Issuance", "Fees Paid", "Updated by Fees Paid on ACA", "");

		var capAddressResult = aa.address.getAddressByCapId(capId);

		if (capAddressResult.getSuccess())
		{
			var Address = capAddressResult.getOutput();

			for(var yy in Address)
			{
				var AddressE = Address[yy];
			}
		}

		var rFile;
		// deactivateTask("Permit Issuance");
		var altID = capId.getCustomID();
		var report_params = aa.util.newHashMap();
		report_params.put("altid", altID); // Depending on the Permit then we need to put the correct Parameter

		var Params = aa.util.newHashtable();
		addParameter(Params, "$$ALTID$$", altID);
		addParameter(Params, "$$fileDateFixed$$", fileDate);// Date submitted
		addParameter(Params, "$$AddressLine1$$", AddressE); //address
		addParameter(Params, "$$workDesc$$", workDescGet(capId));

		var reportName = "Building Permit";
		report = aa.reportManager.getReportInfoModelByName(reportName);
		report = report.getOutput();
		report.setModule("Building");
		report.setCapId(capId);
		report.setReportParameters(report_params);

		var permit = aa.reportManager.hasPermission(reportName, currentUserID);

		if(permit.getOutput().booleanValue())
		{
			var reportResult = aa.reportManager.getReportResult(report);
        exploreObject(reportResult)


			if(reportResult)
			{
                logDebug('report results....')
				reportResult = reportResult.getOutput();
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				reportFile = reportFile.getOutput();
				rFile = reportFile;
			}
			else
			{
				logDebug("Unable to run report: " + reportName + " for Admin" + systemUserObj);
				return false;
			}
		}
		else
		{
			logDebug("No permission to report: " + reportName + " for Admin" + systemUserObj);
			return false;
		}

		if(rFile)
		{
			var rFiles = [];
			var emailHist = [];
			rFiles.push(rFile);

			var conArray = getContactArray();
			for(var x in conArray)
			{
				var contType = conArray[x].contactType;
				appEmail = conArray[x].email;
				var emailParams = aa.util.newHashtable();
				getRecordParams4Notification(emailParams);
				
				if(!exists(appEmail + "::" + "BLD_MESSAGE_SEND_PERMIT",emailHist))
				{
					sendNotification("", appEmail, "", "BLD_MESSAGE_SEND_PERMIT", Params, rFiles);
					emailHist.push(appEmail + "::" + "BLD_MESSAGE_SEND_PERMIT");
				}
				else
				{
					aa.print("Duplicate Notification Exists: [" + appEmail + "::" + "BLD_MESSAGE_SEND_PERMIT]");
				}
			}
		}

		//JLY 05/08/2023 - Script Item 26 Update - CCCD Permit adjustment 
		if(appMatch("Building/CCCDOTC/NA/NA") || appMatch("Building/CCCD/NA/NA"))
		{
			var cccdParams = aa.util.newHashtable();
			addParameter(cccdParams, "$$altid$$", capId.getCustomID());
			sendNotification("", "", "", "CCCD_PERMIT_ISSUED", cccdParams, []);
		}
	}
}
