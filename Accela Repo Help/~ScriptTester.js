var myCapId = 'ALIQR-A22-00008';
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed w. Fee"; inspResultComment = "Comment";  inspType = "Roofing"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ //var eventName = "ConverToRealCAPAfter";
/* IFA */ //var eventName = 'InvoiceFeeAfter' ; var InvoiceNbrArray = []
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.

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
doConfigurableScriptActions();

//
// User code goes here
//

try {
  logDebug('>>>>>>>> Start of script test');

  showDebug = true;
  publicUser = true;

    //populate email notification parameters
    var emailSendFrom = "";
    var emailSendTo = "";
    var emailCC = "";
    var emailParameters = aa.util.newHashtable();
    var emailTemplate = "PLN_FEES_PAID";
    var fileNames = [];
  
    
    getRecordParams4Notification(emailParameters);
    //getAPOParams4Notification(emailParameters);
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
    getACARecordParam4Notification(emailParameters, acaSite);
    var applicantEmail = "";
    var contObj = {};
    contObj = getContactArray(capId);
    if (typeof(contObj) == "object") {
        for (co in contObj) {
            if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
                applicantEmail += contObj[co]["email"] + ";";
        }
    }
  
    addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);
  
  
    var receiptNbr = '';
    var receiptArray = aa.finance.getPaymentByCapID(capId, null)
     if (receiptArray.getSuccess()){
       receiptArray = receiptArray.getOutput();
       receiptNbr = receiptArray[0].getReceiptNbr()
       // for (i in receiptArray){
       //   var receipt = receiptArray[i];
       //   logDebug(receipt.getReceiptNbr())
       //   // exploreObject(receipt)
       // }
       logDebug('Most recent Receipt: ' + receiptNbr)
     }
   
    var reportParams = aa.util.newHashtable();
    addParameter(reportParams, "capid", capIDString); logDebug('capIdString: ' + capIDString)
    addParameter(reportParams, "receiptnbr", String(receiptNbr)); logDebug('receiptnbr: ' + receiptNbr)
    var issuedPermitReport = generatePlanningReport("AutoReceipt", reportParams, "Planning");
  
    if (applicantEmail != "") {
        sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, new Array(issuedPermitReport));
    }


} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);


// END SCRIPT TESTER
// HELPER FUNCTIONS BELOW
function emailPlanningInvoice() {
  //populate email notification parameters
  var emailSendFrom = "";
  var emailSendTo = "";
  var emailCC = "";
  var emailParameters = aa.util.newHashtable();
  var emailTemplate = "PLN_FEES_DUE";
  var fileNames = [];

  getRecordParams4Notification(emailParameters);
  //getAPOParams4Notification(emailParameters);
  var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
  acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
  getACARecordParam4Notification(emailParameters, acaSite);
  var applicantEmail = "";
  var contObj = {};
  contObj = getContactArray(capId);
  if (typeof(contObj) == "object") {
      for (co in contObj) {
          if (contObj[co]["contactType"] == "Applicant" && contObj[co]["email"] != null)
              applicantEmail += contObj[co]["email"] + ";";
      }
  }

  addParameter(emailParameters, "$$applicantEmail$$", applicantEmail);


  var invoiceNbr;
  var iListResult = aa.finance.getInvoiceByCapID(capId,null);
  if (iListResult.getSuccess()){
     iListResult =  iListResult.getOutput();
     var lastInvoice = iListResult.length - 1;
     invoiceNbr = iListResult[lastInvoice].getInvNbr();
     logDebug('Invoice Number: ' + invoiceNbr)
  }

  var reportParams = aa.util.newHashtable();
  addParameter(reportParams, "capid", capIDString); logDebug('capIdString: ' + capIDString)
  addParameter(reportParams, "invoicenbr", String(invoiceNbr)); logDebug('invoicenbr: ' + invoiceNbr)
  var issuedPermitReport = generateReportSavetoEDMS("Planning Invoice", reportParams, "Planning");

  if (applicantEmail != "") {
      sendNotification(emailSendFrom, emailSendTo, emailCC, emailTemplate, emailParameters, new Array(issuedPermitReport));
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


