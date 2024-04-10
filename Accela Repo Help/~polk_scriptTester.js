// var myCapId = "BT-2023-7"; //has gis object but not won't add parcel district
// var myCapId = 'BC-2023-6'
var myCapId = 'P23-0020'
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

    var assignedStaff = getAssignedStaffFromRecordTab();


	var asitHearingBody = loadASITable("HEARING BODY");

    eval(getScriptText("INCLUDES_LOGGING_CUSTOM", null, false));
if (wfTask == "Detailed Staff Review" && wfStatus == "Final Documents Ready" && !asitHearingBody){
			cancel = true;
		logMessage("Hearing Body Custom List is empty, please add atleast one hearing body to continue", "ERROR");
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


function updateAddressDistrictByInspectionDistrictOnCap_LOCAL(pCapId) {
	// var addrValidated = aa.env.getValue('AddressValidatedNumber');
	// var myCapId = cap.getCapID();
	// var addrResult = aa.address.getAddressByCapId(myCapId);
	// var addr = addrResult.getOutput();
	// logMessage(myCapId + ": " + addr.length + " | " + addrValidated);
	// var addObj = aa.address.getRefAddressByPK(parseInt(addrValidated)).getOutput();
	//aa.print(addObj.getInspectionDistrict());
  
	var addObj = aa.address.getAddressByCapId(pCapId).getOutput();
	var addressDistrict = '';
	var addrId = '';
	var theAddress = '';
  
	if (!addObj) return false;
  
	for (var addr in addObj) {
	  var thisAddr = addObj[addr];
	  var primaryFlag = thisAddr.getPrimaryFlag();
	  if (addressDistrict == '' && String(primaryFlag) == 'Y') {
		addressDistrict = thisAddr.getInspectionDistrict();
		aa.print('addressDistrict: ' + addressDistrict);
	  }
  
	  if (addrId == '' && String(primaryFlag) == 'Y') {
		addrId = thisAddr.getAddressId();
	  }
  
	  if (theAddress == '' && String(primaryFlag) == 'Y') {
		theAddress = thisAddr.getDisplayAddress();
	  }
	}
  
	if (addObj.length > 0) {
	  if (addressDistrict == '') {
		// get first object if no primaryFlag = "Y"
		addressDistrict = addObj[0].getInspectionDistrict();
	  }
  
	  if (addrId == '') {
		addrId = addObj[0].getAddressId();
	  }
  
	  if (theAddress == '') {
		theAddress = addObj[0].getDisplayAddress();
	  }
  
	  // parcel here
	  var parcelResult = aa.parcel.getParcelDailyByCapID(pCapId, null);
	  if (parcelResult.getSuccess()) {
		var parcelArray = parcelResult.getOutput();
		for (var p in parcelArray) {
		  var thisParcelNum = parcelArray[p].getParcelNumber();
  
		  if (thisParcelNum && thisParcelNum.length < 6) break;
  
		  var parcelRange = thisParcelNum.substring(0, 2);
		  var parcelTownship = thisParcelNum.substring(2, 4);
		  var parcelSection = thisParcelNum.substring(4, 6);
  
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 13) addressDistrict = 110;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 14) addressDistrict = 110;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 15) addressDistrict = 110;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 16) addressDistrict = 110;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 17) addressDistrict = 112;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 18) addressDistrict = 112;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 19) addressDistrict = 112;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 20) addressDistrict = 112;
		  if (parcelRange == 28 && parcelTownship == 27 && parcelSection == 21) addressDistrict = 112;
		}
	  }
  
	  /*** CITY ***/
	  var typeStringP = appTypeString.split('/');
	  var propertyTypeP = getAppSpecific('TRADE INFORMATION.Property Type', pCapId);
	  var permitType = getAppSpecific('DEMOLITION INFORMATION.Permit Type', pCapId);
	  var permitByP = getAppSpecific('GENERAL INFORMATION.Permit initiated by', pCapId);
	  var privateInsp = getAppSpecific('PRIVATE PROVIDER INFORMATION.Inspection', pCapId);
  
	  if (permitByP) {
		if (permitByP.equals('Fort Meade')) {
		  addressDistrict = 31;
		} else if (permitByP.equals('Davenport')) {
		  addressDistrict = 35;
		} else if (permitByP.equals('Polk City')) {
		  addressDistrict = 37;
		} else if (permitByP.equals('Dundee')) {
		  addressDistrict = 39;
		} else if (permitByP.equals('Eagle Lake')) {
		  addressDistrict = 32;
		}
	  }
  
      /**
       * Commenting this out while I implement new logic for Commerical and Trade records
       */
	//   if (typeStringP[1] == 'Commercial' || propertyTypeP == 'Commercial' || permitType == 'Commercial') {
	// 	// record type commercial OR BLD_TRADE-Property Type
	// 	addressDistrict = 9;
	//   }
    //begin ticket 79 
	var addressDistrict = updateComTradeInspDist(pCapId);
	  logDebug('Address district in main script: ' + addressDistrict)

	//end ticket 79

	  /*** private provider: inspection area equals 33 ***/
	  if (privateInsp && privateInsp.equals('Yes')) {
		addressDistrict = 33;
	  }
  
	  clearAllAddressDistrictOnCap(pCapId, addrId); // return true if success
	  logDebug('propertyTypeP : ' + propertyTypeP);
	  logDebug('addressDistrict to be added : ' + addressDistrict);
  
	  if (addressDistrict != '') {
		var addAddrDistrict = aa.address.addAddressDistrictForDaily(pCapId.ID1, pCapId.ID2, pCapId.ID3, addrId, addressDistrict);
		if (!addAddrDistrict.getSuccess()) {
		  // failed
		  var errType = addAddrDistrict.getErrorType();
		  if (errType && errType.endsWith('ObjectDuplicateException')) {
			// Inspection Area duplicate or already exists, nothing is added.
			logDebug('Address: ' + theAddress + ' already had inspection district ' + addressDistrict + '. Nothing will be added');
		  }
		  logDebug('Error when add Inspection District for Address: ' + theAddress + '. Error message: ' + addAddrDistrict.getErrorMessage());
		} else {
		  // update the Inspection Area on Address
		  var addrResult = aa.address.getAddressByCapId(pCapId);
		  if (addrResult.getSuccess()) {
			var addr = addrResult.getOutput();
			if (addressDistrict != '' && addressDistrict > 0) {
			  for (var x in addr) {
				logDebug('Address inspection district before:' + addr[x].inspectionDistrict);
				addr[x].setInspectionDistrict(addressDistrict);
				logDebug('Address inspection district after:' + addr[x].inspectionDistrict);
				try {
				  aa.address.editAddressWithLogic(pCapId, addr[x]);
				  logDebug('Updated Address inspection area: ' + addressDistrict + ' at ' + addr[x].getDisplayAddress());
				} catch (err) {
				  logDebug('Error Updating Address Inspection Area ' + addr[x].getDisplayAddress());
				}
			  }
			}
		  }
		}
	  }
	  logDebug('addrId' + addrId);
	  //email("samnguyen@polk-county.net", "no-reply@polk-county.net", "Test ACA", "from program " + addrValidated + " district: " + addObj[0].getInspectionDistrict());
	}
  
	return true;
  }

  function updateComTradeInspDist(pCapId){
    if (appTypeArray[1] == 'Commercial' || (appTypeArray[1] == 'Trades' && getAppSpecific('TRADE INFORMATION.Property Type') == 'Commercial')){
		var inspDist = getGISInfoArray("POLKCO", "APO_Inspection_Areas", "Inspection_Area");

		//for testing
		// inspDist.push('5');
		// inspDist.push('901');
		// inspDist.push('202');
		
		logDebug('Insp. Array Length: ' + inspDist.length)
		var inspectionDistrict = '';
		if (inspDist != null && inspDist.length == 1){
			logDebug('One Inspection District: ' + inspDist)
			inspectionDistrict = inspDist[0];
			var firstIndex = inspectionDistrict;
			firstIndex = firstIndex.split('');
			if (firstIndex[0] != '9'){
				logDebug('Inspection District does not begin with a 9, add it to the beginning');
				inspectionDistrict = '9' + inspectionDistrict;
				logDebug('Inspection District with 9: ' + inspectionDistrict);
			} else {
				logDebug('Inspection District begins with 9, do not do anything');
			}
            return inspectionDistrict
		} else if (inspDist.length > 1) {
			logDebug('More than 1 inspection district found, determine if one begins with 9 if not then return first');
			for (i in inspDist){
				var district = inspDist[i];
				inspectionDistrict = district;
				logDebug('Checking District: ' + district)
				var firstIndex = district.split('');
				if (firstIndex[0] == '9'){
					logDebug('Distict Begins with 9, stop here: ' + district);
					inspectionDistrict = district;
					break
				} else {
					logDebug('District does not begin with 9, use the first district')
					inspectionDistrict = '9' + inspDist[0];
				}
			}
            return inspectionDistrict

		} 
		logDebug('Inspection District: ' + inspectionDistrict)
		logDebug('>>>End Item 79');
	} else {
		logDebug('>>>End Item 79 -- FAILED -- Record not Commercial or Trade')
	}
  }