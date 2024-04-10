var myCapId = 'C-23-001-1';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Assign Planner"; wfStatus = "Void"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConverToRealCAPAfter";
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = false; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = false; // set to true to simulate the event and run all std choices/scripts for the record type.

/* master script code don't touch */ aa.env.setValue('EventName', eventName);
var vEventName = eventName;
var controlString = eventName;
var tmpID = aa.cap.getCapID(myCapId).getOutput();
if (tmpID != null) {
  aa.env.setValue('PermitId1', tmpID.getID1());
  aa.env.setValue('PermitId2', tmpID.getID2());
  aa.env.setValue('PermitId3', tmpID.getID3());
}
aa.env.setValue('CurrentUserID', myUserId);
var preExecute = 'PreExecuteForAfterEvents';
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue(
  'MULTI_SERVICE_SETTINGS',
  'SUPER_AGENCY_FOR_EMSE'
);
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != 'I') {
  useSA = true;
  SA = bzr.getOutput().getDescription();
  bzr = aa.bizDomain.getBizDomainByValue(
    'MULTI_SERVICE_SETTINGS',
    'SUPER_AGENCY_INCLUDE_SCRIPT'
  );
  if (bzr.getSuccess()) {
    SAScript = bzr.getOutput().getDescription();
  }
}
if (SA) {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', SA, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', SA, useProductScript));
  /* force for script test*/ showDebug = true;
  eval(getScriptText(SAScript, SA, useProductScript));
} else {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', null, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', null, useProductScript));
}
eval(getScriptText('INCLUDES_CUSTOM', null, useProductScript));
if (documentOnly) {
  doStandardChoiceActions2(controlString, false, 0);
  aa.env.setValue('ScriptReturnCode', '0');
  aa.env.setValue(
    'ScriptReturnMessage',
    'Documentation Successful.  No actions executed.'
  );
  aa.abortScript();
}
var prefix = lookup('EMSE_VARIABLE_BRANCH_PREFIX', vEventName);
var controlFlagStdChoice = 'EMSE_EXECUTE_OPTIONS';
var doStdChoices = true;
var doScripts = false;
var bzr =
  aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
  var bvr1 = aa.bizDomain.getBizDomainByValue(
    controlFlagStdChoice,
    'STD_CHOICE'
  );
  doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
  var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, 'SCRIPT');
  doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
  if (!servProvCode) servProvCode = aa.getServiceProviderCode();
  vScriptName = vScriptName.toUpperCase();
  var emseBiz = aa.proxyInvoker
    .newInstance('com.accela.aa.emse.emse.EMSEBusiness')
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
        'ADMIN'
      );
    }
    return emseScript.getScriptText() + '';
  } catch (err) {
    return '';
  }
}
logGlobals(AInfo);
if (runEvent && typeof doStandardChoiceActions == 'function' && doStdChoices)
  try {
    doStandardChoiceActions(controlString, true, 0);
  } catch (err) {
    logDebug(err.message);
  }
if (runEvent && typeof doScriptActions == 'function' && doScripts)
  doScriptActions();
var z = debug.replace(/<BR>/g, '\r');
aa.print(z);
// doConfigurableScriptActions();

//
// User code goes here
//

try {
  logDebug('>>>>>>>> Start of script test');

  showDebug = true;
  publicUser = true;


  addLookup('CNB_SCORING', '10140||Three Years of Data Provided: Score', 'temp' )

  // exploreObject(aa.bizDomain)



} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);

// END SCRIPT TESTER
// HELPER FUNCTIONS BELOW

function deactivateActiveTasksLocal() {

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else

  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
			if (fTask.getActiveFlag().equals("Y"))
				deactivateTask(fTask.getTaskDescription());
		}

}

function exploreObject(objExplore) {
  logDebug('Methods:');
  for (var x in objExplore) {
    try {
      if (typeof objExplore[x] === 'function') {
        logDebug('<font color=blue><u><b>' + x + '</b></u></font> ');
        logDebug('   ' + objExplore[x] + '<br>');
      }
    } catch (err) {
      logDebug('exploreObject(): **ERROR** in Functions: ' + err.Message);
    }
    var counter = objExplore.length;
  }
  logDebug('');
  logDebug('Properties:');
  for (var y in objExplore) {
    try {
      if (typeof objExplore[y] !== 'function') {
        logDebug('  <b> ' + y + ': </b> ' + objExplore[y]);
      }
    } catch (err) {
      logDebug('exploreObject(): **ERROR** in Properties: ' + err.Message);
    }
  }
}

