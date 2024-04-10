/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BEFORE_REQ_DFI_DOC.js
| Event   : ACA BEFORE
||
| Client  : MILWAUKEE
| Action# : MKEBL-226
| Author : Jacob Clay (Byrne Software)
|
| Notes   : MKEBL-226, require DFI Registration if contact ASI criteria matches
| Notes   : MKEBL-219, require DFI Registration if contact ASI criteria matches
| Notes   : MKEBL-224, require DFI Registration if contact ASI criteria matches
| Notes   : MKEBL-225, require DFI Registration if contact ASI criteria matches
| Notes   : MKEBL-200, require DFI Registration if contact ASI criteria matches 
| Notes   : MKEBL-223, require Sellers Permit if ASI criteria matches 
| Notes   : MKEBL-227, require Sellers Permit if ASI criteria matches 

|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

// //TESTING

// var testingCap = aa.cap.getCapID("23TMP-000422").getOutput();
// var capModel = aa.cap.getCapViewBySingle4ACA(testingCap);
// var capTest = aa.env.setValue("CapModel", capModel);
// aa.env.setValue("CurrentUserID", "ADMIN");


var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
	currentUserID = "ADMIN";
	publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj)
    currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var parcelArea = 0;

var estValue = 0;
var calcValue = 0;
var feeFactor // Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput(); // Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
}

var balanceDue = 0;
var houseCount = 0;
feesInvoicedTotal = 0; // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
if (capDetailObjResult.getSuccess()) {
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
}

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
loadASITables();

logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
logDebug("capId = " + capId.getClass());
logDebug("cap = " + cap.getClass());
logDebug("currentUserID = " + currentUserID);
logDebug("currentUserGroup = " + currentUserGroup);
logDebug("systemUserObj = " + systemUserObj.getClass());
logDebug("appTypeString = " + appTypeString);
logDebug("capName = " + capName);
logDebug("capStatus = " + capStatus);
logDebug("sysDate = " + sysDate.getClass());
logDebug("sysDateMMDDYYYY = " + sysDateMMDDYYYY);
logDebug("parcelArea = " + parcelArea);
logDebug("estValue = " + estValue);
logDebug("calcValue = " + calcValue);
logDebug("feeFactor = " + feeFactor);

logDebug("houseCount = " + houseCount);
logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
logDebug("balanceDue = " + balanceDue);

// page flow custom code begin

try {
    //task 223
    checkSellersPermit();
	//task 227
	checkSellersPermitForTowing();
} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}

try {
    var capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
    var submittedDocList = aa.document.getDocumentListByEntity(capIdString, "TMP_CAP").getOutput().toArray();
    //aa.print(submittedDocList.length);
    //aa.print(capIDString);

    var requireDFIDoc = false;

	var capContacts = cap.getContactsGroup();
	var contactArray = new Array();

if (appMatch('Licenses/Transportation/*/Application') || appMatch('Licenses/Mobile Vendor/*/Application') || appMatch('ABC/Retail/*/Application') || appMatch('Licenses/Parking/*/Application') || appMatch('Licenses/Amusement/*/Application') || appMatch('Licenses/Business/*/Application')) { 

	if (capContacts){
		var contactsArray = capContacts.toArray();
		for (yy in contactsArray)
			{
				aa.print('');
				aa.print('New Contact');
				var contactModel = contactsArray[yy]; //capContactModel
				
				var contactType = getContactType(contactModel);
				logDebug('Contact Type: ' + contactType);
				if (contactType == 'Business Entity'){
					var asiTypeOwnership = getContactASI('Type of Ownership', contactModel);
					aa.print('asi type: ' + asiTypeOwnership)
					logDebug('asi type: ' + asiTypeOwnership)
	
					if (!matches(asiTypeOwnership, 'Sole Proprietorship', 'General Partnership')){
						aa.print('Business Entity Contact is not a Sole Proprietor or General Partnership');
					   //  addDFICondition = true;
						requireDFIDoc = true;
					   break
					   }
					  } else {
						continue
					  }
				}	   
			}
		
		if (requireDFIDoc){
			var dfiExists = false;
            aa.print('check docs for dfidoc')
			for (docs in submittedDocList) {
				submittedDocList[docs] = submittedDocList[docs].getDocCategory();
				if (submittedDocList[docs] == "DFI Registration") {
					dfiExists = true;
				}
			  }
	
			  if (dfiExists) {
				cancel = false;
				showMessage = false;
				message = "";
				comment(message);
			  }
			  else {
				cancel = true;
				showMessage = true;
				message += "<br><font color=red>Required Documents Missing: 'DFI Registration'" + "<br>" + "</font><br>";
				// message += debug;
				// comment(message);
			  }
		}
}


aa.print('Cancel after DFI Doc Check: ' + cancel)


	
} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}

