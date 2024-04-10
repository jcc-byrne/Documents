var myCapId = "MRL511";
var myUserId = "ADMIN";

/* ASA  */  //var eventName = "ApplicationSubmitAfter";
/* WTUA */  var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Annual Liquor Renewal"; wfStatus = "Renewed"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */  //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */  //var eventName = "PaymentReceiveAfter";  
/* CTRCA  */  //var eventName = "ConverToRealCAPAfter";  
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName", eventName); var vEventName = eventName; var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput(); if (tmpID != null) { aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3()); } aa.env.setValue("CurrentUserID", myUserId); var preExecute = "PreExecuteForAfterEvents"; var documentOnly = false; var SCRIPT_VERSION = 3.0; var useSA = false; var SA = null; var SAScript = null; var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT"); if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); } } if (SA) { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript)); } else { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript)); } eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript)); if (documentOnly) { doStandardChoiceActions2(controlString, false, 0); aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed."); aa.abortScript(); } var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName); var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS"; var doStdChoices = true; var doScripts = false; var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0; if (bzr) { var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE"); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT"); doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; } function getScriptText(vScriptName, servProvCode, useProductScripts) { if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput(); try { if (useProductScripts) { var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName); } else { var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN"); } return emseScript.getScriptText() + ""; } catch (err) { return ""; } } logGlobals(AInfo); if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try { doStandardChoiceActions(controlString, true, 0); } catch (err) { logDebug(err.message) } if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g, "\r"); aa.print(z);

//
// User code goes here
//


try {
	logDebug('>>>>>>>> Start of script test')

	showDebug = true;
	publicUser = true;


	var contactArray = aa.people.getCapContactByCapID(capId);
	if (contactArray.getSuccess()){
		contactArray = contactArray.getOutput()

		
	exploreObject(contactArray)
	}


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