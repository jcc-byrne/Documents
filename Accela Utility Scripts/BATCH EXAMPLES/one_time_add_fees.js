/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_ADD_PERM_WTR_MTR_INSPECTIONS.js   
| Trigger: Batch
| Client: Babcock
|
| Frequency: Once
|
| Desc: Babcock Ranch would like to add backflow certification inspections to all Permanent Water Meter records that have a water meter installed. 
|              
|   Note: it will take the current date when the batch started
|
|Parameters are:
|
/------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/--------------------------------------------------------------------------------------------------------*/
var VS = 1;
var debugText = "";
var showDebug = false;
var showMessage = false;
var message = "";
var emailText = "";
var br = "<br>";
/*-------------------------------------------------------------------------------------------------------/
 |
 | END: USER CONFIGURABLE PARAMETERS
 |
/--------------------------------------------------------------------------------------------------------*/
var sysDate = aa.date.getCurrentDate();
var batchJobResult = aa.batchJob.getJobID()
var batchJobName = "" + aa.env.getValue("BatchJobName");
var SA = "";
var SCRIPT_VERSION = 3.0;
var batchStartDate = new Date();
var batchStartTime = batchStartDate.getTime();
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;


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

function getMasterScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
    return emseScript.getScriptText() + "";
}

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

showDebug = true;
batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    aa.print("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
}
else {
    aa.print("Batch job ID not found " + batchJobResult.getErrorMessage() + br);
}
aa.print("=========================" + br);
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var runDate = new Date();
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var currentUserID = "ADMIN";
var procCount = 0;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

