/*------------------------------------------------------------------------------------------------------/
| Program  : BLD_RUNREPORTASYNC.js
| Event    : BLD_RUNREPORTASYNC.js
|
| Client   : VISALIA
| Author   : Jacob Clay
| Date	   : 08/1/2023
|
/------------------------------------------------------------------------------------------------------*/
var useCustomScriptFile = false; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var SA = null;
var SAScript = null;
var br = "\n<br>";
var sysDate = aa.date.getCurrentDate();

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
var SCRIPT_VERSION = 9.0;

currentUserID = aa.getAuditID();
systemUserObj = aa.person.getUser(currentUserID).getOutput();

var emailTEXT = "";

try
{
	var capId = aa.env.getValue("CAPID");
	emailTEXT += "CAPID: " + capId;

	var reportTemplate = aa.env.getValue("reportTemplate");
	emailTEXT += "reportTemplate: " + reportTemplate;

	var reportModule = aa.env.getValue("reportModule");
	emailTEXT += "reportModule: " + reportModule;

	var reportParams = aa.env.getValue("reportParams");
	emailTEXT += "reportParams: " + reportParams;
	emailTEXT += "reportParams[altID]: " + reportParams.get("altID");
	emailTEXT += "reportParams[serviceProviderCode]: " + reportParams.get("serviceProviderCode");
	
	wait(4000);

	var capObj = aa.cap.getCap(capId);
	
	if(capObj.getSuccess())
	{
		var cap = capObj.getOutput();
		var appTypeString = cap.getCapType().getValue();
		emailTEXT += "appTypeString = " + appTypeString + "<br/>";

		var appTypeArray = appTypeString.split("/");
		emailTEXT += "appTypeArray = " + appTypeArray + "<br/>";
	}

	var canRun = true;

	if(canRun)
	{
		//generateAndNotify();
        runReportAttach_async(capId, reportTemplate, reportParams)
	}
	
	aa.sendMail("no_reply@accela.com", "jcc@byrnesoftware.com", "", "BLD_RUNREPORTASYNC Logs", "LOG: " + emailTEXT);
}
catch(ex)
{
	logDebug("Exception BLD_RUNREPORTASYNC:" + ex);
	aa.sendMail("no_reply@accela.com", "jcc@byrnesoftware.com", "", "Exception BLD_RUNREPORTASYNC Logs", "Exception: " + ex + emailTEXT);
}

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
	if(!servProvCode)
	{
		servProvCode = aa.getServiceProviderCode();
	}

	var vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();

	try
	{
		if(useProductScripts)
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

function generateAndNotify()
{
	//Generate report
	var module = aa.env.getValue("reportModule");
	var rptParams = aa.env.getValue("reportParams");
	var reportName = aa.env.getValue("reportTemplate");
	var rFiles = null;

	if (reportName && reportName != null && reportName != "")
	{
		var rFile = async_generateReport(capId, reportName, module, rptParams);

		if(rFile)
		{
			rFiles = [];
			rFiles.push(rFile);
		}
	}

	emailTEXT += "rFiles = " + rFiles + "<br/>";
	//var sent = sendNotification(emailFrom, rEmailTo, "", emailTemplate, eParamsContact, rFiles, capId);
}

/**
 * method in INCLUDE_ACCELA has bug, calling report.getOutput() or Report Model not Script Result
 * @param itemCap
 * @param reportName
 * @param module
 * @param parameters
 * @returns
 */
function async_generateReport(itemCap, reportName, module, parameters)
{
	//returns the report file which can be attached to an email.
	var user = currentUserID; // Setting the User Name
	var report;
	var reportOutput;
	var reportInfoModel = aa.reportManager.getReportInfoModelByName(reportName);

	if(!reportInfoModel || !reportInfoModel.getSuccess())
	{
		logDebug("**WARN BLD_RUNREPORTASYNC :: async_generateReport() failed to get report info: " + reportInfoModel.getErrorMessage());
		return false;
	}

	report = reportInfoModel.getOutput();
	report.setModule(module);
	report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
	report.setReportParameters(parameters);
	report.getEDMSEntityIdModel().setAltId(parameters.get("altID"));
	emailTEXT += "itemCap.getCustomID() = " + parameters.get("altID") + "<br/>";

	var permit = aa.reportManager.hasPermission(reportName, user);

	if(permit.getOutput().booleanValue())
	{
		var reportResult = aa.reportManager.getReportResult(report);

		if(reportResult)
		{
			reportOutput = reportResult.getOutput();
			var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
			reportFile = reportFile.getOutput();
			logDebug("BLD_RUNREPORTASYNC : reportFile=" + reportFile);

			return reportFile;
		}
		else
		{
			logDebug("**WARN BLD_RUNREPORTASYNC :: async_generateReport() failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());

			return false;
		}
	}
	else
	{
		logDebug("**WARN BLD_RUNREPORTASYNC :: async_generateReport() You have no permission.");

		return false;
	}
}


function generateReport2(aaReportName,parameters,rModule) {
	var reportName = aaReportName;
	var user = "ADMIN";
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
  
    report.setModule(rModule);
    report.setCapId(capId);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName,user);

    if(permit.getOutput().booleanValue())
       var reportResult = aa.reportManager.getReportResult(report);
     
       if(reportResult) {
	       reportResult = reportResult.getOutput();
	       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
			//logMessage("Report Result: "+ reportResult);
	       reportFile = reportFile.getOutput();
	       return reportFile
       } else {
       		//logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
       		return false;
       }
}

function generateReport_(itemCap, reportName, module, parameters)
{
	var user = "ADMIN";
	var report = aa.reportManager.getReportInfoModelByName(reportName);

	if (!report.getSuccess() || report.getOutput() == null)
	{
		aa.print("**WARN report generation failed, missing report or incorrect name: " + reportName);

		return false;
	}

	report = report.getOutput();
	report.setModule(module);
	report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
	report.setReportParameters(parameters);

	var permit = aa.reportManager.hasPermission(reportName, user);

	if (permit.getOutput().booleanValue())
	{
		var reportResult = aa.reportManager.getReportResult(report);

		if (reportResult.getSuccess())
		{
			reportOutput = reportResult.getOutput();
			var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
			reportFile = reportFile.getOutput();

			return reportFile;
		}
		else
		{
			logDebug("**WARN BLD_RUNREPORTASYNC :: async_generateReport() failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
			aa.print("**WARN BLD_RUNREPORTASYNC :: async_generateReport() failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());

			return false;
		}
	}
	else
	{
		logDebug("**WARN BLD_RUNREPORTASYNC :: generateReport_() You have no permission.");
		aa.print("**WARN BLD_RUNREPORTASYNC :: generateReport_() You have no permission.");

		return false;
	}
}

function wait(ms)
{
	var start = new Date().getTime();
	var end = start;

	while(end < start + ms)
	{
		end = new Date().getTime();
	}
}


function runReportAttach_async(itemCapId,aaReportName)
	{
	var reportName = aaReportName;
	reportResult = aa.reportManager.getReportInfoModelByName(reportName);
	if (!reportResult.getSuccess())
		{ logDebug("**WARNING** couldn't load report " + reportName + " " + reportResult.getErrorMessage()); return false; }
	var report = reportResult.getOutput(); 
	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	itemAppTypeResult = itemCap.getCapType();
	itemAppTypeString = itemAppTypeResult.toString(); 
	itemAppTypeArray = itemAppTypeString.split("/");
	report.setModule(itemAppTypeArray[0]); 
	report.setCapId(itemCapId.getID1() + "-" + itemCapId.getID2() + "-" + itemCapId.getID3()); 
	report.getEDMSEntityIdModel().setAltId(itemCapId.getCustomID());
	var parameters = aa.util.newHashMap(); 
	if(arguments.length > 2 && arguments[2].getClass().toString().equals("class java.lang.String")){
		// optional parameters are report parameter pairs
		// for example: runReportAttach_async(capId,"ReportName","altid",capId.getCustomID(),"months","12");
		for (var i = 2; i < arguments.length ; i = i+2)
		{
			parameters.put(arguments[i],arguments[i+1]);
			logDebug("Report parameter: " + arguments[i] + " = " + arguments[i+1]);
		}
	}
	else if(arguments.length > 2 && arguments[2].getClass().toString().equals("class java.util.HashMap")){
		// optional argument is a hashmap so assign it to parameters
		parameters = arguments[2]
	}
	report.setReportParameters(parameters);
	var permit = aa.reportManager.hasPermission(reportName,currentUserID); 
	if(permit.getOutput().booleanValue()) 
		{ 
			var reportResult = aa.reportManager.getReportResult(report); 
			if(reportResult){
				logDebug("Report " + aaReportName + " has been run for " + itemCapId.getCustomID());
				return true;
			}
		}
	else{
		logDebug("No permission to report: "+ reportName + " for user: " + currentUserID);
		return false;
	}
} 