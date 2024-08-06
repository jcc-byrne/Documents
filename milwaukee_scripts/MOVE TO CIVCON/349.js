var myCapId = "BFOOD-A24-00030";
var myUserId = 'ADMIN';

/* ASA  */ var eventName = "ApplicationSubmitAfter";
//eventName = 'pageflow'
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConvertToRealCAPAfter";
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
//   publicUser = true;

  debug = ''



  logDebug("Current Cap ID String: " + capIDString);

  var appRecIdString = capIDString;
  var indexSrch = appRecIdString.indexOf("-");
  
  if (indexSrch > 0 && !publicUser) {
      var appRecIdSubString;
      appRecIdSubString = appRecIdString.substring(indexSrch);
  logDebug('appRecIdString: ' + appRecIdString); 
  logDebug('indexSrch: ' + indexSrch); 
  logDebug('appRecIdSubString: ' + appRecIdSubString); 

      // get last record number from the table
      var vSC_Restaurant_SeqNbr;
      var vSC_Retail_SeqNbr;
      var vSC_Value;
      var vSC_SeqNbr;
  
  
  
      var vNewCapAltID;
      // check for type of application
      var vAppType = AInfo["Majority of your food sales"];
      if (vAppType == "Restaurant Items (meals)") {
          // "FREST-A$$yy$$-$$SEQ05$$";
          vAppTypePrefix = "FREST-A"; //+ appRecIdSubString;
          vSC_Value = lookup("LIC_FOOD_DEALER_ID_TRACKER", "RESTAURANT_FOOD_DEALER");
          
          vSC_SeqNbr = parseInt(vSC_Value) + 1;
          var vSeqNbr = padZeros(vSC_SeqNbr, 5);
          logDebug("New Restaurant Sequence: " + vSeqNbr);
          vYear = new Date().getFullYear().toString().substring(2);
          vNewCapAltID = vAppTypePrefix + vYear + "-" + vSeqNbr;
          logDebug("New Restaurant AltID: " + vNewCapAltID);
          if (!isNaN(vSeqNbr)){
              editLookup("LIC_FOOD_DEALER_ID_TRACKER", "RESTAURANT_FOOD_DEALER", vSeqNbr);
          }
  
      }
  
      if (vAppType == "Retail Items (snacks and beverages)") {
          // "FOOD-A$$yy$$-$$SEQ05$$";
          vAppTypePrefix = "FOOD-A"; //+ appRecIdSubString;
          vSC_Retail_SeqNbr = lookup("LIC_FOOD_DEALER_ID_TRACKER", "RETAIL_FOOD_DEALER");
  
          vSC_SeqNbr = parseInt(vSC_Value) + 1;
          var vSeqNbr = padZeros(vSC_SeqNbr, 5);
          logDebug("New Retail Sequence: " + vSeqNbr);
          vYear = new Date().getFullYear().toString().substring(2);
          vNewCapAltID = vAppTypePrefix + vYear + "-" + vSeqNbr;
          logDebug("New Retail AltID: " + vNewCapAltID);
          if (!isNaN(vSeqNbr)){
          editLookup("LIC_FOOD_DEALER_ID_TRACKER", "RETAIL_FOOD_DEALER", vSeqNbr);
          }
      }
  
      // Update the current AltId based on Retail Food Dealer / Restaurant Food Dealer 
      var updateResult = aa.cap.updateCapAltID(capId, vNewCapAltID);
      if (updateResult.getSuccess()) {
         logDebug("New Food Dealer Record Id: " + vNewCapAltID);
  
      }
  }





} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
// END SCRIPT TESTER



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


function padZeros(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}