var myCapId = 'BL-2024-7';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Status"; wfStatus = "New Contractor"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'; wfProcess = 'BLD'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
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

debug = ''
  logDebug('>>>>>>>> Start of script test');

  showDebug = true;
  publicUser = true;


  /**
   * TASK 22
   * Byrne Software
   * Initial Script - JCC
   */
  try {

    //This script will work if it is a New Contractor or if it is a Renewal.

    /**
     * New Contractor Registered
     *    Does a check to see if the Ref LP already exists, if it does will update with the current caps 
     * 
     */
    if (wfTask == 'Status' && (wfStatus == 'New Contractor' || wfStatus == 'Contractor Renewed')){
        logDebug('Begin Task 22 - Create Ref LP and Link to Record')
      eval(getScriptText('INCLUDES_LOGGING_BYRNE', null, null));

        var asiLic = loadASITable('LICENSE CATEGORY TYPE', capId);

        // var asitLicNum = 'TEST123456'
        // var asitLicType = 'Alarm II'
        // var asitBusName = 'Clay\'s Cabinets'

        if (asiLic){
    
          var asiExpirationDate = aa.date.parseDate(AInfo['Next Renewal Date']);
          var asiGLExpirationDD = aa.date.parseDate(AInfo['General Liability Expiration Date']);
          var asiWorkersCompExpDD = aa.date.parseDate(AInfo['Worker\'s Comp Expiration Date']);
          // var asiBusTaxExpDD =  aa.date.parseDate(AInfo['Business Tax Expiration Date']);

          var capContact = aa.people.getCapContactByCapID(capId);

          if (capContact.getSuccess()){
            logDebug('Getting Contact')
              capContact = capContact.getOutput();
              var capCCSM = capContact[0] // CapContactScriptModel
              var capContactPeople = capCCSM.getPeople();
              var vContactObj = new contactObj(capCCSM);
              var vRefSeqNbr = null;
              var s_publicUserResult ;
            if (vContactObj.refSeqNumber != null){
              vRefSeqNbr = vContactObj.refSeqNumber;
              s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(vRefSeqNbr));
            } 



      

              for (r in asiLic){
                  var tRow = asiLic[r];
                  var vCategory = tRow['Category Type'].toString();
                  var vLicNumber = tRow['License Number'].toString();
                  var vBusName = tRow['Business Name'].toString();
                  logDebug('Review License: ' + vLicNumber + ' <br>Category: ' + vCategory)

                  vContactObj.editName(vContactObj.people.FirstName, vContactObj.people.MiddleName, vContactObj.people.LastName, vContactObj.people.fullName, vBusName, vBusName )


                  var updateLP = getRefLicenseProf(vLicNumber, vCategory)

                  var createSuccess = false;

                  //if LP already exists, don't attempt to create a new one or an error occurs
                  if (!updateLP){
                    createSuccess = vContactObj.createRefLicProf(vLicNumber, vCategory, null, 'FL');
                  } else {
                    vContactObj.syncCapContactToReference();
                  }



                logDebug('Created Ref LP: ' + createSuccess)
                  var refLicList = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), vLicNumber)

                  if(refLicList.getSuccess()){
                    refLicList = refLicList.getOutput();

                    for (i in refLicList){
                      var refLP = refLicList[i];

                      addr = capContactPeople.getContactAddressList()

                      if (addr){
                        addr = addr.toArray()[0]
                      }

                      if (refLP.getLicenseType() != vCategory) continue;

                      refLP.setContactFirstName(capContactPeople.getFirstName());
                      refLP.setContactMiddleName(capContactPeople.getMiddleName());
                      refLP.setContactLastName(capContactPeople.getLastName());
                      
                      refLP.setBusinessLicExpDate(asiExpirationDate);
                      refLP.setLicenseExpirationDate(asiExpirationDate);
                      refLP.setInsuranceExpDate(asiGLExpirationDD);
                      refLP.setWcExpDate(asiWorkersCompExpDD);
                      refLP.setBusinessName(vBusName);
					            refLP.setBusinessLicense(vLicNumber);
                      var today = new Date(aa.util.now());
                      refLP.setLicenseIssueDate(sysDate);
                      refLP.setLicOrigIssDate(sysDate);

                      if (addr){
                        refLP.setAddress1(addr.getAddressLine1());
                        refLP.setAddress2(addr.getAddressLine2());
                        refLP.setAddress3(addr.getAddressLine3());
                        refLP.setCity(addr.getCity());
                        refLP.setState(addr.getState());
                        refLP.setZip(addr.getZip());
                      }

                      refLP.setPhone1(capContactPeople.getPhone1());
                      refLP.setPhone2(capContactPeople.getPhone2());
                      refLP.setPhone3(capContactPeople.getPhone3());
                      refLP.setEMailAddress(capContactPeople.getEmail());
      

                      var updateLP = aa.licenseScript.editRefLicenseProf(refLP);

                      if (updateLP.getSuccess()){
                        logDebug('Updated Address and Expirations of Ref LP: ' + vLicNumber + ' ' + vCategory)
                      }

                    }
                  }

                  //Copy Ref LP to Record - if already linked it will not link again
                   var licObj = new licenseProfObject(vLicNumber, vCategory, capId);
                   var copySuccess = licObj.copyToRecord(capId, true)         
  
                  if (createSuccess && copySuccess){
                    logDebug('Contractor, ' +vLicNumber +' created and linked')

                      logMessage('Contractor, ' +vLicNumber +' created and linked')
                  } else if (createSuccess && !copySuccess){
                    logDebug('Contractor, ' +vLicNumber +' was created but not linked')
                      
                    logMessage('Contractor, ' +vLicNumber +' was created but not linked', 'WARNING')

                  } else if (!createSuccess && copySuccess){
                    logDebug('Contractor, ' +vLicNumber +' was not created but was linked to the record')

                      logMessage('Contractor, ' +vLicNumber +' was not created but was linked to the record', 'WARNING')
                  } else if (!createSuccess && !copySuccess){
                    logDebug('Contractor, ' +vLicNumber +' was not created and was not linked to the record. Contractor may already exist')

                    logMessage('Contractor, ' +vLicNumber +' was not created and was not linked to the record. Contractor may already exist', 'WARNING')
                  }
            
                  //Link Ref LP to Public User
                    if (vRefSeqNbr != null && s_publicUserResult.getSuccess()){
                      var pubUserModel = s_publicUserResult.getOutput().toArray()[0];
                      var licenseScriptModel = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), vLicNumber).getOutput()[0];
                      var linkResult = aa.licenseScript.associateLpWithPublicUser(pubUserModel, licenseScriptModel);
                      if (linkResult.getSuccess()){
                        logDebug('Linked Ref LP to Ref Contact and Public User')
                      } else {
                        logDebug('There was an error linking the Ref LP to the Public User, they may already be linked')
                      }
                      
                  }          
                  
    
              }
          }
  }
   else {
      logDebug('Licence Category ASIT is empty, can\'t create LP')
   }
 }
   
  } catch(err){
    logDebug(err)
    aa.print(err)
  } finally {
    logDebug('End Task 22 - Create Ref LP and Link to Record')
    showDebug = false;
    showMessage = true;
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



