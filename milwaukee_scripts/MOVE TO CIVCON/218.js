/*------------------------------------------------------------------------------------------------------/
| Program : ACA_LIC_PAGEFLOW_SHD_SECURITY_BEFORE.js
| Script Code: 	ACA_LIC_PAGEFLOW_SHD_SECURITY_BEFORE
| Script Title: ACA_LIC_PAGEFLOW_SHD_SECURITY_BEFORE
| Event   : ACA_BEFORE_BUTTON Event
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Author  : Jacob Clay
| Notes   : This script ensures that at least one custom field per group has a value.
|         
|
|------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
|------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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

function getScriptText(vScriptName, servProvCode, useProductScripts) {
  if (!servProvCode) servProvCode = aa.getServiceProviderCode();
  vScriptName = vScriptName.toUpperCase();
  var emseBiz = aa.proxyInvoker
    .newInstance("com.accela.aa.emse.emse.EMSEBusiness")
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
        "ADMIN"
      );
    }
    return emseScript.getScriptText() + "";
  } catch (err) {
    return "";
  }
}

if (SA) {
  eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, true));
  eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, true));
  eval(getScriptText(SAScript, SA, true));
} else {
  eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
  eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var controlString = "Before Template"; // Standard choice for control
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var useAppSpecificGroupName = false;
var cancel = false;

/*------------------------------------------------------------------------------------------------------
    | END User Configurable Parameters
    |-----------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var cUserId = aa.env.getValue("CurrentUserID");
var capModel = aa.env.getValue("CapModel");
var cap = capModel;
var capId = capModel.getCapID();
var asiGroups = capModel.getAppSpecificInfoGroups();

var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
  currentUserID = "ADMIN";
  publicUser = true;
} // ignore public users

var applicantType = null;

var contactArray = cap.getContactsGroup().toArray();
var servProvCode = capId.getServiceProviderCode();
var capIDString = capId.getCustomID();
var capIDString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
var appTypeResult = cap.getCapType();
var appTypeAlias = appTypeResult.getAlias();
var appTypeString = appTypeResult.toString();
var appTypeArray = appTypeString.split("/");

// Main Loop
try {
  var vMessage = "";
  var AInfo = new Array(); // Create array for tokenized variables
  loadAppSpecific4ACA(AInfo);

  /*--------------------------------------------------------------------------------------------------------
  |  Based on the Type of Transfer;
  |  - diaply next steps and page; otherwise hide the next step.
  /--------------------------------------------------------------------------------------------------------*/
  if (appMatch("Licenses/Business/Secondhand Dealer/Application") || appMatch("Licenses/Transportation/Limousine Service/Renewal")) {
    var otherClothing = AInfo["Other clothing that is prohibited"];
    var neatClean = AInfo["Neat and clean clothing"];
    var wellGroomed = AInfo["Well groomed"];
    var hairTrimmed = AInfo["Hair neatly trimmed"];
    var statementPolicies = AInfo["Statement of written policies is attached"];
    var otherPolicies = AInfo["Other written policies for drivers"];

    if (otherClothing == "" && neatClean != "CHECKED" && wellGroomed != "CHECKED" && hairTrimmed != "CHECKED" && statementPolicies != "CHECKED" && otherPolicies == "") {
      cancel = true;
      showMessage = true;
      vMessage = "<font color=red>Please check at least one field or enter a value under Plan of Operations Appearance section." + "<br>" + "</font>";
      comment(vMessage);
    }
  }

} catch (error) {
  aa.env.setValue("ErrorCode", "1");
  aa.env.setValue("ErrorMessage", error.message);
}

/*------------------------------------------------------------------------------------------------------/
    | <===========END=Main=Loop================>
    /-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0 || debug.substring(0, 7) == "**ERROR") {
  showDebug = true;
  aa.env.setValue("ErrorCode", "1");
  aa.env.setValue("ErrorMessage", debug);
} else {
  if (cancel) {
    aa.env.setValue("ErrorCode", "-2");
    if (showMessage) aa.env.setValue("ErrorMessage", message);
    if (showDebug) aa.env.setValue("ErrorMessage", debug);
  } else {
    aa.env.setValue("ErrorCode", "0");
    if (showMessage) aa.env.setValue("ErrorMessage", message);
    if (showDebug) aa.env.setValue("ErrorMessage", debug);
  }
}

/*------------------------------------------------------------------------------------------------------/
    | <===========External Functions (used by Action entries)
    /------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
    | Custom Functions (End)
    /------------------------------------------------------------------------------------------------------*/
function loadAppSpecific4ACA(thisArr) {
  //
  // Returns an associative array of App Specific Info
  // Optional second parameter, cap ID to load from
  //
  // uses capModel in this event

  var itemCap = capId;
  if (arguments.length >= 2) {
    itemCap = arguments[1]; // use cap ID specified in args

    var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

    for (loopk in fAppSpecInfoObj) {
      if (useAppSpecificGroupName)
        thisArr[
          fAppSpecInfoObj[loopk].getCheckboxType() +
          "." +
          fAppSpecInfoObj[loopk].checkboxDesc
        ] = fAppSpecInfoObj[loopk].checklistComment;
      else
        thisArr[fAppSpecInfoObj[loopk].checkboxDesc] =
          fAppSpecInfoObj[loopk].checklistComment;
    }
  } else {
    var capASI = cap.getAppSpecificInfoGroups();
    if (!capASI) {
      logDebug("No ASI for the CapModel");
    } else {
      var i = cap.getAppSpecificInfoGroups().iterator();

      while (i.hasNext()) {
        var group = i.next();
        var fields = group.getFields();
        if (fields != null) {
          var iteFields = fields.iterator();
          while (iteFields.hasNext()) {
            var field = iteFields.next();

            if (useAppSpecificGroupName)
              thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] =
                field.getChecklistComment();
            else thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
          }
        }
      }
    }
  }
}

function appMatch(ats) {
  // optional capId or CapID string
  var matchArray = appTypeArray; //default to current app
  if (arguments.length == 2) {
    matchCapParm = arguments[1];
    if (typeof matchCapParm == "string")
      matchCapId = aa.cap.getCapID(matchCapParm).getOutput(); // Cap ID to check
    else matchCapId = matchCapParm;
    if (!matchCapId) {
      logDebug(
        "**WARNING: CapId passed to appMatch was not valid: " + arguments[1]
      );
      return false;
    }
    matchCap = aa.cap.getCap(matchCapId).getOutput();
    matchArray = matchCap.getCapType().toString().split("/");
  }

  var isMatch = true;
  var ata = ats.split("/");
  if (ata.length != 4)
    logDebug(
      "**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " +
      ats
    );
  else
    for (xx in ata)
      if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
        isMatch = false;
  return isMatch;
}

function matches(eVal, argList) {
  for (var i = 1; i < arguments.length; i++) {
    if (arguments[i] == eVal) {
      return true;
    }
  }
  return false;
}
    // EOF