try {
    if (appMatch("Licenses/Business/Cigarette & Tobacco/Application") || appMatch("Licenses/Business/Cigarette & Tobacco/Supplemental") || appMatch("Licenses/Business/Cigarette & Tobacco/Renewal")) {
        var docuScriptModel = aa.document.getDocumentListByEntity(capId.toString(), 'TMP_CAP');
        if (!docuScriptModel.getSuccess())
        {
            aa.env.setValue('ErrorMessage', docuScriptModel.getErrorMessage());
        }		
        var floorPlan = false;
        var wisconsinForm = false;
        var attachmentList = docuScriptModel.getOutput();
        var docModelArray = docuScriptModel.getOutput().toArray();
        var uploadedDocs = new Array();
    
        aa.print('Check Docs for floor plan and state of wisc. form')
        for ( docs in docModelArray )
        {
            uploadedDocs[docs] = docModelArray[docs].getDocCategory();
    
            if (uploadedDocs[docs] == "Plan - Floor Plan")
            {
                floorPlan = true;
            }
            else if (uploadedDocs[docs] == "State of Wisconsin Form")
            {
                wisconsinForm = true;
            }
        }
    
        if (floorPlan && wisconsinForm){
            cancel = false;
            showMessage = false;
            message = "";
            comment(message);
        } else if (!floorPlan && wisconsinForm) {
            cancel = true;
            showMessage = true;
            message += "<br><font color=red>Required Document Missing: 'Plan - Floor Plan'" + "<br>" + "</font><br>";
            comment(message);
        } else if (!wisconsinForm && floorPlan) {
            cancel = true;
            showMessage = true;
            message += "<br><font color=red>Required Document Missing: 'State of Wisconsin Form'" + "<br>" + "</font><br>";
            comment(message);
        } else {
            cancel = true;
            showMessage = true;
            message += "<br><font color=red>Required Documents Missing: 'State of Wisconsin Form' and 'Plan - Floor Plan'" + "<br>" + "</font><br>";
            comment(message);
        }
      }
      aa.print('Cancel after floor plan check: ' + cancel)

} catch(err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}

//TICKET 196 BEGIN
try {
    var capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
    var submittedDocList = aa.document.getDocumentListByEntity(capIdString, "TMP_CAP").getOutput().toArray();
    //aa.print(submittedDocList.length);
    //aa.print(capIDString);
    var reqSellersPermit = false;
if ((appMatch('Licenses/Transportation/Recycle Salvage Premises/*') && AInfo['Non-Consensual Towing'] == 'UNCHECKED' && (matches('CHECKED', AInfo['Junk Valuable Metal Dealing Storing or Transporting'], AInfo['Junk Valuable Metal Removing or Recycling'], AInfo['Waste Tires Dealing Storing or Transporting'], AInfo['Waste Tires Removing or Recycling'], AInfo['Salvaged Motor Vehicle Parts Dealing Storing or Transporting'], AInfo['Salvaged Motor Vehicle Parts Removing or Recycling']))) || (appMatch('Licenses/Transportation/Recycle Salvage Vehicle/*') && AInfo['Non-Consensual Towing – Repossession Only'] == 'CHECKED' && AInfo['Non-Consensual Towing – By Contract with Milwaukee'] != 'CHECKED')){
    reqSellersPermit = true;
}
		if (reqSellersPermit){
            aa.print('Check documents ')
			var sellersPermitExists = false;
            
			for (docs in submittedDocList) {
                aa.print(submittedDocList)
				submittedDocList[docs] = submittedDocList[docs].getDocCategory();
				if (submittedDocList[docs] == "Wisconsin Seller's Permit") {
                    aa.print('Require Wisc. Sellers Permit')
					sellersPermitExists = true;
				}
			  }

              aa.print('Sellers Permit Exists: ' + sellersPermitExists)
	
			  if (sellersPermitExists) {
				cancel = false;
				showMessage = false;
				message = "";
				comment(message);
			  }
			  else {
				cancel = true;
				showMessage = true;
				message += "<br><font color=red>Required Documents Missing: 'Wisconsin Seller's Permit'" + "<br>" + "</font><br>";
				// message += debug;
				// comment(message);
			  }
		}
    
} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}
//TICKET 196 END
// page flow custom code end
aa.print('cancel ' + cancel)
aa.print('Message: ' + message)

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
        //aa.print("Reached");
		aa.env.setValue("ErrorCode", "0");
		if (showMessage) {
            aa.env.setValue("ErrorMessage", message);
            //aa.print("Reached1");
        }
			
		if (showDebug) {
            aa.env.setValue("ErrorMessage", debug);
            //aa.print("Reached2");
        }
			
	}
}

