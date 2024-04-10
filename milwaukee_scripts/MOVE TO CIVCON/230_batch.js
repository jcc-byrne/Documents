/*----------------------------------------------------------------------------------------------------------------------/
| Program: 		BATCH_LIC_MHP_EXPIRING.js
| Trigger: 		Batch: About to Expire MHP
| Client:  		Milwaukee
| Date:			02/06/2024
| Version: 		Base Version 1.0
| Item No:		1
| Author:  		Jacob clay - Byrne Software
|
| Description:
| mark the renewal status as About to Expire and send Notification via email to Business Entity and Agent-Sole Proprietor-1st Partner that the business license is up for renewal 30 days before renewal Expiration
|
---------------------------------------------------------------------------------------------------------------------*/

/*=======================================================/
Including all Accela Internal Library
/=======================================================*/
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
    return emseScript.getScriptText() + "";
}
var SCRIPT_VERSION = 3;
/*======================================================*/

/*=======================================================/
Variables needed to log parameters below in eventLog
/=======================================================*/
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
var batchJobResult = aa.batchJob.getJobID();
var batchJobID = 0;
var eventType = "";
var startDt = sysDate;
var batchDescription = "";
var br = "<br>";
/*======================================================*/

/*======================================================/
Setting up current user id in case system doesn't provide info.
/======================================================*/
var currentUserID = "ADMIN";
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
/*======================================================*/

if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    aa.print("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
} else
    aa.print("Batch job ID not found " + batchJobResult.getErrorMessage() + br);

aa.print("Start of Job" + br);
var todayDate = new Date().getMonth() + 1;
if (todayDate == '06'){
    mainProcess();
}
aa.print("End of Job" + br);

function mainProcess() {

    var capCollection = new Array();

    capCollection = addRecType('License', 'Business', 'Mobile Home Park', 'License', "Active", capCollection);

    var newStatus = "About to Expire";
    var statusToCheck = "Active";
    var emailParams = aa.util.newHashtable();
    aa.print("Total number of MHP Licenses: " + capCollection.length + br);

    var recCounter = 0;
    var recSetToExpire = 0;

    var currentDate = new Date();
    var currentDateTime = currentDate.getTime();

    for (i in capCollection) {
        altID = capCollection[i].getCapModel().getAltID(); // Record ID

        // FOR TESTING
        // if (altID != 'MHP-00004') {continue}

        capID = aa.cap.getCapID(altID).getOutput();
        // capId = capID;
            recCounter++;
            //------GETTING LICENSE EXPIRATION INFO------
            var b1ExpResult = aa.expiration.getLicensesByCapID(capID);
            var x = b1ExpResult.getOutput();// Returns the original B1ExpirationScriptModel
            var tmpDate = x.getExpDate(); 

            var b1License = b1ExpResult.getOutput().b1Expiration;
            if (b1License === null) {
                continue;
            }

            var expDateString = b1License.getExpDateString();
            //if expDateString does not equal currentYear-06-30, then skip it e.g. 2024-06-30
            if (expDateString != new Date().getFullYear() + '-06-30') {
                continue
            }

            

            var capObj = aa.cap.getCap(capID);
            var cap = capObj.getOutput(); //CapScriptModel

                aa.print("Cap ID: " + altID);
                aa.print("Setting record " + altID + " to About to Expire");
    
                b1License.setExpStatus(newStatus); //Update the Expiration Status on the Renewal Info portlet of the license. This will activate the "Renew" button on the Renewal portlet. 
                //Important: Need this to actually update the record data.
                aa.expiration.editB1Expiration(x.getB1Expiration()); 
                updateTaskCustom("License Status", newStatus, "About to Expire Notice Sent via script", "", capID); //updating workflow status to about to expire
                updateAppStatusCustom(newStatus, "About to Expire, update via batch script", capID); //updating record status to about to expire

                var contactEmail = '';
                var contactArray = getContactArrayCustom(capID);
                if (contactArray != null) {
                    for (i in contactArray) {
                        if (contactArray[i].contactType != 'Business Entity' && contactArray[i].contactType != 'Agent-Sole Proprietor-1st Partner'){
                            continue;
                        }
                        var conEmail = contactArray[i].email;
                        if (conEmail != null || conEmail != '') {
                            aa.print('Email for ' + contactArray[i].contactType + ': ' + conEmail)
                            contactEmail += conEmail + '; ';
                        }
                    }
                }
                getRecordParams4NotificationLocal(emailParams, capID);


                if(tmpDate)
        {
        var expirationDate =  tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear(); 
        addParameter(emailParams, "$$expirationDate$$", expirationDate);
        aa.print("$$expirationDate$$:" + expirationDate);
        }

                sendNotification('', contactEmail, '', 'LIC_MHP_ABOUT_TO_EXPIRE', emailParams, [], capID);
                recSetToExpire++;
            
    
    }

    aa.print("Total Active Licenses: " + recCounter);
    aa.print("Total Licenses Set To About to Expire: " + recSetToExpire);

}

