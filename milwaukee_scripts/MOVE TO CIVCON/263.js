
var myCapId = "BTR-AMD-24-000001";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConvertToRealCAPAfter";
/* IFA */ //var eventName = 'InvoiceFeeAfter' ; var InvoiceNbrArray = []
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
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

//TASK 263 - UPDATE LICENSE FROM AMENDMENT
if (wfTask == 'Issuance' && wfStatus == 'Issued'){
    try {

        var childApps = getChildren('*/*/*/*', capId);
    
        var changeLocation = AInfo["Change of Location"];
        var changeEntity = AInfo["Reorganization of Legal Entity"];
        var changeAgent = AInfo["Change of Agent"];
        var changeStock = AInfo["Transfer of Stock"];
    
        // changeLocation = 'No'
        // changeEntity = 'No'
        // changeAgent = 'No'
        // changeStock = 'Yes'
    
    
        childApps.forEach(function(app){
    
            logDebug('Process: ' + app.getCustomID())
            // if (app.getCustomID() != 'BFOOD-24-00042') {return};
    
                if (changeLocation == 'Yes'){
                    copyAppAddressesLocal(capId, app);
                    copyParcelsLocal(capId, app);
                    copyOwnerLocal(capId, app);
                }
        
                if (changeEntity == 'Yes'){
                    var srcEntityCSM = getContactByType_("Business Entity", capId)
                    var trgEntityCSM = getContactByType_("Business Entity", app)
    
                    if (srcEntityCSM && trgEntityCSM){
                        
                        srcEntityCSM = new contactObj(srcEntityCSM)
                        trgEntityCSM = new contactObj(trgEntityCSM)
                        trgEntityCSM.remove()
                        srcEntityCSM.replace(app);
                    }
     
     
                }
                
                if (changeAgent == 'Yes'){
                    var srcAgentCSM = getContactByType_("Agent-Sole Proprietor-1st Partner", capId)
                    var trgAgentCSM = getContactByType_("Agent-Sole Proprietor-1st Partner", app)
    
                    if (srcAgentCSM && trgAgentCSM){
                        srcAgentCSM = new contactObj(srcAgentCSM)
                        trgAgentCSM = new contactObj(trgAgentCSM)
                        trgAgentCSM.remove()
                        srcAgentCSM.replace(app);
                    }
                    }
        
                if (changeStock == 'Yes'){
                var srcShareholderArray = getContactArrByType_("Business Shareholder", capId, new Array())
                var trgShareholderArray = getContactArrByType_("Business Shareholder", app, new Array())
    
                if (trgShareholderArray && trgShareholderArray.length > 0){
                    trgShareholderArray.forEach(function (contact){
                        trgShareholder = new contactObj(contact)
                        trgShareholder.remove();
                    })
                }
    
                if (srcShareholderArray && srcShareholderArray.length > 0){
                    srcShareholderArray.forEach(function (contact){
                        srcShareholder = new contactObj(contact)
                        srcShareholder.replace(app);
                    })
                }
    
                }
    
    
    
    
    
        })
    
    
    
      } catch (err) {
        logDebug(err.message);
        logDebug(err.stack);
      };
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


/**
 * Deletes selected component from deleteFromCapId if keepExisting is true,<br/>flag 'keepExisting' is passed and checked in case it's coming from a settings source
 * @param deleteFromCapId capId to delete related APO from
 * @param keepExisting boolean, check if delete required
 * @param whichAPO which component to delete A: address P: Parcel O:Owner
 */
function deleteExistingAPO(deleteFromCapId, keepExisting, whichAPO) {
	if (keepExisting || whichAPO == null || whichAPO == "") {
		return;
	}

	if (whichAPO.equalsIgnoreCase("A")) {
		var addresses = aa.address.getAddressByCapId(deleteFromCapId, null);
		if (addresses.getSuccess()) {
			addresses = addresses.getOutput();
			for (a in addresses) {
				aa.address.removeAddress(deleteFromCapId, addresses[a].getAddressId());
			}
		}
	} else if (whichAPO.equalsIgnoreCase("P")) {
		var pbzns = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
		var capModelDeleteFrom = aa.cap.getCap(deleteFromCapId);
		if (capModelDeleteFrom.getSuccess()) {
			capModelDeleteFrom = capModelDeleteFrom.getOutput();
			capModelDeleteFrom = capModelDeleteFrom.getCapModel();
			pbzns.removeParcel(capModelDeleteFrom);
		}
	} else if (whichAPO.equalsIgnoreCase("O")) {
		var owners = null;
		owners = aa.owner.getOwnerByCapId(deleteFromCapId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			for (o in owners) {
				aa.owner.removeCapOwnerModel(owners[o]);
			}
		}
	}
}

  /**
 * Copy Addresses from Current record to Parent or Child records, Or from Parent to Current Record, based on copyDirection parameter
 * @param capIdsArray array of Parent or Child CapIdModel
 * @param copyTypes all or a bar separated values (group names, or types)
 * @param copyDirection Number: TO_PARENT = 1, FROM_PARENT = 2, TO_CHILD = 3
 * @returns {Boolean} true if success, false otherwise
 */
function copyAppAddressesLocal(srcCap, trgCap) {

		deleteExistingAPO(trgCap, false, "A");
        copyAddresses(srcCap, trgCap)

	return true;
}

function copyParcelsLocal(srcCap, trgCap) {

    //delete existing
		deleteExistingAPO(trgCap, false, "P");
		copyParcels(srcCap, trgCap);


	return true;
}






function copyOwnerLocal(srcCap, trgCap) {

		//delete existing
		deleteExistingAPO(trgCap, false, "O");
		var res = copyOwner_(srcCap, trgCap);

}

function copyOwner_(sCapID, tCapID) {
    try{
        aa.cap.getCap(sCapID);
        aa.cap.getCap(tCapID);
    } catch(err){
        logDebug("'copyOwner' requires both parameters for Source CAP and Target CAP");
        return;
    }
	var ownrReq = aa.owner.getOwnerByCapId(sCapID);
	if (ownrReq.getSuccess()) {
		var ownrObj = ownrReq.getOutput();
		if (ownrObj != null) {
			for (var xx in ownrObj) {
				ownrObj[xx].setCapID(tCapID);
				aa.owner.createCapOwnerWithAPOAttribute(ownrObj[xx]);
				logDebug("Copied Owner: " + ownrObj[xx].getOwnerFullName());
			}
		} else {
			logDebug("Error Copying Owner : " + ownrObj.getErrorType() + " : " + ownrObj.getErrorMessage());
		}
	} else {
		logDebug("Warning: No owners exist to copy");
	}
}


function getContactByType_(conType,capId) {

    var contactArray = getPeople(capId);

    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            return contactArray[thisContact];

    }
    return false;

}

function getContactArrByType_(conType,capId, tempContactArr) {

    var contactArray = getPeople(capId);

    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            tempContactArr.push(contactArray[thisContact]);

    }
    return tempContactArr;

}