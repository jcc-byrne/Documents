// var myCapId = "C-20-47";
var myCapId = "COL-24-004"; //Background Check Record
// var myCapId = "C-23-011A"; 

 
var myUserId = "ADMIN";

/* ASA  */  var eventName = "ApplicationSubmitAfter";
/* WTUA */  //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Facility Inspection"; wfStatus = "Ready to Issue"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */  //var eventName = "InspectionScheduleAfter" ; inspType = "Facility Inspection"
/* PRA  */  //var eventName = "PaymentReceiveAfter";  
/* CTRCA  */  //var eventName = "ConverToRealCAPAfter";  
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName", eventName); var vEventName = eventName; var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput(); if (tmpID != null) { aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3()); } aa.env.setValue("CurrentUserID", myUserId); var preExecute = "PreExecuteForAfterEvents"; var documentOnly = false; var SCRIPT_VERSION = 3.0; var useSA = false; var SA = null; var SAScript = null; var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT"); if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); } } if (SA) { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript)); } else { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript)); } eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript)); if (documentOnly) { doStandardChoiceActions2(controlString, false, 0); aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed."); aa.abortScript(); } var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName); var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS"; var doStdChoices = true; var doScripts = false; var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0; if (bzr) { var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE"); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT"); doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; } function getScriptText(vScriptName, servProvCode, useProductScripts) { if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput(); try { if (useProductScripts) { var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName); } else { var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN"); } return emseScript.getScriptText() + ""; } catch (err) { return ""; } } logGlobals(AInfo); if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try { doStandardChoiceActions(controlString, true, 0); } catch (err) { logDebug(err.message) } if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g, "\r"); aa.print(z); 

// if (runEvent && typeof (doConfigurableScriptActions) == "function") doConfigurableScriptActions();


//
// User code goes here
//


try {
	logDebug('>>>>>>>> Start of script test')

	showDebug = true;
	publicUser = true;

    var pCapId = getParent();	
	if (pCapId){
        var pCap = aa.cap.getCap(pCapId).getOutput();
        var pCapType = String(pCap.getCapType())
        var pCapTypeArray = pCapType.split('/');
        if (pCapType == 'Cannabis/Regulatory/Annual/Application'){
            updateParentApp(capId, pCapId);             
            updateWfTask('Phase IV - City Manager Final Review','Accepted', 'Accepted via Change of Location', null, pCapId)
            logMessage('Change of Location approved, Parent Application updated')
        } else if (pCapType == 'Cannabis/Regulatory/Testing Lab/Application'){
            updateParentApp(capId, pCapId);             
            updateWfTask('Phase III - City Manager Final Review','Accepted', 'Accepted via Change of Location', null, pCapId)
            logMessage('Change of Location approved, Parent Application updated')

        } else if (pCapType == 'Cannabis/Regulatory-SE/Annual/Application'){
            updateParentApp(capId, pCapId);             
            updateWfTask('Phase V - City Manager Final Review','Accepted', 'Accepted via Change of Location', null, pCapId)
            logMessage('Change of Location approved, Parent Application updated')

        } else if (pCapTypeArray[3] == 'Permit'){
            editAppSpecific('City Manager POS Inventory System Approval', 'CHECKED');
            createPendingInspFromReqd();
            logMessage('City Manager Review accepted, creating pending inspections')
        }

        showMessage = true;
        showDebug = false;
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


function deleteExistingAPO(deleteFromCapId, keepExisting, whichAPO) {
	if (keepExisting || whichAPO == null || whichAPO == "") {
		return;
	}

	if (whichAPO.equalsIgnoreCase("A")) {
		var addresses = aa.address.getAddressByCapId(deleteFromCapId, null);
		if (addresses.getSuccess()) {
			addresses = addresses.getOutput();
			for (a in addresses) {
				logDebug('Removed Address')
				aa.address.removeAddress(deleteFromCapId, addresses[a].getAddressId());
			}
		}
	} else if (whichAPO.equalsIgnoreCase("P")) {
		var pbzns = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
		var capModelDeleteFrom = aa.cap.getCap(deleteFromCapId);
		if (capModelDeleteFrom.getSuccess()) {
			capModelDeleteFrom = capModelDeleteFrom.getOutput();
			capModelDeleteFrom = capModelDeleteFrom.getCapModel();
			logDebug('Removed Parcel')

			pbzns.removeParcel(capModelDeleteFrom);
		}
	} else if (whichAPO.equalsIgnoreCase("O")) {
		var owners = null;
		owners = aa.owner.getOwnerByCapId(deleteFromCapId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			for (o in owners) {
			logDebug('Removed Owner')

				aa.owner.removeCapOwnerModel(owners[o]);
			}
		}
	}
}


function appHasConditionLocal(pType,pStatus,pDesc,pImpact, itemCap)
	{
	// Checks to see if conditions have been added to CAP
	// 06SSP-00223
	//
	if (pType==null)
		var condResult = aa.capCondition.getCapConditions(itemCap);
	else
		var condResult = aa.capCondition.getCapConditions(itemCap,pType);
		
	if (condResult.getSuccess())
		var capConds = condResult.getOutput();
	else
		{ 
		logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		return false;
		}
	
	var cStatus;
	var cDesc;
	var cImpact;
	
	for (cc in capConds)
		{
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus();
		var cDesc = thisCond.getConditionDescription();
		var cImpact = thisCond.getImpactCode();
		var cType = thisCond.getConditionType();
		if (cStatus==null)
			cStatus = " ";
		if (cDesc==null)
			cDesc = " ";
		if (cImpact==null)
			cImpact = " ";
		//Look for matching condition
		
		if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
		logDebug('condition exists')
			return true; //matching condition found
		}
	return false; //no matching condition found
	} //function
	
	

	function editCapConditionStatusLocal(pType,pDesc,pStatus,pStatusType, itemCap) {
		// updates a condition with the pType and pDesc
		// to pStatus and pStatusType, returns true if updates, false if not
		// will not update if status is already pStatus && pStatusType
		// all parameters are required except for pType
	
		if (pType==null)
			var condResult = aa.capCondition.getCapConditions(itemCap);
		else
			var condResult = aa.capCondition.getCapConditions(itemCap,pType);
			
		if (condResult.getSuccess())
			var capConds = condResult.getOutput();
		else
			{ 
			logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
			logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
			return false;
			}
	
	
		for (cc in capConds) {
		
			var thisCond = capConds[cc];
			var cStatus = thisCond.getConditionStatus();
			var cStatusType = thisCond.getConditionStatusType();
			var cDesc = thisCond.getConditionDescription();
			var cImpact = thisCond.getImpactCode();
			logDebug(cStatus + ": " + cStatusType);
	
	
	
			
			if (cDesc.toUpperCase() == pDesc.toUpperCase()) {
				if (!pStatus.toUpperCase().equals(cStatus.toUpperCase())) {
					thisCond.setConditionStatus(pStatus);
					thisCond.setConditionStatusType(pStatusType);
					thisCond.setImpactCode("");
					aa.capCondition.editCapCondition(thisCond);
					return true; // condition has been found and updated
				} else {
					logDebug("ERROR: condition found but already in the status of pStatus and pStatusType");
					return false; // condition found but already in the status of pStatus and pStatusType
				}
			}
		}
		
		logDebug("ERROR: no matching condition found");
		return false; //no matching condition found
	
	}



	
function addStdConditionLocal(cType, cDesc, exactMatch, itemCap) // optional cap ID
{
	var addCapCondResult;
	if (matches(exactMatch,undefined,null,"","false",false)) exactMatch = false; // default to false
	if (matches(exactMatch,"true",true)) exactMatch = true;
	if (!aa.capCondition.getStandardConditions) {
		logDebug("addStdCondition function is not available in this version of Accela Automation.");
	} else {
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)
			if(!exactMatch){
				standardCondition = standardConditions[i];
				addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, "Y", "Y", standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
				
			}
			if (exactMatch && (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase())) //EMSE Dom function does like search, needed for exact match
			{
				standardCondition = standardConditions[i];
				addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), "Y", standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
			}
			if (addCapCondResult && addCapCondResult.getSuccess()) {
				logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
			} else {
				logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
			}
			
	}
}

function updateParentApp(capFrom, capTo){
    deactivateTask('Facility Inspection')
    closeTask('Change of Location Status', 'Approved')
    editCapConditionStatusLocal("Change of Location Pending", "Change of Location Pending", "Not Applied", "Not Applied", capTo);  
    deleteAndCopyAPO(capFrom, capTo);

}

function updateWfTask(wfstr, wfstat, wfcomment, wfnote, itemCap) // optional process name, cap id
{
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}
	if (!wfstat)
		wfstat = "NA";
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			else
				aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			logMessage("Updating Workflow Task " + wfstr + " with status " + wfstat);
			logDebug("Updating Workflow Task " + wfstr + " with status " + wfstat);
		}
	}
}