/*======================================================/
Helper functions - Do not edit
/======================================================*/

function addRecType(group, type, subType, category, capStatus, capCollectionArray) {
    var vSearchCapModel = aa.cap.getCapModel().getOutput();
    var vSearchCapTypeModel = vSearchCapModel.capType;
    vSearchCapTypeModel.setServiceProviderCode(aa.serviceProviderCode);
    vSearchCapTypeModel.setGroup(group);
    vSearchCapTypeModel.setType(type);
    vSearchCapTypeModel.setSubType(subType);
    vSearchCapTypeModel.setCategory(category);
    vSearchCapModel.setCapType(vSearchCapTypeModel);
    vSearchCapModel.setCapStatus(capStatus);

    var collectionList = aa.cap.getCapListByCollection(vSearchCapModel, null, null, null, null, null, new Array());

    capCollectionArray = capCollectionArray.concat(collectionList.getOutput());
    aa.print('Found ' + collectionList.getOutput().length + ' ' + vSearchCapTypeModel)

    return capCollectionArray
}


function describeObject(obj2describe) {
    if (obj2describe.class){
    aa.print("Object Class: " + obj2describe.getClass());
    }
    aa.print("List Object Functions ...");
    //Print function list
    for (x in obj2describe)
        if (typeof (obj2describe[x]) == "function")
            aa.print("  " + x)

    aa.print("");
    aa.print("List Object Properties ...");

    //Print properties and values of the current function
    for (x in obj2describe)
        if (typeof (obj2describe[x]) != "function")
            aa.print("  " + x + " = " + obj2describe[x]);
}



function calculateTimeInDays(timeDifference) {
    var oneDay = 1000 * 60 * 60 * 24; // one day converted into milliseconds
    var timeInDays = Math.round(timeDifference / oneDay);

    return timeInDays;
}

function updateAppStatusCustom(stat, cmt, itemCap) // optional cap id
{
    var updateStatusResult = aa.cap.updateAppStatus(itemCap, "APPLICATION", stat, sysDate, cmt, systemUserObj);
    if (updateStatusResult.getSuccess())
        aa.print("Updated application status to " + stat + " successfully.");
    else
        aa.print("**ERROR: application status update to " + stat + " was unsuccessful.  The reason is " + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage() + br);
}
function updateTaskCustom(wfstr, wfstat, wfcomment, wfnote, itemCap) // optional process name, cap id
{
    var useProcess = false;
    var processName = "";
    if (arguments.length > 5) {
        if (arguments[5] != "") {
            processName = arguments[5]; // subprocess
            useProcess = true;
        }
    }

    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName,
        null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else {
        aa.print("**ERROR: Failed to get workflow object: "
            + s_capResult.getErrorMessage());
        return false;
    }

    if (!wfstat)
        wfstat = "NA";

    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase()
            .equals(wfstr.toUpperCase())
            && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();
            if (useProcess)
                aa.workflow.handleDisposition(itemCap, stepnumber, processID,
                    wfstat, dispositionDate, wfnote, wfcomment,
                    systemUserObj, "U");
            else
                aa.workflow.handleDisposition(itemCap, stepnumber, wfstat,
                    dispositionDate, wfnote, wfcomment, systemUserObj, "U");
            aa.print("Updating Workflow Task " + wfstr + " with status "
                + wfstat);
        }
    }
}

function sendNotificationCustom(emailFrom, emailTo, emailCC, templateName, params, reportFile) {
    var itemCap;
    if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args
    var id1 = itemCap.ID1;
    var id2 = itemCap.ID2;
    var id3 = itemCap.ID3;
    var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
    var result = null;
    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
    if (result.getSuccess()) {
        aa.print("Sent email successfully!");
        return true;
    }
    else {
        aa.print("Failed to send mail. - " + result.getErrorType());
        return false;
    }

}

