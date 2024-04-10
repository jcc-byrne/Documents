/* -------------------------------------------------------------------------------------------------
| Program  : BATCH_WFTASK_DUE_TODAY
| Trigger  : Batch
| Client   : St. Cloud, MN
| Script ID: 67
| Frequency: Annual
|
| Desc: The batch script to notify the license holder that they need to renew
|
| Batch Requirements :
| - None
| Batch Options:
| - None
|
|
| ------------------------------------------------------------------------------------------------------ */
var SCRIPT_VERSION = 3.0;

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
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

var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

var sysDate = aa.date.getCurrentDate();
// Global variables
var batchStartDate = new Date();
// System Date
var batchStartTime = batchStartDate.getTime();
var startTime = batchStartTime;
// Start timer
var timeExpired = false;

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var runDate = new Date();

//
//JCC Where is DueDaysFromToday defined in the environment? For Evanston we will update this to 0
//



var dueDaysFromToday = 0;
var startDueDate = aa.date.parseDate(dateAdd(null, dueDaysFromToday));
var jsToday = new Date(dateAdd(null, 0));
var endDueDate = aa.date.parseDate(dateAdd(null, dueDaysFromToday));


//
var recs4PartArray = ["Enforcement/Rental License/NA/NA"];

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/


/* ------------------------------------------------------------------------------------------------------ /
| main
/ ------------------------------------------------------------------------------------------------------ */
var capId;
var altId;

var totalRecs = 0;

var emailFrom = "CityofStCloudNoReply@accela.com";

try {
    aa.print("Batch started on " + new Date() + br);

    aa.print("Processing Batch Script - Notify License Holders... " + dateAdd(null, dueDaysFromToday) + br)

    //Loop through the 4part array for record where this batch applies to
    for (eachRecType in recs4PartArray) {
        var appTypeString = recs4PartArray[eachRecType];
        // Example: appTypeString = "Planning/Planning/Annexation/NA"
        aa.print("app Type string == " + appTypeString + br);


        var appTypeArray = appTypeString.split("/");

        //set capModel
        var capModelEmpty = aa.cap.getCapModel().getOutput();
        var capTypeModelEmpty = aa.cap.getCapTypeModel().getOutput();


        capTypeModelEmpty.setGroup(appTypeArray[0]);
        capTypeModelEmpty.setType(appTypeArray[1]);
        capTypeModelEmpty.setSubType(appTypeArray[2]);
        capTypeModelEmpty.setCategory(appTypeArray[3]);

        capModelEmpty.setCapType(capTypeModelEmpty);


        var getCapIdsList = aa.cap.getCapIDListByCapModel(capModelEmpty);
        var capIds = null;

        if (getCapIdsList.getSuccess()) {
            capIds = getCapIdsList.getOutput();
        } else {
            aa.print("**ERROR getting capIds: " + getCapIdsResult.getErrorMessage());
        }
        exploreObject(capIds[20])

        //Process earch record
        for (eachRec in capIds) {
            var capIdModel = capIds[eachRec];
            var capId = capIdModel.getCapID();
            var altId = capId.getCustomID();


            aa.print('Alt ID: ' + altId);

            //TO DO - if cap has primary contact with an email address

            //TO DO - run report License Renewal and attach to email

        }


        aa.print("_______________________________________________________________________________" + br);
        //
        //JCC added
        aa.print("Total records with active reviews due today: " + totalRecs + br);
        //aa.print("Total records with active reviews due soon: " + totalRecs + br);
        aa.print("Run Time: " + elapsed() + br);
        aa.print("_______________________________________________________________________________" + br);
    }
}
catch (err) {
    aa.print("ERROR on batch BATCH_SEND_LICENSE_NOTICE: " + err + " At: " + err.lineNumber);
}
/* ------------------------------------------------------------------------------------------------------ /
| Internal Functions and Classes (Used by this script)
/ ------------------------------------------------------------------------------------------------------ */

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - batchStartTime) / 1000)
}


//JCC - this is not called above
function emailPerson(optionsEmail) {
    var settings = {
        from: emailFrom,
        to: '',
        cc: '',
        subj: '',
        body: '',
        files: []
    };
    for (var attr in optionsEmail) { settings[attr] = optionsEmail[attr]; }

    var emailResult;
    if (settings.files.length === 0) {
        emailResult = aa.sendMail(settings.from, redirectEmail.length > 0 ? redirectEmail : settings.to, redirectEmail.length > 0 ? redirectEmail : settings.cc, settings.subj, redirectEmail.length > 0 ? "to: " + settings.to + "<br />cc: " + settings.cc + "<br /><br />" + settings.body : settings.body);
    } else {
        aa.print("utils.email.emailPerson(): Sending email with attachments.");
        emailResult = aa.sendEmailWithAttachedFiles(settings.from, redirectEmail.length > 0 ? redirectEmail : settings.to, redirectEmail.length > 0 ? redirectEmail : settings.cc, settings.subj, redirectEmail.length > 0 ? settings.to + "<br />cc: " + settings.cc + "<br /><br />" + settings.body : settings.body, settings.files);
    }
    aa.print(emailResult.getSuccess() ? "Email sent to " + settings.to + ", cc " + settings.cc + "." + br : "System failed send report to " + settings.to + " because mail server is broken or report file size is great than 5M." + br)
    return emailResult;
};



function exploreObject(objExplore) {
    aa.print("Methods:");
    for (var x in objExplore) {
        try {
            if (typeof (objExplore[x]) === "function") {
                aa.print("<font color=blue><u><b>" + x + "</b></u></font> ");
                aa.print("   " + objExplore[x] + "<br>");
            }
        } catch (err) {
            aa.print("exploreObject(): **ERROR** in Functions: " + err.Message);
        }
        var counter = objExplore.length;
    }
    aa.print("");
    aa.print("Properties:");
    for (var y in objExplore) {
        try {
            if (typeof (objExplore[y]) !== "function") {
                aa.print("  <b> " + y + ": </b> " + objExplore[y]);
            }
        } catch (err) {
            aa.print("exploreObject(): **ERROR** in Properties: " + err.Message);
        }
    }
}
