//  ACA_ONLOAD_LIC_HOURS_OF_OPERATION

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

// var testingCap = aa.cap.getCapID("24TMP-000600").getOutput();
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
    var currentLicASIT = loadASITable('CURRENT LICENSES');
    removeASITableLocal('CHANGE OF HOURS')

    var licToCopy = '';
    if (currentLicASIT && currentLicASIT.length > 0){
        currentLicASIT.forEach(function (row){
            var applyChange = row["Apply Change"].toString()
            var licenseNumber = row["License Number"]
            if (applyChange.toUpperCase() == 'YES'){
                licToCopy = licenseNumber
            }
        })
    }

    var arWorkItemsASIT = new Array();

    if (licToCopy){
        aa.print('Copy Hours from ' + licToCopy)
        var tCapId = aa.cap.getCapID(licToCopy)
        if (tCapId.getSuccess()){
            tCapId = tCapId.getOutput();
            var tHoursASIT = loadASITable("HOURS OF OPERATION", tCapId);
            
            for (i in tHoursASIT){
                var row = tHoursASIT[i]
                var day = row["Day of the Week"].toString();
                var closed = row["Closed"].toString()
                var openTime = closed == 'No' ? row["Open Time (include am or pm)"].toString() : "CLOSED"
                var closeTime = closed == 'No' ? row["Close Time (include am or pm)"].toString() : "CLOSED"
                aa.print(day)

                aa.print(openTime)
                aa.print(closeTime)


                var newRow = new Array();

                newRow["Day of the Week"] = new asiTableValObjLocal("Day of the Week", day, "Y");
                newRow["Approved Hours of Operation - Start Time"] = new asiTableValObjLocal("Approved Hours of Operation - Start Time", openTime, "Y");
                newRow["Approved Hours of Operation - End Time"] = new asiTableValObjLocal("Approved Hours of Operation - End Time", closeTime, "Y");
                newRow["Proposed Hours - Start Time"] = new asiTableValObjLocal("Proposed Hours - Start Time",null, "N");
                newRow["Proposed Hours - End Time"] = new asiTableValObjLocal("Proposed Hours - End Time", null, "N");

                arWorkItemsASIT.push(newRow);

            }

            aa.print('Adding Rows')
            var res = addASITable4ACAPageFlow_(capModel.getAppSpecificTableGroupModel(), "CHANGE OF HOURS", arWorkItemsASIT)


        }
    }

   
    //to output to ACA debug window
// showDebug = true
// logDebug(appTypeString)

