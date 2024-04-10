/*----------------------------------------------------------------------------------------------------------------------/
| Program: 		BATCH_ASSESS_LATE_FEES.js
| Trigger: 		Batch:  For records where the document category is O Drive copy
|						the document file name to the document description field.
| Client:  		PCR
| Date:			05/02/2022
| Version: 		Base Version 1.0

| Author:  		Jose L Yanez - Byrne Software
|
| Description:
|				JY - 	Assess Late Fee on Record Types: Cannabis/Regulatory/NA/Renewal,
|						Deferred = Y and
|						Balance > 0
|
| Notes:
|
|
---------------------------------------------------------------------------------------------------------------------*/

/*=======================================================/
Including all Accela Internal Library
/=======================================================*/
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));
var SCRIPT_VERSION = 3;
/*======================================================*/

/*=======================================================/
Variables needed to log parameters below in eventLog
/=======================================================*/
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var batchJobName = "" + aa.env.getValue("batchJobName");
// var batchFromdate = "" + aa.env.getValue("fromDate");
// var batchToDate = "" + aa.env.getValue("toDate");
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

if (batchJobResult.getSuccess())
{
	batchJobID = batchJobResult.getOutput();
	aa.print("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
}
else
{
	aa.print("Batch job ID not found " + batchJobResult.getErrorMessage() + br);
}

var recCounter = 0;
var updRecCounter = 0;
var documentType = "O Drive";

aa.print("Start of Job" + br);
aa.print("Current Date: " + sysDate.getMonth() + "/" + sysDate.getDayOfMonth() + "/" + sysDate.getYear() + " " + sysDate.getHourOfDay() + ":" + sysDate.getMinute() + br);
aa.print("-------------------------------------------------- " + br);
mainProcess();
aa.print("End of Job" + br);

function mainProcess()
{
	var notificationTemplate = "";
	var willsendNotification = false;
	var notificationsSent = 0;
	var notificationsSent30 = 0;
	var notificationsSent45 = 0;
	var notificationsSent75 = 0;

	var group = "Licenses";
	var type = "Animal";
	var subType = "Dog";
	var category = "NA";

	var vSearchCapModel = aa.cap.capModel.getOutput();
	var vSearchCapTypeModel = vSearchCapModel.capType;

	vSearchCapTypeModel.setServiceProviderCode(aa.serviceProviderCode);
	vSearchCapTypeModel.setGroup(group);
	vSearchCapTypeModel.setType(type);
	vSearchCapTypeModel.setSubType(subType);
	vSearchCapTypeModel.setCategory(category);
	vSearchCapModel.setCapType(vSearchCapTypeModel);


	var collectionList = aa.cap.getCapListByCollection(vSearchCapModel, null, null, null, null, null, new Array());
	var capCollection = collectionList.getOutput();

	aa.print("Total Records Found: " + capCollection.length + br);
	aa.print("-------------------------------------------------- " + br);
	aa.print("LOG: " + br);
	aa.print("     " + br);

	recCounter = 0;
	updRecCounter = 0;

	var currentDate = new Date();
	var currentDateTime = currentDate.getTime();

	var balanceDue = 0;
	var capDetail = "";
	var capDetailObjResult = "";
	var exemptInterestFee = "";
	var firstInvoiceDate = "";
	var nextInterestDate = "";
    var totalInterestFees = 0;
	var numberOfDays = 0;
	var licType = "";

	aa.print("------------------------------ RECORD LIST ------------------------------ " + br);
    

// exploreObject(capCollection[0])

capCollection.forEach( function (cap) {

    var capScriptModel = cap;
    var capID = capScriptModel.getCapID()
    var capModel = capScriptModel.getCapModel();
    var capStatus = capScriptModel.getCapStatus();
    
    
    if (capStatus == 'Issued'){
    
        if (isTaskActiveLocal('Application Intake', capID)){
            aa.print('>>> Updating ' + capModel.getAltID())
            deactivateTaskLocal('Application Intake', capID);
            activateTaskLocal('Mailed/Give Dog Tag', capID);
            closeTaskLocal('Mailed/Give Dog Tag', 'Issued', '', '', capID);
        }
    }
})


/*
	for (i in capCollection)
	{
		recCounter++;

		altID = capCollection[i].getCapModel().getAltID(); // Record ID

    var cap = aa.cap.getCap(capId).getOutput();
	var appTypeResult = cap.getCapType();
	var appTypeString = appTypeResult.toString(); 


		capID = aa.cap.getCapID(altID).getOutput();
		capDetailObjResult = aa.cap.getCapDetail(capID);
        var capStatus = capID.getCapStatus();


        if (altID != 'HDOG24-0001') continue;
aa.print(appTypeResult)
        if (capStatus == 'Issued'){
            aa.print('issued')
        }




		if (capDetailObjResult.getSuccess())
		{
			capDetail = capDetailObjResult.getOutput();
			// balanceDue = capDetail.getBalance();
            // nextInterestDate = getAppSpecific("Next Interest Assessment", capID);
            // exemptInterestFee = getAppSpecific("Exempt Interest Fee", capID);
            // totalInterestFees = getAppSpecific("Total Interest Fees", capID);


			if(balanceDue > 0 && sysDateMMDDYYYY == nextInterestDate && exemptInterestFee != 'CHECKED')
			{
				// aa.print(" altID: " + altID + " current balance: " + balanceDue + br);
				// totalInterestFees = getAppSpecific("Total Interest Fees", capID);
				// aa.print("   altID: " + altID + " exempt interest " + exemptInterestFee + br);
                // aa.print('  ' + altID + ' >> Adding Interest Fee, Updated Total Interest Fees, Update Next Interest Assessment');

                // totalInterestFees++;

                // editAppSpecific('Next Interest Assessment', dateAdd(nextInterestDate, 30));
                // editAppSpecific('Total Interest Fees', totalInterestFees);
                // addFee('C_R_ENF_360', 'ENF_PM', 'FINAL', 1, 'Y');
                // updRecCounter++;
} 
		}
	}
  */

	aa.print("-------------------------------------------------- " + br);
	aa.print("Total " + group + "/" + type + "/" + subType + "/" + category + " Records Found: " + recCounter + br);
	aa.print("Total " + group + "/" + type + "/" + subType + "/" + category + " Fees Assessed: " + updRecCounter + br);
}

/*======================================================/
Helper functions - Do not edit
/======================================================*/
function isTaskActiveLocal(wfstr, itemCap) // optional process name
{
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
	}
}

