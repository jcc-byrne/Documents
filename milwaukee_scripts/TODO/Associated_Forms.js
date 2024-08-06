//  ACA_LIC_PAGEFLOW_SHD_ONLOAD_ASSOC_REC

var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM

var startDate = new Date();
var startTime = startDate.getTime();
var message = "";							// Message String
var debug = "";								// Debug String
var br = "<BR>";							// Break Tag
var useProductScripts = true;

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1];
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

// eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
//eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"), null, true);

// var testingCap = aa.cap.getCapID("24TMP-000067").getOutput();
// var capModel = aa.cap.getCapViewBySingle4ACA(testingCap);
// var capTest = aa.env.setValue("CapModel", capModel);
// aa.env.setValue("CurrentUserID", "ADMIN");

var capModel = aa.env.getValue('CapModel');
cap = aa.env.getValue('CapModel');
capId = capModel.getCapID();

	var appTypeResult = cap.getCapType();
	var appTypeString = appTypeResult.toString(); 

// Create array for tokenized variables
var AInfo = new Array();

try {
    var currentUserID = aa.env.getValue("CurrentUserID"); // Current User
    var systemUserObj = null;							// Current User Object
    var currentUserGroup = null;						// Current User Group
    var publicUserID = null;
    var publicUser = false;

    if (currentUserID.indexOf("PUBLICUSER") == 0)
    {
        publicUserID = currentUserID; 
        currentUserID = "ADMIN"; 
        publicUser = true;
    }

    if(currentUserID != null)
    {
        systemUserObj = aa.person.getUser(currentUserID).getOutput(); //Current User Object
    }

    var asiGroups = capModel.getAppSpecificInfoGroups();
    var parcelModel = capModel.getParcelModel();

    var useAppSpecificGroupName = true;
    var cancel = false;


	// Add AppSpecific Info - custom fields					
	loadAppSpecific4ACA(AInfo);

    if (matches(appTypeString, 'Licenses/Business/Secondhand Dealer/Application', 'Licenses/Business/Secondhand Dealer/Renewal')){
        var eWorkItemsASIT = getASITablesRowsFromSession4ACA("ASSOCIATED RECORDS");
            addSupplementalRecords();
    } 
    
    //to output to ACA debug window
// showDebug = true
// logDebug(appTypeString)

// aa.env.setValue("ErrorCode", "1");
// aa.env.setValue("ErrorMessage", debug);
// showMessage = true;
// cancel = true;


} catch (err) {
    logDebug(err);
    showMessage = true;
    comment('Error: ' + err);
    aa.print(err);
  }
  // page flow custom code end
  
  if (debug.indexOf('**ERROR') > 0) {
    aa.env.setValue('ErrorCode', '1');
    aa.env.setValue('ErrorMessage', debug);
  } else {
    if (cancel) {
      aa.env.setValue('ErrorCode', '-2');  
      if (showMessage) aa.env.setValue('ErrorMessage', message);
      if (showDebug) aa.env.setValue('ErrorMessage', debug);
    } else {
      aa.env.setValue('ErrorCode', '0');
      if (showMessage) {
        aa.env.setValue('ErrorMessage', message);
        aa.env.setValue('ScriptReturnCode', '1');
        aa.env.setValue('ScriptReturnMessage', debug);
      }
  
      if (showDebug) {
        aa.env.setValue('ErrorMessage', debug);
  
        aa.env.setValue('ScriptReturnCode', '1');
        aa.env.setValue('ScriptReturnMessage', debug);
      }
    }
  }
  

