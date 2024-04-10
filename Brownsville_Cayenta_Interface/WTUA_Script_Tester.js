var myCapId = '2024-00124';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Permit Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter";  wfTask = "Application Intake"; wfStatus = "Accepted - Plan Review Not Req"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
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


  forWTUA()

  showDebug = true
showMessage = false;

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




function forWTUA(){
  eval(getScriptText('BPUB_INTERFACE_FUNCTIONS', null, null));

  var asiTempPole = getAppSpecific('Is there a temporary pole?'); //Yes No field
  var asiDisconnect = getAppSpecific('Will this require a Disconnect/Reconnect');
  var asiWorkingClearance = getAppSpecific('Do you have a working clearance?')
  var asiTypeOfWork = getAppSpecific('Type of Work')

/**
 * add fees regardless of provider
 */


if(!feeExists('BLDGCOMELC01')){
  showDebug = false;
  showMessage = true;
  addFee('BLDGCOMELC01', 'BLDG_COM_ELC', 'FINAL', 1, 'N')
  logMessage('Fee Added - Electrical Permit')

}


if (asiTempPole == 'Yes' && !feeExists('BLDGCOMELC10')){
  showDebug = false;
  showMessage = true;
  addFee('BLDGCOMELC10', 'BLDG_COM_ELC', 'FINAL', 1, 'N')
  logMessage('Fee Added - Temporary Pole')
}

// if (asiDisconnect == 'Yes' && !feeExists('BLDGCOMELC01')){
//   addFee('BLDGCOMELC01', 'BLDG_COM_ELC', 'FINAL', 1, 'N')
// }

if (asiWorkingClearance == 'Yes' && !feeExists('BLDGCOMELC05')){
  showDebug = false;
  showMessage = true;
  addFee('BLDGCOMELC05', 'BLDG_COM_ELC', 'FINAL', 1, 'N')
  logMessage('Fee Added - Working Clearance')

}

var asiCircuits = getAppSpecific('Number of Circuits')


if (asiCircuits > 0 && !feeExists('BLDGCOMELC03')){
  showDebug = false;
  showMessage = true;
  addFee('BLDGCOMELC03', 'BLDG_COM_ELC', 'FINAL', asiCircuits, 'N')
  logMessage('Fee Added - Circuits Fee')

}


    
  if ((wfTask == 'Application Intake' && wfStatus == 'Accepted - Plan Review Not Req') || (wfTask == 'Plans Coordination' && wfStatus == 'Ready to Issue') && getAppSpecific('Provider') == 'BPUB' && (asiTempPole == 'Yes' || asiDisconnect == 'Yes' || asiWorkingClearance == 'Yes')){    
  
      var asiNumberMeters = getAppSpecific('Number of Meters');
      var asiAmps = getAppSpecific('Meter Loop Amps')
  
      logDebug('Number of Meter: ' + asiNumberMeters)
      //IF ONLY ONE CONNECTION and the METERS table is empty, fill it in
      if (asiNumberMeters == '1') {
         var meterInfoASIT = loadASITable('METERS');
  
         if (!meterInfoASIT){
          //T-POLE
          if (asiTempPole == 'Yes'){
            var newRow = [];
            newRow['Amperage Per Meter'] = new asiTableValObj('Amperage Per Meter', '', 'N')
            newRow['Connection Type'] = new asiTableValObj('Connection Type', 'TEMP', 'N')
            newRow['Quantity'] = new asiTableValObj('Quantity', '1', 'N')
            addToASITable('METERS',newRow, capId)
            logMessage('TEMP Connection Added to Meter Information Data Table')
            logDebug('TEMP Connection Added to Meter Information Data Table')




            showDebug = false;
            showMessage = true;
          }
  
          //Disconnect/Reconnect
          if (asiDisconnect == 'Yes'){
            var newRow = [];
            newRow['Amperage Per Meter'] = new asiTableValObj('Amperage Per Meter', asiAmps, 'N')
            newRow['Connection Type'] = new asiTableValObj('Connection Type', 'PERM', 'N')
            newRow['Quantity'] = new asiTableValObj('Quantity', '1', 'N')
            addToASITable('METERS',newRow, capId)
            logMessage('PERM Connection added to Meter Information Data Table. Data Fields')
            logDebug('PERM Connection added to Meter Information Data Table. Data Fields')

            showDebug = false;
            showMessage = true;
          }
  
          //Working Clearance
          if (asiWorkingClearance == 'Yes'){
            var newRow = [];
            newRow['Amperage Per Meter'] = new asiTableValObj('Amperage Per Meter', asiAmps, 'N')
            newRow['Connection Type'] = new asiTableValObj('Connection Type', 'CLEAR', 'N')
            newRow['Quantity'] = new asiTableValObj('Quantity', '1', 'N')
            addToASITable('METERS',newRow, capId)
            logMessage('CLEAR Connection Added to Meter Information Data Table')
            logMessage('CLEAR Connection Added to Meter Information Data Table')

            showDebug = false;
            showMessage = true;
          }
         }
      }    
      // if Tpole = Yes, and there is not yet a row for it, add tpole to meter information 
      if (asiTempPole == 'Yes'){
        // check to see if Tpole is added to Meter Info ASIT
        var meterInfoASIT = loadASITable('METERS');

        var tempExists = false;

        if (meterInfoASIT){
          for (r in meterInfoASIT){
            var row = meterInfoASIT[r]
            logDebug(row['Connection Type'])
            var rConnTp = row['Connection Type']
            if (rConnTp == 'TEMP'){
              tempExists = true;
            }
          }
        }

        logDebug(tempExists)
        if (!tempExists){
          
          var newRow = [];
          newRow['Amperage Per Meter'] = new asiTableValObj('Amperage Per Meter', '', 'N')
          newRow['Connection Type'] = new asiTableValObj('Connection Type', 'TEMP', 'N')
          newRow['Quantity'] = new asiTableValObj('Quantity', '1', 'N')
          addToASITable('METERS',newRow, capId)
          logMessage('TEMP Connection Added to Meter Information Data Table')
          showDebug = false;
          showMessage = true;
        }

      }


      /**
       * ADD METER LOOP FEES BASED OFF ASIT
       */

      if (!feeExists('BLDGCOMELC02')){
        var meterInfoASIT = loadASITable('METERS');

        if (meterInfoASIT){
          logDebug('Loop through Meter Information table and add fee')
          for (i in meterInfoASIT){
              row = meterInfoASIT[i];
              connectionTp = row['Connection Type'];
              if (connectionTp == 'TEMP') {
                continue;
              }

              quantity = row['Quantity'];
              amps = row['Amperage Per Meter'];

              count = 0;
              while (count < quantity){
                var qt = count + 1;

                addFeeWithExtraData('BLDGCOMELC02', 'BLDG_COM_ELC', 'FINAL', amps, 'N', capId, 'Connection Type: ' + connectionTp + ' Amps: ' + amps + ' Count: ' + qt + '/'+quantity, null, null)
                count++;
            }
          }
      }

      }

showDebug = false;
showMessage = true;
debug = ''
  }
  
  
  if (wfTask == 'Permit Issuance' && wfStatus == 'Issued' && getAppSpecific('Provider') == 'BPUB' && (asiTempPole == 'Yes' || asiDisconnect == 'Yes' || asiWorkingClearance == 'Yes')){    
  
      try {
      
          eval(getScriptText('BPUB_INTERFACE_FUNCTIONS', null, null));
        
          var asiTempPole = getAppSpecific('Is there a temporary pole?'); //Yes No field
          var asiDisconnect = getAppSpecific('Will this require a Disconnect/Reconnect');
          var asiWorkingClearance = getAppSpecific('Do you have a working clearance?')
          var asiTypeOfWork = getAppSpecific('Type of Work')
        
          if ((isTaskActive('Permit Issuance') || taskStatus('Permit Issuance') == 'Issued' ) && balanceDue <= 0 && getAppSpecific('Provider') == 'BPUB' && (asiTempPole == 'Yes' || asiDisconnect == 'Yes' || asiWorkingClearance == 'Yes')){    
        
            // Create BPUB Project
            var prjNo = getBPUBProjectNo();
            var prjFdesc = getBPUBProjectFDesc();
            var prjSdesc = getBPUBProjectSDesc();
            var prjExpDD = getBPUBExpDate();
            var prjComments = getBPUBProjectComments();
        
            var prjResult = addPermitProject(prjNo, prjFdesc, prjSdesc, prjExpDD, prjComments, capId)
            if (prjResult) {
              createCayentaPermits(prjNo);
            }

              logDebug('Initializing Account Info script');
              var Provider = AInfo["Provider"];
              var accountName = AInfo["Account Name"];
              var accountNum = AInfo["ESID# or Account Number"];
              var work = AInfo["Type of Work"];
      
                  if (work == "Pool Install" || work == "Wiring Repairs" || Provider == 'BPUB') {
                      resultWorkflowTask("Account Info Entry", "Info Not Required", "Updated by Script - PRA", "");
                  
                  } else if (Provider == 'AEP' && accountName.length >= 8 && accountNum.length == 17){
                      resultWorkflowTask("Account Info Entry", "Account Info Added" , "Updated by script - PRA", "");  
          
                  } else if (Provider =='Magic Valley' && accountName.length >= 8 && accountNum.length == 10) {
                      resultWorkflowTask("Account Info Entry", "Account Info Added" , "Updated by script - PRA", "");
      }
            
            
            if (!publicUser){
                showDebug = false;
                showMessage = true;
            }
        }
        } catch (err) {
             logDebug("An error occurred in PRA:BUILDING/*/ELECTRICAL/NA: " + err.message);
             logDebug(err.stack);
         }
  }
  

}