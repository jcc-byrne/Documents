/**
 * load fees and void then credit
 */


var capId = aa.cap.getCapID("MHP-A24-00002").getOutput();

// var removeFee = aa.finance.voidFeeItem(capId, '71743670')

// var feeSeqArray = new Array();
// 			var paymentPeriodArray = new Array();
// 			feeSeqArray.push('71743670');
// 			paymentPeriodArray.push('final');
// 			var invoiceResult_L = aa.finance.createInvoice(capId, feeSeqArray, paymentPeriodArray);
// 			if (!invoiceResult_L.getSuccess())
// 				logDebug("**ERROR: Invoicing the fee items voided " + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());


// exploreObject(invoiceResult_L)

          

var feeA = loadFees();
for (var x in feeA) {
  thisFee = feeA[x];
  logDebug("status is " + thisFee.status);
  if (thisFee.status == "INVOICED") {
    voidResult = aa.finance.voidFeeItem(capId, thisFee.sequence);
    if (voidResult.getSuccess()) {
      logDebug("Fee item " + thisFee.code + "(" + thisFee.sequence + ") has been voided");
    } else {
      logDebug("**ERROR: voiding fee item " + thisFee.code + "(" + thisFee.sequence + ") " + voidResult.getErrorMessage());
    }
    var feeSeqArray = new Array();
    var paymentPeriodArray = new Array();
    feeSeqArray.push(thisFee.sequence);
    paymentPeriodArray.push(thisFee.period);
    var invoiceResult_L = aa.finance.createInvoice(capId, feeSeqArray, paymentPeriodArray);
    if (!invoiceResult_L.getSuccess())
      logDebug("**ERROR: Invoicing the fee items voided " + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
  }
}





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
  
  function logDebug(str){aa.print(str)}




  function condMatchObj() {
    this.objType = null;
    this.object = null;
    this.contactObj = null;
    this.addressObj = null;
    this.licenseObj = null;
    this.parcelObj = null;
    this.status = null;
    this.type = null;
    this.impact = null;
    this.description = null;
    this.comment = null;
    this.arObject = null;
    this.arDescription = null;
    this.arComment = null;
    this.expireDate = null;
  } 

  function loadFees()  // option CapId
	{
	//  load the fees into an array of objects.  Does not
	var itemCap = capId
	if (arguments.length > 0)
		{
		ltcapidstr = arguments[0]; // use cap ID specified in args
		if (typeof(ltcapidstr) == "string")
                {
				var ltresult = aa.cap.getCapID(ltcapidstr);
	 			if (ltresult.getSuccess())
  				 	itemCap = ltresult.getOutput();
	  			else
  				  	{ logDebug("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " +  ltresult.getErrorMessage()); return false; }
                }
		else
			itemCap = ltcapidstr;
		}
  	var feeArr = new Array();
	var feeResult=aa.fee.getFeeItems(itemCap);
		if (feeResult.getSuccess())
			{ var feeObjArr = feeResult.getOutput(); }
		else
			{ logDebug( "**ERROR: getting fee items: " + feeResult.getErrorMessage()); return false }
		for (ff in feeObjArr)
			{
			fFee = feeObjArr[ff];
			var myFee = new Fee();
			var amtPaid = 0;
			var pfResult = aa.finance.getPaymentFeeItems(itemCap, null);
			if (pfResult.getSuccess())
				{
				var pfObj = pfResult.getOutput();
				for (ij in pfObj)
					if (fFee.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
						amtPaid+=pfObj[ij].getFeeAllocation()
				}
			myFee.sequence = fFee.getFeeSeqNbr();
			myFee.code =  fFee.getFeeCod();
			myFee.sched = fFee.getF4FeeItemModel().getFeeSchudle();
			myFee.description = fFee.getFeeDescription();
			myFee.unit = fFee.getFeeUnit();
			myFee.amount = fFee.getFee();
			myFee.amountPaid = amtPaid;
			if (fFee.getApplyDate()) myFee.applyDate = convertDate(fFee.getApplyDate());
			if (fFee.getEffectDate()) myFee.effectDate = convertDate(fFee.getEffectDate());
			if (fFee.getExpireDate()) myFee.expireDate = convertDate(fFee.getExpireDate());
			myFee.status = fFee.getFeeitemStatus();
			myFee.period = fFee.getPaymentPeriod();
			myFee.display = fFee.getDisplay();
			myFee.accCodeL1 = fFee.getAccCodeL1();
			myFee.accCodeL2 = fFee.getAccCodeL2();
			myFee.accCodeL3 = fFee.getAccCodeL3();
			myFee.formula = fFee.getFormula();
			myFee.udes = fFee.getUdes();
			myFee.UDF1 = fFee.getUdf1();
			myFee.UDF2 = fFee.getUdf2();
			myFee.UDF3 = fFee.getUdf3();
			myFee.UDF4 = fFee.getUdf4();
			myFee.subGroup = fFee.getSubGroup();
			myFee.calcFlag = fFee.getCalcFlag();;
			myFee.calcProc = fFee.getFeeCalcProc();
			myFee.version = fFee.getF4FeeItemModel().getVersion();
			feeArr.push(myFee)
			}
		return feeArr;
		}


    function Fee() // Fee Object
	{
	this.sequence = null;
	this.code =  null;
	this.description = null;  // getFeeDescription()
	this.unit = null; //  getFeeUnit()
	this.amount = null; //  getFee()
	this.amountPaid = null;
	this.applyDate = null; // getApplyDate()
	this.effectDate = null; // getEffectDate();
	this.expireDate = null; // getExpireDate();
	this.status = null; // getFeeitemStatus()
	this.recDate = null;
	this.period = null; // getPaymentPeriod()
	this.display = null; // getDisplay()
	this.accCodeL1 = null; // getAccCodeL1()
	this.accCodeL2 = null; // getAccCodeL2()
	this.accCodeL3 = null; // getAccCodeL3()
	this.formula = null; // getFormula()
	this.udes = null; // String getUdes()
	this.UDF1 = null; // getUdf1()
	this.UDF2 = null; // getUdf2()
	this.UDF3 = null; // getUdf3()
	this.UDF4 = null; // getUdf4()
	this.subGroup = null; // getSubGroup()
	this.calcFlag = null; // getCalcFlag();
	this.calcProc = null; // getFeeCalcProc()
	this.auditDate = null; // getAuditDate()
	this.auditID = null; // getAuditID()
	this.auditStatus = null; // getAuditStatus()
	this.version = null; // getVersion()
	}

   
function convertDate(thisDate)
{
if (typeof(thisDate) == "string")
  {
  var retVal = new Date(String(thisDate));
  if (!retVal.toString().equals("Invalid Date"))
    return retVal;
  }
if (typeof(thisDate)== "object")
  {
  if (!thisDate.getClass) // object without getClass, assume that this is a javascript date already
    {
    return thisDate;
    }
  if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime"))
    {
    return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
    }
    
  if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime"))
    {
    return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
    }			
  if (thisDate.getClass().toString().equals("class java.util.Date"))
    {
    return new Date(thisDate.getTime());
    }
  if (thisDate.getClass().toString().equals("class java.lang.String"))
    {
    return new Date(String(thisDate));
    }
  if (thisDate.getClass().toString().equals("class java.sql.Timestamp"))
    {
    return new Date(thisDate.getMonth() + "/" + thisDate.getDate() + "/" + thisDate.getYear());
    }
  }
if (typeof(thisDate) == "number")
  {
  return new Date(thisDate);  // assume milliseconds
  }
logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
return null;
}