function getContactArrayCustom() {
    // Returns an array of associative arrays with contact attributes.  Attributes are UPPER CASE
    // optional capid
    // added check for ApplicationSubmitAfter event since the contactsgroup array is only on pageflow,
    // on ASA it should still be pulled normal way even though still partial cap
    var thisCap;
    if (arguments.length == 1) thisCap = arguments[0];

    var cArray = new Array();

    if (arguments.length == 0 && !cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") // we are in a page flow script so use the capModel to get contacts
    {
        capContactArray = cap.getContactsGroup().toArray();
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(thisCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
        }
    }

    if (capContactArray) {
        for (yy in capContactArray) {
            var aArray = new Array();
            aArray["lastName"] = capContactArray[yy].getPeople().lastName;
            aArray["refSeqNumber"] = capContactArray[yy].getCapContactModel().getRefContactNumber();
            aArray["firstName"] = capContactArray[yy].getPeople().firstName;
            aArray["middleName"] = capContactArray[yy].getPeople().middleName;
            aArray["businessName"] = capContactArray[yy].getPeople().businessName;
            aArray["contactSeqNumber"] = capContactArray[yy].getPeople().contactSeqNumber;
            aArray["contactType"] = capContactArray[yy].getPeople().contactType;
            aArray["relation"] = capContactArray[yy].getPeople().relation;
            aArray["phone1"] = capContactArray[yy].getPeople().phone1;
            aArray["phone2"] = capContactArray[yy].getPeople().phone2;
            aArray["email"] = capContactArray[yy].getPeople().email;
            aArray["addressLine1"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine1();
            aArray["addressLine2"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine2();
            aArray["city"] = capContactArray[yy].getPeople().getCompactAddress().getCity();
            aArray["state"] = capContactArray[yy].getPeople().getCompactAddress().getState();
            aArray["zip"] = capContactArray[yy].getPeople().getCompactAddress().getZip();
            aArray["fax"] = capContactArray[yy].getPeople().fax;
            aArray["notes"] = capContactArray[yy].getPeople().notes;
            aArray["country"] = capContactArray[yy].getPeople().getCompactAddress().getCountry();
            aArray["fullName"] = capContactArray[yy].getPeople().fullName;
            aArray["peopleModel"] = capContactArray[yy].getPeople();

            var pa = new Array();

            if (arguments.length == 0 && !cap.isCompleteCap()) {
                var paR = capContactArray[yy].getPeople().getAttributes();
                if (paR) pa = paR.toArray();
            }
            else
                var pa = capContactArray[yy].getCapContactModel().getPeople().getAttributes().toArray();
            for (xx1 in pa)
                aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;

            cArray.push(aArray);
        }
    }
    return cArray;
}

function getRecordParams4NotificationLocal(params, itemCapId) {
    // pass in a hashtable and it will add the additional parameters to the table
    var itemCapIDString = itemCapId.getCustomID();
    var itemCap = aa.cap.getCap(itemCapId).getOutput();
    var itemCapName = itemCap.getSpecialText();
    var itemCapStatus = itemCap.getCapStatus();
    var itemFileDate = itemCap.getFileDate();
    var itemCapTypeAlias = itemCap.getCapType().getAlias();
    var itemHouseCount;
    var itemFeesInvoicedTotal;
    var itemBalanceDue;

    var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);
    if (itemCapDetailObjResult.getSuccess()) {
        itemCapDetail = itemCapDetailObjResult.getOutput();
        itemHouseCount = itemCapDetail.getHouseCount();
        itemFeesInvoicedTotal = itemCapDetail.getTotalFee();
        itemBalanceDue = itemCapDetail.getBalance();
    }

    var workDesc = workDescGet(itemCapId);
    addParameter(params, "$$altID$$", itemCapIDString);
    addParameter(params, "$$capName$$", itemCapName);

    addParameter(params, "$$recordTypeAlias$$", itemCapTypeAlias);
    addParameter(params, "$$capStatus$$", itemCapStatus);
    addParameter(params, "$$fileDate$$", itemFileDate);
    addParameter(params, "$$balanceDue$$", "$" + parseFloat(itemBalanceDue).toFixed(2));

    addParameter(params, "$$workDesc$$", (workDesc) ? workDesc : "");
    return params;
}