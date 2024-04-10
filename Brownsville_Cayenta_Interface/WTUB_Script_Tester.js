var myCapId = '2024-00019';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Permit Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConverToRealCAPAfter";
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'
var eventName = 'WorkflowTaskUpdateBefore'; wfTask = "Application Intake"; wfStatus = "Accepted - Plan Review Not Req"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'

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


  eval(getScriptText('BPUB_INTERFACE_FUNCTIONS', null, null));


  var asitNumberMeters = getAppSpecific('Number of Meters')
  var asiDisconnect = getAppSpecific('Will this require a Disconnect/Reconnect');
  var asiWorkingClearance = getAppSpecific('Do you have a working clearance?')


  if (((wfTask == 'Application Intake' && wfStatus == 'Accepted - Plan Review Not Req') || (wfTask == 'Plans Coordination' && wfStatus == 'Ready to Issue')) && asitNumberMeters > 1 && getAppSpecific('Provider') == 'BPUB'){
    logDebug('BPUB Interface - Checking Meter table')
    var meterInfoASIT = loadASITable('METERS');

    if (!meterInfoASIT){
        cancel = true;
        showDebug = false;
        showMessage = true;
        logDebug('BPUB Interface - Error, Meter Table is empty and there is more than 1 connection')
        logMessage('Please complete the Meter Information Data Table. The Data Field "Number of Meters" is greater than 1 and there are no fields on the Data Table', 'ERROR');

    } else {
      var totalConnections = 0;
      for (i in meterInfoASIT){
        row = meterInfoASIT[i];
        connectionTp = row['Connection Type']
        quantity = row['Quantity'];
      if (connectionTp !='TEMP'){
        totalConnections += Number(quantity)
      }
  }
        

        if (asitNumberMeters != totalConnections){
          cancel = true;
          showDebug = false;
          showMessage = true;
          logDebug('The Data Field "Number of Meters", ' + asitNumberMeters + ', does not match the total quantity in the Meter Information table, Quantity: ' + totalConnections)
          logMessage('The Data Field "Number of Meters", ' + asitNumberMeters + ', does not match the total quantity in the Meter Information table, Quantity: ' + totalConnections, 'ERROR')
        }
    }


  }

  if (((wfTask == 'Application Intake' && wfStatus == 'Accepted - Plan Review Not Req') || (wfTask == 'Plans Coordination' && wfStatus == 'Ready to Issue') && (asiDisconnect || asiWorkingClearance)) && asitNumberMeters == 0 && getAppSpecific('Provider') == 'BPUB'){
    cancel = true;
    showDebug = false;
    showMessage = true;
    logMessage('Number of Meters must be greater than 0 if a Disconnect/Reconnect OR Working Clearance is Yes', 'ERROR')


  }



} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);

// END SCRIPT TESTER
// HELPER FUNCTIONS BELOW

function exploreObject(objExplore) {
  logDebug('Methods:');
  for (var x in objExplore) {
    try {
      if (typeof objExplore[x] === 'function') {
        logDebug('<font color=blue><u><b>' + x + '</b></u></font> ');
        logDebug('   ' + objExplore[x] + '<br>');
      }
    } catch (err) {
      logDebug('exploreObject(): **ERROR** in Functions: ' + err.Message);
    }
    var counter = objExplore.length;
  }
  logDebug('');
  logDebug('Properties:');
  for (var y in objExplore) {
    try {
      if (typeof objExplore[y] !== 'function') {
        logDebug('  <b> ' + y + ': </b> ' + objExplore[y]);
      }
    } catch (err) {
      logDebug('exploreObject(): **ERROR** in Properties: ' + err.Message);
    }
  }
}


