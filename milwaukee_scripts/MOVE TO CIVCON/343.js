var myCapId = "BFOOD-R24-00024";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConvertToRealCAPAfter";
/* IFA */ //var eventName = 'InvoiceFeeAfter' ; var InvoiceNbrArray = []
// var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.

/* master script code don't touch */ 
aa.env.setValue('EventName', eventName);var vEventName = eventName;var controlString = eventName;var tmpID = aa.cap.getCapID(myCapId).getOutput();if (tmpID != null) {  aa.env.setValue('PermitId1', tmpID.getID1());  aa.env.setValue('PermitId2', tmpID.getID2());  aa.env.setValue('PermitId3', tmpID.getID3());}; aa.env.setValue('CurrentUserID', myUserId);var preExecute = 'PreExecuteForAfterEvents';var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue('MULTI_SERVICE_SETTINGS','SUPER_AGENCY_FOR_EMSE');if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != 'I') { useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue('MULTI_SERVICE_SETTINGS', 'SUPER_AGENCY_INCLUDE_SCRIPT' ); if (bzr.getSuccess()) {SAScript = bzr.getOutput().getDescription(); }}
if (SA) { eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', SA, useProductScript)); eval(getScriptText('INCLUDES_ACCELA_GLOBALS', SA, useProductScript));  /* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript));} else { eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', null, useProductScript)); eval(getScriptText('INCLUDES_ACCELA_GLOBALS', null, useProductScript));}eval(getScriptText('INCLUDES_CUSTOM', null, useProductScript));if (documentOnly) { doStandardChoiceActions2(controlString, false, 0); aa.env.setValue('ScriptReturnCode', '0'); aa.env.setValue('ScriptReturnMessage','Documentation Successful.  No actions executed.' );  aa.abortScript();}var prefix = lookup('EMSE_VARIABLE_BRANCH_PREFIX', vEventName);var controlFlagStdChoice = 'EMSE_EXECUTE_OPTIONS';var doStdChoices = true;var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;if (bzr) {  var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice,'STD_CHOICE'); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';  var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, 'SCRIPT');  doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';}
function getScriptText(vScriptName, servProvCode, useProductScripts) {  if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance('com.accela.aa.emse.emse.EMSEBusiness').getOutput(); try {if (useProductScripts) {var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);} else {
var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName,'ADMIN'); }return emseScript.getScriptText() + ''; } catch (err) { return '';}}

logGlobals(AInfo);
if (runEvent && typeof doStandardChoiceActions == 'function' && doStdChoices)
  try { doStandardChoiceActions(controlString, true, 0);
  } catch (err) { logDebug(err.message);}
if (runEvent && typeof doScriptActions == 'function' && doScripts)  doScriptActions();

var z = debug.replace(/<BR>/g, '\r');
aa.print(z);
doConfigurableScriptActions();

//
// User code goes here
//

try {
  logDebug('>>>>>>>> Start of script test');

  showDebug = true;
  publicUser = true;

  debug = ''

//TASK 343 - STOP ISSUANCE IF THERE ARE STILL APPLIED CONDITIONS 

  try {

    if (wfTask =='Issuance' && wfStatus == 'Issued'){
        var appHasAppliedCondition = appHasCondition(null, 'Applied', null, null);

        if (appHasAppliedCondition){
            showDebug = false;
            showMessage = true;
            comment('Renewal still has Applied Conditions. Resolve Conditions prior to renewal')
            cancel = true;
        }
    }
    
  } catch (err) {
    logDebug(err.message);
    logDebug(err.stack);
  };







} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
// END SCRIPT TESTER

if (cancel)
    {
    aa.env.setValue("ScriptReturnCode", "1");
    if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
    if (showDebug) 	aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
    }
else
    {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
    if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
    }




function exploreObject(objExplore) {

    logDebug('<font color=red ><u><b>Properties:</b></u></font> ');
  
    var properties = [];
  
    for (var y in objExplore) {
      try {
        if (typeof objExplore[y] !== 'function') {
          properties.push(y);
        }
      } catch (err) {
        logDebug('exploreObject(): **ERROR** in Properties: ' + err.Message);
      }
    }
  
    properties.sort();
    properties.forEach(function(property) {
      logDebug('  <b> ' + property + ': </b> ' + objExplore[property]);
    });
  
    logDebug('');
    logDebug('<font color=red ><u><b>Methods:</b></u></font> ');
  
    var methods = [];
  
    for (var x in objExplore) {
      try {
        if (typeof objExplore[x] === 'function') {
          methods.push(x);
        }
      } catch (err) {
        logDebug('exploreObject(): **ERROR** in Functions: ' + err.Message);
      }
    }
  
    methods.sort();
    methods.forEach(function(method) {
      logDebug('<font color=blue><u><b>' + method + '</b></u></font> ');
      logDebug('   ' + objExplore[method] + '<br>');
    });
  
  
  }





  function editCapConditionStatus_(pType,pDesc,pStatus,pStatusType, itemCap) {
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
		logDebug('Original Status/Type: ' + cStatus + ": " + cStatusType);



		
		if (cDesc.toUpperCase() == pDesc.toUpperCase()) {
			if (!pStatus.toUpperCase().equals(cStatus.toUpperCase())) {
				thisCond.setConditionStatus(pStatus);
				thisCond.setConditionStatusType(pStatusType);
				thisCond.setImpactCode("");
				aa.capCondition.editCapCondition(thisCond);

                logDebug('Updated CAP Condition')
				// return true; // condition has been found and updated
			} else {
				logDebug("ERROR: condition found but already in the status of pStatus and pStatusType");
				// return false; // condition found but already in the status of pStatus and pStatusType
			}
		}
	}
}