function updateASITwCalculated(tname) {
  //
  // Returns a single ASI Table array of arrays
  // Optional parameter, cap ID to load from
  //
  var itemCap = capId;
  if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
  var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
  var ta = gm.getTablesArray();
  var tai = ta.iterator();
  exploreObject(gm)
  /*
  while (tai.hasNext()) {
    var tsm = tai.next();
    var tn = tsm.getTableName();
    if (!tn.equals(tname)) continue;
    if (tsm.rowIndex.isEmpty()) {
      logDebug("Couldn't load ASI Table " + tname + ' it is empty');
      return false;
    }
    var tempObject = new Array();
    var tempArray = new Array();
    var tsmfldi = tsm.getTableField().iterator();
    var tsmcoli = tsm.getColumns().iterator();
    var readOnlyi = tsm
      .getAppSpecificTableModel()
      .getReadonlyField()
      .iterator(); // get Readonly filed
    var numrows = 1;
    while (tsmfldi.hasNext()) {
      // cycle through fields
      if (!tsmcoli.hasNext()) {
        // cycle through columns
        var tsmcoli = tsm.getColumns().iterator();
        tempArray.push(tempObject); // end of record
        var tempObject = new Array(); // clear the temp obj
        numrows++;
      }
      var tcol = tsmcoli.next();
      var tval = tsmfldi.next();
      var readOnly = 'N';
      if (readOnlyi.hasNext()) {
        readOnly = readOnlyi.next();
      }
      var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
      tempObject[tcol.getColumnName()] = fieldInfo;
    }
    tempArray.push(tempObject); // end of record
  }
  return tempArray;
  */
}


function createCayentaProject(){

//Script to run when Residential or Commercial Electrical permit is issued, could be from PRA or WTUA

var cayentaEndpoint = 'as';


//Setup Project Type, COMM or RES
var commOrRes = '';
var projectType = '';
if (appTypeArray[1] == 'Residential'){
  commOrRes = 'R';
  projectType = 'RES';
} else if (appTypeArray[1] == 'Commercial'){
  commOrRes = 'C';
  projectType = 'COMM';
}

//Setup Project Number, Accela Permit Number without the '-' and a R or C at the end for residential or commercial
var projectNumber = capId.getCustomID().replace('-', '') + commOrRes; logDebug('Cayenta Project Number: ' + projectNumber) //Accela Permit Number without the '-' and 'R' or 'C' appended to the end

//Setup Project Description
var asiTypeOfWork = getAppSpecific('Type of Work'); //dropdown
var asiMeterLoop = String(getAppSpecific('Meter Loop Amps')); //number field
var asiNumberOfCircuits = getAppSpecific('Number of Circuits'); //number field
var asiMotor = getAppSpecific('Motor'); //number field
var asiTempPole = getAppSpecific('Is there a temporary pole?'); //Yes No field
var asiWorkingClearance = getAppSpecific('Do you have a working clearance?'); //Yes No field

var projectDescription = ''; 

projectDescription += asiMeterLoop != null ? asiMeterLoop + ' AMPS,' : '';
projectDescription += asiTempPole =='Yes' ?  ' TEMP' : '';
projectDescription += asiWorkingClearance == 'Yes' ?  ' CLEAR' : '';

logDebug('Cayenta Project Description: ' + projectDescription); //ASI Watts, ASI Temp Pole, ASI Clearance, ASI____ 
logDebug('Cayenta Project Type: ' + projectType) //'COMM' for Commercial or 'RES' for Residential

//setup Project Expiration Date
var projectExpiration = '';
var capExpiration = aa.expiration.getLicensesByCapID(capId);
if (capExpiration.getSuccess()){
  capExpiration = capExpiration.getOutput();
  projectExpiration = capExpiration.expDateString;
}
logDebug('Cayenta Project Expiration: ' + projectExpiration);//expiration date from b1_expiration

//setup Project Comment which will be the Address (House Number, Direction, Street, Unit # AND Business Name)
var projectComment = ''; 
var adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");
if (adResult.getSuccess()){
  adResult = adResult.getOutput();
  projectComment = adResult.houseNumberStart;
  projectComment += adResult.houseNumberEnd != null ? ' ' + adResult.houseNumberEnd : '';
  projectComment += adResult.streetPrefix != null ? ' ' + adResult.streetPrefix : '';
  projectComment += adResult.streetName != null ? ' ' + adResult.streetName : '';
  projectComment += adResult.unitStart != null ? ' ' + adResult.unitStart : '';
}

projectComment += ' / BUSINESS NAME';
logDebug('Cayenta Project Comment: ' + projectComment);//House Number, Street, Direction, Unit #, and Business Name


var requestBody = '<Request>  ' +  
'<AddPermit>' +  
'<Params>' +  
'<PROJECT_NO>' + projectNumber + '</PROJECT_NO>'+ //Elect. City Permit No. (e.g., 202300012R)
'<PROJECT_NO_FDESC>' + projectDescription + '</PROJECT_NO_FDESC>'+ //Full City Description (e.g. '200 Amps, Temp')
'<PROJECT_NO_SDESC>' + projectType + '</PROJECT_NO_SDESC>'+ // e.g., 'RES' or 'COMM'
'<RELEASED_YN>' + 'F' + '</RELEASED_YN>'+ // Default to 'F' 
'<REJECTION_DT>' + projectExpiration + '</REJECTION_DT>'+ // Expiration Date from b1_expiration, (e.g., 05/04/2024)
'<COMMENTS>' + projectComment + '</COMMENTS>'+ //Address / Bus Name (e.g., '123 Main ST / MY BUSINESS')
'</Params>' + 
'</AddPermit>' + 
'</Request>' 

var headers = aa.util.newHashMap();
headers.put("Content-Type", "application/xml");
// exploreObject(aa.httpClient)

var httpResponse = aa.httpClient.post(cayentaEndpoint, headers, requestBody);

if (httpResponse.getSuccess()){
    var responseText = httpResponse.getOutput(); logDebug('Client Response: ' + responseText)    
    createCayentaPermit();
} else {
    logDebug('Error sending response to Cayenta: ' + httpResponse.getErrorMessage());
}
}

