// var myCapId = "C-20-47";
var myCapId = "EB00129"; //Amendment Record
 
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

	// var capIdLoop = aa.cap.getCapID('2670').getOutput()
    // var capContactResult = aa.licenseProfessional.getLicensedProfessionalsByCapID(capIdLoop).getOutput()[0];
    // var capContactResult = aa.licenseProfessional.getLicenseProf(capIdLoop).getOutput()[0]

	// exploreObject(capContactResult)

/*
	var people = aa.people
	var peopleModel = aa.people.getPeopleModel()
	var peopleList = aa.people.getPeopleByPeopleModel(peopleModel)
	var getPeopleByPK = aa.people.getPeople(1252)
	*/
/*
	var lp = aa.licenseProfessional //licenseProfessionalScript
	var lpScriptModel = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput() //LicenseProfessionalScriptModel
	lpScriptModel.setLicenseType('Cement')
	var lpModel = lpScriptModel.getLicenseProfessionalModel() //LicenseProfessionalModel
	// var getLPs = aa.licenseProfessional.getLicensedProfessionalsByPK(lpModel);
	*/
	// var licScript = aa.licenseScript
	// var refLic = licScript

	// exploreObject(aa.licenseScript)


	//Need to pass the license number with the ref_seq_nbr for the reference professional

	var newUser = createPublicUserFromRefLP('2670', '182089')
	logDebug(newUser)
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


function createPublicUserFromRefLP(licNbr, licSeqNbr)   // optional: Contact Type, default Applicant
{
    var contactType = "Applicant";
    var contact;
    var refContactNum;
    var userModel;

	logDebug('Get License Cap: ' + licNbr)
    var lpCapId = aa.cap.getCapID(licNbr).getOutput();
   

    if (arguments.length > 0) contactType = arguments[0]; // use contact type specified
    var capContactResult = aa.licenseProfessional.getLicensedProfessionalsByCapID(lpCapId)
    if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
				contact = Contacts[yy];
        }
    }
    
    if (!contact)
    { logDebug("Couldn't create public user for " + contactType + ", no such contact"); return false; }
    if (!contact.getEmail())
    { logDebug("Couldn't create public user for " + contactType + ", no email address"); return false; }

    // get the reference contact ID.   We will use to connect to the new public user
    refContactNum = licSeqNbr
    // check to see if public user exists already based on email address
    var getUserResult = aa.publicUser.getPublicUserByEmail(contact.getEmail())
    if (getUserResult.getSuccess() && getUserResult.getOutput()) {
        userModel = getUserResult.getOutput();
        logDebug("CreatePublicUserFromContact: Found an existing public user: " + userModel.getUserID());
	}
    if (!userModel) // create one
    	{
	    logDebug("CreatePublicUserFromContact: creating new user based on email address: " + contact.getEmail()); 
	    var publicUser = aa.publicUser.getPublicUserModel();
	    publicUser.setFirstName(contact.getContactFirstName());
	    publicUser.setLastName(contact.getContactLastName());
	    publicUser.setEmail(contact.getEmail());
	    publicUser.setUserID(licNbr);
	    publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
	    publicUser.setAuditID("PublicUser");
	    publicUser.setAuditStatus("A");
	    publicUser.setCellPhone(contact.getPhone1());
	    var result = aa.publicUser.createPublicUser(publicUser);
	    if (result.getSuccess()) {
		logDebug("Created public user " + contact.getEmail() + "  sucessfully.");
		var userSeqNum = result.getOutput();
		var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()
		// create for agency
		aa.publicUser.createPublicUserForAgency(userModel);
		// activate for agency
		var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
			userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(servProvCode,userSeqNum,"ADMIN");
			// reset password
			var resetPasswordResult = aa.publicUser.resetPassword(contact.getEmail());
			if (resetPasswordResult.getSuccess()) {
				var resetPassword = resetPasswordResult.getOutput();
				userModel.setPassword(resetPassword);
				logDebug("Reset password for " + contact.getEmail() + "  sucessfully.");
			} else {
				logDebug("**ERROR: Reset password for  " + contact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
			}
		// send Activate email
		aa.publicUser.sendActivateEmail(userModel, true, true);
		// send another email
		aa.publicUser.sendPasswordEmail(userModel);
	    }
    	else {
    	    logDebug("**Warning creating public user " + contact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
    	}
    }
//  Now that we have a public user let's connect to the reference contact		
	
if (refContactNum)
	{
	logDebug("CreatePublicUserFromContact: Linking this public user with reference contact : " + refContactNum);
	var licScriptModel = aa.licenseScript.getRefLicensesProfByLicNbr('WICHITA', licNbr).getOutput()[0]
	var returnMsg = aa.licenseScript.associateLpWithPublicUser(userModel, licScriptModel);

	if (!returnMsg.getSuccess()){
		logDebug('ERROR ' + returnMsg.errorMessage + ' FAILED to link')
	}

	// exploreObject(returnMsg)
	}
	
return userModel; // send back the new or existing public user
}