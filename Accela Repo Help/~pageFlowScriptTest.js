/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BLD_COMM_DOC_BEFORE.js
| Event   : ACA AFTER (AFTER)
|
| Usage   : Used to pre-populate contacts on amendment records from the amendment parent.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
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
// var testingCap = aa.cap.getCapID("23TMP-000044").getOutput();
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
	logDebug('>>>start of page flow script')


	var asiSolarAppId = AInfo['SolarApp ID'];
	var isValidAppId = validateMask(asiSolarAppId, "aa00000000-0-00-0-a");

	if (!isValidAppId && ((AInfo['Type of Use'] == '1 - 2 Family Dwelling') || (matches(AInfo['Type of Use'], 'Other', 'Accessory Building') && matches(AInfo['Category of Use'], 'Residential')))){
		showMessage = true;
		comment('The SolarApp ID you entered is not valid number, the number should match the following pattern aa00000000-0-00-0-a')
		cancel = true;

	}




} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}
// page flow custom code end
// aa.env.setValue("ScriptReturnCode", "1");
// aa.env.setValue("ScriptReturnMessage", debug)




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

/* @desc This method is used to get contact model for ACA based on contact type.
 *
 */
function getContactByType4ACA(conType) {
	var capContactArray = cap.getContactsGroup().toArray() ;
 
	for(thisContact in capContactArray) {
	   if((capContactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())
		  return capContactArray[thisContact].getPeople();
	}
 
	return false;
 }
 

 /**
 * This function takes a string and a mask and returns true if the string
 * matches the mask or false if it doesn't match. The function also insures
 * the input variables are strings before proceeding.
 * 
 * First check is to make sure the mask and the string are the same length.
 *
 * The function then takes each character in the string and compares it to
 * the mask. The mask takes a 0 (zero) value for a number, an 'a' for a string. 
 * Any  * other characters are the static mask and should match exactly.
 *
 * @example
 * str = 2021-15-2Z 45-45-45
 * mask = 0000-00-00 00-00 00
 * would return false since the 10th character in the string is a character
 * and not a number and the 17th character should be a space and not a dash.
 *
 * @param {string} str - input parameter string to compare to the mask.
 * @param {string} mask - input parameter string to indicate if the string input
 * parameter should be a number, a string, or an exact match to the mask.
 * @return {boolean} - true if the input string parameter matches the mask, 
 * false if any of the string parameter doesn't match.
 */
 function validateMask(str, mask) {
    var title = "validateMask(): ";

    str = String(str);
    mask = String(mask);

    if (str.length != mask.length) {
        aa.print(title + "string length doesn't match mask length.");
        return false;
    }
    for (var i = 0; i < mask.length; i++) {
        var thisMask = mask[i] + "";
        var thisStr = str[i] + "";
        if (thisMask === str[i]) {
            continue;
        } else if (thisMask === "0") {
            var test = parseInt(thisStr, 10);
            if (!isNaN(test)) {
                continue;
            } else {
                aa.print(title + "input at position " + i + " doesn't match the mask.");
                return false;
            }
        } else {
            if (thisMask == "a" && typeof thisStr == "string") {
                continue;
            } else {
                aa.print(title + "input at position " + i + " doesn't match the mask.");
                return false;
            }
        }
    }
    return true;
}