aa.print("Start of Job" + br);
try {

    mainProcess();
}
catch (err) {
    aa.print("ERROR: " + err.message + br)
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
function mainProcess() {
    //Batch Variables
    try {
var recArray = new Array();
recArray.push('RLSP22-04123')
recArray.push('RLSP22-04126')
recArray.push('RLSP22-04117')
recArray.push('RLSP22-04118')
recArray.push('RLSP22-04147')
recArray.push('RLSP22-04155')
recArray.push('RLSP22-04163')
recArray.push('RLSP22-07982')
recArray.push('RLSP22-08087')
recArray.push('RLSP22-08088')
recArray.push('RLSP22-08092')
recArray.push('RLSP22-08093')
recArray.push('RLSP22-08094')
recArray.push('RLSP22-08096')
recArray.push('RLSP22-08098')
recArray.push('RLSP22-08099')
recArray.push('RLSP22-08100')
recArray.push('RLSP22-08050')
recArray.push('RLSP22-08051')
recArray.push('RLSP22-08053')
recArray.push('RLSP22-08054')
recArray.push('RLSP22-08071')
recArray.push('RLSP22-08102')
recArray.push('RLSP22-08103')
recArray.push('RLSP22-08104')
recArray.push('RLSP22-08105')
recArray.push('RLSP22-08106')
recArray.push('RLSP22-08109')
recArray.push('RLSP22-08110')
recArray.push('RLSP22-08111')
recArray.push('RLSP22-08112')
recArray.push('RLSP22-08113')
recArray.push('RLSP22-08114')
recArray.push('RLSP22-08115')
recArray.push('RLSP22-08116')
recArray.push('RLSP22-08155')
recArray.push('RLSP22-08158')
recArray.push('RLSP22-08159')
recArray.push('RLSP22-08160')
recArray.push('RLSP22-08161')
recArray.push('RLSP22-08166')
recArray.push('RLSP22-08001')
recArray.push('RLSP22-08010')
recArray.push('RLSP22-08020')
recArray.push('RLSP22-08026')
recArray.push('RLSP22-08036')
recArray.push('RLSP22-08037')
recArray.push('RLSP22-08040')
recArray.push('RLSP22-04044')
recArray.push('RLSP22-04045')
recArray.push('RLSP22-04060')
recArray.push('RLSP22-04061')
recArray.push('RLSP22-04079')
recArray.push('RLSP22-04080')
recArray.push('RLSP22-04081')
recArray.push('RLSP22-04082')
recArray.push('RLSP22-04083')
recArray.push('RLSP22-04084')
recArray.push('RLSP22-04088')
recArray.push('RLSP22-04076')
recArray.push('RLSP22-04064')
recArray.push('RLSP22-04065')
recArray.push('RLSP22-04066')
recArray.push('RLSP22-04104')
recArray.push('RLSP22-04105')
recArray.push('RLSP22-04106')
recArray.push('RLSP22-04108')
recArray.push('RLSP22-04109')
recArray.push('RLSP22-03293')
recArray.push('RLSP22-03375')
recArray.push('RLSP22-03388')
recArray.push('RLSP22-03397')
recArray.push('RLSP22-03398')
recArray.push('RLSP22-03833')
recArray.push('RLSP22-03839')
recArray.push('RLSP22-03840')
recArray.push('RLSP22-03841')
recArray.push('RLSP22-03842')
recArray.push('RLSP22-03843')
recArray.push('RLSP22-03849')
recArray.push('RLSP22-03554')
recArray.push('RLSP22-03559')
recArray.push('RLSP22-03563')
recArray.push('RLSP22-03086')
recArray.push('RLSP22-03087')
recArray.push('RLSP22-03088')
recArray.push('RLSP22-03089')
recArray.push('RLSP22-03090')
recArray.push('RLSP22-03091')
recArray.push('RLSP22-03092')
recArray.push('RLSP22-03093')
recArray.push('RLSP22-03094')
recArray.push('RLSP22-03095')
recArray.push('RLSP22-03096')
recArray.push('RLSP22-03097')
recArray.push('RLSP22-03098')
recArray.push('RLSP22-03099')
recArray.push('RLSP22-03100')
recArray.push('RLSP22-03101')
recArray.push('RLSP22-03102')
recArray.push('RLSP22-03103')
recArray.push('RLSP22-03104')
recArray.push('RLSP22-03105')
recArray.push('RLSP22-03106')
recArray.push('RLSP22-03112')
recArray.push('RLSP22-08400')
recArray.push('RLSP22-02820')
recArray.push('RLSP22-02824')
recArray.push('RLSP22-02825')
recArray.push('RLSP22-02875')
recArray.push('RLSP22-03084')
recArray.push('RLSP22-02975')
recArray.push('RLSP22-02980')
recArray.push('RLSP22-02997')
recArray.push('RLSP22-03008')
recArray.push('RLSP22-03010')
recArray.push('RLSP22-03011')
recArray.push('RLSP22-03018')
recArray.push('RLSP22-03055')
recArray.push('RLSP22-03056')
recArray.push('RLSP22-03058')
recArray.push('RLSP22-03059')
recArray.push('RLSP22-03073')
recArray.push('RLSP22-03355')
recArray.push('RLSP22-03356')
recArray.push('RLSP22-03357')
recArray.push('RLSP22-03313')
recArray.push('RLSP22-03332')
recArray.push('RLSP22-03337')
recArray.push('RLSP22-03345')
recArray.push('RLSP22-03350')
recArray.push('RLSP22-03131')
recArray.push('RLSP22-03132')
recArray.push('RLSP22-03133')
recArray.push('RLSP22-03134')
recArray.push('RLSP22-03137')
recArray.push('RLSP22-03138')
recArray.push('RLSP22-03115')
recArray.push('RLSP22-03116')
recArray.push('RLSP22-03291')
recArray.push('RLSP22-03303')

        aa.print("altIds Number: " + recArray.length)
        var numberAdded = 0;
        for (i in recArray){
            var altId = recArray[i];
            aa.print('Processing ' + altId)
            var capId = aa.cap.getCapID(altId);
        
            if (capId.getSuccess()){
                capId = capId.getOutput();
                // aa.print('>>> Success Adding Fee to ' + altId)
                var feeThere = feeExistsLocal('PLNRESLOT08', capId);

                if (feeThere){
                    aa.print('>>Fee exists for ' + altId);
                } else {
                    aa.print('>>>> Fee Does not exist, adding fee on ' + altId);
                addFeeLocal('PLNRESLOT08', 'PLNG_RESLOT', 'Final', 1, 'Y', capId);
                numberAdded++;
                }
                
            } else {
                aa.print('Could not process ' + altId + ' -- ' + capId.getErrorMessage())
            }

        aa.print('<br>')
        }

        aa.print('Number of records updated: ' + numberAdded)
        printDebug("--------------------------------------------------------------------------------------------" + br);
        //aa.print("--------------------------------------------------------------------------------------------" + br);   
        printDebug("Total run time: " + elapsed() + br);
        //aa.print("--------------------------------------------------------------------------------------------" + br);

    }
    catch (err) {
        showMessage = true;
        comment("Error on BATCH_ADD_PERM_WTR_MTR_INSPECTIONS. Please contact system administrator. Err: " + err);
		printDebug("Error on BATCH_ADD_PERM_WTR_MTR_INSPECTIONS. Please contact system administrator. Err: " + err);
    }
}
//___________________________________________________________________________________________________________ 
function comment(cstr)
{
    if (showDebug) logDebug(cstr);
    if (showMessage) logMessage(cstr);
}
    

function elapsed(stTime) {

    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - stTime) / 1000)
}