function deactivateTaskLocal(wfstr, itemCap) // optional process name
{
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			var completeFlag = fTask.getCompleteFlag();
			if (useProcess) {
				aa.workflow.adjustTask(itemCap, stepnumber, processID, "N", completeFlag, null, null);
			} else {
				aa.workflow.adjustTask(itemCap, stepnumber, "N", completeFlag, null, null);
			}
			aa.print("deactivating Workflow Task: " + wfstr);
		}
	}
}

function activateTaskLocal(wfstr, itemCap) // optional process name
{
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess) {
				aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
			} else {
				aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)
			}
			aa.print("Activating Workflow Task: " + wfstr);
		}
	}
}

function closeTaskLocal(wfstr,wfstat,wfcomment,wfnote, itemCap) // optional process name
	{
	var useProcess = false;
	var processName = "";

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			else
				aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			
			aa.print("Closing Workflow Task: " + wfstr + " with status " + wfstat);

			}			
		}
	}

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
	if (!servProvCode)
	{
		servProvCode = aa.getServiceProviderCode();
	}

	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();

	try
	{
		if (useProductScripts)
		{
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		}
		else
		{
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	}
	catch (err)
	{
		return "";
	}
}

function describeObject(obj2describe)
{
	aa.print("Object Class: " + obj2describe.getClass());
	aa.print("List Object Functions ...");
	//Print function list
	for (x in obj2describe)
	{
		if (typeof(obj2describe[x]) == "function")
		{
			aa.print("  " + x)
		}
	}

	aa.print("");
	aa.print("List Object Properties ...");
	//Print properties and values of the current function
	for (x in obj2describe)
	{
		if (typeof(obj2describe[x]) != "function")
		{
			aa.print("  " + x + " = " + obj2describe[x]);
		}
	}
}

function calculateTimeInDays(timeDifference)
{
	var oneDay = 1000 * 60 * 60 * 24; // one day converted into milliseconds
	var timeInDays = Math.round(timeDifference / oneDay);

	return timeInDays;
}
/*
function getAppSpecific(itemName, thiscapId) // optional: itemCap
{
	var i = 0;
	var itemCap = thiscapId;

	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);

	if(appSpecInfoResult.getSuccess())
	{
		var appspecObj = appSpecInfoResult.getOutput();

		for(i in appspecObj)
		{
			if(appspecObj[i].getCheckboxDesc() == itemName)
			{
				return appspecObj[i].getChecklistComment();
				break;
			}
		}
	}
	else
	{
		aa.print("**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage())
	}
}*/

function matches(eVal,argList)
{
	for (var i=1; i<arguments.length;i++)
		if (arguments[i] == eVal)
		return true;
}
/*
function addFee(fcode,fsched,fperiod,fqty,finvoice) // Adds a single fee, optional argument: fCap

{
	// Updated Script will return feeSeq number or null if error encountered (SR5112)
	var feeCapMessage = "";
	var feeSeq_L = new Array(); // invoicing fee for CAP in args
	var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
	var feeSeq = null;
	if (arguments.length > 5)
	{
		myCapID = arguments[5]; // use cap ID specified in args
		feeCapMessage = " to specified CAP";
	}

	assessFeeResult = aa.finance.createFeeItem(myCapID, fsched, fcode, fperiod, fqty);
	if (assessFeeResult.getSuccess())
	{
		feeSeq = assessFeeResult.getOutput();
		aa.print("          Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
		aa.print("          The assessed fee Sequence Number " + feeSeq + feeCapMessage);

		if (finvoice == "Y" && arguments.length == 5) // use current CAP
		{
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
		}
		if (finvoice == "Y" && arguments.length > 5) // use CAP in args
		{
			feeSeq_L.push(feeSeq);
			paymentPeriod_L.push(fperiod);
			var invoiceResult_L = aa.finance.createInvoice(myCapID, feeSeq_L, paymentPeriod_L);
			if (invoiceResult_L.getSuccess())
				aa.print("             Invoicing assessed fee items" + feeCapMessage + " is successful.");
			else
				aa.print("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
		}
	}
	else
	{
		aa.print("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
		feeSeq = null;
	}

	return feeSeq;

}*/

function exploreObject(objExplore) {

    aa.print('Properties:');
    for (var y in objExplore) {
      try {
        if (typeof objExplore[y] !== 'function') {
          aa.print('  <b> ' + y + ': </b> ' + objExplore[y]);
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Properties: ' + err.Message);
      }
    }
    aa.print('');

    aa.print('Methods:');
    for (var x in objExplore) {
      try {
        if (typeof objExplore[x] === 'function') {
          aa.print('<font color=blue><u><b>' + x + '</b></u></font> ');
          aa.print('   ' + objExplore[x] + '<br>');
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Functions: ' + err.Message);
      }
      var counter = objExplore.length;
    }

  }

  function logDebug(str){
    aa.print(str)
  }