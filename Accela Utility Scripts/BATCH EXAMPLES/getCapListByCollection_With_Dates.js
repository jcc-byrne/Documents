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
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));
var SCRIPT_VERSION = 3;
/*======================================================*/

/*=======================================================/
Variables needed to log parameters below in eventLog
/=======================================================*/
var sysDate = aa.date.getCurrentDate();
var batchJobName = "" + aa.env.getValue("batchJobName");
var batchFromdate = "" + aa.env.getValue("fromDate");
var batchToDate = "" + aa.env.getValue("toDate");
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

	var group = "Cannabis";
	var type = "Regulatory";
	var subType = "NA";
	var category = "Renewal";

	var vSearchCapModel = aa.cap.capModel.getOutput();
	var vSearchCapTypeModel = vSearchCapModel.capType;

	vSearchCapTypeModel.setServiceProviderCode(aa.serviceProviderCode);
	vSearchCapTypeModel.setGroup(group);
	vSearchCapTypeModel.setType(type);
	vSearchCapTypeModel.setSubType(subType);
	vSearchCapTypeModel.setCategory(category);
	vSearchCapModel.setCapType(vSearchCapTypeModel);

	/*	IF NO DATE PROVIDED IN BATCH JOB, ASSUME DATE TO AND FROM IS TODAY	*/
	if(batchFromdate == "" || batchFromdate == undefined)
	{
		// batchFromdate = sysDate.getMonth() + "/" + sysDate.getDayOfMonth() + "/" + sysDate.getYear();
		// aa.print("Dates: <" + batchFromdate + "> To <");
		// batchFromdate = aa.date.parseDate(batchFromdate);
		batchFromdate = null;
	}
	else
	{
		batchFromdate = aa.date.parseDate(batchFromdate);
	}

	if(batchToDate == "" || batchToDate == undefined)
	{
		// batchToDate = sysDate.getMonth() + "/" + sysDate.getDayOfMonth() + "/" + sysDate.getYear();
		// aa.print(batchToDate + ">" + br);
		// batchToDate = aa.date.parseDate(batchToDate);
		batchToDate = null;
	}
	else
	{
		batchToDate = aa.date.parseDate(batchToDate);
	}

	var collectionList = aa.cap.getCapListByCollection(vSearchCapModel, null, null, batchFromdate, batchToDate, null, new Array());
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
	var deferredPayment = "";
	var latePaymentDate = "";
	var numberOfDays = 0;
	var licType = "";

	aa.print("------------------------------ RECORD LIST ------------------------------ " + br);
	for (i in capCollection)
	{
		altID = capCollection[i].getCapModel().getAltID(); // Record ID
		capID = aa.cap.getCapID(altID).getOutput();
		capDetailObjResult = aa.cap.getCapDetail(capID);

		balanceDue = 0;
		capDetail = null;
		deferredPayment = null;
		latePaymentDate = null;
		numberOfDays = 0;
		licType = null;

		recCounter++;

		if (capDetailObjResult.getSuccess())
		{
			capDetail = capDetailObjResult.getOutput();
			balanceDue = capDetail.getBalance();

			if(balanceDue > 0)
			{
				//aa.print(" altID: " + altID + " current balance: " + balanceDue + br);
				deferredPayment = getAppSpecific("DeferredPayment", capID);

				if (deferredPayment == "Yes")
				{
					//aa.print("   altID: " + altID + " deferred option " + deferredPayment + br);
					latePaymentDate = aa.date.parseDate(getAppSpecific("LatePaymentDate", capID));

					if(latePaymentDate)
					{
						latePaymentDateString = latePaymentDate.getMonth() + "/" + latePaymentDate.getDayOfMonth() + "/" + latePaymentDate.getYear();
						latePaymentDate = latePaymentDate.getEpochMilliseconds();

						timeDifferenceBetweenDates = currentDateTime - latePaymentDate;
						numberOfDays = calculateTimeInDays(timeDifferenceBetweenDates); // calculating the number of days
						licType = getAppSpecific("License Type", capID);
						
						aa.print("    Record ID: " + altID + ", License Type: " + licType + ", Number of Days past due: " + numberOfDays + br);
						//aa.print("    " + numberOfDays + " Days for Record <" + altID + "> "+ br);

						if(licType != null && licType != "")
						{
							if (numberOfDays == 30)
							{
								if (matches(licType, "Retail Courier", "Producer: Micro-Tier 1", "Producer: Micro-Tier 2"))
								{
									aa.print("       Record ID: " + altID + ", License Type: " + licType + ", Number of Days past due: " + numberOfDays + ", Fees Assessed: REN09 $100 " + br);
									addFee("REN09", "MJ_PCR_REN", "FINAL", 100, "Y",capID);
									updRecCounter++;
								}
								else // "Medical Dispensary","Processor","Producer: Tier 1","Producer: Tier 2",,"Retailer","Wholesaler"
								{
									aa.print("       Record ID: " + altID + ", License Type: " + licType + ", Number of Days past due: " + numberOfDays + ", Fees Assessed: REN08 $250 " + br);
									addFee("REN08", "MJ_PCR_REN", "FINAL", 250, "Y",capID);
									updRecCounter++;
								}
							}
							else if (numberOfDays == 60)
							{
								if (matches(licType, "Retail Courier", "Producer: Micro-Tier 1", "Producer: Micro-Tier 2"))
								{
									aa.print("       Record ID: " + altID + ", License Type: " + licType + ", Number of Days past due: " + numberOfDays + ", Fees Assessed: REN09 $200 " + br);
									addFee("REN09", "MJ_PCR_REN", "FINAL", 200, "Y",capID);
									updRecCounter++;
								}
								else // "Medical Dispensary","Processor","Producer: Tier 1","Producer: Tier 2",,"Retailer","Wholesaler"
								{
									aa.print("       Record ID: " + altID + ", License Type: " + licType + ", Number of Days past due: " + numberOfDays + ", Fees Assessed: REN08 $500 " + br);
									addFee("REN08", "MJ_PCR_REN", "FINAL", 500, "Y",capID);
									updRecCounter++;
								}
							}
						}
					}
				}
			}
		}
	}

	aa.print("-------------------------------------------------- " + br);
	aa.print("Total " + group + "/" + type + "/" + subType + "/" + category + " Records Found: " + recCounter + br);
	aa.print("Total " + group + "/" + type + "/" + subType + "/" + category + " Fees Assessed: " + updRecCounter + br);
}

/*======================================================/
Helper functions - Do not edit
/======================================================*/
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
}

function matches(eVal,argList)
{
	for (var i=1; i<arguments.length;i++)
		if (arguments[i] == eVal)
		return true;
}

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

}