function getContactASI(asiField, ccm) {
    var contact = ccm; //capContactModel
    var contactPeople = contact.getPeople()
    var genTemplateObj = contactPeople.getTemplate();
	if (genTemplateObj) {
        var formsResult = genTemplateObj.getTemplateForms().toArray();
        if (formsResult) {
            var asiResult = formsResult[0];
            var subGroups = asiResult.getSubgroups();
            for (var i = 0; i < subGroups.size(); i++) {
                var subGroup = subGroups.get(i);
                aa.print('SubGroup: ' + subGroup.getSubgroupName())
                var asiFields = subGroup.getFields();
                for (var fieldIndex = 0; fieldIndex < asiFields.size(); fieldIndex++) {
                    var field = asiFields.get(fieldIndex);
                    aa.print('asi Field: ' + field)
                    if (field.getFieldName() == asiField) {
                        return field.getChecklistComment()
                    }
                }
            }
        }
    } else {
		aa.print('Contact ASI Template is null, check contact fields');
		logDebug('Contact ASI Template is null, check contact fields');

	}
}

function getContactType(ccm){
	var person = ccm.getPeople();
    return person.getContactType()
}

function exploreObject(objExplore) {
	aa.print("Properties:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) != "function") {
			aa.print(x + " : " + objExplore[x]);
		} 
	}
	aa.print("");

	aa.print("Methods:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) == "function") {
			aa.print(x);
			aa.print(objExplore[x]);
		}
	}

}

function exploreObjectPageFlow(objExplore) {
	logDebug("Properties:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) != "function") {
			logDebug(x + " : " + objExplore[x]);
		} 
	}
	logDebug("");
	logDebug("Methods:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) == "function") {
			logDebug(x);
			logDebug(objExplore[x]);
		}
	}

}

function checkSellersPermit() {
    var requireSellersPermit= false;
    if (appMatch("Licenses/Business/Secondhand Motor Veh. Dealer/Application") || appMatch("Licenses/Business/Secondhand Motor Veh. Dealer/Renewal")) {
  
      if (AInfo['License Type'] == 'Retail'){
          requireSellersPermit = true;
      }
      
      if (requireSellersPermit) {
        var docuScriptModel = aa.document.getDocumentListByEntity(capId.toString(), 'TMP_CAP');
        if (!docuScriptModel.getSuccess()) {
          aa.env.setValue('ErrorMessage', docuScriptModel.getErrorMessage());
        }
  
        var permitAttachment = false;
        var attachmentList = docuScriptModel.getOutput();
        var docModelArray = docuScriptModel.getOutput().toArray();
        var uploadedDocs = new Array();
  
        for (docs in docModelArray) {
          uploadedDocs[docs] = docModelArray[docs].getDocCategory();
  
          if (uploadedDocs[docs] == "Wisconsin Seller's Permit") {
            permitAttachment = true;
          }
        }
  
        if (permitAttachment) {
          cancel = false;
          showMessage = false;
          message = "";
          comment(message);
        }
        else {
          cancel = true;
          showMessage = true;
          message = "<br><font color=red>Required Documents Missing: 'Wisconsin Seller's Permit'" + "<br>" + "</font><br>";
          // comment(message);
        }
      }
      }
}

function checkSellersPermitForTowing() {
    var requireSellersPermit= false;
    if (appMatch("Licenses/Transportation/Recycle Salvage Vehicle/Application")) {
  
      if (AInfo['Non-Consensual Towing – Repossession Only'] == 'CHECKED' && AInfo['Non-Consensual Towing – By Contract with Milwaukee'] != 'CHECKED'){
          requireSellersPermit = true;
      }
      
      if (requireSellersPermit) {
        var docuScriptModel = aa.document.getDocumentListByEntity(capId.toString(), 'TMP_CAP');
        if (!docuScriptModel.getSuccess()) {
          aa.env.setValue('ErrorMessage', docuScriptModel.getErrorMessage());
        }
  
        var permitAttachment = false;
        var attachmentList = docuScriptModel.getOutput();
        var docModelArray = docuScriptModel.getOutput().toArray();
        var uploadedDocs = new Array();
  
        for (docs in docModelArray) {
          uploadedDocs[docs] = docModelArray[docs].getDocCategory();
  
          if (uploadedDocs[docs] == "Wisconsin Seller's Permit") {
            permitAttachment = true;
          }
        }
  
        if (permitAttachment) {
          cancel = false;
          showMessage = false;
          message = "";
          comment(message);
        }
        else {
          cancel = true;
          showMessage = true;
          message = "<br><font color=red>Required Documents Missing: 'Wisconsin Seller's Permit'" + "<br>" + "</font><br>";
          // comment(message);
        }
      }
      }
}