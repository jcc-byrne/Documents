/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BEFORE_REQ_CUSTOM_LIST.js
| Event   : ACA_BEFORE_REQ_CUSTOM_LIST Event
|
| Usage   : Make sure there is at least 1 row added to the Custom List Table.
|           
| Client  : N/A
| Action# : N/A
|
| Notes   : 
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

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
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
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

//TESTING
//  var testingCap = aa.cap.getCapID("23TMP-000276").getOutput();
//  var capModel = aa.cap.getCapViewBySingle4ACA(testingCap);
//  var capTest = aa.env.setValue("CapModel", capModel);
//  aa.env.setValue("CurrentUserID", "ADMIN");


var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode() // Service Provider Code
	var publicUser = false;
var currentUserID = aa.env.getValue("CurrentUserID");
var publicUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) {
	currentUserID = "ADMIN";
	publicUser = true
} // ignore public users
var capIDString = capId.getCustomID(); // alternate cap id string
var systemUserObj = aa.person.getUser(currentUserID).getOutput(); // Current User Object
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString(); // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/"); // Array of application type string
var currentUserGroup;
var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput()
if (currentUserGroupObj)
    currentUserGroup = currentUserGroupObj.getGroupName();
var capName = cap.getSpecialText();
var capStatus = cap.getCapStatus();
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
var parcelArea = 0;

var estValue = 0;
var calcValue = 0;
var feeFactor // Init Valuations
var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput(); // Calculated valuation
if (valobj.length) {
	estValue = valobj[0].getEstimatedValue();
	calcValue = valobj[0].getCalculatedValue();
	feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
}

var balanceDue = 0;
var houseCount = 0;
feesInvoicedTotal = 0; // Init detail Data
var capDetail = "";
var capDetailObjResult = aa.cap.getCapDetail(capId); // Detail
if (capDetailObjResult.getSuccess()) {
	capDetail = capDetailObjResult.getOutput();
	var houseCount = capDetail.getHouseCount();
	var feesInvoicedTotal = capDetail.getTotalFee();
	var balanceDue = capDetail.getBalance();
}

var AInfo = new Array(); // Create array for tokenized variables
loadAppSpecific4ACA(AInfo); // Add AppSpecific Info
//loadTaskSpecific(AInfo);						// Add task specific info
//loadParcelAttributes(AInfo);						// Add parcel attributes
loadASITables();
// page flow custom code begin

try {

	var tables = new Array();
    tables.push('REQUESTED DATES AND HOURS');

    //  if ((AInfo['ConvictionProvided'] == 'No' || AInfo['ConvictionProvided'] == null) && AInfo['Prior Cannabis Convictions'] == 'CHECKED' ){
    // }  

	var errors = new Array();
	var oneRowEntered = false;

	for(var i in tables) {
		var tableName = tables[i];
		var tableObj = loadASITable4ACA(tableName, cap);
		if (!tableObj || tableObj.length == 0) {			
			errors.push("Must enter at least one row in the "+ tableName + " table below to continue.");
		} else {
			oneRowEntered = true;
		}
	}

	if (!oneRowEntered) {
		if(errors.length > 0) {
			showMessage = true;
			comment(errors);
			//comment("At least one row must be completed in the tables below.");
			cancel = true;
		}
	}



	
} catch (err) {
	logDebug(err);
    showMessage = true;
    comment("Error: " + err);
	aa.print(err)
}
// page flow custom code end


if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
        //aa.print("Reached");
		aa.env.setValue("ErrorCode", "0");
		if (showMessage) {
            aa.env.setValue("ErrorMessage", message);
            //aa.print("Reached1");
        }
			
		if (showDebug) {
            aa.env.setValue("ErrorMessage", debug);
            //aa.print("Reached2");
        }
			
	}
}

function sbcoGetEnvironment()

{
   var vEventName = aa.env.getValue("EventName");
    var params = aa.env.paramValues;
    var keys = params.keys(); // class java.util.Hashtable$Enumerator ;
    var key = null;
    comment('***** Begin List Environment for the ' + vEventName + ' event *****');
    while (keys.hasMoreElements())
    {
        key = keys.nextElement();
        //logDebug("var " + key + " = aa.env.getValue( \"" + key + "\" ) ;");
        //logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
        comment('var ' + key + ' = ' + aa.env.getValue(key) + ' ;');
    }
    comment('***** End List Environment for the ' + vEventName + ' event *****');
}

function aaExplore(objExplore) {
	comment("Methods:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) == "function") {
			aa.print(x);
			aa.print(objExplore[x]);
		}
	}
	comment("");
	comment("Properties:")
	for (x in objExplore) {
		if (typeof(objExplore[x]) != "function") {
			comment(x + " : " + objExplore[x]);
		} 
	}
}

function loadASITable4ACA(tname, cap) {
    var gm = cap.getAppSpecificTableGroupModel()
        var ta = gm.getTablesMap();
    var tai = ta.values().iterator();
    while (tai.hasNext()) {
        var tsm = tai.next();
        var tn = tsm.getTableName();

        if (!tn.equals(tname))
            continue;
        if (tsm.rowIndex.isEmpty()) {
            aa.print("Couldn't load ASI Table " + tname + " it is empty");
            return false;
        }

        var tempObject = new Array();
        var tempArray = new Array();

        var tsmfldi = tsm.getTableField().iterator();
        var tsmcoli = tsm.getColumns().iterator();
        var numrows = 1;
        while (tsmfldi.hasNext()) // cycle through fields
        {
            if (!tsmcoli.hasNext()) // cycle through columns
            {
                var tsmcoli = tsm.getColumns().iterator();
                tempArray.push(tempObject); // end of record
                var tempObject = new Array(); // clear the temp obj
                numrows++;
            }
            var tcol = tsmcoli.next();
            var tval = tsmfldi.next();
            var readOnly = 'N';
            var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
            tempObject[tcol.getColumnName()] = fieldInfo;

        }
        tempArray.push(tempObject); // end of record
    }
    return tempArray;
}