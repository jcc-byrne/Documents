var myCapId = "FREST-A23-00004";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConverToRealCAPAfter";
/* IFA */ //var eventName = 'InvoiceFeeAfter' ; var InvoiceNbrArray = []
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.

/* master script code don't touch */ aa.env.setValue('EventName', eventName);
var vEventName = eventName;
var controlString = eventName;
var tmpID = aa.cap.getCapID(myCapId).getOutput();
if (tmpID != null) {
  aa.env.setValue('PermitId1', tmpID.getID1());
  aa.env.setValue('PermitId2', tmpID.getID2());
  aa.env.setValue('PermitId3', tmpID.getID3());
}
aa.env.setValue('CurrentUserID', myUserId);
var preExecute = 'PreExecuteForAfterEvents';
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue(
  'MULTI_SERVICE_SETTINGS',
  'SUPER_AGENCY_FOR_EMSE'
);
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != 'I') {
  useSA = true;
  SA = bzr.getOutput().getDescription();
  bzr = aa.bizDomain.getBizDomainByValue(
    'MULTI_SERVICE_SETTINGS',
    'SUPER_AGENCY_INCLUDE_SCRIPT'
  );
  if (bzr.getSuccess()) {
    SAScript = bzr.getOutput().getDescription();
  }
}
if (SA) {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', SA, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', SA, useProductScript));
  /* force for script test*/ showDebug = true;
  eval(getScriptText(SAScript, SA, useProductScript));
} else {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', null, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', null, useProductScript));
}
eval(getScriptText('INCLUDES_CUSTOM', null, useProductScript));
if (documentOnly) {
  doStandardChoiceActions2(controlString, false, 0);
  aa.env.setValue('ScriptReturnCode', '0');
  aa.env.setValue(
    'ScriptReturnMessage',
    'Documentation Successful.  No actions executed.'
  );
  aa.abortScript();
}
var prefix = lookup('EMSE_VARIABLE_BRANCH_PREFIX', vEventName);
var controlFlagStdChoice = 'EMSE_EXECUTE_OPTIONS';
var doStdChoices = true;
var doScripts = false;
var bzr =
  aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
  var bvr1 = aa.bizDomain.getBizDomainByValue(
    controlFlagStdChoice,
    'STD_CHOICE'
  );
  doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
  var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, 'SCRIPT');
  doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
  if (!servProvCode) servProvCode = aa.getServiceProviderCode();
  vScriptName = vScriptName.toUpperCase();
  var emseBiz = aa.proxyInvoker
    .newInstance('com.accela.aa.emse.emse.EMSEBusiness')
    .getOutput();
  try {
    if (useProductScripts) {
      var emseScript = emseBiz.getMasterScript(
        aa.getServiceProviderCode(),
        vScriptName
      );
    } else {
      var emseScript = emseBiz.getScriptByPK(
        aa.getServiceProviderCode(),
        vScriptName,
        'ADMIN'
      );
    }
    return emseScript.getScriptText() + '';
  } catch (err) {
    return '';
  }
}
logGlobals(AInfo);
if (runEvent && typeof doStandardChoiceActions == 'function' && doStdChoices)
  try {
    doStandardChoiceActions(controlString, true, 0);
  } catch (err) {
    logDebug(err.message);
  }
if (runEvent && typeof doScriptActions == 'function' && doScripts)
  doScriptActions();
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


  if (wfTask == 'Issuance' && wfStatus == 'Issued' && (appMatch('Licenses/Business/Food Dealer/*') || appMatch('Licenses/Business/Restaurant/*')  || appMatch('Licenses/Business/Temporary Food Dealer/*'))){

    var reqDocs = ['Plan - Floor Plan', 'Menu'];
    var capDocs = getDocumentList() 
    var missingDocuments = findMissingDocs(reqDocs, capDocs);
    if (missingDocuments.length === 0) {
      logDebug("All required documents are present.");
  } else {
      logDebug("Some required documents are missing: " + missingDocuments.join(', '));
      cancel = true;
      showDebug = false;
      showMessage = true;
      message += "Some required documents are missing: " + missingDocuments.join(', ')
  }
  }






} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
// END SCRIPT TESTER

function findMissingDocs(reqDocs, capDocs) {
    var missingDocs = [];
    
    // Loop through each item in reqDocs
    for (var i = 0; i < reqDocs.length; i++) {
        var reqDoc = reqDocs[i];
        var found = false;
        
        // Check if the current reqDoc exists in capDocs
        for (var j = 0; j < capDocs.length; j++) {
            var capDoc = capDocs[j];
            var docCategory = capDoc.getDocCategory();
            logDebug('doc cat: ' +docCategory)

            // Check if the category of the current capDoc matches the current reqDoc
            if (docCategory == reqDoc) {
                found = true;
                break; // Exit the loop once a match is found
            }
        }
        
        // If reqDoc is not found in capDocs, add it to the list of missing documents
        if (!found) {
            missingDocs.push(reqDoc);
        }
    }
    
    // Return the list of missing documents
    return missingDocs;
}


 
function getDocumentList() {
	// Returns an array of documentmodels if any
	// returns an empty array if no documents
	var docListArray = new Array();
	docListResult = aa.document.getCapDocumentList(capId,currentUserID);
	if (docListResult.getSuccess()) {		
		docListArray = docListResult.getOutput();
	}
	return docListArray;
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