function doSQL(sql) {

    try {
        var valuesArr = [];
        var conn = aa.db.getConnection();
        var sStmt = aa.db.prepareStatement(conn, sql);

        if (sql.toUpperCase().indexOf("SELECT") == 0) {
            var rSet = sStmt.executeQuery();
            while (rSet.next()) {
                var obj = {};
                var md = rSet.getMetaData();
                var columns = md.getColumnCount();
                for (i = 1; i <= columns; i++) {
                    obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
                }
                obj.count = rSet.getRow();
                valuesArr.push(obj);
            }
            rSet.close();
            sStmt.close();
            conn.close();
            return valuesArr;
        }
    } catch (err) {
        printDebug(err.message);
        aa.print4Batch(err.message);
    }
}

function printDebug(dstr){
    aa.print(dstr + br);
}
                
function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        printDebug("************* " + obj.getClass() + " *************");
    }

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                printDebug(idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            printDebug(idx + ":  " + obj[idx]);
        }
    }
}

function logDebug(dstr){
    if(showDebug){
        printDebug(dstr)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
        aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(),"", dstr,batchJobID);
    }
}

function formattedDate(date) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('/');
}

function local_scheduleInspection(iType,DaysAhead, itemCapId) // optional inspector ID.  This function requires dateAdd function
{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 4) 
		if (arguments[3] != null)
		{
		var inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 5)
	    if (arguments[4] != null)
		    inspTime = arguments[4];
	
	if (arguments.length == 6)
	    if (arguments[5] != null)
	        inspComm = arguments[5];

	var schedRes = aa.inspection.scheduleInspection(itemCapId, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
	
	if (schedRes.getSuccess())
		printDebug("-->Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
	else
		printDebug( "-->ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
}


function addFeeLocal(fcode, fsched, fperiod, fqty, finvoice) // Adds a single fee, optional argument: fCap
{
	// Updated Script will return feeSeq number or null if error encountered (SR5112)
	var feeCap = capId;
	var feeCapMessage = "";
	var feeSeq_L = new Array(); // invoicing fee for CAP in args
	var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
	var feeSeq = null;
	if (arguments.length > 5) {
		feeCap = arguments[5]; // use cap ID specified in args
		feeCapMessage = " to specified CAP";
	}
	assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
	if (assessFeeResult.getSuccess()) {
		feeSeq = assessFeeResult.getOutput();
		aa.print("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
		aa.print("The assessed fee Sequence Number " + feeSeq + feeCapMessage);
		if (finvoice == "Y" && arguments.length == 5) // use current CAP
		{
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
		}
		if (finvoice == "Y" && arguments.length > 5) // use CAP in args
		{
			feeSeq_L.push(feeSeq);
			paymentPeriod_L.push(fperiod);
			var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
			if (invoiceResult_L.getSuccess())
				aa.print("Invoicing assessed fee items" + feeCapMessage + " is successful.");
			else
				aa.print("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
		}
		updateFeeItemInvoiceFlag(feeSeq, finvoice);
	} else {
		aa.print("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
		feeSeq = null;
	}
	return feeSeq;
}

function updateFeeItemInvoiceFlag(feeSeq,finvoice)
{
	if(feeSeq == null)
		return;
	if(publicUser && !cap.isCompleteCap())
	{
		var feeItemScript = aa.finance.getFeeItemByPK(capId,feeSeq);
		if(feeItemScript.getSuccess)
		{
			var feeItem = feeItemScript.getOutput().getF4FeeItem();
			feeItem.setAutoInvoiceFlag(finvoice);
			aa.finance.editFeeItem(feeItem);
		}
	}
}

function feeExistsLocal(feestr, itemCap) // optional statuses to check for
{
	var checkStatus = false;
	var statusArray = new Array();
	//get optional arguments
	// if (arguments.length > 1) {
	// 	checkStatus = true;
	// 	for (var i = 1; i < arguments.length; i++)
	// 		statusArray.push(arguments[i]);
	// }
	var feeResult = aa.fee.getFeeItems(itemCap, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
        
	} else {
		aa.print("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}
	for (ff in feeObjArr){
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			return true;
    }

	return false;
} 