// aa.env.setValue("ErrorCode", "1");
// aa.env.setValue("ErrorMessage", debug);
// showMessage = true;
// cancel = true;
// aa.sendMail('noreply@accela.com', 'jcc@byrnesoftware.com', '', 'ACA_ONLOAD_TCOP_CHANGE', debug)


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
      aa.print('Reached');
      aa.env.setValue('ErrorCode', '0');
      if (showMessage) {
        aa.env.setValue('ErrorMessage', message);
          aa.print("Reached1");
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

function removeASITableLocal(tableName) // optional capId
{
//  tableName is the name of the ASI table
//  tableValues is an associative array of values.  All elements MUST be strings.

var itemCap = capId
if (arguments.length > 1)
  itemCap = arguments[1]; // use cap ID specified in args
var tssmResult = aa.appSpecificTableScript.removeAppSpecificTableInfos(tableName,itemCap,currentUserID)
if (!tssmResult.getSuccess())
  { aa.print("**WARNING: error removing ASI table " + tableName + " " + tssmResult.getErrorMessage()) ; return false }
  else{
logDebug("Successfully removed all rows from ASI Table: " + tableName);
aa.print("Successfully removed all rows from ASI Table: " + tableName);

  }
}

function addASITable4ACAPageFlow_(destinationTableGroupModel, tableName, tableValueArray) {
    var ta = destinationTableGroupModel.getTablesMap().values();
    var tai = ta.iterator();
    var tsm;

    var found = false;
    while (tai.hasNext()) {
        tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
        if (tsm.getTableName().equals(tableName)) {
            found = true;
            break;
        }
    }

    if (!found) {
        aa.print("Error: cannot update asit for ACA, no matching table name.");
        return false;
    }

    var i = -1; // row index counter
    if (tsm.getTableFields() != null) {
        i = 0 - tsm.getTableFields().size();
    }



    for (var thisrow in tableValueArray) {
        var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
        var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
        var col = tsm.getColumns();
        var coli = col.iterator();
        while (coli.hasNext()) {
            var args;
            var fldToAdd;
            var colname = coli.next();

            if (!tableValueArray[thisrow][colname.getColumnName()]) {
                aa.print("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
                tableValueArray[thisrow][colname.getColumnName()] = "";
            }


            if (typeof (tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") {
                // we are passed an asiTablVal Obj
                args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
                fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
                fld.add(fldToAdd);
                fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

            } else {
                // we are passed a string
                args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
                fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
                fldToAdd.setRowIndex(i);
                fldToAdd.setFieldLabel(colname.getColumnName());
                fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
                fldToAdd.setReadOnly(false);
                fld.add(fldToAdd);
                fld_readonly.add("N");
            }
        }

        i--;

        if (tsm.getTableFields() == null) {
            tsm.setTableFields(fld);
        } else {
            tsm.getTableFields().addAll(fld);
        }

        if (tsm.getReadonlyField() == null) {
            tsm.setReadonlyField(fld_readonly); // set readonly field
        } else {
            tsm.getReadonlyField().addAll(fld_readonly);
        }
    }

    tssm = tsm;
    return destinationTableGroupModel;
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

function asiTableValObjLocal(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;
	this.hasValue = Boolean(fieldValue != null & fieldValue != "");
	asiTableValObj.prototype.toString=function(){ return this.hasValue ? String(this.fieldValue) : String(""); }
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

function appMatchLocal(ats) // optional capId or CapID string
	{
    appTypeResult = cap.getCapType();
	appTypeString = appTypeResult.toString(); 
	appTypeArray = appTypeString.split("/")
	var matchArray = appTypeArray //default to current app
	if (arguments.length == 2) 
		{
		matchCapParm = arguments[1]
		if (typeof(matchCapParm) == "string")
			matchCapId = aa.cap.getCapID(matchCapParm).getOutput();   // Cap ID to check
		else
			matchCapId = matchCapParm;
		if (!matchCapId)
			{
			logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
			return false
			}
		matchCap = aa.cap.getCap(matchCapId).getOutput();
		matchArray = matchCap.getCapType().toString().split("/");
		}
		
	var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
	else
		for (xx in ata)
			if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
	}	

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
      function addASITable_(tableName, tableValueArray) {
        var localCurrentUserID = "";
    
        var itemCap;
        if (arguments.length > 2) {
            itemCap = arguments[2]; // use cap ID specified in args
        } else {
            if (typeof capId != "undefined") {
                var itemCap = capId;
            }
        }
    
        if (!itemCap ||  typeof itemCap.getCustomID == "undefined") {
            aa.print("Error: addASITable - global 'capId' is undefined/null and no usable value was passed for 'itemCap'");
            return false;
        }
    
        if (typeof currentUserID === typeof undefined) {
            localCurrentUserID = String(aa.env.getValue("CurrentUserID"));
        } else {
            localCurrentUserID = currentUserID;
        }
        if (localCurrentUserID == "") {
            aa.print("Error: currentUserID variable isn't set at CurrentUserID environment variable isn't available.");
            return false;
        }
    
    
        var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName);
    
        if (!tssmResult.getSuccess()) {
            aa.print("EMSE API Error: addASITable - error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
            return false;
        }
    
        var tssm = tssmResult.getOutput();
        var tsm = tssm.getAppSpecificTableModel();
        var fld = tsm.getTableField();
        var fld_readonly = tsm.getReadonlyField(); // get Readonly field
    
        for (var thisrow in tableValueArray) {
            var col = tsm.getColumns();
            var coli = col.iterator();
            while (coli.hasNext()) {
                var colname = coli.next();
    
                if (!tableValueArray[thisrow][colname.getColumnName()]) {
                    aa.print("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
                    tableValueArray[thisrow][colname.getColumnName()] = "";
                }
    
                if (typeof (tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") {
                    // we are passed an asiTablVal Obj
                    fld.add(tableValueArray[thisrow][colname.getColumnName()].fieldValue);
                    fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);
                    //fld_readonly.add(null);
                } else {
                    // we are passed a string
                    fld.add(tableValueArray[thisrow][colname.getColumnName()]);
                    fld_readonly.add(null);
                }
            }
            tsm.setTableField(fld);
            tsm.setReadonlyField(fld_readonly);
        }
    
        var addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, localCurrentUserID);
        if (!addResult.getSuccess()) {
            aa.print("EMSE API Error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
            return false;
        } else {
            aa.print("Successfully added record to ASI Table: " + tableName);
        }
        return true;
    } 
//EOF