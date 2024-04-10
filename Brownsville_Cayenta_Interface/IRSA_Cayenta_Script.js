var myCapId = '2024-00047';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Permit Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ var eventName = "InspectionResultSubmitAfter" ; inspResult = "Passed"; inspResultComment = "Comment";  inspType = "Electrical - Final"; inspId = '364172'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConverToRealCAPAfter";
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



  eval(getScriptText('BPUB_INTERFACE_FUNCTIONS', null, null));
  if (inspType == 'Electrical - T-Pole' && inspResult == 'Passed'){
    //Look for permits in BPUB table that are of type 'TEMP' and update to released
    var permArray = getASITpermitNumbers('TEMP');
    for (i in permArray){
    row = permArray[i]
    rowIndex = row[0]
    permitNum = row[1]
    aa.print('Updating Permit Number: ' + permitNum);
    logDebug('Updating Permit Number: ' + permitNum)
    updatePermitEntry(permitNum, 'TEMP', rowIndex)
}
} else if (inspType == 'Electrical - Working Clearance' && inspResult == 'Passed') {
        //Look for permits in BPUB table that are of type 'CLEAR' and update to released
        var permArray = getASITpermitNumbers('CLEAR');
        for (i in permArray){
        row = permArray[i]
        rowIndex = row[0]
        permitNum = row[1]
        aa.print('Updating Permit Number: ' + permitNum);
        logDebug('Updating Permit Number: ' + permitNum)
        updatePermitEntry(permitNum, 'CLEAR', rowIndex)
    }
} else if (inspType == 'Electrical - Final' && inspResult == 'Passed') {
    //Look for permits in BPUB table that are of type 'PERM', 'RELOC', SERIN', 'HOUSE' and update to released
    var permArray = getAllASITPermitNumbers();
    for (i in permArray){
    row = permArray[i]
    rowIndex = row[0]
    permitNum = row[1]
    connectionTp = row[2]
    permStatus = row[3];

    if (permStatus != 'Released'){
      aa.print('Updating Permit Number: ' + permitNum);
      logDebug('Updating Permit Number: ' + permitNum)
      updatePermitEntry(permitNum, connectionTp, rowIndex)
    }
}
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