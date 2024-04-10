var myCapId = "SHD-A-1880";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Application Submital"; wfStatus = "Complete"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
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

// TASK MKEBL-217
// 01/17/2024
// AUTHOR JACOB CLAY (BYRNE SOFTWARE) 

if (appMatch('Licenses/Business/Secondhand Dealer/*') && wfTask == 'Application Submittal' && wfStatus == 'Complete'){

    logDebug('>>>Start of 217')
    var asiBicycleOnly = AInfo['Secondhand Dealer-Bicycles Only'];
    var asiSHD = AInfo['Secondhand Dealer']
    var asiSHDMall = AInfo['Secondhand Dealer Mall']
    var asiPawn = AInfo['Pawnbroker']
    var asiPMG = AInfo['Precious Metal & Gem Dealer']

    if (asiBicycleOnly == 'CHECKED' && !matches('CHECKED', asiSHD, asiSHDMall, asiPawn, asiPMG)){
      if (isTaskActive('MPD Fingerprinting')){
        deactivateTask('MPD Fingerprinting')
      }
    }
    
    logDebug('<<<End of 217')

  }
 


} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
// END SCRIPT TESTER




function exploreObject(objExplore) {
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
  logDebug('');

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
}



function addASITable4ACAPageFlowCamp(destinationTableGroupModel, tableName, tableValueArray) { 
	// optional capId
    //  tableName is the name of the ASI table
    //  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
    //

    var itemCap = capId
    if (arguments.length > 3)
        itemCap = arguments[3]; // use cap ID specified in args

    var ta = destinationTableGroupModel.getTablesMap().values();
    logDebug(capId)
    var tai = ta.iterator();

    var found = false;
    while (tai.hasNext()) {
        var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
        
        if (tsm.getTableName().equals(tableName)) {
            found = true;
            break;
        }
    }

    if (!found) {
        logDebug("cannot update asit for ACA, no matching table name");
        return false;
    }

    var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
    var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
    var i = -1; // row index counter

    for (thisrow in tableValueArray) {
        aa.print(tableValueArray[thisrow])

        var col = tsm.getColumns()
        var coli = col.iterator();
        while (coli.hasNext()) {
            var colname = coli.next();

            if (typeof (tableValueArray[thisrow][colname.getColumnName()]) == "object") // we are passed an asiTablVal Obj
            {
                var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
                var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
                fld.add(fldToAdd);
                fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

            } else // we are passed a string
            {
                var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
                var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(false);
                fld.add(fldToAdd);
                fld_readonly.add("N");

            }
        }

        i--;

        //tsm.setTableField(fld);
        tsm.setReadonlyField(fld_readonly); // set readonly field
    }
    tsm.setTableFields(fld);

    //tssm = tsm;

    aa.print(tsm.getTableName())
    var newfields = tsm.getTableFields();
    aa.print(newfields)

    return destinationTableGroupModel;
}

function getASITablesRowsFromSession4ACA(tableName) {
  var gm = null;
  if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
      gm = cap.getCapModel().getAppSpecificTableGroupModel();
  } else {
      gm = cap.getAppSpecificTableGroupModel();
  }
  if (gm == null) {
      return false;
  }
  var ta = gm.getTablesMap();
  var tai = ta.values().iterator();
  while (tai.hasNext()) {
      var tsm = tai.next();
      if (tsm.rowIndex.isEmpty())
          continue;

      var asitRow = new Array;
      var asitTables = new Array;
      var tn = tsm.getTableName();
      if (tn != tableName) {
          continue;
      }

      var tsmfldi = tsm.getTableField().iterator();
      var tsmcoli = tsm.getColumns().iterator();
      while (tsmfldi.hasNext()) {

          var tcol = tsmcoli.next();
          var tval = tsmfldi.next();

          asitRow[tcol.getColumnName()] = tval;

          if (!tsmcoli.hasNext()) {
              tsmcoli = tsm.getColumns().iterator();
              asitTables.push(asitRow);
              asitRow = new Array;
          }
      }
      return asitTables;
  }
  return false;
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