function createCayentaPermit() {

//AFTER THE PROJECT IS CREATED, CREATE PERMITS AS CHILD RECORDS IN CAYENTA
var cayentaEndpoint = 'TBD'; //to be provided by BPUB

var permitNo = ''; //cayenta utilities generated, drop the year
var permitTP = ''; //ELEC OR TRANS
var permitSTAT = 'ENTER'; //default to ENTER
var connectionTP = ''; //CLEAR, PERM, RELOC, TEMP, SERIN, HOUSE

  var requestBody = 
  '<Request>  ' +  
'<AddPermitEntry>' +  
'<Params>' +  
'<PERMIT_NO>' + permitNo + '</PERMIT_NO>'+
'<PERMIT_TP>' + permitTP + '</PERMIT_TP>'+
'<PERMIT_STAT>' + permitSTAT + '</PERMIT_STAT>'+
'<CONNECTION_TP>' + connectionTP + '</CONNECTION_TP>'+
'</Params>' + 
'</AddPermitEntry>' + 
'</Request>' 

var headers = aa.util.newHashMap();
headers.put("Content-Type", "application/xml");
// exploreObject(aa.httpClient)

var httpResponse = aa.httpClient.post(cayentaEndpoint, headers, requestBody);

if (httpResponse.getSuccess()){
  var responseText = httpResponse.getOutput(); logDebug('Client Response: ' + responseText)    
} else {
  logDebug('Error sending response to Cayenta: ' + httpResponse.getErrorMessage());
}

}

function updateCayentaPermit(){

  //after the inspection is passed, update and Release the Cayenta Permit

  var cayentaEndpoint = 'TBD'; //to be provided by BPUB

var permitNo = ''; //cayenta utilities generated, drop the year
var permitSTAT = 'REV'; //default to ENTER
var connectionTP = ''; //CLEAR, PERM, RELOC, TEMP, SERIN, HOUSE

  var requestBody = 
'<Request>  ' +  
'<AddPermitEntry>' +  
'<Params>' +  
'<PERMIT_NO>' + permitNo + '</PERMIT_NO>'+
'<PERMIT_TP>' + permitTP + '</PERMIT_TP>'+
'<PERMIT_STAT>' + permitSTAT + '</PERMIT_STAT>'+
'<CONNECTION_TP>' + connectionTP + '</CONNECTION_TP>'+
'</Params>' + 
'</AddPermitEntry>' + 
'</Request>' 

var headers = aa.util.newHashMap();
headers.put("Content-Type", "application/xml");
// exploreObject(aa.httpClient)

var httpResponse = aa.httpClient.post(cayentaEndpoint, headers, requestBody);

if (httpResponse.getSuccess()){
  var responseText = httpResponse.getOutput(); logDebug('Client Response: ' + responseText)    
} else {
  logDebug('Error sending response to Cayenta: ' + httpResponse.getErrorMessage());
}

}