function deleteAndCopyAPO(capFrom, capTo){
	exploreObject(capFrom)
    deleteExistingAPO(capTo, false, "A");
    copyAddresses(capFrom, capTo);

    deleteExistingAPO(capTo, false, "P");
    copyParcels(capFrom, capTo)

    deleteExistingAPO(capTo, false, "O");
    copyOwnerLocal(capFrom, capTo)

    var copyDocs = aa.cap.transferRenewCapDocument(capFrom, capTo, false)
    logDebug('Copy Documents success?: ' + copyDocs.getSuccess())

}



function copyOwnerLocal(sCapID, tCapID)
{ 
	var ownrReq = aa.owner.getOwnerByCapId(sCapID);
	if(ownrReq.getSuccess())
	{
		var ownrObj = ownrReq.getOutput();
        if(ownrObj != null){
			for (xx in ownrObj)
			{
				ownrObj[xx].setCapID(tCapID);
				var succ = aa.owner.createCapOwnerWithAPOAttribute(ownrObj[xx]);
				exploreObject(succ)
				logDebug("Copied Owner: " + ownrObj[xx].getOwnerFullName());
			}
		}else{
			logDebug("Error Copying Owner : " + ownrObj.getErrorType() + " : " + ownrObj.getErrorMessage());
		}
	}else{ 
		logDebug("Warning: No owners exist to copy");
	}
} 