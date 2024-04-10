/*------------------------------------------------------------------------------------------------------/
| Program : ACA_ABC_DOC_UPLOAD_BEFORE.js
| Event   : ACA BEFORE
|
| Usage   : Used to pre-populate contacts on amendment records from the amendment parent.
|
| Client  : N/A
| Action# : N/A
|
| Notes   : 167 require zoning map be uploaded if ASI Initial Application Type == New Outlet
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

//TESTING
// var testingCap = aa.cap.getCapID("23TMP-000005").getOutput();
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
    var capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
    var submittedDocList = aa.document.getDocumentListByEntity(capIdString, "TMP_CAP").getOutput().toArray();
    //aa.print(submittedDocList.length);
    //aa.print(capIDString);
    if (AInfo['New Application Type'] == 'New Outlet'){
        var documentMap = {};
        var missingDocs = [];
        var requiredDocuments = [
            "Zoning Map"
        ]
    
        for(var a in submittedDocList) {
            var docModel = submittedDocList[a];
            var docCategory = docModel.getDocCategory();
            documentMap[docCategory] = true;
            aa.print("Currently uploaded doc: " + docCategory)
        }
        requiredDocuments.sort();
        for(var b in requiredDocuments) {
            var requiredCategory = requiredDocuments[b];
            if(!documentMap[requiredCategory]) {
                missingDocs.push((parseInt(b, 10) + 1)+". "  + requiredCategory);
            }
        }
        if(missingDocs.length > 0) {
            showMessage = true;
            comment("The following documents are required: <br>");
            comment(missingDocs.join("<br>"))
            aa.print("The following documents are required: \n")
            aa.print(missingDocs.join("\n"))
            cancel = true;
        }

    }
   
	
} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}
// page flow custom code end


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

function exploreObject(objExplore) {
	aa.print("Methods:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) == "function") {
			aa.print(x);
			aa.print(objExplore[x]);
		}
	}
	aa.print("");
	aa.print("Properties:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) != "function") {
			aa.print(x + " : " + objExplore[x]);
		} 
	}
}