var myCapId = "PAS-A24-00001";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ var eventName = "ConverToRealCAPAfter";
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


  /**
   * Get records associated to Business Entity. If contacts don't match on current CAP, place a condition and list the records where the contacts don't match
   */

  var contactBusinessEntity = getContactByType('Business Entity', capId)
  // var businessEntityID = 
  var capPeople = getPeople(capId);
  // exploreObject(capPeople[0].getPeople())


  // var isExistedPeople = capPeople[0].getPeople(); //PeopleMOdel

  // var isExisted = aa.people.isExisted(capId, isExistedPeople)
  // exploreObject(isExisted)


  logDebug('Number of contacts: ' + capPeople.length)

  for (i in capPeople){
    var capPerson = capPeople[i]
    var capPeopleModel = capPerson.getPeople(); //PeopleModel
    var contactType = capPeopleModel.getContactType();
    if(contactType != 'Business Entity'){
      continue;
    }

    var capContactModel = capPerson.getCapContactModel();
    var refNumber = capContactModel.getRefContactNumber();

    // Step 1 - get the records associated with the Business Entity
    var psm = aa.people.createPeopleModel().getOutput()
    psm.setContactSeqNumber(refNumber);
    var cResult = aa.people.getCapIDsByRefContact(psm);  

    if (cResult.getSuccess()){
      var capsToSearch = cResult.getOutput(); 

      //for testing
      var vCap = capsToSearch[0];
      var vCapIdModel = vCap.getCapID()
      var vCapPeople = aa.people.getCapContactByCapID(vCapIdModel).getOutput()
      // exploreObject(vCapPeople[0])
      // exploreObject(capPeople)
      //end for testing

      var contactsMatch = true;
      var recordMismatch = new Array()
      var reasonMessage = ''

      for (i in capsToSearch){
        var vCap = capsToSearch[i]; //CapIDScriptModel
        var vCapIdModel = vCap.getCapID()
        var vCapScriptModel = aa.cap.getCap(vCapIdModel).getOutput();
        var vCapModel = vCapScriptModel.getCapModel();
        var vCapAltId = vCapModel.getAltID();
        logDebug('Comparing contacts on ' + vCapAltId)

        //Step 2 - get the contacts for each cap, if they do not match then add the Alt ID to recordMistmatch array
        var vCapPeople = aa.people.getCapContactByCapID(vCapIdModel).getOutput();
        logDebug('Number of contacts: ' + vCapPeople.length)

        //First Check
        if (vCapPeople.length != capPeople.length){
          logDebug('Number of contacts do not match, add to array')
          recordMismatch.push(vCapAltId)
          if (capPeople.length < vCapPeople.length){
            reasonMessage += '<br>There are more contacts on ' + capIDString;
          } else {
            reasonMessage += '<br>There are more contacts on ' + vCapAltId;
          }
          // continue;
        }

        //Second Check - Compare first name and last name
        logDebug('Compare Names')

        for (i in vCapPeople){
          var vCapPerson = vCapPeople[i];
          var vCapPersonPeopleModel = vCapPerson.getPeople()
          var existsOnOG = aa.people.isExisted(capId,vCapPersonPeopleModel)

          exploreObject(existsOnOG)


        }


      }

      if (recordMismatch.length > 0){
        logDebug('There is a discrepancy in contacts on the following records: ' + recordMismatch.join(', '))
        logDebug(reasonMessage)
      }  else {
        logDebug('Contacts appear to match')
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




function exploreObject(objExplore) {
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
  logDebug('');

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
}