//Working functions...
function addSupplementalRecords() {
    var arWorkItemsASIT = new Array();
	var arRecordTypeCol="";
	var arApplicationTypeCol="";
	var arChildRecIDCol = "";
    var arRelationshipIDCol = "";
    // exploreObject(capModel.getAppSpecificTableGroupModel().getTablesMap())

        if (AInfo["MERCHANDISE AND SALES.Barcode scanner or scale"] == "Yes" ){
		arRecordTypeCol = "Weights & Measures Supplemental";
		arApplicationTypeCol = "Licenses/Business/Weights & Measures/Supplemental";

        var row = new Array();
        row["Record Type"] = new asiTableValObj("Record Type", arRecordTypeCol, "N");
        row["Application Type"] = new asiTableValObj("Application Type", arApplicationTypeCol, "N");
        row["Child Record ID"] = new asiTableValObj("Child Record ID", arChildRecIDCol, "N");
        row["RelationshipID"] = new asiTableValObj("RelationshipID", arRelationshipIDCol, "N");
        arWorkItemsASIT.push(row);
	    addASITable4ACAPageFlowCamp(capModel.getAppSpecificTableGroupModel(), "ASSOCIATED RECORDS", arWorkItemsASIT, capId);
    } else if (AInfo["MERCHANDISE AND SALES.Barcode scanner or scale"] == "No"){
        //clear table
	    addASITable4ACAPageFlowCamp(capModel.getAppSpecificTableGroupModel(), "ASSOCIATED RECORDS", [], capId);
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
        // aa.print(tableValueArray[thisrow])

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

function asiTableValObj(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;
	this.hasValue = Boolean(fieldValue != null & fieldValue != "");

	asiTableValObj.prototype.toString = function() {
		return this.hasValue ? String(this.fieldValue) : String("");
	}
};
function getRecordFileDate(pCapId) {
	var recordResult = aa.cap.getCap(pCapId);
	
	if (!recordResult.getSuccess())
		{
		logDebug("**ERROR: Failed to get record status: " + recordResult.getErrorMessage()); 
		return false;
		}
		
	var recordResultObj = recordResult.getOutput();

	if (!recordResultObj)
		{ logDebug("**ERROR: No cap script object") ; return false; }

	var cd = recordResultObj.getCapModel();

	var recordFileDate = cd.getFileDate();

	if(recordFileDate != null)
		return "" + (recordFileDate.getMonth()+1) + "/" + recordFileDate.getDate() + "/" + (parseInt(recordFileDate.getYear())+1900);
	else
		return "";
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

function getFieldValue(fieldName, asiGroups) {
    if (asiGroups == null) {
        return null;
    }

    var iteGroups = asiGroups.iterator();
    while (iteGroups.hasNext()) {
        var group = iteGroups.next();
        var fields = group.getFields();
        if (fields != null) {
            var iteFields = fields.iterator();
            while (iteFields.hasNext()) {
                var field = iteFields.next();
                if (fieldName == field.getCheckboxDesc()) {
                    return field.getChecklistComment();
                }
            }
        }
    }
    return null;
}

function getStandardChoiceValues(strControl)
{
	// Generic function to get Std Choice values based on value
	// pass in standard choice name
	// return values
	var returnVal = new Array();
	var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
	
	if (bizDomScriptResult.getSuccess())
	{
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
		
		for (var i in bizDomScriptArray)
		{
				returnVal.push(bizDomScriptArray[i].getBizdomainValue());
		}
	}
	return returnVal;
}

function loadAppSpecific4ACA(thisArr) {
    //
    // Returns an associative array of App Specific Info
    // Optional second parameter, cap ID to load from
    //
    // uses capModel in this event
    var itemCap = capId;
    if (arguments.length >= 2) {
        itemCap = arguments[1]; // use cap ID specified in args

        var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

        for (loopk in fAppSpecInfoObj) {
            if (useAppSpecificGroupName)
                thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
            else
                thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
        }
    } else {
        var capASI = cap.getAppSpecificInfoGroups();
        if (!capASI) {
            logDebug("No ASI for the CapModel");
        } else {
            var i = cap.getAppSpecificInfoGroups().iterator();

            while (i.hasNext()) {
                var group = i.next();
                var fields = group.getFields();
                if (fields != null) {
                    var iteFields = fields.iterator();
                    while (iteFields.hasNext()) {
                        var field = iteFields.next();

                        if (useAppSpecificGroupName)
                            thisArr[field.getCheckboxType() + "." + field.getCheckboxDesc()] = field.getChecklistComment();
                        else
                            thisArr[field.getCheckboxDesc()] = field.getChecklistComment();
                    }
                }
            }
        }
    }
}

function exploreObject(objExplore) {
    aa.print("Properties:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) != "function") {
            aa.print(x + " : " + objExplore[x]);
        } 
    }
    aa.print("");

    aa.print("Methods:")
    for (x in objExplore) {
        if (typeof(objExplore[x]) == "function") {
            aa.print(x);
            aa.print(objExplore[x]);
        }
    }

}
//EOF