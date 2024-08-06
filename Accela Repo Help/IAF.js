/*------------------------------------------------------------------------------------------------------/
| Program : INCLUDES_ACCELA_FUNCTIONS.js
| Event   : N/A
|
| Usage   : Accela Inc. Developed Master Script Functions.  This file should not be modified.  For custom
			includes make additions and overrides to the INCLUDES_CUSTOM script file.
|
| Notes   : For Application Submit Before see INCLUDES_ACCELA_FUNCTIONS_ASB
|
/------------------------------------------------------------------------------------------------------*/

var INCLUDE_VERSION = "23.2.1";

//@ts-check
/** 
 * Makes workflow task wfstr active and not completed, so that users can edit wfstr
 * @param {String} wfstr Name of task to activate.
 */
function activateTask(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	if (typeof capId === typeof undefined) {
		logDebug("capId is undefined.");
		return false;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	} else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.adjustTask(capId, stepnumber, processID, "Y", "N", null, null);
			} else {
				aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null);
			}
			logMessage("Activating Workflow Task: " + wfstr);
			logDebug("Activating Workflow Task: " + wfstr);
		}
	}
	return true;
}
 
//@ts-check
/** 
 * Activates the license when the status is "About to expire", "Expired", or "Delinquent".
 * @param {String} capid
* @returns 
*/
function activeLicense(capid) {
	if (capid == null || aa.util.instanceOfString(capid)) {
		return false;
	}
	//1. Set status to "Active", and update expired date.
	var result = aa.expiration.activeLicensesByCapID(capid);
	if (result.getSuccess()) {
		return true;
	} else {
		aa.print("ERROR: Failed to activate License with CAP(" + capid + "): " + result.getErrorMessage());
	}
	return false;
}
 
//@ts-check
/**
 * 
 */
function activeTasksCheck() {

	if (typeof capId === typeof undefined) {
		logDebug("CapId is undefinded.");
		return false;
	}

	var workflowResult = aa.workflow.getTasks(capId);
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	} else {
		logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getActiveFlag().equals("Y")) {
			return true;
		}
	}
	return false;
}
 
//@ts-check
/**
* Adds a condition to the specified reference address. If a standard condition is associated with an ASI group
*  (condition template), the method adds the condition with the template fields and tables. You can call the
*  method to add duplicate conditions to a record.
* Notes: If addNum is null, the function adds the condition to all reference addresses associated with the current record.
 * @param {Number} addNum Reference address number or null.
 * @param {String} cType Type of condition (from admin->condition->condition type).
 * @param {String} cStatus Status (from admin->condition->condition status).
 * @param {String} cDesc Description of the condition.
 * @param {String} cComment Condition comment.
 * @param {String} cImpact Must be Lock, Hold, Notice, Required, or “”.
 * 
 * @returns {boolean} Returns true if successful, false if not.
 */

function addAddressCondition(addNum, cType, cStatus, cDesc, cComment, cImpact) {
	if (!addNum) {
		if (typeof capId === typeof undefined) {
			logDebug("ERROR : function 'addAddressCondition' requires global 'capId' be defined if parameter 'addNum' is not undefined.");
			return false;
		}
	}

	var localSysUserObj;
	if (typeof systemUserObj === typeof undefined || !systemUserObj) {
		var localSysUserObjResult = aa.person.getUser(aa.env.getValue("CurrentUserID"));
		if (localSysUserObjResult.getSuccess()) {
			localSysUserObj = localSysUserObjResult.getOutput();
		} else {
			logDebug("EMSE API error: " + localSysUserObjResult.getErrorMessage());
			return false;
		}
		if (localSysUserObj == null) {
			logDebug("Error: Cannot get user from env variable 'CurrentUserID'. Ensure 'systemUserObj' is defined.");
			return false;
		}

	} else {
		localSysUserObj = systemUserObj;
	}

	var localSysDate = aa.date.getCurrentDate();

	if (!addNum) {
		//if addNum is null, condition is added to all addresses on CAP

		var capAddResult = aa.address.getAddressByCapId(capId);

		if (capAddResult.getSuccess()) {
			var Adds = capAddResult.getOutput();
			for (var zz in Adds) {

				if (Adds[zz].getRefAddressId()) {
					var addAddCondResult = aa.addressCondition.addAddressCondition(Adds[zz].getRefAddressId(), cType, cDesc, cComment, null, null, cImpact, cStatus, localSysDate, null, localSysDate, localSysDate, localSysUserObj, localSysUserObj);

					if (addAddCondResult.getSuccess()) {
						logDebug("Successfully added condition to reference Address " + Adds[zz].getRefAddressId() + "  (" + cImpact + ") " + cDesc);
						return true;
					} else {
						logDebug("**ERROR: adding condition to reference Address " + Adds[zz].getRefAddressId() + "  (" + cImpact + "): " + addAddCondResult.getErrorMessage());
						return false;
					}
				}
			}
		}
		return false;
	} else {
		var addAddCondResult = aa.addressCondition.addAddressCondition(addNum, cType, cDesc, cComment, null, null, cImpact, cStatus, localSysDate, null, localSysDate, localSysDate, localSysUserObj, localSysUserObj);
		if (addAddCondResult.getSuccess()) {
			logDebug("Successfully added condition to Address " + addNum + "  (" + cImpact + ") " + cDesc);
			return true;
		} else {
			logDebug("**ERROR: adding condition to Address " + addNum + "  (" + cImpact + "): " + addAddCondResult.getErrorMessage());
			return false;
		}
	}
}
 
//@ts-check
/**
 * addAddressDistrict adds a District value to a Record Address.
 * If no value is supplied for addrNum parameter, an attempt will be made to add the supplied districtValue to the first Address on the Record.
 * Global var 'capId' should be in scope and assigned a value.
 * @param {number} addrNum 
 * @param {string} districtValue 
 * @returns 
 */
//if addrNum is null, district is is added to all addresses on the Record
function addAddressDistrict(addrNum, districtValue) {

  if (typeof capId === typeof undefined) {
    logDebug("'addAddressDistrict' global 'capId' is undefined.");
    return false;
  }

  if (!addrNum) {
    var capAddrResult = aa.address.getAddressByCapId(capId);
    if (capAddrResult.getSuccess()) {
      var addrs = capAddrResult.getOutput();
      for (var zz in addrs) {
        var apdResult = aa.address.addAddressDistrictForDaily(capId.getID1(), capId.getID2(), capId.getID3(), addrs[zz].getAddressId(), districtValue);

        if (!apdResult.getSuccess()) {
          logDebug("**ERROR Adding District " + districtValue + " to address #" + addrs[zz].getAddressId() + " : " + apdResult.getErrorMessage());
          return false;
        } else {
          logDebug("Successfully added district " + districtValue + " to address #" + addrs[zz].getAddressId());
          // halt after first success
          break;
        }
      }
    }
  } else {
    var apdResult = aa.address.addAddressDistrictForDaily(capId.getID1(), capId.getID2(), capId.getID3(), addrNum, districtValue);

    if (!apdResult.getSuccess()) {
      logDebug("**ERROR Adding District " + districtValue + " to address #" + addrNum + " : " + apdResult.getErrorMessage());
      return false;
    } else {
      logDebug("Successfully added district " + districtValue + " to address #" + addrNum);
    }
  }
  return true;
} 
//@ts-check
/**
 * Adds a standard condition to the specified reference address. If a standard condition is associated with an
 * ASI group (condition template), the method adds the condition with the template fields and tables. You can
 * call the method to add duplicate conditions to a record
 * @param {Number} addNum Reference address number or null.
 * @param {String} cType Type of the standard condition.
 * @param {String} cDesc Description of the standard condition.
 * @returns {boolean} Returns true if successful and no errors, false if errors
 */

function addAddressStdCondition(addNum, cType, cDesc) {
	var foundCondition = false;

	var cStatus = "Applied";
	if (arguments.length > 3) {
		cStatus = arguments[3]; // use condition status in args
	}

	var localSysUserObj;
	if (typeof systemUserObj === typeof undefined || !systemUserObj) {
		var localSysUserObjResult = aa.person.getUser(aa.env.getValue("CurrentUserID"));
		if (localSysUserObjResult.getSuccess()) {
			localSysUserObj = localSysUserObjResult.getOutput();
		} else {
			logDebug("EMSE API error: " + localSysUserObjResult.getErrorMessage());
			return false;
		}
		if (localSysUserObj == null) {
			logDebug("Error: Cannot get user from env variable 'CurrentUserID'. Ensure 'systemUserObj' is defined.");
			return false;
		}
	} else {
		localSysUserObj = systemUserObj;
	}

	var localSysDate = aa.date.getCurrentDate();

	if (!aa.capCondition.getStandardConditions) {
		logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
		return false;
	} else {

		if (!cType || !cDesc) {
			logDebug("cType or Cdesc are not defined");
			return false;
		}
		var standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (var i = 0; i < standardConditions.length; i++) {
			if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) {
				//EMSE Dom function does like search, needed for exact match

				var standardCondition = standardConditions[i]; // add the last one found

				foundCondition = true;
				if (!addNum) {
					// add to all reference address on the current capId
					if (typeof capId === typeof undefined) {
						logDebug("capId is undefined.");
						return false;
					}

					var capAddResult = aa.address.getAddressByCapId(capId);
					if (capAddResult.getSuccess()) {
						var Adds = capAddResult.getOutput();
						var success = true;
						for (var zz in Adds) {
							if (Adds[zz].getRefAddressId()) {
								var addAddCondResult = aa.addressCondition.addAddressCondition(Adds[zz].getRefAddressId(), standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, localSysDate, null, localSysDate, null, localSysUserObj, localSysUserObj)
								if (addAddCondResult.getSuccess()) {
									logDebug("Successfully added condition to reference Address " + Adds[zz].getRefAddressId() + " " + cDesc);
								} else {
									logDebug("**ERROR: adding condition to reference Address " + Adds[zz].getRefAddressId() + " " + addAddCondResult.getErrorMessage());
									success = false;
								}
							}
						}
						return success;
					}
					return false;
				} else {
					addNum = parseInt("" + addNum);
					if (isNaN(addNum)) {
						logDebug("**ERROR: Calling 'addAddressStdCondition' - value for parameter 'addNum' [" + addNum + "] is not a number. ");
						return false;
					}

					var addAddCondResult = aa.addressCondition.addAddressCondition(addNum, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, localSysDate, null, localSysDate, null, localSysUserObj, localSysUserObj)
					if (addAddCondResult.getSuccess()) {
						logDebug("Successfully added condition to Address " + addNum + " " + cDesc);
					} else {
						logDebug("**ERROR: adding condition to Address " + addNum + " " + addAddCondResult.getErrorMessage());
						return false;
					}
				}
			}
		}
	}

	if (!foundCondition) {
		logDebug("**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
		return false;
	}
	return true;
}
 
//@ts-check
/**
 * Adds an Adhoc WF Task to the Record's Workflow
 * @param {string} adHocProcess must be same as one defined in R1SERVER_CONSTANT
 * @param {string} adHocTask must be same as Task Name defined in AdHoc Process
 * @param {string} adHocNote can be variable
 * @param {string} [thisUser] (unnamed/optional) Assign-To User ID
 * @param {string} [thisCap] (unnamed/optional) Cap ID to use.
 * @returns {boolean} Returns true if successful, false if not.
 */
function addAdHocTask(adHocProcess, adHocTask, adHocNote) {


  var thisCap;
	if (arguments.length > 4) {
		thisCap = arguments[4];
	} else {
		if (typeof capId === typeof undefined) {
			logDebug("'addAdHocTask' requires either global 'capId' be defined or itemCap parameter be supplied.");
			return false;
		} else {
			thisCap = capId;
		}
	}
  if(typeof thisCap == "undefined" || thisCap == null){
    logDebug("'addAdHocTask' requires either global 'capId' be defined or itemCap parameter be supplied.");
    return false;
  }

  var thisUser = "";
  if (typeof currentUserID !== typeof undefined) {
    thisUser = currentUserID;
  } else {
    thisUser = String(aa.env.getValue("CurrentUserID"));
  }
  if (arguments.length > 3) {
    thisUser = arguments[3];
  }
  if (!thisUser || thisUser == "") {
    logDebug("Error: Unable to get the current user ID from the environment.");
    return false;
  }

  if (arguments.length > 4) {
    thisCap = arguments[4];
  }

  var userObjResult = aa.person.getUser(thisUser);
  if (!userObjResult.getSuccess()) {
    logDebug("Error: Could not find user to assign to.");
    return false;
  }
  var userObj = userObjResult.getOutput();

  var tasksArrResult = aa.workflow.getTasks(thisCap);
  if (!tasksArrResult.getSuccess()) {
    logDebug("EMSE API Error: " + tasksArrResult.getErrorMessage());
    return false;
  }
  var tasksArr = tasksArrResult.getOutput();
  var taskObj = tasksArr[0].getTaskItem();

  taskObj.setProcessCode(adHocProcess);
  taskObj.setTaskDescription(adHocTask);
  taskObj.setDispositionNote(adHocNote);
  taskObj.setProcessID(0);
  taskObj.setAssignmentDate(aa.util.now());
  taskObj.setDueDate(aa.util.now());
  taskObj.setAssignedUser(userObj);

  var wfResult = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness");
  if (!wfResult.getSuccess()) {
    logDebug("EMSE API Error: " + wfResult.getErrorMessage());
    return false;
  }
  var wf = wfResult.getOutput();

  try {
    wf.createAdHocTaskItem(taskObj);
  } catch (err) {
    logDebug("Error: Unable to create Ad Hoc task. Message: " + err.message);
    return false;
  }
  return true;
}
 
//@ts-check
/**
 * Adds all fees within a fee schedule to the record. Optionally flags the fees for automatic invoicing by the
   script.
 * @param {string} fsched Fee schedule to be added.
 * @param {string} fperiod Fee period to be used.
 * @param {number} fqty Quantity to be entered.
 * @param {string} finvoice Flag for invoicing ("Y" or "N").
 * @returns {boolean} Returns true if successful, false if not.
 */
function addAllFees(fsched, fperiod, fqty, finvoice) {

  if (typeof capId === typeof undefined) {
    logDebug("Error: capId is undefined.");
    return false;
  }

  if (typeof fsched === typeof undefined || fsched == null || fsched == "") {
    logDebug("Error: fsched parameter is undefined, null, or an empty string.");
    return false;
  }

  if (typeof fperiod === typeof undefined || fperiod == null || fperiod == "") {
    logDebug("Error: fperiod parameter is undefined, null, or an empty string.");
    return false;
  }

  if (typeof fqty === typeof undefined || fqty == null || isNaN(fqty)) {
    logDebug("Error: fqty parameter is undefined, null, or not a number.");
    return false;
  }

  if (finvoice == "Y") {
    if (typeof feeSeqList === typeof undefined) {
      feeSeqList = new Array();
    }

    if (typeof paymentPeriodList === typeof undefined) {
      paymentPeriodList = new Array();
    }
  }


  var arrFeesResult = aa.finance.getFeeItemList(null, fsched, null);
  if (!arrFeesResult.getSuccess()) {
    logDebug("EMSE API Error: " + arrFeesResult.getOutput());
    return false;
  }
  var arrFees = arrFeesResult.getOutput();

  for (var xx in arrFees) {
    var feeCod = arrFees[xx].getFeeCod();
    var assessFeeResult = aa.finance.createFeeItem(capId, fsched, feeCod, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
      var feeSeq = assessFeeResult.getOutput();
      logMessage("Added Fee " + feeCod + ", Qty " + fqty);
      logDebug("The assessed fee Sequence Number " + feeSeq);
      if (finvoice == "Y") {
        feeSeqList.push(feeSeq);
        paymentPeriodList.push(fperiod);
      }
    }
    else {
      logDebug("**ERROR: assessing fee (" + feeCod + "): " + assessFeeResult.getErrorMessage());
      return false
    }
  } // for xx
  return true;
} // function
 
//@ts-check
/**
 * Adds the condition to the record. If a standard condition is associated with 
 * an ASI group (condition template), the method adds the condition with the 
 * template fields and tables. You can call the method to add duplicate 
 * conditions to a record.
 * 
 * @param {string} cType Type of condition (from admin->condition->condition type).
 * @param {string} cStatus Status (from admin->condition->condition status).
 * @param {string} cDesc Description of the condition.
 * @param {string} cComment Condition comment.
 * @param {string} cImpact Must be Lock, Hold, Notice, Required, or "".
 * @param {string} conditionOfApproval (Optional)
 * @returns {boolean} Returns true if successful, false if not.
 */
function addAppCondition(cType, cStatus, cDesc, cComment, cImpact, conditionOfApproval) {

  var localSysDate;
  var addCapCondResult;
  var localSysUserObj;
  var localCurrentUserID = "";

  if (typeof capId === typeof undefined) {
    logDebug("capId is undefined.");
    return false;
  }

  if (typeof currentUserID === typeof undefined) {
    localCurrentUserID = String(aa.env.getValue("CurrentUserID"));
  } else {
    localCurrentUserID = currentUserID;
  }

  if (typeof systemUserObj === typeof undefined || !systemUserObj) {
    var localSysUserObjResult = aa.person.getUser(localCurrentUserID);
    if (localSysUserObjResult.getSuccess()) {
      localSysUserObj = localSysUserObjResult.getOutput();
    } else {
      logDebug("EMSE API error: " + localSysUserObjResult.getErrorMessage());
      return false;
    }
    if (localSysUserObj == null) {
      logDebug("Error: Cannot get user from env variable 'CurrentUserID'. Ensure 'systemUserObj' is defined.");
      return false;
    }
  } else {
    localSysUserObj = systemUserObj;
  }

  if (typeof sysDate === typeof undefined) {
    localSysDate = aa.date.getCurrentDate();
  } else {
    localSysDate = sysDate;
  }

  if (arguments.length > 5) {
    addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, localSysDate, null, localSysDate, null, null, cImpact, localSysUserObj, localSysUserObj, cStatus, localCurrentUserID, "A", conditionOfApproval);
  } else {
    addCapCondResult = aa.capCondition.addCapCondition(capId, cType, cDesc, cComment, localSysDate, null, localSysDate, null, null, cImpact, localSysUserObj, localSysUserObj, cStatus, localCurrentUserID, "A");
  }

  if (addCapCondResult.getSuccess()) {
    logDebug("Successfully added condition (" + cImpact + ") " + cDesc);
  } else {
    logDebug("**ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage());
    return false;
  }
  return true;
}
 
//@ts-check
/**
 * Adds ASIT rows to Record. The Table Name passed should be a sub-group on 
 * the group (Custom List Group Code) associated with the Record Type's ASI.
 * @param {string} tableName ASI Table Name 
 * @param {object[]} tableValueArray Array of associative array values. All elements MUST be either a string or asiTableVal object
 * (Optional) {object} itemCap Cap ID object is 3rd parm. If not supplied then global 'capId' is used  
 * @returns {boolean} FALSE if failure, TRUE if update performed without issue
 */
function addASITable(tableName, tableValueArray) {
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
		logDebug("Error: addASITable - global 'capId' is undefined/null and no usable value was passed for 'itemCap'");
		return false;
	}

	if (typeof currentUserID === typeof undefined) {
		localCurrentUserID = String(aa.env.getValue("CurrentUserID"));
	} else {
		localCurrentUserID = currentUserID;
	}
	if (localCurrentUserID == "") {
		logDebug("Error: currentUserID variable isn't set at CurrentUserID environment variable isn't available.");
		return false;
	}


	var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName);

	if (!tssmResult.getSuccess()) {
		logDebug("EMSE API Error: addASITable - error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
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
				logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
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
		logDebug("EMSE API Error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
		return false;
	} else {
		logDebug("Successfully added record to ASI Table: " + tableName);
	}
	return true;
} 
//@ts-check
/**
 * Used by page flow scripts to add rows to an ASIT table. 
 * You can use this function to dynamically populate an ASIT based on data from earlier pages.
 * The Table Name passed should be a sub-group on 
 * the group (Custom List Group Code) associated with the Record Type's ASI.
 * 
 * @param {object} destinationTableGroupModel App Specific Table Group Model (com.accela.aa.aamain.appspectable.AppSpecificTableGroupModel)
 * @param {string} tableName ASI Table Name
 * @param {[object]} tableValueArray Array of associative array values. All elements MUST be either a string or asiTableVal object
 * 
 * @returns {object} boolean (false) if no match on 'tableName' || com.accela.aa.aamain.appspectable.AppSpecificTableGroupModel which was passed as parm 'destinationTableGroupModel'
 */
function addASITable4ACAPageFlow(destinationTableGroupModel, tableName, tableValueArray) {
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
        logDebug("Error: cannot update asit for ACA, no matching table name.");
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
                logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
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
 
// @ts-check
/**
 * A Standard Condition will be applied to Reference Contacts which are associted to the Record.
 * When a value is supplied to 'contSeqNum' parameter then the Condition will be applied to that Ref Contact.
 * Otherwise, an attempt will be made to apply the Condition to all Ref Contacts assocaited to the Record.
 * An un-named 4th parameter {string} may be passed for the Condition Status. If not present, the Status will be
 * set to "Applied".
 * @param {string} contSeqNum This should be the Reference Contact Number on the Cap Contact MODEL
 * @param {string} cType Standard Condition Type
 * @param {string} cDesc Standard Condition Description
 * (Optional) cStatus Standard Condition Status
 */
function addContactStdCondition(contSeqNum, cType, cDesc) {

	if((typeof contSeqNum == "undefined" || contSeqNum == null || contSeqNum == "") && (typeof capId == "undefined" || capId == null)){
		// If parameter 'contSeqNum' is not supplied then the global 'capId' will be used.
		// Therefore, if 'contSeqNum' and 'capId' are not present no processing will occur
		logDebug("Error : addContactStdCondition - both 'contSeqNum' and 'capId' are not defined. Processing halted");
		return;
	}
	if(typeof systemUserObj == "undefined" || systemUserObj == null){
		logDebug("Error : addContactStdCondition - Required global 'systemUserObj' is not defined. Processing halted");
		return;
	}
	if(typeof currentUserID == "undefined" || currentUserID == null){
		logDebug("Error : addContactStdCondition - Required global 'currentUserID' is not defined. Processing halted");
		return;
	}

	var foundCondition = false;
	var javascriptDate = new Date(aa.util.now())
	var javautilDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

	var cStatus = "Applied";
	if (arguments.length > 3) {
		cStatus = arguments[3]; // use condition status in args
	}

	if (!aa.capCondition.getStandardConditions) {
		logDebug("addContactStdCondition function is not available in this version of Accela Automation.");
	} else {
        var standardConditions = aa.capCondition.getStandardConditions(cType, cDesc);
        if(standardConditions.getSuccess()){
            standardConditions = standardConditions.getOutput();
        } else {
            logDebug("addContactStdCondition - issue attempting to fetch Standard Condition " + cType + "/" + cDesc + " " + standardConditions.getErrorMessage());
        }
        var standardCondition;
		for (var i = 0; i < standardConditions.length; i++) {
			if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase()
				&& standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) {
				//EMSE Dom function does like search, needed for exact match
				standardCondition = standardConditions[i]; // add the last one found
				foundCondition = true;
			}
        }
        if (foundCondition) {
            if (!contSeqNum || contSeqNum == "") {
                    // add to all REFERENCE contact on the current capId 
                var capContactResult = aa.people.getCapContactByCapID(capId);
                if (capContactResult.getSuccess()) {
                    var Contacts = capContactResult.getOutput();
                    for (var contactIdx in Contacts) {
                        var contactNbr
                        try{
                            // initial code preserved below. Though, it appears 'getRefContactNumber' is on the model.
                            contactNbr = Contacts[contactIdx].getCapContactModel().getPeople().getRefContactNumber();
                        } catch(err) {
                            logDebug("addContactStdCondition - issue attempting Contacts[contactIdx].getCapContactModel().getPeople().getRefContactNumber(). Continue");
                            try{
                                contactNbr = Contacts[contactIdx].getCapContactModel().getRefContactNumber();
                            } catch(err2) {
                                logDebug("addContactStdCondition - issue attempting Contacts[contactIdx].getCapContactModel().getRefContactNumber(). Continue ");
                            }
                        }
                        if (contactNbr) {
                            // TODO - remove redundancy in set-up and call to create
                            var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                            newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                            newCondition.setEntityType("CONTACT");
                            newCondition.setEntityID(contactNbr);
                            newCondition.setConditionDescription(standardCondition.getConditionDesc());
                            newCondition.setConditionGroup(standardCondition.getConditionGroup());
                            newCondition.setConditionType(standardCondition.getConditionType());
                            newCondition.setConditionComment(standardCondition.getConditionComment());
                            newCondition.setImpactCode(standardCondition.getImpactCode());
                            newCondition.setConditionStatus(cStatus)
                            newCondition.setAuditStatus("A");
                            newCondition.setIssuedByUser(systemUserObj);
                            newCondition.setIssuedDate(javautilDate);
                            newCondition.setEffectDate(javautilDate);
                            newCondition.setAuditID(currentUserID);
                            var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);
                            
                            if (addContactConditionResult.getSuccess()) {
                                logDebug("Successfully added reference contact (" + contactNbr + ") condition: " + cDesc);
                            } else {
                                logDebug("**ERROR: adding reference contact (" + contactNbr + ") condition: " + addContactConditionResult.getErrorMessage());
                            }
                        }
                    }
                } else {
                    logDebug("addContactStdCondition - issue attempting to get Record Contacts");
                }
            } else {
                // TODO - remove redundancy in set-up and call to create
                // TODO - the call is happy with ANY value for 'contSeqNum' so we may want to check to see
                //         if it is a valid id for a ref contact
                var newCondition = aa.commonCondition.getNewCommonConditionModel().getOutput();
                newCondition.setServiceProviderCode(aa.getServiceProviderCode());
                newCondition.setEntityType("CONTACT");
                newCondition.setEntityID(contSeqNum);
                newCondition.setConditionDescription(standardCondition.getConditionDesc());
                newCondition.setConditionGroup(standardCondition.getConditionGroup());
                newCondition.setConditionType(standardCondition.getConditionType());
                newCondition.setConditionComment(standardCondition.getConditionComment());
                newCondition.setImpactCode(standardCondition.getImpactCode());
                newCondition.setConditionStatus(cStatus)
                newCondition.setAuditStatus("A");
                newCondition.setIssuedByUser(systemUserObj);
                newCondition.setIssuedDate(javautilDate);
                newCondition.setEffectDate(javautilDate);
                newCondition.setAuditID(currentUserID);
                var addContactConditionResult = aa.commonCondition.addCommonCondition(newCondition);
                if (addContactConditionResult.getSuccess()) {
                    logDebug("Successfully added reference contact (" + contSeqNum + ") condition: " + cDesc);
                } else {
                    logDebug("**ERROR: adding reference contact (" + contSeqNum + ") condition: " + addContactConditionResult.getErrorMessage());
                }
            }
        } else {
            logDebug("**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
        }
    }
}
 
//@ts-check
/**
 * Adds a custom fee feecode to the record, from the fee schedule (feesched) 
 * with fee period (feeperiod).
 * 
 * Note: The fee period parameter must be a valid fee period for the fee code
 * parameter in the fee schedule parameter, or this function throws an error.
 * 
 * @param {String} feeSched Fee code to be added.
 * @param {String} feeCode Fee schedule of the fee to be added.
 * @param {String} feeDescr A description of the custom fee item.
 * @param {number} feeAm Fee quantity.
 * @param {String} feeAcc Fee account code 1.
 * @param {String} feePeriod  Fee period to be used.
 * (optional) CapIDModel Record to add fee to.
 * 
 * @returns  Returns the Fee Sequence number of the fee added or returns null 
 * if there is an error
 */

function addCustomFee(feeSched, feeCode, feeDescr, feeAm, feeAcc, feePeriod) {
	var feeCap;

	if (arguments.length == 7) {
		feeCap = arguments[6];
	} else {
		feeCap = capId;
	}

	if (typeof feeCap === typeof undefined) {
		logDebug("Error: the global capId variable must be defined for this function or passed as the optional parameter.");
		return null;
	}

	if (feePeriod == null) {
		feePeriod = "FINAL";
	}

	var newFeeResult = aa.finance.createFeeItem(feeCap, feeSched, feeCode, feePeriod, feeAm);
	if (newFeeResult.getSuccess()) {
		var feeSeq = newFeeResult.getOutput();
		var newFeeResult = aa.finance.getFeeItemByPK(feeCap, feeSeq);
		if (!newFeeResult.getSuccess()) {
			logDebug("EMSE API Error retrieving fee item: " + newFeeResult.getErrorMessage());
			return null;
		}
		var newFee = newFeeResult.getOutput().getF4FeeItem();
		newFee.setFeeDescription(feeDescr);

		if (feeAcc) {
			newFee.setAccCodeL1(feeAcc);
		}

		var feeObj = aa.finance.editFeeItem(newFee);
		if (feeObj.getSuccess()) {
			logDebug("Added Custom Fee: " + feeDescr);
		} else {
			logDebug("EMSE API Error Adding Fee: " + feeObj.getErrorMessage());
			return null;
		}
	} else {
		logDebug("EMSE API Error Adding Fee: " + newFeeResult.getErrorMessage());
		return null;
	}
	return feeSeq;
}
 
//@ts-check
/**
 * Adds a single fee fcode to the record, from the fee schedule fsched with fee period fperiod and quantity of fqty.
 * If finvoice is Y, the function invoices the fee. 
 * If finvoice is N, the function assesses the fee but does not invoice the fee.
 * If you use the capID optional parameter, the function updates the identified Cap.
 * If you do not use the capID parameter, the function updates the current record.
 * getApplication( ), getParent( ), createChild() functions each returns a record ID object that you can use in the capID parameter.
 * @param {string} fcode Fee Item Code
 * @param {string} fsched Fee Schedule
 * @param {string} fperiod Fee Payment Period. Must be a valid fee period for fcode in fsched
 * @param {number} fqty Fee Quantity value
 * @param {string} finvoice Should invoice indicator. "Y" || "N"
 * @param {[object]} feeCap Optional. Sixth un-named argument. Will populate 'feeCap' if present.
 * @returns Fee Sequence of new fee || null if an error was encountered
 */

function addFee(fcode, fsched, fperiod, fqty, finvoice) {
	// Adds a single fee, optional argument: fCap
	// Updated Script will return feeSeq number or null if error encountered (SR5112)

    if (typeof fcode === typeof undefined || fcode == null || fcode == "") {
        logDebug("'addFee' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fsched === typeof undefined || fsched == null || fsched == "") {
        logDebug("'addFee' - fsched parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fperiod === typeof undefined || fperiod == null || fperiod == "") {
        logDebug("'addFee' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fqty === typeof undefined || fqty == null || isNaN(fqty)) {
        logDebug("'addFee' - fqty parameter is undefined, null, or not a number.");
        return null;
    }

    if (typeof finvoice === typeof undefined || finvoice == null || (finvoice == "" || (finvoice != "Y" && finvoice != "N"))) {
        logDebug("'addFee' - finvoice parameter is undefined, null, or an incorrect value.");
        return null;
    }

	var feeCap = capId;
	var feeCapMessage = "";
	var feeSeq_L = new Array(); // invoicing fee for CAP in args
	var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
	var feeSeq = null;

	if (arguments.length > 5) {
		feeCap = arguments[5]; // use cap ID specified in args
		feeCapMessage = " to specified CAP";
	} else {
		if (typeof capId == "undefined") {
			logDebug("ERROR : function 'addFee' relies on a CapID. Global var 'capId' is not set and there was no CapID passed as a parameter");
			return null;
		} else {
			feeCap = capId;
		}
		// If invoice = 'y' we must check presence of global vars of fee arrays 
        // 'feeSeqList' and 'paymentPeriodList' as well in this block.
		// when using global 'capId' then the global arrays are used too.
		if (finvoice == "Y" && (typeof feeSeqList == "undefined")) {
			feeSeqList = [];
		}
		if (finvoice == "Y" && (typeof paymentPeriodList == "undefined")) {
			paymentPeriodList = [];
		}
	}

	var assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
	if (assessFeeResult.getSuccess()) {
		feeSeq = assessFeeResult.getOutput();
		logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
		logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

		if (finvoice == "Y" && arguments.length == 5) {
			// use current CAP
			feeSeqList.push(feeSeq);
			paymentPeriodList.push(fperiod);
		}
		if (finvoice == "Y" && arguments.length > 5) {
			// use CAP in args
			feeSeq_L.push(feeSeq);
			paymentPeriod_L.push(fperiod);
			var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
			if (invoiceResult_L.getSuccess()) {
				logMessage("Invoicing assessed fee items" + feeCapMessage + " is successful.");
			} else {
				logDebug("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
				return null;
			}
		}
		updateFeeItemInvoiceFlag(feeSeq, finvoice);
	} else {
		logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
		feeSeq = null;
	}
	return feeSeq;
}
 

/**
 * Create new Fee Item on the supplied Cap. 
 * The new Fee Sequence (int) will be returned if process was a success. Otherwise, null is returned.
 * @param {object} feeCap CapID
 * @param {object} fdate Object which can resolve to a JS Date using function 'convertDate'
 * @param {string} fcode Fee Item Code
 * @param {string} fsched Fee Schedule
 * @param {string} fperiod Fee Payment Period
 * @param {number} fqty Fee Quantity
 * @param {String} finvoice "Y" or "N"
 * @returns {number} returns fee sequence number if successful || null if not successful
 */
function addFeeByDate(feeCap, fdate, fcode, fsched, fperiod, fqty, finvoice) {
if (typeof feeCap === typeof undefined || feeCap == null) {
        logDebug("Error: 'addFeeByDate' - feeCap is undefined.");
        return null;
      }
    
      if (typeof fdate === typeof undefined || fdate == null || fdate == "") {
        logDebug("Error: 'addFeeByDate' - fdate parameter is undefined, null, or an empty string.");
        return null;
      }
    
      if (typeof fcode === typeof undefined || fcode == null || fcode == "") {
        logDebug("Error: 'addFeeByDate' - fcode parameter is undefined, null, or an empty string.");
        return null;
      }
    
      if (typeof fsched === typeof undefined || fsched == null || fsched == "") {
        logDebug("Error: 'addFeeByDate' - fsched parameter is undefined, null, or an empty string.");
        return null;
      }
    
      if (typeof fperiod === typeof undefined || fperiod == null || fperiod == "") {
        logDebug("Error: 'addFeeByDate' - fperiod parameter is undefined, null, or an empty string.");
        return null;
      }
    
      if (typeof fqty === typeof undefined || fqty == null || isNaN(fqty)) {
        logDebug("Error: 'addFeeByDate' - fqty parameter is undefined, null, or not a number.");
        return null;
      }

    if (finvoice == "Y") {
        if (typeof feeSeqList === typeof undefined) {
            feeSeqList = new Array();
        }

        if (typeof paymentPeriodList === typeof undefined) {
            paymentPeriodList = new Array();
        }
    }

    var feeSeq_L = new Array(); // invoicing fee for CAP in args
    var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
    var feeSeq = null;
    var feeCapMessage = " to " + feeCap.getCustomID();

    var f = aa.proxyInvoker.newInstance("com.accela.aa.finance.fee.RefFeeBusiness").getOutput();
    if (!f) {
        logDebug("Error: could not instantiate RefFeeBusiness to determine fee version, exiting addFeeByDate");
        return null;
    }

    var vDate = convertDate(fdate);

    if (!vDate) {
        logDebug("Error: could not convert date parameter to javascript date, exiting addFeeByDate");
        return null;
    }

    var v = f.getDefaultVersionBySchedule(aa.getServiceProviderCode(), fsched, vDate, "ADMIN");

    if (!v) {
        logDebug("Error: could not determine default version for fee schedule " + fsched + ", exiting addFeeByDate");
        return null;
    }

    var assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, v, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
        logDebug("Successfully added Fee:" + fcode + ", Qty:" + fqty + " Version:" + v + " Sched: " + fsched + " based on date " + vDate + " " + feeCapMessage + ".  The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        // TODO revisit testing length of args in next iteration. 
        // will always be gt 5 b/c finvoice is at index 6
        if (finvoice == "Y" && arguments.length == 5) {
            // use current CAP
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 5) {
            // use CAP in args
            feeSeq_L.push(feeSeq);
            paymentPeriod_L.push(fperiod);
            var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
            if (invoiceResult_L.getSuccess()) {
                logMessage("Invoicing assessed fee items" + feeCapMessage + " is successful.");
            } else {
                logDebug("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
            }
        }
        updateFeeItemInvoiceFlag(feeSeq, finvoice);
    } else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        feeSeq = null;
    }
    return feeSeq;
}
 
/**
 * Identical to the addFee function. Also allows you to populate the Fee Item Comment 
 * and User-Defined Fields (UDF1, UDF2).
 * @param {string} fcode Fee Item Code
 * @param {string} fsched Fee Schedule
 * @param {string} fperiod Fee Payment Period
 * @param {number} fqty Fee Quantity value
 * @param {string} finvoice Should invoice indicator. "Y" || "N"
 * @param {object} feeCap CapID object
 * @param {string} feeComment Fee Comment
 * @param {string} UDF1 User Defined Field 1
 * @param {string} UDF2 User Defined Feild 2
 * @returns 
 */
function addFeeWithExtraData(fcode, fsched, fperiod, fqty, finvoice, feeCap, feeComment, UDF1, UDF2) {

    if (typeof fcode === typeof undefined || fcode == null || fcode == "") {
        logDebug("'addFeeWithExtraData' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fsched === typeof undefined || fsched == null || fsched == "") {
        logDebug("'addFeeWithExtraData' - fsched parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fperiod === typeof undefined || fperiod == null || fperiod == "") {
        logDebug("'addFeeWithExtraData' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fqty === typeof undefined || fqty == null || isNaN(fqty)) {
        logDebug("'addFeeWithExtraData' - fqty parameter is undefined, null, or not a number.");
        return null;
    }

    if (typeof finvoice === typeof undefined || finvoice == null || (finvoice == "" || (finvoice != "Y" && finvoice != "N"))) {
        logDebug("'addFeeWithExtraData' - finvoice parameter is undefined, null, or an incorrect value.");
        return null;
    }

    var feeCapMessage = "";
    var feeSeq_L = new Array(); 			// invoicing fee for CAP in args
    var paymentPeriod_L = new Array(); 		// invoicing pay periods for CAP in args

    assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        var feeSeq = assessFeeResult.getOutput();
        logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
        logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        fsm = aa.finance.getFeeItemByPK(feeCap, feeSeq).getOutput().getF4FeeItem();

        if (feeComment){
            fsm.setFeeNotes(""+feeComment); // force string
        } 
        if (UDF1) {
            fsm.setUdf1(""+UDF1); // force string
        }
        if (UDF2) {
            fsm.setUdf2(""+UDF2); // force string
        }

        aa.finance.editFeeItem(fsm);

        // TODO revisit on next iteration. 
        // args count will always be gt 5
        if (finvoice == "Y" && arguments.length == 5) {
            // use current CAP
            if(typeof feeSeqList === typeof undefined){
                feeSeqList = new Array();
            }
            if(typeof paymentPeriodList === typeof undefined){
                paymentPeriodList = new Array();
            }
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 5) {
            // use CAP in args
            feeSeq_L.push(feeSeq);
            paymentPeriod_L.push(fperiod);
            var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
            if (invoiceResult_L.getSuccess()) {
                logMessage("Invoicing assessed fee items is successful.");
            } else {
                logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult.getErrorMessage());
                return null;
            }
        }
    } else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        return null;
    }

    return feeSeq;

}
 
/**
 * Identical to the addFeeWithExtraData function, which allows you to populate the Fee Item Comment 
 * and User-Defined Fields (UDF1, UDF2). This version is expanded to find correct Fee Schedule version by date.
 * @param {object} feeCap CapID object - NOTE known issue ~ this parm (position 0) will not be used.
 * @param {object} fdate Object which can resolve to a JS Date using function 'convertDate'
 * @param {string} fcode Fee Item Code
 * @param {string} fsched Fee Schedule
 * @param {string} fperiod Fee Payment Period
 * @param {number} fqty Fee Quantity value
 * @param {string} finvoice Should invoice indicator. "Y" || "N"
 * @param {object} feeCap CapID object - NOTE this is the 'feeCap' parm (position 7) which MUST be populated
 * @param {string} feeComment Fee Comment
 * @param {string} UDF1 User Defined Field 1
 * @param {string} UDF2 User Defined Feild 2
 * @returns {number | null } Fee Sequence Number of new Fee Item | Returns null if there was an issue.
 */
function addFeeWithExtraDataByDate(feeCap, fdate, fcode, fsched, fperiod, fqty, finvoice, feeCap, feeComment, UDF1, UDF2) {
    // Updated Script will return feeSeq number or null if error encountered (SR5112)
    if (typeof feeCap === typeof undefined || feeCap == null) {
        logDebug("'addFeeWithExtraDataByDate' - feeCap parameter is undefined or null");
        return null;
    }

    if (typeof fcode === typeof undefined || fcode == null || fcode == "") {
        logDebug("'addFeeWithExtraDataByDate' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fsched === typeof undefined || fsched == null || fsched == "") {
        logDebug("'addFeeWithExtraDataByDate' - fsched parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fperiod === typeof undefined || fperiod == null || fperiod == "") {
        logDebug("'addFeeWithExtraDataByDate' - fperiod parameter is undefined, null, or an empty string.");
        return null;
    }

    if (typeof fqty === typeof undefined || fqty == null || isNaN(fqty)) {
        logDebug("'addFeeWithExtraDataByDate' - fqty parameter is undefined, null, or not a number.");
        return null;
    }

    if (typeof finvoice === typeof undefined || finvoice == null || (finvoice == "" || (finvoice != "Y" && finvoice != "N"))) {
        logDebug("'addFeeWithExtraDataByDate' - finvoice parameter is undefined, null, or an incorrect value.");
        return null;
    }


    var feeSeq_L = new Array(); // invoicing fee for CAP in args
    var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
    var feeSeq = null;
    var feeCapMessage = " to " + feeCap.getCustomID();

    var f = aa.proxyInvoker.newInstance("com.accela.aa.finance.fee.RefFeeBusiness").getOutput();
    if (!f) {
        logDebug("could not instantiate RefFeeBusiness to determine fee version, exiting addFeeWithExtraDataByDate");
        return null;
    }

    var vDate = convertDate(fdate);

    if (!vDate) {
        logDebug("could not convert date parameter to javascript date, exiting addFeeWithExtraDataByDate");
        return null;
    }

    var v = f.getDefaultVersionBySchedule(aa.getServiceProviderCode(), fsched, vDate, "ADMIN");

    if (!v) {
        logDebug("could not determine default version for fee schedule " + fsched + " based on date " + vDate + ", exiting addFeeWithExtraDataByDate");
        return null;
    }

    var assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
    if (assessFeeResult.getSuccess()) {
        feeSeq = assessFeeResult.getOutput();
        logDebug("Successfully added Fee:" + fcode + ", Qty:" + fqty + " Version:" + v + " Sched: " + fsched + " based on date " + vDate + " " + feeCapMessage + ".  The assessed fee Sequence Number " + feeSeq + feeCapMessage);

        var fsm = aa.finance.getFeeItemByPK(feeCap, feeSeq).getOutput().getF4FeeItem();

        if (feeComment){
            fsm.setFeeNotes(""+feeComment); // force string
        } 
        if (UDF1) {
            fsm.setUdf1(""+UDF1); // force string
        }
        if (UDF2) {
            fsm.setUdf2(""+UDF2); // force string
        }

        aa.finance.editFeeItem(fsm);


        // TODO revisit on next iteration. 
        // args count will always be gt 5
        if (finvoice == "Y" && arguments.length == 5) {
            // use current CAP
            if(typeof feeSeqList === typeof undefined){
                feeSeqList = new Array();
            }
            if(typeof paymentPeriodList === typeof undefined){
                paymentPeriodList = new Array();
            }
            feeSeqList.push(feeSeq);
            paymentPeriodList.push(fperiod);
        }
        if (finvoice == "Y" && arguments.length > 5) {
            // use CAP in args
            feeSeq_L.push(feeSeq);
            paymentPeriod_L.push(fperiod);
            var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
            if (invoiceResult_L.getSuccess()) {
                logMessage("Invoicing assessed fee items is successful.");
            } else {
                logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult.getErrorMessage());
                return null;
            }
        }
    } else {
        logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
        return null;
    }

    return feeSeq;

}
 
/**
 * Will copy GuideSheet (Ref Checklist) to Inspection.
 * This Inspection must be on the Cap identified.
 * @param {object} itemCapId CapID instance
 * @param {number} inspectionId ID Number for Inspection to use
 * @param {string} guideSheetName GuideSheet Name (Reference Checklist name)
 * @returns {number | undefined} If errors/issues were encountered then undefined is returned. If the process was success then Guide Sheet Sequence ID is returned
 */
function addGuideSheet(itemCapId, inspectionId, guideSheetName) {

	if (typeof itemCapId == "undefined" || !itemCapId || typeof itemCapId.getCustomID == "undefined") {
		logDebug("'addGuideSheet' requires CapID for parameter 'itemCapId' ");
		return;
	}
	if (typeof inspectionId == "undefined" || !inspectionId || isNaN(inspectionId)) {
		logDebug("'addGuideSheet' requires Inspection ID (integer) for parameter 'inspectionId' ");
		return;
	}
	if (typeof guideSheetName == "undefined" || !guideSheetName) {
		logDebug("'addGuideSheet' requires parameter 'guideSheetName' ");
		return;
	}

	// force inspectionId to int
	inspectionId = parseInt("" + inspectionId);
	var rgsm = null;
	var r = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.RGuideSheetBusiness").getOutput();
	if (r) {
		try {
			rgsm = r.getRGuideSheet(aa.getServiceProviderCode(), guideSheetName);
		} catch (err) {
			logDebug("'addGuideSheet' could not get GuideSheet instance with name " + guideSheetName);
			return;
		}
	}

	var g = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();

	if (rgsm) {
		try {
			// TODO - any number inspectionId will pass. In next iteration check that the inspectionId/itemCapId is valid.
			var gsSequence = g.createGGuideSheet(itemCapId, rgsm, inspectionId, "ADMIN");
		} catch (err) {
			logDebug("'addGuideSheet' error attaching GuideSheet " + guideSheetName + "  : " + err);
			return;
		}
		return gsSequence;
	}
}
 
//@ts-check
/**
 * Adds the condition (cType, cStatus, cDesc, cComment, cImpact) to the 
 * reference record for each licensed professional on the record. If a standard
 * condition is associated with an ASI group (condition template), the method 
 * adds the condition with the template fields and tables. You can call the 
 * method to add duplicate conditions to a record.
 *
 * **Note:**
 * If you use the stateLicNum parameter, the function adds the condition to the 
 * licensed professional reference record whose State License Number is 
 * stateLicNum. This licensed professional may not be on the current record.
 *
 * ----
 * **Env variables:**
 * - systemUserObj
 * - capId
 * - sysDate
 * 
 * ----
 * @param {string} cType Condition type.
 * @param {string} cStatus Condition status
 * @param {string} cDesc Condition (30 characters maximum).
 * @param {string} cComment Condition comment (free text).
 * @param {("Lock" | "Hold" | "Notice" | "Required" | "")} cImpact Condition severity: Lock, Hold, Notice, Required, or "".
 * @param {string} [stateLicNum] (unnamed/optional) State license number.
 * @returns {boolean} Returns true if succesful, false if not. It can fail to add the condition to one License Professional, but it will try to add to all the remaining ones.
 */
function addLicenseCondition(cType, cStatus, cDesc, cComment, cImpact) {

	if (typeof sysDate == "undefined") {
		logDebug("'addLicenseCondition'- global 'sysDate' is undefined.");
		return false;
	}
	if (typeof systemUserObj == "undefined") {
		logDebug("'addLicenseCondition'- global 'systemUserObj' is undefined.");
		return false;
	}
    if (typeof cType == "undefined" || cType == null || cType == "") {	
		logDebug("'addLicenseCondition'- parameter 'cType' is required");
		return false;
	}
    if (typeof cStatus == "undefined" || cStatus == null || cStatus == "") {	
		logDebug("'addLicenseCondition'- parameter 'cStatus' is required");
		return false;
	}
	if (typeof cDesc == "undefined" || cDesc == null || cDesc == "") {	
		logDebug("'addLicenseCondition'- parameter 'cDesc' is required");
		return false;
	}
	if ((typeof cImpact == "undefined") || !matches(cImpact, "Lock", "Hold", "Notice", "Required", "")) {
		logDebug("'addLicenseCondition'- parameter 'cImpact' is required and must be one of: [\"Lock\", \"Hold\", \"Notice\", \"Required\", \"\"]");
		return false;
	}

	// Optional 6th argument is license number, otherwise add to all CAEs on CAP
	var refLicArr = new Array();
	if (arguments.length >= 6) {
		// License Number provided
		refLicArr.push(getRefLicenseProf(arguments[5]));
	} else {
		if (typeof capId == "undefined") {
			logDebug("'addLicenseCondition'- global 'capId' must be defined if License Number is not sent as parameter");
			return false;
		}
		// adding to cap lic profs
		var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
		if (capLicenseResult.getSuccess()) {
			refLicArr = capLicenseResult.getOutput();
		} else {
			logDebug('**ERROR: getting lic profs from Cap: ' + capLicenseResult.getErrorMessage());
			return false;
		}
	}

	var errorInIteration = false;

	for (var refLic in refLicArr) {
		var licSeq;
		if (arguments.length >= 6) {
			// use given sequence number
			licSeq = refLicArr[refLic].getLicSeqNbr();
		} else {
			licSeq = refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr();
		}

		if (licSeq >= 0) {
			var addCAEResult = aa.caeCondition.addCAECondition(
				licSeq,
				cType,
				cDesc,
				cComment,
				null,
				null,
				cImpact,
				cStatus,
				sysDate,
				null,
				sysDate,
				sysDate,
				systemUserObj,
				systemUserObj
			);

			if (addCAEResult.getSuccess()) {
				logDebug('Successfully added licensed professional (' + licSeq + ') condition (' + cImpact + ') ' + cDesc);
			} else {
				logDebug('**ERROR: adding licensed professional (' + licSeq + ') condition (' + cImpact + '): ' + addCAEResult.getErrorMessage());
				errorInIteration = true;
			}
		} else {
			logDebug('No reference link to license : ' + refLicArr[refLic].getLicenseNbr());
		}
	}

	return !errorInIteration;
}
 
//@ts-check

/**
 * Adds a standard condition to the specified reference licensed professional. If a standard condition is
 * associated with an ASI group (condition template), the method adds the condition with the template fields
 * and tables. You can call the method to add duplicate conditions to a record.
 * 
 * ** Note:**
 * If licSeqNum is null, the function adds the condition to all reference licensed professionals associated with
 * the current record.
 * 
 * ----
 * **Env variables:**
 * - systemUserObj
 * - capId
 * - sysDate
 * 
 * ----
 * @param {number} licSeqNum Reference license sequence number or null.
 * @param {string} cType Type of the standard condition.
 * @param {string} cDesc Description of the standard condition.
 * @param {string} [cStatus=Applied] (unnamed/optional) cStatus Condition status.
 * @returns {boolean|undefined} Returns FALSE in some error conditions. Otherwise, returns nothing.
 */

function addLicenseStdCondition(licSeqNum, cType, cDesc) {
	var foundCondition = false;
	var cStatus = "Applied";

	if (typeof sysDate === typeof undefined) {
		logDebug("'addLicenseStdCondition' - global variable 'sysDate' is undefined.");
		return false;
	}

	if (typeof systemUserObj === typeof undefined) {
		logDebug("'addLicenseStdCondition' - global var 'systemUserObj' is undefined.");
		return false;
	}


	if (arguments.length > 3) {
		// use condition status in args
		cStatus = arguments[3];
	}

	if (!aa.capCondition.getStandardConditions) {
		logDebug("addLicenseStdCondition function is not available in this version of Accela Automation.");
	} else {
		var standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (var i = 0; i < standardConditions.length; i++) {
			if (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) {
				//EMSE Dom function does like search, needed for exact match

				var standardCondition = standardConditions[i]; // add the last one found

				foundCondition = true;

				if (!licSeqNum) {
					// add to all reference licenses on the current capId

					if (typeof capId === typeof undefined) {
						logDebug("'addLicenseStdCondition' - global var 'capId' is undefined.");
						return false;
					}

					var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
					if (capLicenseResult.getSuccess()) {
						var refLicArr = capLicenseResult.getOutput();
					} else {
						logDebug("**ERROR: getting lic profs from Cap: " + capLicenseResult.getErrorMessage());
						return false;
					}

					for (var refLic in refLicArr) {
						if (refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr()) {
							var licSeq = refLicArr[refLic].getLicenseProfessionalModel().getLicSeqNbr();
							var addCAEResult = aa.caeCondition.addCAECondition(licSeq, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);

							if (addCAEResult.getSuccess()) {
								logDebug("Successfully added licensed professional (" + licSeq + ") condition: " + cDesc);
							} else {
								logDebug("**ERROR: adding licensed professional (" + licSeq + ") condition: " + addCAEResult.getErrorMessage());
							}
						}
					}
				} else {
					var addCAEResult = aa.caeCondition.addCAECondition(licSeqNum, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null, null, standardCondition.getImpactCode(), cStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj);

					if (addCAEResult.getSuccess()) {
						logDebug("Successfully added licensed professional (" + licSeqNum + ") condition: " + cDesc);
					} else {
						logDebug("**ERROR: adding licensed professional (" + licSeqNum + ") condition: " + addCAEResult.getErrorMessage());
					}
				}
			}
		}
	}
	if (!foundCondition) {
		logDebug("**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
	}
}

 
// @ts-check

/**
 * Adds a lookup entry to an existing standard choices item. Adds a new value called stdValue with the value
 * description of stdDesc to standard choices item name stdChoice.
 * 
 * ** Notes **
 * If the standard choices item stdChoice already has a value entry called stdValue, the function does not add
 * or update stdValue. This function does not create the standard choices item stdChoice if it does not exist.
 * 
 * @param {string} stdChoice Standard choices item name.
 * @param {string} stdValue Standard choices value.
 * @param {string} stdDesc Standard choices value description.
 * @returns {boolean | undefined} FALSE is returned for some error conditions | undefined for some errors and success
 */

function addLookup(stdChoice, stdValue, stdDesc) {
	if (typeof stdChoice == "undefined" || stdChoice == null || stdChoice == "") {
		logDebug("'addLookup' - var 'stdChoice' is required and must not be blank");
		return false;
	}
	if (typeof stdValue == "undefined" || stdValue == null || stdValue == "") {
		logDebug("'addLookup' - var 'stdValue' is required and must not be blank");
		return false;
	}
	if (typeof stdDesc == "undefined" || stdDesc == null) {
		logDebug("'addLookup' - var 'stdDesc' is required");
		return false;
	}
	//check if stdChoice and stdValue already exist; if they do, don't add
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
	if (bizDomScriptResult.getSuccess()) {
		logDebug("Standard Choices Item " + stdChoice + " and Value " + stdValue + " already exist.  Lookup is not added or updated.");
		return false;
	}

	//Proceed to add
	var strControl;
	// TODO : standardize return values. Return TRUE or FALSE only.
	if (stdChoice != null && stdChoice.length && stdValue != null && stdValue.length && stdDesc != null && stdDesc.length) {
		var bizDomScriptResult = aa.bizDomain.createBizDomain(stdChoice, stdValue, "A", stdDesc)
		if (bizDomScriptResult.getSuccess()) {
			logDebug("Successfully created Std Choice(" + stdChoice + "," + stdValue + ") = " + stdDesc);
		} else {
			logDebug("**ERROR creating Std Choice " + bizDomScriptResult.getErrorMessage());
		}
	} else {
		logDebug("Could not create std choice, one or more null values");
	}
} 
 function addParameter(pamaremeters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		pamaremeters.put(key, value);
	}
}
 
function addParcelAndOwnerFromRefAddress(refAddress) // optional capID
{

	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		// first add the primary parcel
		//
		var primaryParcelResult = aa.parcel.getPrimaryParcelByRefAddressID(refAddress, "Y");
	if (primaryParcelResult.getSuccess())
		var primaryParcel = primaryParcelResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get primary parcel for ref Address " + refAddress + " , " + primaryParcelResult.getErrorMessage());
		return false;
	}

	var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, primaryParcel).getOutput()

		var createPMResult = aa.parcel.createCapParcel(capParModel);
	if (createPMResult.getSuccess())
		logDebug("created CAP Parcel");
	else {
		logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
	}

	// Now the owners
	//

	var parcelListResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
	if (parcelListResult.getSuccess())
		var parcelList = parcelListResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get Parcel List " + parcelListResult.getErrorMessage());
		return false;
	}

	for (var thisP in parcelList) {
		var ownerListResult = aa.owner.getOwnersByParcel(parcelList[thisP]);
		if (ownerListResult.getSuccess())
			var ownerList = ownerListResult.getOutput();
		else {
			logDebug("**ERROR: Failed to get Owner List " + ownerListResult.getErrorMessage());
			return false;
		}

		for (var thisO in ownerList) {
			ownerList[thisO].setCapID(itemCap);
			createOResult = aa.owner.createCapOwnerWithAPOAttribute(ownerList[thisO]);

			if (createOResult.getSuccess())
				logDebug("Created CAP Owner");
			else {
				logDebug("**WARNING: Failed to create CAP Owner " + createOResult.getErrorMessage());
			}
		}
	}
}
 
// @ts-check

/**
 * Adds a condition to the REFERENCE parcel whose number is parcelNum. If a standard condition is associated
 * with an ASI group (condition template), the method adds the condition with the template fields and tables.
 * You can call the method to add duplicate conditions to a record.
 * @param {string} parcelNum Parcel number to add the condition to. If null, the function adds the condition to all parcels on the record.
 * @param {string} cType Condition type.
 * @param {string} cStatus Condition status.
 * @param {string} cDesc Condition name.
 * @param {string} cComment Condition comment.
 * @param {string} cImpact Condition severity.
 * 
 * **Notes**
 * The condition Type, Condition (description), Status, Severity and Comment corresponds to cType,
 * cDesc, cStatus, cImpact, and cComment, respectively. The condition Apply and Effective dates equal the
 * current date. The condition Applied By and Action By staff names equal the current user name.
 * If you use null for the parcelNum parameter, the function adds the condition to all parcels on the current
 * record.
 * 
 * ---
 * **Global Variable**:
 * - capId
 * - systemUserObj
 * - sysDate
 * 
 * ---
 */

function addParcelCondition(parcelNum, cType, cStatus, cDesc, cComment, cImpact) {

	var l_sysDate = (typeof sysDate == "undefined") ? aa.date.getCurrentDate() : sysDate;
	var l_systemUserObj;
	if (typeof systemUserObj == "undefined") {
		var l_currentUserID = (aa.env.getValue("CurrentUserID") == "") ? "" : "" + aa.env.getValue("CurrentUserID");
		l_systemUserObj = aa.person.getUser(l_currentUserID).getOutput();
	} else {
		l_systemUserObj = systemUserObj;
	}

	//if parcelNum is null, condition is added to all parcels on CAP
	if (!parcelNum) {
		if (typeof capId === typeof undefined || capId == null) {
			logDebug("'addParcelCondition' parameter 'parcelNum' and global variable 'capId' are not defined.");
			return false;
		}
		var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
		if (capParcelResult.getSuccess()) {
			var Parcels = capParcelResult.getOutput().toArray();
			for (var zz in Parcels) {
				logDebug("Adding Condition to parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				var addParcelCondResult = aa.parcelCondition.addParcelCondition(Parcels[zz].getParcelNumber(), cType, cDesc, cComment, null, null, cImpact, cStatus, l_sysDate, null, l_sysDate, l_sysDate, l_systemUserObj, l_systemUserObj);
				if (addParcelCondResult.getSuccess()) {
					logMessage("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + "  (" + cImpact + ") " + cDesc);
					logDebug("Successfully added condition to Parcel " + Parcels[zz].getParcelNumber() + "  (" + cImpact + ") " + cDesc);
				} else {
					logDebug("**ERROR: adding condition to Parcel " + Parcels[zz].getParcelNumber() + "  (" + cImpact + "): " + addParcelCondResult.getErrorMessage());
				}
			}
		}
	} else {
		parcelNum = new java.lang.String("" + parcelNum);
		var addParcelCondResult = aa.parcelCondition.addParcelCondition(parcelNum, cType, cDesc, cComment, null, null, cImpact, cStatus, l_sysDate, null, l_sysDate, l_sysDate, l_systemUserObj, l_systemUserObj);

		if (addParcelCondResult.getSuccess()) {
			logMessage("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
			logDebug("Successfully added condition to Parcel " + parcelNum + "  (" + cImpact + ") " + cDesc);
		} else {
			logDebug("**ERROR: adding condition to Parcel " + parcelNum + "  (" + cImpact + "): " + addParcelCondResult.getErrorMessage());
		}
	}
}
 
// @ts-check

/**
 * Adds a district to the parcel on a record.
 * @param {string} parcelNum Parcel number that district adds to.
 * @param {string} districtValue Value of district entry to add.
 * @returns {boolean | undefined} FALSE if any single failure during an add, otherwise, returns nothing
 *  * ---
 * **Notes**
 * Does not edit reference parcel data.
 * If parcelNum is null, the function adds the district to all parcels on the current record.
 * 
 * ---
 * **Global Variable**:
 * - capId
 * 
 * ---
 */

function addParcelDistrict(parcelNum, districtValue) {
	//if parcelNum is null, district is is added to all parcels on CAP


	if (typeof capId === typeof undefined) {
		logDebug("'addParcelDistrict' global 'capId' must be defined.");
		return false;
	}
	if (!parcelNum) {
		var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
		if (capParcelResult.getSuccess()) {
			var Parcels = capParcelResult.getOutput().toArray();
			for (var zz in Parcels) {
				var apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(), capId.getID2(), capId.getID3(), Parcels[zz].getParcelNumber(), districtValue);

				if (!apdResult.getSuccess()) {
					logDebug("**ERROR Adding District " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber() + " : " + apdResult.getErrorMessage());
					return false;
				} else {
					logDebug("Successfully added district " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber());
				}
			}
		}
	} else {
		apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(), capId.getID2(), capId.getID3(), parcelNum, districtValue);

		if (!apdResult.getSuccess()) {
			logDebug("**ERROR Adding District " + districtValue + " to parcel #" + parcelNum + " : " + apdResult.getErrorMessage());
			return false;
		} else {
			logDebug("Successfully added district " + districtValue + " to parcel #" + parcelNum);
		}
	}
}
 
// @ts-check

/**
 * Adds the current record as a hierarchal child to the parent record parentAppNum.
 * @param {string} parentAppNum 
 * @returns {boolean | undefined} FALSE in some error conditions, otherwise, nothing
 */

function addParent(parentAppNum) {
	if (parentAppNum.getID1 == undefined) {
		// is this one an object or string?
		var getCapResult = aa.cap.getCapID(parentAppNum);
		if (getCapResult.getSuccess()) {
			var parentId = getCapResult.getOutput();
		}
		else {
			logDebug("**ERROR: getting parent cap id (" + parentAppNum + "): " + getCapResult.getErrorMessage());
			return false;
		}
	} else {
		parentId = parentAppNum;
	}

	if (typeof capId === typeof undefined) {
		logDebug("'addParent' requires global 'capId' be defined.");
		return false;
	} 

	var linkResult = aa.cap.createAppHierarchy(parentId, capId);
	if (linkResult.getSuccess()) {
		logDebug("Successfully linked to Parent Application : " + parentAppNum);
	} else {
		logDebug("**ERROR: linking to parent application parent cap id (" + parentAppNum + "): " + linkResult.getErrorMessage());
	}

}

 
/**
 * AA User ID for a Public User (ex. PUBLICUSER0011) is used to match Public User.
 * Ref LPs associated with that PU are then matched.
 * For each of the matched Ref LPs, an attempt is made to add the Ref LP to the Record.
 * @param {object} itemCapId CapID
 * @param {string} publicUser AA User ID for the Public User
 * @returns {boolean} If there were issues 'false'. If any Ref LPs were attached then 'true'.
 */
function addPublicUserLPsToRecord(itemCapId, publicUser) {
	if (typeof itemCapId == "undefined" || itemCapId == null || (typeof itemCapId.getCustomID == "undefined")) {
		logDebug("'addPublicUserLPsToRecord' requires a CapID for parameter 'itemCapId'");
		return false;
	}
	if (typeof publicUser == "undefined" || publicUser == null || publicUser == "") {
		logDebug("'addPublicUserLPsToRecord' requires a Public User's User ID for parameter 'publicUser'");
		return false;
	}
	var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUser);
	if (!publicUserModelResult.getSuccess() || !publicUserModelResult.getOutput()) {
		logDebug("**WARNING** couldn't find public user " + publicUser + " " + publicUserModelResult.getErrorMessage());
		return false;
	}
	var userSeqNum = publicUserModelResult.getOutput().getUserSeqNum();
	var associatedLPResult = aa.licenseScript.getRefLicProfByOnlineUser(userSeqNum);
	if (!associatedLPResult.getSuccess() || !associatedLPResult.getOutput()) {
		logDebug("**WARNING** no associated LPs to publuc user " + publicUser + " " + associatedLPResult.getErrorMessage());
		return false;
	}
	var associatedLPs = associatedLPResult.getOutput();
	if (associatedLPs.length <= 0) {
		logDebug("**WARNING** no associated LPs to publuc user " + publicUser + " " + associatedLPResult.getErrorMessage());
		return false;
	}
	// TODO - may be more-than-one. Track success/failure and return an object describing outcome more fully.
	var failedAttempts = 0;
	for (var x in associatedLPs) {
		var lp = associatedLPs[x];
		var attachResult = aa.licenseScript.associateLpWithCap(itemCapId, lp);
		if (!attachResult.getSuccess()) {
			logDebug("**WARNING** failed to associate LP " + lp.getStateLicense() + " to Record " + attachResult.getErrorMessage());
			failedAttempts++
		} else {
			logDebug("Associated LP " + lp.getStateLicense() + " to Record " + itemCapId.getCustomID());
		}
	}
	return (associatedLPs.length > failedAttempts);
}
 
function addrAddCondition(pAddrNum, pType, pStatus, pDesc, pComment, pImpact, pAllowDup)
	{
	//if pAddrNum is null, condition is added to all addresses on CAP
	//06SSP-00223
	//
	if (pAllowDup=="Y")
		var noDup = false;
	else
		var noDup = true;
		
	var condAdded = false;
		
	if (!pAddrNum) //no address num, add condition to all addresses on CAP
		{
		var capAddrResult = aa.address.getAddressByCapId(capId);
		if (capAddrResult.getSuccess())
			{
			var addCondResult;
			var addCondResult2;
			var getCondResult;
			var condArray;
			var addresses = capAddrResult.getOutput();
			
			addCondLoop:  //loop identifier
			for (zz in addresses)
				{
				var addrRefId = addresses[zz].getRefAddressId();
				if (addrRefId==null)
					{
					logDebug("No reference address ID found for Address "+zz);
					continue;
					}
					
				if (noDup) //Check if this address has duplicate condition
					{
					var cType;
					var cStatus;
					var cDesc;
					var cImpact;
					
					getCondResult = aa.addressCondition.getAddressConditions(addrRefId);
					condArray = getCondResult.getOutput();
					if (condArray.length>0)
						{
						for (bb in condArray)
							{
							cType = condArray[bb].getConditionType();
							cStatus = condArray[bb].getConditionStatus();
							cDesc = condArray[bb].getConditionDescription();
							cImpact = condArray[bb].getImpactCode();
							if (cType==null)
								cType = " ";
							if (cStatus==null)
								cStatus = " ";
							if (cDesc==null)
								cDesc = " ";
							if (cImpact==null)
								cImpact = " ";
							if ( (pType==null || pType.toUpperCase()==cType.toUpperCase()) && (pStatus==null || pStatus.toUpperCase()==cStatus.toUpperCase()) && (pDesc==null || pDesc.toUpperCase()==cDesc.toUpperCase()) && (pImpact==null || pImpact.toUpperCase()==cImpact.toUpperCase()) )
								{
								logMessage("Condition already exists: New condition not added to Address ID "+addrRefId);
								logDebug("Condition already exists: New condition not added to Address ID "+addrRefId);
								continue addCondLoop; //continue to next address without adding condition
								}
							}
						}
					}
					
				logDebug("Adding Condition to address " + zz + " = " + addrRefId);
				addCondResult = aa.addressCondition.addAddressCondition(addrRefId, pType, pDesc, pComment, null, null, pImpact, pStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
				if (addCondResult.getSuccess())
					{
					logMessage("Successfully added condition to Address ID " + addrRefId + "  (" + pImpact + ") " + pDesc);
					logDebug("Successfully added condition to Address ID " + addrRefId + "  (" + pImpact + ") " + pDesc);
					condAdded=true;
					}
				else
					{
					logDebug( "**ERROR: adding condition to Address " + addrRefId + "  (" + pImpact + "): " + addCondResult.getErrorMessage());
					}
				}
			}
		}
	else //add condition to specified address only
		{
		if (noDup) //Check if this address has duplicate condition
			{
			var cType;
			var cStatus;
			var cDesc;
			var cImpact;
			
			getCondResult = aa.addressCondition.getAddressConditions(pAddrNum);
			condArray = getCondResult.getOutput();
			if (condArray.length>0)
				{
				for (bb in condArray)
					{
					cType = condArray[bb].getConditionType();
					cStatus = condArray[bb].getConditionStatus();
					cDesc = condArray[bb].getConditionDescription();
					cImpact = condArray[bb].getImpactCode();
					if (cType==null)
						cType = " ";
					if (cStatus==null)
						cStatus = " ";
					if (cDesc==null)
						cDesc = " ";
					if (cImpact==null)
						cImpact = " ";
					if ( (pType==null || pType.toUpperCase()==cType.toUpperCase()) && (pStatus==null || pStatus.toUpperCase()==cStatus.toUpperCase()) && (pDesc==null || pDesc.toUpperCase()==cDesc.toUpperCase()) && (pImpact==null || pImpact.toUpperCase()==cImpact.toUpperCase()) )
						{
						logMessage("Condition already exists: New condition not added to Address ID "+pAddrNum);
						logDebug("Condition already exists: New condition not added to Address ID "+pAddrNum);
						return false;
						}
					}
				}
			}
		var addCondResult = aa.addressCondition.addAddressCondition(pAddrNum, pType, pDesc, pComment, null, null, pImpact, pStatus, sysDate, null, sysDate, sysDate, systemUserObj, systemUserObj); 
	  if (addCondResult.getSuccess())
		  {
			logMessage("Successfully added condition to Address ID " + pAddrNum + "  (" + pImpact + ") " + pDesc);
			logDebug("Successfully added condition to Address ID " + pAddrNum + "  (" + pImpact + ") " + pDesc);
			condAdded=true;
			}
		else
			{
			logDebug( "**ERROR: adding condition to Address " + pAddrNum + "  (" + pImpact + "): " + addCondResult.getErrorMessage());
			}
		}
	return condAdded;
	}

 
//@ts-check

/**
 * Adds a reference contact to the current record, based on the name of the contact. The function only adds
 * the first matching contact
 * 
 * ----
 * **Env. Variables:**
 * - capId
 * ----
 * @param {string} vFirst First name of reference contact.
 * @param {string} vMiddle Middle name of reference contact.
 * @param {string} vLast Last name of reference contact.
 * @returns {boolean | number} Returns the added contact sequence number if it was added, false if not.
 */
function addReferenceContactByName(vFirst, vMiddle, vLast) {
	if (typeof capId === typeof undefined) {
		logDebug("'addReferenceContactByName' Error: required global variable 'capId' is undefined.");
		return false;
	}
	var userFirst = vFirst;
	var userMiddle = vMiddle;
	var userLast = vLast;
	//Find PeopleModel object for user
	var peopleResult = aa.people.getPeopleByFMLName(userFirst, userMiddle, userLast);
	if (peopleResult.getSuccess()) {
		var peopleObj = peopleResult.getOutput();
		if (peopleObj == null) {
			logDebug("No reference user found for: " + userFirst + " " + userMiddle + " " + userLast);
			return false;
		}
		logDebug("No. of reference contacts found: " + peopleObj.length);
	} else {
		logDebug("**ERROR: Failed to get reference contact record: " + peopleResult.getErrorMessage());
		return false;
	}

	//Add the reference contact record to the current CAP
	var contactAddResult = aa.people.createCapContactWithRefPeopleModel(capId, peopleObj[0]);
	if (contactAddResult.getSuccess()) {
		logDebug("Contact successfully added to CAP.");
		var capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess()) {
			var contacts = capContactResult.getOutput();
			var last = contacts.length - 1;
			var contactNbr = contacts[last].getCapContactModel().getPeople().getContactSeqNumber();
			logDebug("Contact Nbr = " + contactNbr);
			return contactNbr;
		} else {
			logDebug("**ERROR: Failed to get Contact Nbr: " + capContactResult.getErrorMessage());
			return false;
		}
	} else {
		logDebug("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage());
		return false;
	}
}
 
function addressExistsOnCap() {
	// Optional parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 1)
		itemCap = arguments[0]; // use cap ID specified in args

	var fcapAddressObj = null;
	var capAddResult = aa.address.getAddressByCapId(itemCap);
	if (capAddResult.getSuccess())
		var fcapAddressObj = capAddResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get Address object: " + capAddResult.getErrorType() + ":" + capAddResult.getErrorMessage());
		return false;
	}

	for (i in fcapAddressObj) {
		return true;
	}

	return false;
}
 
function addStdCondition(cType, cDesc, vCapId, exactMatch) // optional cap ID
{

	var itemCap = capId;
	var addCapCondResult;
	if (!matches(vCapId,undefined,null,"")) itemCap = vCapId;
	if (matches(exactMatch,undefined,null,"","false",false)) exactMatch = false; // default to false
	if (matches(exactMatch,"true",true)) exactMatch = true;
	if (!aa.capCondition.getStandardConditions) {
		logDebug("addStdCondition function is not available in this version of Accela Automation.");
	} else {
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)

			if(!exactMatch){

				standardCondition = standardConditions[i];

				addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
				
			}
			if (exactMatch && (standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase())) //EMSE Dom function does like search, needed for exact match
			{
				standardCondition = standardConditions[i];

				addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());

			}

			if (addCapCondResult && addCapCondResult.getSuccess()) {
				logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
			} else {
				logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
			}
			
	}
}
 
function addTask(sourceTaskName, newTaskName, insertTaskType) {

	// insertTaskType needs to be "N" or "P" for "Next" or "Parallel"

	var itemCap = capId;
	if (arguments.length > 3)
		itemCap = arguments[3]; // use cap ID specified in args


	if (!insertTaskType.toUpperCase().equals("P") && !insertTaskType.toUpperCase().equals("N")) {
		logDebug("WARNING: Insert Task Type must be P or N");
		return false;
	}

	var sTask;
	var tTask;

	//get the task by the task path
	var taskResult1 = aa.workflow.getTask(itemCap, sourceTaskName);
	if (taskResult1.getSuccess()) {
		tTask = taskResult1.getOutput();
	} else {
		logDebug("WARNING: Failed to get task! Path = " + sourceTaskName + ";" + taskResult1.getErrorMessage());
		return false;
	}

	//change the task name
	tTask.setTaskDescription(newTaskName);

	var taskResult = aa.workflow.insertTask(tTask, insertTaskType);
	if (taskResult.getSuccess()) {
		var processId = tTask.getProcessID();
		var stepNum = tTask.getStepNumber();
		var taskResult1 = aa.workflow.getTask(itemCap, stepNum, processId);

		if (taskResult1.getSuccess()) {
			tTask = taskResult1.getOutput();
			logDebug("add task successful : inserted task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
		} else {
			logDebug("WARNING: Failed to get task! Path = " + taskPath + ";" + taskResult1.getErrorMessage());
			return false;
		}

	} else {
		logDebug("WARNING: Failed to add task! Path = " + taskPath + ";" + taskResult.getErrorMessage());
		return false;
	}

	return tTask; // returns task item
} 

function addTimeAccountingRecord(taskUser, taGroup, taType, dateLogged, hoursSpent, itemCap, billableBool) {

    if (!aa.timeAccounting.getTimeTypeByTimeTypeName) {
		logDebug("addTimeAccountingRecordToWorkflow function required AA 7.1SP3 or higher."); return false }

    userRight = aa.userright.getUserRight(appTypeArray[0], taskUser).getOutput();

    TimeAccountingResult = aa.timeAccounting.getTimeLogModel();

    if (TimeAccountingResult.getSuccess());
    TimeAccounting = TimeAccountingResult.getOutput();

    var billable = "N";  if (billableBool) billable = "Y";

    TimeAccounting.setAccessModel("N");
    TimeAccounting.setBillable(billable);
    TimeAccounting.setCreatedBy(taskUser);
    TimeAccounting.setCreatedDate(aa.date.getCurrentDate());
    TimeAccounting.setDateLogged(aa.date.parseDate(dateLogged));
    TimeAccounting.setEndTime(null);
    TimeAccounting.setEntryCost(0.0);
    TimeAccounting.setEntryPct(0.0);
    TimeAccounting.setEntryRate(0.0);
    TimeAccounting.setLastChangeDate(aa.date.getCurrentDate());
    TimeAccounting.setLastChangeUser(taskUser);
    TimeAccounting.setMaterials(null);
    TimeAccounting.setMaterialsCost(0.0);
    TimeAccounting.setMilageTotal(0.0);
    TimeAccounting.setMileageEnd(0.0);
    TimeAccounting.setMileageStart(0.0);
    TimeAccounting.setNotation(null);
    if (itemCap)
        TimeAccounting.setReference(itemCap);
    else
        TimeAccounting.setReference("N/A");

    TimeAccounting.setStartTime(null);
    TimeAccounting.setTotalMinutes(60 * hoursSpent);

    var timeElapsedString = "";
    if (hoursSpent.indexOf(".") != -1) {
        var vMinutes = "";
        vMinutes = hoursSpent.substr(hoursSpent.indexOf(".")) * 60;
        vMinutes = vMinutes.toString();
        if (vMinutes.length == 1) vMinutes = "0" + vMinutes;

        timeElapsedString = dateLogged + " " + hoursSpent.substr(0, hoursSpent.indexOf(".")) + ":" + vMinutes + ":00";
    }
    else
    { timeElapsedString = dateLogged + " " + hoursSpent + ":00:00"; }

	var taTypeResult = aa.timeAccounting.getTimeTypeByTimeTypeName(taType);
    if (!taTypeResult.getSuccess() || !taTypeResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting type : " + taType + " : " + taTypeResult.getErrorMessage()); return false;   }
            	

    var taGroupResult = aa.timeAccounting.getTimeGroupByTimeGroupName(taGroup);
    if (!taGroupResult.getSuccess() || !taGroupResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting group : " + taGroup + " : " + taGroupResult.getErrorMessage()); return false;   }

	
    TimeAccounting.setTimeElapsed(aa.date.parseDate(timeElapsedString));
	TimeAccounting.setTimeGroupSeq(taGroupResult.getOutput().getTimeGroupSeq());
    TimeAccounting.setTimeTypeSeq(taTypeResult.getOutput().getTimeTypeSeq());
	TimeAccounting.setUserGroupSeqNbr(userRight.getGroupSeqNumber()); //Required -- User Group Number from user rights
    TimeAccounting.setVehicleId(null);

    addResult = aa.timeAccounting.addTimeLogModel(TimeAccounting);

    if (addResult.getSuccess()) {
        logDebug("Successfully added Time Accounting Record.");
    }
    else {
        logDebug("**ERROR: adding Time Accounting Record: " + addResult.getErrorMessage());
    }
}
 

function addTimeAccountingRecordToWorkflow(taskUser, taGroup, taType, dateLogged, hoursSpent, itemCap, taskName, processName, billableBool)
    {
    
    if (!aa.timeAccounting.getTimeTypeByTimeTypeName) {
		logDebug("addTimeAccountingRecordToWorkflow function required AA 7.1SP3 or higher."); return false }

    userRight = aa.userright.getUserRight(appTypeArray[0], taskUser).getOutput();

    TimeAccountingResult = aa.timeAccounting.getTimeLogModel();

    if (TimeAccountingResult.getSuccess());
    TimeAccounting = TimeAccountingResult.getOutput();

    var billable = "N";  if (billableBool) billable = "Y";
    
    TimeAccounting.setAccessModel("N");
    TimeAccounting.setBillable(billable);
    TimeAccounting.setCreatedBy(taskUser);
    TimeAccounting.setCreatedDate(aa.date.getCurrentDate());
    TimeAccounting.setDateLogged(aa.date.parseDate(dateLogged));
    TimeAccounting.setEndTime(null);
    TimeAccounting.setEntryCost(0.0);
    TimeAccounting.setEntryPct(0.0);
    TimeAccounting.setEntryRate(0.0);
    TimeAccounting.setLastChangeDate(aa.date.getCurrentDate());
    TimeAccounting.setLastChangeUser(currentUserID);
    TimeAccounting.setMaterials(null);
    TimeAccounting.setMaterialsCost(0.0);
    TimeAccounting.setMilageTotal(0.0);
    TimeAccounting.setMileageEnd(0.0);
    TimeAccounting.setMileageStart(0.0);
    TimeAccounting.setNotation(null);
    TimeAccounting.setReference(itemCap);
    TimeAccounting.setStartTime(null);
    TimeAccounting.setTotalMinutes(60 * hoursSpent);

    var timeElapsedString = "";
    if (hoursSpent.indexOf(".") != -1) {
        var vMinutes = "";
        vMinutes = hoursSpent.substr(hoursSpent.indexOf(".")) * 60;
        vMinutes = vMinutes.toString();
        if (vMinutes.length == 1) vMinutes = "0" + vMinutes;

        timeElapsedString = dateLogged + " " + hoursSpent.substr(0, hoursSpent.indexOf(".")) + ":" + vMinutes + ":00";
    }
    else
    { timeElapsedString = dateLogged + " " + hoursSpent + ":00:00"; }
    
    
    var taTypeResult = aa.timeAccounting.getTimeTypeByTimeTypeName(taType);
    if (!taTypeResult.getSuccess() || !taTypeResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting type : " + taType + " : " + taTypeResult.getErrorMessage()); return false;   }
            	

    var taGroupResult = aa.timeAccounting.getTimeGroupByTimeGroupName(taGroup);
    if (!taGroupResult.getSuccess() || !taGroupResult.getOutput()) {
            	logDebug("**WARNING: error retrieving Timeaccounting group : " + taGroup + " : " + taGroupResult.getErrorMessage()); return false;   }

    TimeAccounting.setTimeElapsed(aa.date.parseDate(timeElapsedString));
    TimeAccounting.setTimeGroupSeq(taGroupResult.getOutput().getTimeGroupSeq());
    TimeAccounting.setTimeTypeSeq(taTypeResult.getOutput().getTimeTypeSeq());
    
    TimeAccounting.setUserGroupSeqNbr(userRight.getGroupSeqNumber()); //Required -- User Group Number from user rights
    TimeAccounting.setVehicleId(null);

    // find the task
    
    var capTasks = loadTasks(itemCap);
    var TimeLogModel = null;
    
    for (var thisTaskName in capTasks)
    	if (thisTaskName.equals(taskName) && (!processName || capTasks[thisTaskName].process.equals(processName)))
    		{
    		TimeLogModel = TimeAccounting.getTimeLogModel();
    		TimeLogModel.setEntityId(capTasks[thisTaskName].step + ":" + capTasks[thisTaskName].processID);		
		TimeLogModel.setEntityType("WORKFLOW");
    		TimeLogModel.setCapIDModel(itemCap);
    		}		

    if (TimeLogModel)
	{
	addResult = aa.timeAccounting.addTimeLogModel(TimeAccounting);
	if (addResult.getSuccess()) 
		{
        	logDebug("Successfully added Time Accounting Record to task: " + taskName);
    		}
    	else 	
    		{
        	logDebug("**WARNING: error adding Time Accounting Record to task: " + addResult.getErrorMessage());
    		}
    	}
    else
    	{
    	    logDebug("**WARNING: error adding Time Accounting Record: task " + taskName + ", process " + processName + " not found.");
    	}
} 
//@ts-check
/**
 * Adds one row of values (tableValues) to the application specific info (ASI) table called tableName.
 * The tableValues parameter must be an associative array of string values, where each element name 
 * is a column name in the ASI table tableName, and the element stores the column value. 
 * If you use the capID parameter, the function adds tableValues to tableName in the record whose record ID object is capID.
 * The parameter tableValues does not have to contain all the columns in the ASI table tableName. Blank values
 * will be set for any missing column.
 * The ASI table tableName must already exist on the record.
 * The Table Name passed should be a sub-group on 
 * the group (Custom List Group Code) associated with the Record Type's ASI.
 * @param {string} tableName ASI Table Name 
 * @param {object[]} tableValues Array of associative array values. All elements MUST be either a string or asiTableVal object
 * @param {object=} itemCap Optional - Cap ID object is 3rd parm. If not supplied then global 'capId' is used  
 * @returns {boolean} FALSE if failure, TRUE if update performed without issue
 */
function addToASITable(tableName, tableValues) {

    if (typeof tableName === typeof undefined || tableName == null || tableName == "") {
        logDebug("'addToASITable' - tableName parameter is undefined, null, or an empty string.");
        return false;
    }

    if (typeof tableValues === typeof undefined || tableValues == null) {
        logDebug("'addToASITable' - tableValues parameter is undefined or null");
        return false;
    }

    var itemCap;
    if (arguments.length > 2) {
        // use cap ID specified in args
        itemCap = arguments[2]; 
    } else {
        if (typeof capId != "undefined") {
            itemCap = capId;
        }
    }
	if (!itemCap || (typeof itemCap.getCustomID == "undefined")) {
		logDebug("'addToASITable' requires CapID either in global variable 'capId' or passed as parameter at index 2");
        return false;
	}

    var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName);

    if (!tssmResult.getSuccess()) {
        logDebug("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
        return false;
    }

    var tssm = tssmResult.getOutput();
    var tsm = tssm.getAppSpecificTableModel();
    var fld = tsm.getTableField();
    var col = tsm.getColumns();
    var fld_readonly = tsm.getReadonlyField(); //get ReadOnly property
    var coli = col.iterator();

    while (coli.hasNext()) {
        var colname = coli.next();

        if (!tableValues[colname.getColumnName()]) {
            logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
            tableValues[colname.getColumnName()] = "";
        }

        if (typeof (tableValues[colname.getColumnName()].fieldValue) != "undefined") {
            aa.print("WILL ADD THIS >> " + colname.getColumnName() + "   " + tableValues[colname.getColumnName()].fieldValue);
            fld.add(tableValues[colname.getColumnName()].fieldValue);
            fld_readonly.add(tableValues[colname.getColumnName()].readOnly);
        } else {
            // we are passed a string
            aa.print("WILL ADD THIS .. " + colname.getColumnName() + "   " + tableValues[colname.getColumnName()]);
            fld.add(tableValues[colname.getColumnName()]);
            fld_readonly.add(null);
        }
    }

    tsm.setTableField(fld);
    tsm.setReadonlyField(fld_readonly); // set readonly field

    var addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);
    if (!addResult.getSuccess()) {
        logDebug("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
        return false;
    } else {
        logDebug("Successfully added record to ASI Table: " + tableName);
    }
    return true;
}
 
function allTasksComplete(stask) // optional tasks to ignore... for Sacramento
	{
	var ignoreArray = new Array();
	for (var i=1; i<arguments.length;i++) 
		ignoreArray.push(arguments[i])

	// returns true if any of the subtasks are active
	var taskResult = aa.workflow.getTasks(capId);
	if (taskResult.getSuccess())
		{ taskArr = taskResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting tasks : " + taskResult.getErrorMessage()); return false }
		
	for (xx in taskArr)
		if (taskArr[xx].getProcessCode().equals(stask) && taskArr[xx].getActiveFlag().equals("Y") && !exists(taskArr[xx].getTaskDescription(),ignoreArray))
			return false;
	return true;
	}

 
function appHasCondition(pType,pStatus,pDesc,pImpact)
	{
	// Checks to see if conditions have been added to CAP
	// 06SSP-00223
	//
	if (pType==null)
		var condResult = aa.capCondition.getCapConditions(capId);
	else
		var condResult = aa.capCondition.getCapConditions(capId,pType);
		
	if (condResult.getSuccess())
		var capConds = condResult.getOutput();
	else
		{ 
		logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		return false;
		}
	
	var cStatus;
	var cDesc;
	var cImpact;
	
	for (cc in capConds)
		{
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus();
		var cDesc = thisCond.getConditionDescription();
		var cImpact = thisCond.getImpactCode();
		var cType = thisCond.getConditionType();
		if (cStatus==null)
			cStatus = " ";
		if (cDesc==null)
			cDesc = " ";
		if (cImpact==null)
			cImpact = " ";
		//Look for matching condition
		
		if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
			return true; //matching condition found
		}
	return false; //no matching condition found
	} //function
	
 


function applyPayments() {
	var payResult = aa.finance.getPaymentByCapID(capId, null)

		if (!payResult.getSuccess()) {
			logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
			return false
		}

		var payments = payResult.getOutput();

	for (var paynum in payments) {
		var payment = payments[paynum];
		payment.setPaymentDate(aa.date.getCurrentDate());

		var payBalance = payment.getAmountNotAllocated();
		var payStatus = payment.getPaymentStatus();

		if (payBalance <= 0)
			continue; // nothing to allocate

		if (payStatus != "Paid")
			continue; // not in paid status

		var feeResult = aa.finance.getFeeItemByCapID(capId);

		if (!feeResult.getSuccess()) {
			logDebug("**ERROR: error retrieving fee items " + feeResult.getErrorMessage());
			return false
		}

		var feeArray = feeResult.getOutput();

		for (var feeNumber in feeArray) {

			var feeItem = feeArray[feeNumber];
			var amtPaid = 0;
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);

			if (feeItem.getFeeitemStatus() != "INVOICED")
				continue; // only apply to invoiced fees

			if (!pfResult.getSuccess()) {
				logDebug("**ERROR: error retrieving fee payment items items " + pfResult.getErrorMessage());
				return false
			}

			var pfObj = pfResult.getOutput();

			for (ij in pfObj)
				if (feeItem.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
					amtPaid += pfObj[ij].getFeeAllocation()

					var feeBalance = feeItem.getFee() - amtPaid;

			if (feeBalance <= 0)
				continue; // this fee has no balance

			var fseqlist = new Array();
			var finvlist = new Array();
			var fpaylist = new Array();

			var invoiceResult = aa.finance.getFeeItemInvoiceByFeeNbr(capId, feeItem.getFeeSeqNbr(), null);

			if (!invoiceResult.getSuccess()) {
				logDebug("**ERROR: error retrieving invoice items " + invoiceResult.getErrorMessage());
				return false
			}

			var invoiceItem = invoiceResult.getOutput();

			// Should return only one invoice number per fee item

			if (invoiceItem.length != 1) {
				logDebug("**WARNING: fee item " + feeItem.getFeeSeqNbr() + " returned " + invoiceItem.length + " invoice matches")
			} else {
				fseqlist.push(feeItem.getFeeSeqNbr());
				finvlist.push(invoiceItem[0].getInvoiceNbr());

				if (feeBalance > payBalance)
					fpaylist.push(payBalance);
				else
					fpaylist.push(feeBalance);

				applyResult = aa.finance.applyPayment(capId, payment, fseqlist, finvlist, fpaylist, "NA", "NA", "0");

				if (applyResult.getSuccess()) {
					payBalance = payBalance - fpaylist[0];
					logDebug("Applied $" + fpaylist[0] + " to fee code " + feeItem.getFeeCod() + ".  Payment Balance: $" + payBalance);
				} else {
					logDebug("**ERROR: error applying payment " + applyResult.getErrorMessage());
					return false
				}
			}

			if (payBalance <= 0)
				break;
		}
	}
}
 
function appMatch(ats) // optional capId or CapID string
	{
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


 
function appMatchArray(recordTypesArray){
    var capOverride = false;
    
    var itemCap = capId
	if (arguments.length > 1){
        itemCap = arguments[1]; // use cap ID specified in args
        capOverride = true;
    } 

    for(a in recordTypesArray){
        var recTypeToMatch = recordTypesArray[a];
        if(capOverride){
            if(appMatch(recTypeToMatch,itemCap)){
                return true;
            }
        }
        else{
            if(appMatch(recTypeToMatch)){
                return true;
            }
        }
        
    }
    return false;
}

 
function appMatchArrayBefore(recordTypesArray){
    for(a in recordTypesArray){
        var recTypeToMatch = recordTypesArray[a];
        if(appMatchBefore(recTypeToMatch)){
            return true;
        }
    }
    return false;
}


 
function appMatchBefore(ats) // optional capId or CapID string
    {
    var matchArray = appTypeArray //default to current app
        
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
function appNameIsUnique(gaGroup,gaType,gaName)
//
// returns true if gaName application name has not been used in CAPs of gaGroup and gaType
// Bypasses current CAP
	{
	var getCapResult = aa.cap.getByAppType(gaGroup,gaType);
	if (getCapResult.getSuccess())
		var apsArray = getCapResult.getOutput();
	else
		{ logDebug( "**ERROR: getting caps by app type: " + getCapResult.getErrorMessage()) ; return null }
		
	for (aps in apsArray)
		{
		var myCap = aa.cap.getCap(apsArray[aps].getCapID()).getOutput();
		if (myCap.getSpecialText())
			if (myCap.getSpecialText().toUpperCase().equals(gaName.toUpperCase()) && !capIDString.equals(apsArray[aps].getCapID().getCustomID()))
				return false;
		}
	return true;
	}

 

function asiTableValObj(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;
	this.hasValue = Boolean(fieldValue != null & fieldValue != "");

	asiTableValObj.prototype.toString=function(){ return this.hasValue ? String(this.fieldValue) : String(""); }
}; 
// @ts-check

/**
 * Assigns the staff whose user ID is assignId to the current record. Also assigns the user's department.
 * Note: If you use the optional parameter capID, the function assigns the staff and department to the record capID instead.
 * @param {string} assignId User ID of the user to whom to assign the record.
 * @param {object} [itemCap] (unnamed/optional) - Cap ID object is second parmeter. If not supplied then global 'capId' is used 
*/

function assignCap(assignId) {
	var itemCap;
	if (arguments.length > 1) {
		itemCap = arguments[1]; // use cap ID specified in args
	} else if (typeof capId != "undefined") {
		itemCap = capId;
	}

	if (!itemCap) {
		logDebug("'assignCap' - CapID is required. Supply non-null second parameter or assign global variable 'capId'");
		return false;
	}
	if (typeof assignId == "undefined" || assignId == null || assignId == "") {
		logDebug("'assignCap' - var 'assignId' is required and must not be blank");
		return false;
	}

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}

	var cd = cdScriptObj.getCapDetailModel();

	var iNameResult = aa.person.getUser(assignId);

	if (!iNameResult.getSuccess()) {
		logDebug("**ERROR retrieving  user model " + assignId + " : " + iNameResult.getErrorMessage());
		return false;
	}

	var iName = iNameResult.getOutput();

	cd.setAsgnDept(iName.getDeptOfUser());
	cd.setAsgnStaff(assignId);

	var cdWrite = aa.cap.editCapDetail(cd)

	if (cdWrite.getSuccess()) {
		logDebug("Assigned CAP to " + assignId)
	} else {
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
		return false;
	}
}
 
/**
 * Assigns the inspector whose user ID is iName to the inspection whose sequence number is iNumber.
 * Note: The inspection must already be scheduled on the record.
 * @param {number} iNumber Inspection sequence number.
 * @param {string} iName Inspector's user ID.
 * @param {object} [itemCap] (unnamed/optional) - Cap ID object is third parmeter. If not supplied then global 'capId' is 
 * @returns {boolean | undefined} Some issues may return FALSE, otherwise, nothing is returned.
 */
function assignInspection(iNumber, iName) {

    var itemCap;
	if (arguments.length > 2) {
        itemCap = arguments[2]; // use cap ID specified in args
	} else if(typeof capId != "undefined"){
        itemCap = capId;
    }
    if(!itemCap){
        logDebug("'assignInspection' - CapID is required. Supply non-null third parameter or assign global variable 'capId'");
        return false;
    }
    if(typeof iNumber == "undefined" || iNumber == null || isNaN(parseInt(""+iNumber))){
        logDebug("'assignInspection' - var 'iNumber' is required and must be a number");
        return false;
    }
    if(typeof iName == "undefined" || iName == null || iName == ""){
        logDebug("'assignInspection' - var 'iName' is required and must not be blank");
        return false;
    }
    var l_sysDate = (typeof sysDate == "undefined" || !sysDate) ? aa.date.getCurrentDate() : sysDate;

	var iObjResult = aa.inspection.getInspection(itemCap, iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
		return false;
	}

	var iObj = iObjResult.getOutput();

	var iInspector = aa.person.getUser(iName).getOutput();

	if (!iInspector) {
		var dpt = aa.people.getDepartmentList(null).getOutput();
		for (var thisdpt in dpt) {
			var m = dpt[thisdpt]
			if (iName.equals(m.getDeptName())) {
				var iNameResult = aa.person.getUser(null, null, null, null, m.getAgencyCode(), m.getBureauCode(), m.getDivisionCode(), m.getSectionCode(), m.getGroupCode(), m.getOfficeCode());

				if (!iNameResult.getSuccess()) {
					logDebug("**WARNING retrieving department user model " + iName + " : " + iNameResult.getErrorMessage());
					return false;
				}
				iInspector = iNameResult.getOutput();
			}
		}
	}

	if (!iInspector) {
		logDebug("**WARNING could not find inspector or department: " + iName + ", no assignment was made");
		return false;
	} else {
		if (iInspector.getFirstName() == null) {
			iInspector.setFirstName("");
		}
		if (iInspector.getMiddleName() == null) {
			iInspector.setMiddleName("");
		}
		if (iInspector.getLastName() == null) {
			iInspector.setLastName("");
		}
		if (iInspector.getGaUserID() == null) {
			iInspector.setGaUserID("");
		}
		if (iInspector.getUserID() == null) {
			iInspector.setUserID("");
		}
	}

	logDebug("assigning inspection " + iNumber + " to " + iName);
	iObj.setInspector(iInspector);
	if (iObj.getScheduledDate() == null) {
		iObj.setScheduledDate(l_sysDate);
	}
	var editRslt = aa.inspection.editInspection(iObj);
}
 
function assignTask(wfstr,username) // optional process name
	{
	// Assigns the task to a user.  No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) 
		{
		processName = arguments[2]; // subprocess
		useProcess = true;
		}
		
	var taskUserResult = aa.person.getUser(username);
	if (taskUserResult.getSuccess())
		taskUserObj = taskUserResult.getOutput();  //  User Object
	else
		{ logMessage("**ERROR: Failed to get user object: " + taskUserResult.getErrorMessage()); return false; }
		
	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			fTask.setAssignedUser(taskUserObj);
			var taskItem = fTask.getTaskItem();
			var adjustResult = aa.workflow.assignTask(taskItem);
			
			logMessage("Assigned Workflow Task: " + wfstr + " to " + username);
			logDebug("Assigned Workflow Task: " + wfstr + " to " + username);
			}			
		}
	}

 
function associateRefContactAddressToRecordContact(itemCap,cSeqNumber,rConAddrModel) {

	if (itemCap && cSeqNumber && rConAddrModel) {
		var xRefContactAddress = aa.address.createXRefContactAddressModel().getOutput();
		xRefContactAddress.setCapID(itemCap);
		xRefContactAddress.setAddressID(rConAddrModel.getAddressID());
		// Set the daily contact id to xRefContactAddress model
		xRefContactAddress.setEntityID(aa.util.parseLong(cSeqNumber));
		xRefContactAddress.setEntityType(rConAddrModel.getEntityType());
		// Create
		var xrefResult = aa.address.createXRefContactAddress(xRefContactAddress.getXRefContactAddressModel());

		if (xrefResult.getSuccess) {
			logDebug("Successfully assocaited reference contact address to cap contact: " + cSeqNumber);
			return true;
		} else {
			logDebug("Failed to associate reference contact address to cap: " + xrefResult.getErrorMessage());
			return false;
		}

	} else {
		logDebug("Could not associate reference contact address no address model, capId or cap contact sequence number");
		return false;		
	}

} 
function autoAssignInspection(iNumber)
	{
	// updates the inspection and assigns to a new user
	// requires the inspection id
	//

	iObjResult = aa.inspection.getInspection(capId,iNumber);
	if (!iObjResult.getSuccess())
		{ logDebug("**ERROR retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage()) ; return false ; }
	
	iObj = iObjResult.getOutput();


	inspTypeResult = aa.inspection.getInspectionType(iObj.getInspection().getInspectionGroup(), iObj.getInspectionType())

	if (!inspTypeResult.getSuccess())
		{ logDebug("**ERROR retrieving inspection Type " + inspTypeResult.getErrorMessage()) ; return false ; }
	
	inspTypeArr = inspTypeResult.getOutput();

        if (inspTypeArr == null || inspTypeArr.length == 0)
		{ logDebug("**ERROR no inspection type found") ; return false ; }

	inspType = inspTypeArr[0]; // assume first

	inspSeq = inspType.getSequenceNumber();

	inspSchedDate = iObj.getScheduledDate().getYear() + "-" + iObj.getScheduledDate().getMonth() + "-" + iObj.getScheduledDate().getDayOfMonth()

 	logDebug(inspSchedDate)

	iout =  aa.inspection.autoAssignInspector(capId.getID1(),capId.getID2(),capId.getID3(), inspSeq, inspSchedDate)

	if (!iout.getSuccess())
		{ logDebug("**ERROR retrieving auto assign inspector " + iout.getErrorMessage()) ; return false ; }

	inspectorArr = iout.getOutput();

	if (inspectorArr == null || inspectorArr.length == 0)
		{ logDebug("**WARNING no auto-assign inspector found") ; return false ; }
	
	inspectorObj = inspectorArr[0];  // assume first
	
	iObj.setInspector(inspectorObj);

	assignResult = aa.inspection.editInspection(iObj)

	if (!assignResult.getSuccess())
		{ logDebug("**ERROR re-assigning inspection " + assignResult.getErrorMessage()) ; return false ; }
	else
		logDebug("Successfully reassigned inspection " + iObj.getInspectionType() + " to user " + inspectorObj.getUserID());

	}
 
/**
 * Auto schedules an inspection using a RecordID, Inspection Sequence Number, 
 * and date, logs detailed error codes, and returns assignment information object
 *
 * @param {object} vCapId
 * @param {int} inspSeqNbr
 * @param {string} date
 * @returns {object} assignInfo 
 */
function autoScheduleInspection(vCapId, inspSeqNbr, date) {
    var funcName = "autoScheduleInspection(): ";
    logDebug("***STARTING function: " + funcName + new Date().toLocaleTimeString());
    var inspModel;
    var inspScriptModel;
    var inspScriptModelResult = aa.inspection.getInspection(vCapId, inspSeqNbr);
    if (inspScriptModelResult.getSuccess()) {
        inspScriptModel = inspScriptModelResult.getOutput();
        inspModel = inspScriptModel.getInspection();
    } else {
        logDebug(funcName + "**ERROR: Could not get inspection from record. InspSeqNbr: " + inspSeqNbr + ". " + inspScriptModelResult.getErrorMessage());
    }
    // work around required to set autoAssign = Y on new inspection (defaults to "N" when scheduled via script)
    var actModel = inspModel.getActivity();
    actModel.setAutoAssign("Y");
    inspModel.setActivity(actModel);
    logDebug(funcName + "Schedule on earliest date: " + date);
    inspModel.getActivity().setActivityDate(date);
    inspSchedDate = aa.util.formatDate(date, "MM/dd/yyyy");
    var assignSwitch = aa.proxyInvoker.newInstance("com.accela.aa.inspection.assign.model.AssignSwitch").getOutput();
    assignSwitch.setGetNextAvailableTime(true);
    assignSwitch.setOnlyAssignOnGivenDate(false);
    assignSwitch.setValidateCutOffTime(false);
    assignSwitch.setValidateScheduleNumOfDays(false);
    assignSwitch.setAutoAssignOnGivenDeptAndUser(false);
    assignSwitch.setCheckingCalendar(true);
    var assignService = aa.proxyInvoker.newInstance("com.accela.aa.inspection.assign.AssignInspectionBusiness").getOutput();
    var inspectionList = aa.util.newArrayList();
    inspectionList.add(inspModel);
    var specifiedDate = aa.proxyInvoker.newInstance("com.accela.aa.inspection.assign.model.SpecifiedDateTime").getOutput();
    specifiedDate.setDate(date)
    var result = assignService.autoAssign4AddOns(aa.getServiceProviderCode(), inspectionList, specifiedDate, assignSwitch);
    var assignInfo = null;
    // last change made
    if (result.size() <= 0) {
        return false;
    }
    var atm = result.get(0);
    assignInfo = atm;
    var errMsg = "";
    if (assignInfo.flag == "S") {
        logDebug(funcName + "Successfully auto scheduled inspection.");
        var inspector = assignInfo.getInspector();
        var schedDate = assignInfo.getScheduleDate();
        var schedDateScript = aa.date.getScriptDateTime(schedDate);
        inspScriptModel.setInspector(inspector);
        inspScriptModel.setScheduledDate(schedDateScript);
        var editInspResult = aa.inspection.editInspection(inspScriptModel)
        if (!editInspResult.getSuccess()) {
            logDebug(funcName + "WARNING: re-assigning inspection " + editInspResult.getErrorMessage());
            return false;
        } else {
            logDebug(funcName + "Successfully reassigned inspection " + inspScriptModel.getInspectionType() + " to user " + inspector.getUserID() + " on " + schedDate);
        }
        return true;
    }
    if (assignInfo.flag == "C") {
        logDebug(funcName + "WARNING: Cut off will not allow to schedule.");
    }
    if (assignInfo.flag == "U") {
        logDebug(funcName + "WARNING: Unable to auto schedule and assign inspection.");
        switch (assignInfo.resultType) {
            case 24:
                errMsg = "Auto assign is disabled for inspection.";
                break;
            case 25:
                errMsg = "Calendar not found.";
                break;
            case 23:
                errMsg = "Inspector not found.";
                break;
            case 22:
                errMsg = "End time is less than start time.";
                break;
            case 21:
                errMsg = "End time not available.";
                break;
            case 9:
                errMsg = "Inspection unit exceeded inspector max unit.";
            case 2:
                errMsg = "Next available time not found.";
                break;
            default:
                errMsg = "Cannot schedule.";
                break;
        }
        logDebug(errMsg);
    }
    if (assignInfo.flag == "F") {
        logDebug(funcName + "WARNING: Can not auto schedule and assign inspection. Calendar is full.");
        switch (assignInfo.resultType) {
            case 4:
                errMsg = "Calendar Units full.";
                break;
            case 6:
                errMsg = "Calendar Inspection overlap.";
                break;
            case 10:
                errMsg = "Inspection Units Full";
                break;
            case 11:
                errMsg = "Inspection Inspection Overlap";
                break;
            case 5:
                errMsg = "Next inspection not found.";
                break;
            case 12:
                errMsg = "Issue with number of schedule days.";
            case 13:
                errMsg = "Not a working day";
            case 14:
                errMsg = "Scheduled time is not avaialble";
                break;
            case 15:
                errMsg = "Calendar daily units are full";
                break;
            case 16:
                errMsg = "Calendar event units are full.";
                break;
            default:
                errMsg = "";
                break;
        }
        logDebug(errMsg);
    }
    logDebug("***ENDING function: " + funcName + new Date().toLocaleTimeString() + "<br>");
    return assignInfo;
} 
//@ts-check

/**
 * Executes the standard choice script control whose name is iNumber as a sub-control.
 * Note: The script stdChoice must contain only valid criteria/action pairs sequentially numbered.
 * @param {string} stdChoice Standard choices item namestring. Case sensitive.
 */

function branch(stdChoice) {
	doStandardChoiceActions(stdChoice, true, 0);
}

 
//@ts-check

/**
 * Updates the workflow task wfstr as follows:
 * •Status = wfstat
 * •Status Date = current date
 * •Status Comment = wfcomment
 * •Action By = current user
 * 
 * ---
 * **Notes**
 * The function closes the task wfstr and the workflow proceeds to the branch task.
 * If record’s workflow contains duplicate wfstr tasks, use parameter wfProcess to specify the process or
 * subprocess whose wfstr to edit.
 * 
 * ---
 * **Global Variable**:
 * - capId
 * - systemUserObj
 * 
 * ---
 * @param {string} wfstr Workflow task name.
 * @param {string} wfstat Status.
 * @param {string} wfcomment Comment.
 * @param {string} wfnote Note to add to the workflow task.
 * @param {string} [wfProcess] (unnamed/optional) - ID (R1_PROCESS_CODE) for the process that the task belongs to. Required for multi-level workflows.
 * @returns {boolean | undefined} Some issues may return FALSE, otherwise, nothing is returned.
 */

function branchTask(wfstr, wfstat, wfcomment, wfnote) {

	if (typeof capId === typeof undefined) {
		logDebug("capId is undefined.");
		return false;
	}

	if (typeof systemUserObj === typeof undefined) {
		logDebug("systemUserObj is undefined.");
		return false;
	}

	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	} else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false;
	}

	if (!wfstat) {
		wfstat = "NA"
	}

	for (var i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "B");
			} else {
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "B");
			}
			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
		}
	}
}

 
function callWebService(wsSubScript, wsScriptParameters)
	{

		aa.env.setValue("wsScriptParameters",wsScriptParameters);
		aa.env.setValue("wsScriptDebug","");
		aa.env.setValue("wsScriptMessage","");
		
		var sSubDebug = "";
		var sSubMessage = "";
		
		logDebug("Executing Web Service wsSubScript: " + wsSubScript);
		aa.runScriptInNewTransaction(wsSubScript);
		sSubDebug = aa.env.getValue("wsScriptDebug");
		sSubMessage = aa.env.getValue("wsScriptMessage");
		if (sSubDebug != "")
		{
			//Logging
			logDebug("Debug from wsSubScript: " + wsSubScript);
			logDebug(sSubDebug);
		}
		if (sSubMessage != "")
		{
			//Logging
			logDebug("Message from wsSubScript: " + wsSubScript);
			logDebug(sSubMessage);
		}
		
	}
 
//@ts-check

/**
 * Returns true if any licensed professional on the record has expired; otherwise, returns false.
 * Comparison is done on current date is GT than expiration date. Any blank date is assumed to not have expired. 
 * 
 * **Notes**:
 * 
 * Checks for expiration by retrieving the licensed professional reference record having the same license # 
 * and checking the expiration date specified by pDateType. If the expiration date is on or before the current 
 * date, the script returns true. Skips disabled licensed professionals.
 * Use parameter pLicType to check a specific license type. Use parameter pCapId to check licensed
 * professionals on a record other than the current record.
 * 
 * dateType values:
 * - EXPIRE: License Expiration Date
 * - INSURANCE: Insurance Expiration Date
 * - BUSINESS: Business License Expiration Date
 * ---
 * **Global Variables**:
 * - capId
 * ---
 * @param {("EXPIRE" | "INSURANCE" | "BUSINESS")} pDateType Expiration date to check. Options (use one): EXPIRE, INSURANCE, BUSINESS.
 * @param {string} [pLicType] (Optional) License type. Case sensitive
 * @param {CapIDModel} [pCapId] (Optional) Record ID object of record. If null, the function applies to the current record.
 * @returns  {boolean} Returns true if any licensed professional on the record has expired; otherwise (or in case of error), returns false.
 */
function capHasExpiredLicProf(pDateType, pLicType, pCapId) {
	//Uses functions: refLicProfGetDate, jsDateToMMDDYYYY(), matches()

	if (!pCapId && typeof capId === typeof undefined || capId === null) {
		logDebug("'capHasExpiredLicProf' Error: Global variable 'capId' not defined or pCapId given is not defined.");
		return false;
	}
  var vCapId = pCapId || capId;

	if (!pDateType || (pDateType && !matches(pDateType.toUpperCase(), "EXPIRE", "INSURANCE", "BUSINESS"))) {
		logDebug("'capHasExpiredLicProf' Error: Invalid 'pDateType' parameter value. Allowed values are ['EXPIRE', 'INSURANCE', 'BUSINESS']. Got: " + pDateType);
		return false;
	}
	var vDateType = pDateType.toUpperCase();

	//get Licensed Profs on CAP
	var licProfResult = aa.licenseScript.getLicenseProf(vCapId);
	if (!licProfResult.getSuccess()) {
		logDebug("'capHasExpiredLicProf' Error: Error getting CAP's license professional: " + licProfResult.getErrorMessage());
		return false;
	}


	var vToday = new Date(aa.util.now());
	var vExpired = false;
	var licProfList = licProfResult.getOutput();
	if (!licProfList) {
		logDebug("'capHasExpiredLicProf': No licensed professionals found on CAP");
		return false;
	}

	for (var i in licProfList) {
		if (!pLicType || pLicType.equals(licProfList[i].getLicenseType())) {
			var licNum = licProfList[i].getLicenseNbr();

			//Check if has expired
			var vResult = refLicProfGetDate(licNum, vDateType);
			if (vResult < vToday) {
				vExpired = true;
				logMessage("WARNING: Licence # " + licNum + " expired on " + jsDateToMMDDYYYY(vResult));
				logDebug("Licence # " + licNum + " expired on " + jsDateToMMDDYYYY(vResult));
			}
		}
	}
	return vExpired;
}
 
//@ts-check

/**
 * Searches though the records in pCapIdArray and returns only records whose file date is between 
 * pStartDate and pEndDate, as an array of capId (CapIDModel) objects.
 * 
 * **Notes:**
 * To find the number of records returned, store the return value to a variable and use the length 
 * property to find the number of records in the array.
 * 
 * ----
 * @example
 * 
 * capArray = capIdsFilterByFileDate(myCapArray, "01/01/2006", "12/31/2006");
 * capCount = capArray.length;
 * ---
 *
 * @param {Array<CapIDModel>} pCapIdArray Array of record ID (CapIDModel) objects to filter.
 * @param {string} pStartDate Start date of the file date range, in MM/DD/YYYY format.
 * @param {string} pEndDate End date of the file date range, in MM/DD/YYYY format.
 * @returns {Array<CapIDModel> | boolean} returns the filtered array, or false in case of error
 */
function capIdsFilterByFileDate(pCapIdArray, pStartDate, pEndDate) {

	if (!pCapIdArray || pCapIdArray.length === 0 || pCapIdArray[0] === undefined) {
		logDebug("'capIdsFilterByFileDate' Error: 'pCapIdArray' element is empty");
		return false;
	}

	var filteredArray = new Array();
	var startDate = new Date(pStartDate);
	var endDate = new Date(pEndDate);
	if(isNaN(startDate.getTime())|| isNaN(endDate.getTime())){
        logDebug("'capIdsFilterByFileDate' Error: supply both 'pStartDate' and 'pEndDate' in MM/DD/YYYY format");
        return false;
    }
	var relcap;
	var fileDate;

	logDebug("Filtering CAP array by file date between " + pStartDate + " and " + pEndDate);
	for (var y in pCapIdArray) {
        try{
            relcap = aa.cap.getCap(pCapIdArray[y]).getOutput(); //returns CapScriptModel object
            fileDate = convertDate(relcap.getFileDate()); //returns javascript date
            if (fileDate >= startDate && fileDate <= endDate){
                filteredArray.push(pCapIdArray[y]); //add cap to array
            }
        } catch (err){
            logDebug("'capIdsFilterByFileDate' issue in position " + y + " in 'pCapIdArray' array. Continue" );
            continue;
        }
	}

	return filteredArray;
} 
//@ts-check

/**
 * Returns records that have the same property address as the current record, as an array of capId (CapIDModel) objects.
 * Current record is included in the return array.
 * 
 * **Notes:**
 * 
 * The function matches addresses based on these fields:
 * - House Nbr Start
 * - Street Direction
 * - Street Name
 * - Street Suffix
 * - Zip
 * You can use this function with all events except ApplicationSubmitBefore. The records returned include
 * the current record. If the current record has more than one property address, the function uses the first
 * address to match.
 * To find the number of records returned, store the return value to a variable and use the length property to
 * find the number of records in the array.
 * 
 * ---
 * **Global Variable**:
 * - capId
 * ---
 * 
 * @example
 * capArray = capIdsGetByAddr(); 
 * logDebug("Number of CAPs: " + capArray.length);
 * 
 * @returns {Array<CapIDModel> | boolean} Array of CapIDModel in the case of existing, false otherwise(or in case of error)
 */
function capIdsGetByAddr() {

	if(typeof capId === typeof undefined || capId === null){
		logDebug("'capIdsGetByAddr' Error: Required global variable 'capId' is not defined.");
		return false;
	}
	//Get address(es) on current CAP
	var addrResult = aa.address.getAddressByCapId(capId);
	if (!addrResult.getSuccess()) {
		logDebug("**ERROR: getting CAP addresses: " + addrResult.getErrorMessage());
		return false;
	}

	var addrArray = addrResult.getOutput();
	if (addrArray.length == 0 || addrArray == undefined) {
		logDebug("The current CAP has no address.  Unable to get CAPs with the same address.")
		return false;
	}

	//use 1st address for comparison
	var streetName = addrArray[0].getStreetName();
	var hseNum = addrArray[0].getHouseNumberStart();
	var streetSuffix = addrArray[0].getStreetSuffix();
	var zip = addrArray[0].getZip();
	var streetDir = addrArray[0].getStreetDirection();

	if (streetDir == "") streetDir = null;
	if (streetSuffix == "") streetSuffix = null;
	if (zip == "") zip = null;

	if (hseNum && !isNaN(hseNum)) {
		hseNum = parseInt(hseNum);
	} else {
		hseNum = null;
	}

	// get caps with same address
    if(!streetName && !hseNum && !streetSuffix && !zip && !streetDir){
        logDebug("The current CAP has no address.  Unable to get CAPs with the same address.");
		return false;
    }
	var capAddResult = aa.cap.getCapListByDetailAddress(streetName, hseNum, streetSuffix, zip, streetDir, null);
	if (!capAddResult.getSuccess()){
		logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
		return false;
	}
		
	var capArray = capAddResult.getOutput();

	var capIdArray = new Array();
	//convert CapIDScriptModel objects to CapIDModel objects
	for (var i in capArray){
		capIdArray.push(capArray[i].getCapID());
    }

	if (capIdArray){
		return (capIdArray);
	} 
	return false;
} 
//@ts-check

/**
 * Returns records that have the same parcel as the current record, as an array of capId (CapIDModel) objects.
 * 
 * **Notes**:
 * 
 * The records returned include the current record.
 * To find the number of records returned, store the return value to a variable and use the length property to find the number of records in the array.
 * 
 * ---
 * 
 * @example
 * capArray = capIdsGetByParcel(); 
 * logDebug("Number of CAPs: " + capArray.length);
 * @param {string} [pParcelNum] (Optional) Parcel number to search for. If null or omitted, the function uses the first parcel number on the current record.
 * @returns {Array<CapIDModel> | boolean} Returns records that have the same parcel as the current record. If the current record has no parcel, returns false.
 */
function capIdsGetByParcel(pParcelNum) {

	var parcelNum = pParcelNum;
	if (typeof parcelNum === typeof undefined || parcelNum === null) {
		if (typeof capId === typeof undefined || capId === null) {
			logDebug("'capIdsGetByParcel' Error: When parameter 'pParcelNum' is not defined, global variable 'capId' is required.");
			return false;
		}
		var capAllParcelResult = aa.parcel.getParcelandAttribute(capId, null);
		if (!capAllParcelResult.getSuccess()) {
			logDebug("**ERROR: Failed to get parcels: " + capAllParcelResult.getErrorMessage());
			return false;
		}

		var Parcels = capAllParcelResult.getOutput().toArray();
		if (Parcels[0] == undefined) {
			logDebug("'capIdsGetByParcel': Current CAP has no parcel");
			return false;
		}
		parcelNum = Parcels[0].getParcelNumber();
	}
	aa.print("'capIdsGetByParcel' Parcel : " + parcelNum);

	var capParcelResult = aa.cap.getCapListByParcelID(parcelNum, aa.util.newQueryFormat());

	if (!capParcelResult.getSuccess()) {
		logDebug("**ERROR: Failed to get parcels: " + capParcelResult.getErrorMessage());
		return false;
	}

	var capParArray = capParcelResult.getOutput();
	var capIdParArray = new Array();
	//convert CapIDScriptModel objects to CapIDModel objects
	for (var i in capParArray) {
		capIdParArray.push(capParArray[i].getCapID());
	}

	if (capIdParArray) {
		return capIdParArray;
	}

	return false;
} 
function capSet(desiredSetId)
    {
    this.refresh = function()
        {

        var theSet = aa.set.getSetByPK(this.id).getOutput();
		this.status = theSet.getSetStatus();
        this.setId = theSet.getSetID();
        this.name = theSet.getSetTitle();
        this.comment = theSet.getSetComment();
		this.model = theSet.getSetHeaderModel();
		this.statusComment = theSet.getSetStatusComment();
		this.type = theSet.getRecordSetType();

        var memberResult = aa.set.getCAPSetMembersByPK(this.id);

        if (!memberResult.getSuccess()) { logDebug("**WARNING** error retrieving set members " + memberResult.getErrorMessage()); }
        else
            {
            this.members = memberResult.getOutput().toArray();
            this.size = this.members.length;
            if (this.members.length > 0) this.empty = false;
            logDebug("capSet: loaded set " + this.id + " of status " + this.status + " with " + this.size + " records");
            }
        }
        
    this.add = function(addCapId) 
        {
        var setMemberStatus;
        if (arguments.length == 2)  setMemberStatus = arguments[1]; 
            
        var addResult = aa.set.add(this.id,addCapId);
		
		if (setMemberStatus) this.updateMemberStatus(addCapId,setMemberStatus);
		
        }
    
	this.updateMemberStatus = function(addCapId,setMemberStatus) {
	
		// Update a SetMember Status for a Record in SetMember List.

        var setUpdateScript = aa.set.getSetDetailsScriptModel().getOutput();
        setUpdateScript.setSetID(this.id);          //Set ID
        setUpdateScript.setID1(addCapId.getID1());
        setUpdateScript.setID2(addCapId.getID2());
        setUpdateScript.setID3(addCapId.getID3());
        setUpdateScript.setSetMemberStatus(setMemberStatus); 
        setUpdateScript.setSetMemberStatusDate(aa.date.getCurrentDate());  
        setUpdateScript.setServiceProviderCode(aa.getServiceProviderCode());

        var addResult = aa.set.updateSetMemberStatus(setUpdateScript);
        
        if (!addResult.getSuccess()) 
            { 
            logDebug("**WARNING** error adding record to set " + this.id + " : " + addResult.getErrorMessage() );
            }
        else 
            { 
            logDebug("capSet: updated record " + addCapId + " to status " + setMemberStatus);
            }
	}			
	
	
    this.remove = function(removeCapId) 
        {
        var removeResult = aa.set.removeSetHeadersListByCap(this.id,removeCapId)
        if (!removeResult.getSuccess()) 
            { 
            logDebug("**WARNING** error removing record from set " + this.id + " : " + removeResult.getErrorMessage() );
            }
        else 
            { 
            logDebug("capSet: removed record " + removeCapId + " from set " + this.id);
            }
        }
    
    this.update = function() 
        {
		var sh = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.SetBusiness").getOutput();
		this.model.setSetStatus(this.status)
        this.model.setSetID(this.setId);
        this.model.setSetTitle(this.name);
		this.model.setSetComment(this.comment);
		this.model.setSetStatusComment(this.statusComment);
		this.model.setRecordSetType(this.type);
		
		logDebug("capSet: updating set header information");
		try {
			updateResult = sh.updateSetBySetID(this.model);
			}
		catch(err) {
            logDebug("**WARNING** error updating set header failed " + err.message);
            }

        }
    
    this.id = desiredSetId;
    this.name = desiredSetId;
    this.type = null;
	this.comment = null;
    
	if (arguments.length > 1 && arguments[1]) this.name = arguments[1];
	if (arguments.length > 2 && arguments[2]) this.type = arguments[2];
    if (arguments.length > 3 && arguments[3]) this.comment = arguments[3];
    
    this.size = 0;
    this.empty = true;
    this.members = new Array();
    this.status = "";
	this.statusComment = "";
	this.model = null;
	
    var theSetResult = aa.set.getSetByPK(this.id);
    
    if (theSetResult.getSuccess())
        {
        this.refresh();
        }
        
    else  // add the set
        {
        theSetResult = aa.set.createSet(this.id,this.name,this.type,this.comment);
        if (!theSetResult.getSuccess()) 
            {
            logDebug("**WARNING** error creating set " + this.id + " : " + theSetResult.getErrorMessage);
            }
        else
            {
            logDebug("capSet: Created new set " + this.id + " of type " + this.type); 
            this.refresh();
            }
        }
    }
 
function checkCapForLicensedProfessionalType( licProfType )
{
	var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	
	if( capLicenseResult.getSuccess() )
	{ 
		var capLicenseArr = capLicenseResult.getOutput();
		
		if (!capLicenseArr)
			{ logDebug("WARNING: no license professional available on the application:"); return false; }
		
		for( licProf in capLicenseArr )
		{
			if( licProfType.equals(capLicenseArr[licProf].getLicenseType()) )
			{
				aa.print( "Found License Professional with Type= " + licProfType );
				return true; //Found Licensed Prof of specified type
			}
		}
		
		return false;
	}
	else
		{ aa.print("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }
} 
function checkForLastDocCat(vDocCat,capId)
{
//function looks at the last date any document(s) was uploaded and evaluates if matches the specified doc type
docListResult = aa.document.getCapDocumentList(capId ,currentUserID);
varWasUploaded = false;
if (docListResult.getSuccess()) 
	{ 
	docListArray = docListResult.getOutput()
	varDocLast = docListArray.length;
	varLastPos = varDocLast -1
	docLastCat = docListArray[varLastPos].getDocCategory();
	docLastDate = docListArray[varLastPos].getFileUpLoadDate() + " " ;
	dIndex = docLastDate.indexOf(" ")
	dDateCompare = docLastDate.substring(0,dIndex );
	for(x in docListArray)
		{
		inputDate = docListArray[x].getFileUpLoadDate() + " " ;
		inputIndex = inputDate.indexOf(" ")
	    inputCompare = inputDate.substring(0,inputIndex );
		if(inputCompare == dDateCompare)
			{
			if(docListArray[x].getDocCategory() == vDocCat)
				{
				varWasUploaded = true;
				}
			}
		}

	}
	return varWasUploaded;
}
 
function checkInspectionResult(insp2Check,insp2Result)
	{
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()) && String(insp2Result).equals(inspList[xx].getInspectionStatus()))
				return true;
		}
	return false;
	}

 
function checkRequiredASIFields() {

	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(capId);

	var asiObjs = appSpecInfoResult.getOutput();

	var fieldsComplete = true;

	for (var i in asiObjs) {
		if (asiObjs[i].getRequiredFlag() == "Y") {
			if (matches(asiObjs[i].checklistComment,null,undefined,"")) {
				fieldsComplete = false;
			}
		}
	}
	return fieldsComplete;
} 
function childGetByCapType(pCapType, pParentCapId) 
	{
	// Returns capId object of first child of pParentCapId whose cap type matches pCapType parameter
	// Wildcard * may be used in pCapType, e.g. "Building/Commercial/*/*"
	// Optional 3rd parameter pChildCapIdSkip: capId of child to skip
	// 06SSP-00219.C61201
  //
	if (pParentCapId!=null) //use cap in parameter 
		var vCapId = pParentCapId;
	else // use current cap
		var vCapId = capId;
		
	if (arguments.length>2)
		var childCapIdSkip = arguments[2];
	else
		var childCapIdSkip = null;
		
	var typeArray = pCapType.split("/");
	if (typeArray.length != 4)
		logDebug("**ERROR in childGetByCapType function parameter.  The following cap type parameter is incorrectly formatted: " + pCapType);
		
	var getCapResult = aa.cap.getChildByMasterID(vCapId);
	if (getCapResult.getSuccess())
		{
		var childArray = getCapResult.getOutput();
		if (childArray.length)
			{
			var childCapId;
			var capTypeStr = "";
			var childTypeArray;
			var isMatch;
			for (xx in childArray)
				{
				childCapId = childArray[xx].getCapID();
				if (childCapIdSkip!=null && childCapIdSkip.getCustomID().equals(childCapId.getCustomID())) //skip over this child
					continue;
				
				capTypeStr = aa.cap.getCap(childCapId).getOutput().getCapType().toString();	// Convert cap type to string ("Building/A/B/C")
				childTypeArray = capTypeStr.split("/");
				isMatch = true;
				for (yy in childTypeArray) //looking for matching cap type
					{
					if (!typeArray[yy].equals(childTypeArray[yy]) && !typeArray[yy].equals("*"))
						{
						isMatch = false;
						break;
						}
					}
				if (isMatch)
					return childCapId;
				}
			}
		else
			logDebug( "**WARNING: childGetByCapType function found no children");	
			
		return false;
		}
	else
		logDebug( "**WARNING: childGetByCapType function found no children: " + getCapResult.getErrorMessage());
	}
	
 
//@ts-check

/**
 * Sets thje Closed Date value to the current date and the Close by Staff field to the ID of the user who closes the record.
 * 
 * ----
 * **Global Variables**:
 * - capId
 * - sysDate
 * ----
 * 
 * @param {string} userId ID of user who closes the record.
 * @param {CapIDModel} capId (Optional) Record to perform action on.
 * @returns {boolean} true if the cap was closed, false otherwise (or in case of error)
 */
function closeCap(userId) {

	if (arguments.length <= 1 && (typeof capId === typeof undefined || capId === null)){
		logDebug("'closeCap' Error: Required global variable 'capId' or 'capId' optional parameter not defined");
		return false;
	}

	var localSysDate = (typeof sysDate === typeof undefined || sysDate === null ) ? aa.date.getCurrentDate() : sysDate ; 

	var itemCap = arguments.length > 1 ? arguments[1] : capId;


	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}

	var cd = cdScriptObj.getCapDetailModel();

	var iNameResult = aa.person.getUser(userId);

	if (!iNameResult.getSuccess()) {
		logDebug("**ERROR retrieving  user model " + userId + " : " + iNameResult.getErrorMessage());
		return false;
	}

	var iName = iNameResult.getOutput();

	cd.setClosedDept(iName.getDeptOfUser());
	cd.setClosedBy(userId);
	cdScriptObj.setClosedDate(localSysDate);

	var cdWrite = aa.cap.editCapDetail(cd)

	if (!cdWrite.getSuccess()) {
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
		return false;
	}
	
	logDebug("Set CAP *Closed by Staff* to " + userId + "\nSet CAP *Closed by Dept* " + iName.getDeptOfUser() + "\nSet CAP *Closed Date* " + localSysDate.toString());
	return true;
} 
function closeSubWorkflow(thisProcessID,wfStat) // optional capId
	{
	var itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args


	var isCompleted = true;

	var workflowResult = aa.workflow.getTasks(itemCap);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else
		{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

	for (i in wfObj)
		{
		var fTaskSM = wfObj[i];
		if (fTaskSM.getProcessID() == thisProcessID && fTaskSM.getCompleteFlag() != "Y")
			{
			logDebug("closeSubWorkflow: found an incomplete task processID #" + thisProcessID + " , Step# " + fTaskSM.getStepNumber(),3);
			isCompleted = false
			}
		}

	if (!isCompleted) return false;


	// get the parent task

	var relationArray = aa.workflow.getProcessRelationByCapID(itemCap,null).getOutput()

	var relRecord = null;

	for (thisRel in relationArray)
		if (relationArray[thisRel].getProcessID() == thisProcessID)
			relRecord = relationArray[thisRel];

	if (!relRecord)
		{
		logDebug("closeSubWorkflow: did not find a process relation, exiting",3);
		return false;
		}

	logDebug("executing handleDisposition:" + relRecord.getStepNumber() + "," + relRecord.getParentProcessID() + "," + wfStat,3);

	var handleResult = aa.workflow.handleDisposition(itemCap,relRecord.getStepNumber(),relRecord.getParentProcessID(),wfStat,sysDate,"Closed via script","Closed via script",systemUserObj ,"Y");

	if (!handleResult.getSuccess())
		logDebug("**WARNING: closing parent task: " + handleResult.getErrorMessage());
	else
		logDebug("Closed parent task");
	}
 
//@ts-check

/**
 * Updates the workflow task wfstr as follows:
 * - Status = wfstat
 * - Status Date = current date
 * - Status Comment = wfcomment
 * - Action By = current user
 * 
 * **Notes**:
 * 
 * Closes the task wfstr and promotes the workflow to the next task, even if wfstat loops or branches. If
 * workflow needs to loop or branch, use loopTask or branchTask functions.
 * If record's workflow contains duplicate wfstr tasks, use wfProcess parameter to specify the process or
 * subprocess whose wfstr to edit.
 * This old name for this function is closeWorkflow2.
 *
 *
 * @param {string} wfstr Workflow task name.
 * @param {string} wfstat Status to update.
 * @param {string} wfcomment Comment to add.
 * @param {string} wfnote note to add to the workflow task.
 * @param {string} [wfProcess] (Optional) ID (R1_PROCESS_CODE ) for the process that the task belongs to. Required for multi-level workflows
 */


function closeTask(wfstr, wfstat, wfcomment, wfnote) {
    // optional process name

    if(typeof wfstr == "undefined" || wfstr == null){
        logDebug("'closeTask' requires 'wfstr' parameter.");
        return false;
    }
    if(typeof wfstat == "undefined" || wfstat == null){
        logDebug("'closeTask' requires 'wfstat' parameter.");
        return false;
    }
	if (typeof capId === typeof undefined || capId == null) {
		logDebug("'closeTask' requires global 'capId' be defined.");
		return false;
	}
    var l_systemUserObj;
    if(typeof systemUserObj == "undefined"){
        l_systemUserObj = systemUserObj;
    } else {
        // try to set
        if(typeof currentUserID != "undefined"){
            l_systemUserObj = aa.person.getUser(currentUserID).getOutput();
        } else {
            l_systemUserObj = aa.person.getUser(aa.env.getValue("currentUserID")).getOutput();
        }
    }

	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess()){
		var wfObj = workflowResult.getOutput();
    } else { 
        logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
        return false; 
    }

	if (!wfstat) {
        wfstat = "NA";
    }

	for (var i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess) {
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, l_systemUserObj, "Y");
			} else {
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, l_systemUserObj, "Y");
			}
			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
		}
	}
}
 
//@ts-check

/**
 * You can use this function to display messages to the user, as well as variables to aid in debugging issues.
 * @param {string} cstr Comment to display.
 * 
 * ---
 * **Notes**
 * Use logMessage and logDebug functions instead.
 * Adds the message cstr to the message/debug window when the script executes. If you enable debugging
 * (i.e., showDebug = true), the comment shows in the debug messages. If you enable messages (i.e.,
 * showMessage = true), the comment shows in the messages. If you do not enable debugging or messages,
 * the comment does not display.
 * Use this function instead of directly assigning value to message variable in script control.
 * 
 * ---
 * **Global Variable**:
 * - showDebug
 * - showMessage
 * 
 * ---
 */

function comment(cstr) {

	if (typeof showDebug === typeof undefined) {
		logDebug("showDebug is undefined.");
		return false;
	}

	if (typeof showMessage === typeof undefined) {
		logDebug("showMessage is undefined.");
		return false;
	}


	if (showDebug) {
		logDebug(cstr);
	}
	if (showMessage) {
		logMessage(cstr);
	}

}

 
//@ts-check

/**
 * This function passes as a parameter to the createRefContactsFromCapContactsAndLink function.
 * Takes a single peopleModel as a parameter, and returns the sequence number of the first G6Contact result. 
 * Returns null if there are no matches
 * 
 * **Notes:**
 * 
 * To use attributes, you must implement Salesforce case 09ACC-05048.
 * @param {peopleModel} peop The peopleModel object containing the criteria.
 * @returns {number | null} The sequence number of the first G6Contact result, or null if there are no matches.
 */

function comparePeopleGeneric(peop) {

    if(typeof peop == "undefined" || !peop){
        logDebug("'comparePeopleGeneric' requires parameter 'peop' be set" );
        return null;
    }

	peop.setAuditDate(null)
	peop.setAuditID(null)
	peop.setAuditStatus(null)
	peop.setBirthDate(null)
	peop.setBusName2(null)
	peop.setBusinessName(null)
	peop.setComment(null)
	peop.setCompactAddress(null)
	peop.setContactSeqNumber(null)
	peop.setContactType(null)
	peop.setContactTypeFlag(null)
	peop.setCountry(null)
	peop.setCountryCode(null)
	// peop.setEmail(null)       just as a test we are using email
	peop.setEndBirthDate(null)
	peop.setFax(null)
	peop.setFaxCountryCode(null)
	peop.setFein(null)
	peop.setFirstName(null)
	peop.setFlag(null)
	peop.setFullName(null)
	peop.setGender(null)
	peop.setHoldCode(null)
	peop.setHoldDescription(null)
	peop.setId(null)
	peop.setIvrPinNumber(null)
	peop.setIvrUserNumber(null)
	peop.setLastName(null)
	peop.setMaskedSsn(null)
	peop.setMiddleName(null)
	peop.setNamesuffix(null)
	peop.setPhone1(null)
	peop.setPhone1CountryCode(null)
	peop.setPhone2(null)
	peop.setPhone2CountryCode(null)
	peop.setPhone3(null)
	peop.setPhone3CountryCode(null)
	peop.setPostOfficeBox(null)
	peop.setPreferredChannel(null)
	peop.setPreferredChannelString(null)
	peop.setRate1(null)
	peop.setRelation(null)
	peop.setSalutation(null)
	peop.setServiceProviderCode(null)
	peop.setSocialSecurityNumber(null)
	peop.setTitle(null)
	peop.setTradeName(null)

	var r = aa.people.getPeopleByPeopleModel(peop);

	if (!r.getSuccess()) {
		logDebug("WARNING: error searching for people : " + r.getErrorMessage());
		return false;
	}

	var peopResult = r.getOutput();

	if (peopResult.length == 0) {
		logDebug("Searched for REF contact, no matches found, returing null");
		return null;
	}

	if (peopResult.length > 0) {
		logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber());
		return peopResult[0].getContactSeqNumber();
	}

} 
/**
 * Uses the close match criteria configured in Agency Profile > Standard Choices stored in the 
 * INDIVIDUAL_CONTACT_MATCH_CRITERIA and ORGANIZATION_CONTACT_MATCH_CRITERIA to check the reference 
 * contact library for potential duplicates. Takes a single peopleModel as a parameter, 
 * and will return an array of people models (peopResult) returns null if there are no matches.
 * 
 * This is used in conjuction with the createRefContactsFromCapContactsAndLink function as shown in the example.
 * 
 * @requires 
 * @example createRefContactsFromCapContactsAndLink(itemCapId, ["Applicant"], null, null, true, comparePeopleMatchCriteria)
 * @memberof INCLUDES_ACCELA_FUNCTIONS
 * @param {peopleModel}
 * @return {ContactSeqNumber}
 *   
 */

function comparePeopleMatchCriteria(ipPeop)
{
	var fvContType = ipPeop.getContactType();

	var fvCriteriaStdChoice = "INDIVIDUAL_CONTACT_MATCH_CRITERIA";
	// default to individual unless flag is Org
	if (fvContType == "Organization")
	{
		fvCriteriaStdChoice = "ORGANIZATION_CONTACT_MATCH_CRITERIA";
	}
	if (lookup("REF_CONTACT_CREATION_RULES",fvContType) == "O")
	{
		fvCriteriaStdChoice = "ORGANIZATION_CONTACT_MATCH_CRITERIA";
	}

	//Add agency specific logic here if needed
	var fvBizDomainSR = aa.bizDomain.getBizDomain(fvCriteriaStdChoice);
	if (!fvBizDomainSR || !fvBizDomainSR.getSuccess())
	{
		logDebug("Standard Choice '" + fvCriteriaStdChoice + "' not defined.");
		return null;
	}
	var fvBizDomain = fvBizDomainSR.getOutput();
	if (!fvBizDomain || fvBizDomain.size() == 0)
	{
			logDebug("No criteria defined in Standard Choice '" + fvCriteriaStdChoice + "'.");
			return null;
	}

	for(var fvCounter1 = 0; fvCounter1 < fvBizDomain.size(); fvCounter1++)
	{
		var fvCloseMatchCriteriaObj = fvBizDomain.get(fvCounter1);
		var fvCriteriaStr = fvCloseMatchCriteriaObj.getDispBizdomainValue();
		if (!fvCriteriaStr || fvCriteriaStr == "")
			continue;

		var fvPeop = aa.people.createPeopleModel().getOutput().getPeopleModel();
		//make sure we are retrieving only active contacts
        fvPeop.setAuditStatus("A");
		
		var fvCriteriaArr = fvCriteriaStr.split(";");
        var fvSkipThisCriteria = false;
		for (var fvCounter2 in fvCriteriaArr)
		{
		   var fvCriteriaFld = fvCriteriaArr[fvCounter2];
		   if (ipPeop[fvCriteriaFld] == null)
		   {
			   fvSkipThisCriteria = true;
			   logDebug("Value for " + fvCriteriaFld + " is null.");
			   break;
		   }
		   fvPeop[fvCriteriaFld] = ipPeop[fvCriteriaFld];
		   logDebug("Search for " + fvCriteriaFld + " " + fvPeop[fvCriteriaFld]);
		}
		if (fvSkipThisCriteria)
		{
			logDebug("WARNING: One or more Values for the Fields defined in this Criteria are null. Skipping this criteria.");
			continue;
		}

		var fvResult = aa.people.getPeopleByPeopleModel(fvPeop);
		if ( !fvResult.getSuccess())
		{
			logDebug("WARNING: Error searching for duplicate contacts : " + fvResult.getErrorMessage());
			continue;
		}

		var fvPeopResult = fvResult.getOutput();
		if (fvPeopResult.length == 0)
		{
			logDebug("Searched for REF contact, no matches found.");
			continue;
		}

		if (fvPeopResult.length > 0)
		{
			logDebug("Searched for a REF Contact, " + fvPeopResult.length + " matches found! returning the first match : " + fvPeopResult[0].getContactSeqNumber());
			return fvPeopResult[0].getContactSeqNumber();
		}
	}
	logDebug("No matches found. Returning Null.");
	return null;
} 

function comparePeopleStandard(peop)
	{

	/* 
	
		this function will be passed as a parameter to the createRefContactsFromCapContactsAndLink function.
		takes a single peopleModel as a parameter, and will return the sequence number of the first G6Contact result
		returns null if there are no matches
	
		Best Practice Template Version uses the following algorithm:
		
		1.  Match on SSN/FEIN if either exist
		2.  else, match on Email Address if it exists
		3.  else, match on First, Middle, Last Name combined with birthdate if all exist
		
		This function can use attributes if desired
	*/
	

	if (peop.getSocialSecurityNumber() || peop.getFein())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		
		logDebug("we have a SSN " + peop.getSocialSecurityNumber() + " or FEIN, checking on that");
		qryPeople.setSocialSecurityNumber(peop.getSocialSecurityNumber());
		qryPeople.setFein(peop.getFein());
		
		var r = aa.people.getPeopleByPeopleModel(qryPeople);
		
		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();
		
		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}
		
	if (peop.getEmail())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();
		
		qryPeople.setServiceProviderCode(aa.getServiceProviderCode());	
	
		logDebug("we have an email, checking on that");
		qryPeople.setEmail(peop.getEmail());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();

		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}

	if (peop.getBirthDate() && peop.getLastName() && peop.getFirstName())
		{
		var qryPeople = aa.people.createPeopleModel().getOutput().getPeopleModel();		
		logDebug("we have a name and birthdate, checking on that");
		qryPeople.setBirthDate(peop.getBirthDate());
		qryPeople.setLastName(peop.getLastName());
		qryPeople.setFirstName(peop.getFirstName());
		qryPeople.setMiddleName(peop.getMiddleName());

		var r = aa.people.getPeopleByPeopleModel(qryPeople);

		if (!r.getSuccess())  { logDebug("WARNING: error searching for people : " + r.getErrorMessage()); return false; }

		var peopResult = r.getOutput();

		if (peopResult.length > 0)
			{
			logDebug("Searched for a REF Contact, " + peopResult.length + " matches found! returning the first match : " + peopResult[0].getContactSeqNumber() );
			return peopResult[0].getContactSeqNumber();
			}
		}
		
	logDebug("ComparePeople did not find a match");
		return false;
	}
 
function completeCAP(userId) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ 	logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
			return false; }
	
	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ 	logDebug("**ERROR: No cap detail script object") ;
			return false; }
		
	cd = cdScriptObj.getCapDetailModel();
	
	iNameResult  = aa.person.getUser(userId);

	if (!iNameResult.getSuccess())
		{ 	logDebug("**ERROR retrieving  user model " + userId + " : " + iNameResult.getErrorMessage()) ;
			return false ; }
	
	iName = iNameResult.getOutput();

	cd.setCompleteDept(iName.getDeptOfUser());
	cd.setCompleteStaff(userId);
	cdScriptObj.setCompleteDate(sysDate);
		
	cdWrite = aa.cap.editCapDetail(cd)
	
	if (cdWrite.getSuccess())
	{ 	
		logDebug("Set CAP *Completed by Staff* to " + userId + "\nSet CAP *Completed by Dept* " + iName.getDeptOfUser() + "\nSet CAP *Completed Date* " + sysDate.toString());
	}
	else
	{ 	
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ;
		return false ; 
	}
} 
function contactAddFromUser(pUserId)
	{
	// Retrieves user's reference Contact record and adds to CAP
	// Returns contact seq nbr or false if contact not added
	// 06SSP-00186
	//
	if (arguments.length==1) //use parameter user
		{
		var personResult = aa.person.getUser(pUserId);
		if (personResult.getSuccess())
			{
			var personObj = personResult.getOutput();
			//logDebug("personObj class: "+personObj.getClass());
			if (personObj==null) // no user found
				{
				logDebug("**ERROR: Failed to get User");
				return false;
				}
			}
		else
  	  { 
			logDebug("**ERROR: Failed to get User: " + personResult.getErrorMessage()); 
			return false; 
			}
		}
	else //use current user
		var personObj = systemUserObj;
		
	var userFirst = personObj.getFirstName();
	var userMiddle = personObj.getMiddleName();
	var userLast = personObj.getLastName();
	
	//Find PeopleModel object for user 
	var peopleResult = aa.people.getPeopleByFMLName(userFirst, userMiddle, userLast);
	if (peopleResult.getSuccess())
		{
		var peopleObj = peopleResult.getOutput();
		//logDebug("peopleObj is "+peopleObj.getClass());
		if (peopleObj==null)
			{
			logDebug("No reference user found.");
			return false;
			}
		logDebug("No. of reference contacts found: "+peopleObj.length);
		}
	else
		{ 
			logDebug("**ERROR: Failed to get reference contact record: " + peopleResult.getErrorMessage()); 
			return false; 
		}
	
	//Add the reference contact record to the current CAP 
	var contactAddResult = aa.people.createCapContactWithRefPeopleModel(capId, peopleObj[0]);
	if (contactAddResult.getSuccess())
		{
		logDebug("Contact successfully added to CAP.");
		var capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess())
			{
			var Contacts = capContactResult.getOutput();
			var idx = Contacts.length;
			var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
			logDebug ("Contact Nbr = "+contactNbr);
			return contactNbr;
			}
		else
			{
			logDebug("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
			return false;
			}
		}
	else
		{ 
			logDebug("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage()); 
			return false; 
		}	
	} 
	
 
/**
* Contact Object 
* <p>
* Properties: 
*	people - PeopleModel Object
*   capContact - CapContactModel Object
*	capContactScript - CapContactScriptModel Object
*	capId - capID Object
*	type - Contact Type
*	seqNumber - Transactional Seqence Number
*	asi - associative array of people template attributes
*	customFields - associative array of custom template fields
*	customTables - Not yet implemented
*	primary - Contact is Primary
*	relation - Contact Relation
*	addresses - associative array of address
*	validAttrs - Boolean indicating people template attributes
*	validCustomFields - Boolean indicating custom template fields
*	validCustomTables - Not implemented yet
*	infoTables - Table Array ex infoTables[name][row][column].getValue()
*	attribs - Array of LP Attributes ex attribs[name]
*	valid - Get the Attributes for LP
*	validTables - true if LP has infoTables
*	validAttrs - true if LP has attributes
* </p>
* <p>
* Methods:
*	toString() - Outputs a string of key contact fields 
*   getContactName() - Returns either First Name and Last Name, Business Name, or DBA Trade Name
*	getEmailTemplateParams(params,[vContactType]) - Contact Parameters for use in Notification Templates
*	replace(targetCapId) - send this contact to another record, optional new contact type
*	equals(contactObj) - Compares this contact to another contact by comparing key elements
*	saveBase() - Saves base information such as contact type, primary flag, relation
*	save() - Saves all current information to the transactional contact
*	syncCapContactToReference() - Synchronize the contact data from the record with the reference contact by pushing data from the record into reference.
*	syncCapContactFromReference() - Synchronize the reference contact data with the contact on the record by pulling data from reference into the record.
*	getAttribute(vAttributeName) - Get method for people template attributes
*	setAttribute(vAttributeName, vAttributeValue) - Set method for people template attributes
*	getCustomField(vFieldName) - Get method for Custom Template Fields
*	setCustomField(vFieldName,vFieldValue) - Set method for Custom Template Fields
*	remove() - Removes this contact from the transactional record
*	isSingleAddressPerType() - Boolean indicating if this contact has a Single Addresss Per Type
*	getAddressTypeCounts() - returns an associative array of how many adddresses are attached
*	createPublicUser() - For individual contact types, this function checkes to see if public user exists already based on email address then creates a public user and activates it for the agency. It also sends an Activate email and sends a Password Email. If there is a reference contact, it will assocated it with the newly created public user.
*	getCaps([record type filter]) - Returns an array of records related to the reference contact
*	getRelatedContactObjs([record type filter]) - Returns an array of contact objects related to the reference contact
*	getRelatedRefLicProfObjs() - Returns an array of Reference License Professional objects related to the reference contact
*	createRefLicProf(licNum,rlpType,addressType,licenseState, [servProvCode]) - Creates a Reference License Professional based on the contact information. If this contact is linked to a Reference Contact, it will link the new Reference License Professional to the Reference Contact.
*	linkRefContactWithRefLicProf(licnumber, [lictype]) - Link a Reference License Professional to the Reference Contact.
*	getAKA() - Returns an array of AKA Names for the assocated reference contact
*	addAKA(firstName,middleName,lastName,fullName,startDate,endDate) - Adds an AKA Name to the assocated reference contact
*	removeAKA(firstName,middleName,lastName) - Removes an AKA Name from the assocated reference contact
*	hasPublicUser() - Boolean indicating if the contact has an assocated public user account
*	linkToPublicUser(pUserId) - Links the assocated reference contact to the public user account
*	sendCreateAndLinkNotification() - Sends a Create and Link Notification using the PUBLICUSER CREATE AND LINK notification template to the contact for the scenario in AA where a paper application has been submitted
*	getRelatedRefContacts([relConsArray]) - Returns an array of related reference contacts. An optional relationship types array can be used
*   editName([fName], [mName], [lName], [fullName], [businessName], [dbaName]) - Edits the name fields of the contact
*   editEmail(emailAddress) - Edits the email address of the contact
*   editPhone([phone1],[phone2],[phone3],[fax]) - Edits the phone numbers of the contact
*   editContactAddress(addressType, addr1, addr2, addr3, city, state, zip, phone, countryCode, primary, effectiveDate, expirationDate, [addressStatus])
* </p>
* <p>
* Call Example:
* 	var vContactObj = new contactObj(vCCSM);
*	var contactRecordArray = vContactObj.getAssociatedRecords();
*	var cParams = aa.util.newHashtable();
*	vContactObj.getEmailTemplateParams(cParams);
* </p>
* @param ccsm {CapContactScriptModel}
* @return {contactObj}
*/

function contactObj(ccsm)  {

    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
	this.customFieldsObj = null;
	this.customFields = new Array();
	this.customTablesObj = null;
	this.customTables = new Array();
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses
    this.validAttrs = false;
	this.validCustomFields = false;
	this.validCustomTables = false;
        
    this.capContactScript = ccsm;
    if (ccsm)  {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
            }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();
			// contact ASI
			var tm = this.people.getTemplate();
			if (tm)	{
				var templateGroups = tm.getTemplateForms();
				var gArray = new Array();
				if (!(templateGroups == null || templateGroups.size() == 0)) {
                    var subGroups = templateGroups.get(0).getSubgroups();
                    if (subGroups != null) {
                        for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
                            var subGroup = subGroups.get(subGroupIndex);
                            var fields = subGroup.getFields();
                            for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
                                var field = fields.get(fieldIndex);
                                this.asi[field.getDisplayFieldName()] = field.getDefaultValue();
                            }
                        }
                    }
				}
			}

			// contact attributes
			// Load People Template Fields
            if (this.people.getAttributes() != null) {
                this.asiObj = this.people.getAttributes().toArray();
                if (this.asiObj != null) {
                    for (var xx1 in this.asiObj) this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
                    this.validAttrs = true; 
                }   
            }
			// Load Custom Template Fields
			if (this.capContact.getTemplate() != null && this.capContact.getTemplate().getTemplateForms() != null) {
				var customTemplate = this.capContact.getTemplate();
				this.customFieldsObj = customTemplate.getTemplateForms();
				
				for (var i = 0; i < this.customFieldsObj.size(); i++) {
					var eachForm = this.customFieldsObj.get(i);

					//Sub Group
					var subGroup = eachForm.subgroups;

					if (subGroup == null) {
						continue;
					}

					for (var j = 0; j < subGroup.size(); j++) {
						var eachSubGroup = subGroup.get(j);

						if (eachSubGroup == null || eachSubGroup.fields == null) {
							continue;
						}

						var allFields = eachSubGroup.fields;
						for (var k = 0; k < allFields.size(); k++) {
							var eachField = allFields.get(k);
							this.customFields[eachField.displayFieldName] = eachField.defaultValue;
							logDebug("(contactObj) {" + eachField.displayFieldName + "} = " +  eachField.defaultValue);
							this.validCustomFields = true;
						}
					}
				}
			}
        }  

        //this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
        var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
        if (contactAddressrs.getSuccess()) {
            this.addresses = contactAddressrs.getOutput();
            var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
            this.people.setContactAddressList(contactAddressModelArr);
            }
        else {
            pmcal = this.people.getContactAddressList();
            if (pmcal) {
                this.addresses = pmcal.toArray();
            }
        }
    }       
        this.toString = function() { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary;  }
		
		this.getContactName = function(includeContactName, includeBusinessName, includeTradeName){
            var vContactName = "";
            var bFLName = false;
            // Set Defualts
            var vIncludeContactName = true;
            var vIncludeBusinessName = true;
            var vIncludeTradeName = false;
            if(!matches(includeContactName,null,undefined,"")) { vIncludeContactName = true }
            if(!matches(includeBusinessName,null,undefined,"")){ vIncludeBusinessName = true }
            if(!matches(includeTradeName,null,undefined,"")) { vIncludeTradeName = true }

			if (vIncludeContactName && this.people.getLastName() != null && this.people.getFirstName() != null){
                vContactName = this.people.getFirstName() + " " + this.people.getLastName()
                bFLName = true;
			}
			if(vIncludeContactName && vIncludeBusinessName && this.people.getBusinessName() != null && bFLName){
				vContactName = this.people.getBusinessName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
			}
			if(!vIncludeContactName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null){
				vContactName = this.people.getBusinessName();
            }
            if(!bFLName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null){
                // If there is no First or Last Name use the Business Name
				vContactName = this.people.getBusinessName();
            }
            if(!vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null){
				vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName();
			}
			if(!vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null){
				vContactName = this.people.getTradeName();
            }
            if(vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null && bFLName){
				vContactName = this.people.getTradeName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
			}
            if(vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null && bFLName){
				vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName() + " : " + this.people.getFirstName() + " " + this.people.getLastName();
			}
			return vContactName;
		}
        
        this.getEmailTemplateParams = function (params, vContactType) {
			var contactType = "Contact";
			if (arguments.length == 2) contactType = arguments[1];
			
            addParameter(params, "$$ContactName$$", this.getContactName());
            addParameter(params, "$$" + contactType + "LastName$$", this.people.getLastName());
            addParameter(params, "$$" + contactType + "FirstName$$", this.people.getFirstName());
            addParameter(params, "$$" + contactType + "MiddleName$$", this.people.getMiddleName());
            addParameter(params, "$$" + contactType + "BusinessName$$", this.people.getBusinessName());
            addParameter(params, "$$" + contactType + "TradeName$$", this.people.getTradeName());
            addParameter(params, "$$" + contactType + "SeqNumber$$", this.seqNumber);
            addParameter(params, "$$ContactType$$", this.type);
            addParameter(params, "$$" + contactType + "Relation$$", this.relation);
            addParameter(params, "$$" + contactType + "Phone1$$", this.people.getPhone1());
            addParameter(params, "$$" + contactType + "Phone2$$", this.people.getPhone2());
            addParameter(params, "$$" + contactType + "Email$$", this.people.getEmail());
            addParameter(params, "$$" + contactType + "AddressLine1$$", this.people.getCompactAddress().getAddressLine1());
            addParameter(params, "$$" + contactType + "AddressLine2$$", this.people.getCompactAddress().getAddressLine2());
            addParameter(params, "$$" + contactType + "City$$", this.people.getCompactAddress().getCity());
            addParameter(params, "$$" + contactType + "State$$", this.people.getCompactAddress().getState());
            addParameter(params, "$$" + contactType + "Zip$$", this.people.getCompactAddress().getZip());
            addParameter(params, "$$" + contactType + "Fax$$", this.people.getFax());
            addParameter(params, "$$" + contactType + "Country$$", this.people.getCompactAddress().getCountry());
            addParameter(params, "$$" + contactType + "FullName$$", this.people.getFullName());
	    var notificationName = null;
	    if (this.people.getContactTypeFlag() == "individual") {
		notificationName = this.people.getFirstName() + " " + this.people.getLastName();
            }
	    else {
			notificationName = this.people.getBusinessName();
	    }
	    if (notificationName) {
			addParameter(params,"$$notificationName$$",notificationName);
	    }
            return params;
            }
        
        this.replace = function(targetCapId) { // send to another record, optional new contact type
        
            var newType = this.type;
            if (arguments.length == 2) newType = arguments[1];
            //2. Get people with target CAPID.
            var targetPeoples = getContactObjs(targetCapId,[String(newType)]);
            //3. Check to see which people is matched in both source and target.
            for (var loopk in targetPeoples)  {
                var targetContact = targetPeoples[loopk];
                if (this.equals(targetPeoples[loopk])) {
                    targetContact.people.setContactType(newType);
                    aa.people.copyCapContactModel(this.capContact, targetContact.capContact);
                    targetContact.people.setContactAddressList(this.people.getContactAddressList());
                    overwriteResult = aa.people.editCapContactWithAttribute(targetContact.capContact);
                    if (overwriteResult.getSuccess())
                        logDebug("overwrite contact " + targetContact + " with " + this);
                    else
                        logDebug("error overwriting contact : " + this + " : " + overwriteResult.getErrorMessage());
                    return true;
                    }
                }

                var tmpCapId = this.capContact.getCapID();
                var tmpType = this.type;
                this.people.setContactType(newType);
                this.capContact.setCapID(targetCapId);
                createResult = aa.people.createCapContactWithAttribute(this.capContact);
                if (createResult.getSuccess())
                    logDebug("(contactObj) contact created : " + this);
                else
                    logDebug("(contactObj) error creating contact : " + this + " : " + createResult.getErrorMessage());
                this.capContact.setCapID(tmpCapId);
                this.type = tmpType;
                return true;
        }

        this.equals = function(t) {
            if (t == null) return false;
            if (!String(this.people.type).equals(String(t.people.type))) { return false; }
            if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) { return false; }
            if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) { return false; }
            if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) { return false; }
            if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) { return false; }
            return  true;
        }
        
        this.saveBase = function() {
            // set the values we store outside of the models.
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            saveResult = aa.people.editCapContact(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) base contact saved : " + this);
            else
                logDebug("(contactObj) error saving base contact : " + this + " : " + saveResult.getErrorMessage());
            }               
        
        this.save = function() {
            // set the values we store outside of the models
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            this.capContact.setPeople(this.people);
            saveResult = aa.people.editCapContactWithAttribute(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) contact saved : " + this);
            else
                logDebug("(contactObj) error saving contact : " + this + " : " + saveResult.getErrorMessage());
            }
			
		this.syncCapContactToReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactToReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactToReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactToReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactToReference : No Reference Contact to Syncronize With");
			}
            
		}
		this.syncCapContactFromReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactFromReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactFromReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactFromReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactFromReference : No Reference Contact to Syncronize With");
			}
            
		}

        //get method for Attributes
        this.getAttribute = function (vAttributeName){
            var retVal = null;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null)
                    retVal = tmpVal.getAttributeValue();
            }
            return retVal;
        }
        
        //Set method for Attributes
        this.setAttribute = function(vAttributeName,vAttributeValue){
			var retVal = false;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null){
                    tmpVal.setAttributeValue(vAttributeValue);
                    retVal = true;
                }
            }
            return retVal;
        }
		
		//get method for Custom Template Fields
        this.getCustomField = function(vFieldName){
            var retVal = null;
            if(this.validCustomFields){
                var tmpVal = this.customFields[vFieldName.toString()];
                if(!matches(tmpVal,undefined,null,"")){
                    retVal = tmpVal;
				}
            }
            return retVal;
        }
		
		//Set method for Custom Template Fields
        this.setCustomField = function(vFieldName,vFieldValue){
            
            var retVal = false;
            if(this.validCustomFields){
				
				for (var i = 0; i < this.customFieldsObj.size(); i++) {
					var eachForm = this.customFieldsObj.get(i);

					//Sub Group
					var subGroup = eachForm.subgroups;

					if (subGroup == null) {
						continue;
					}

					for (var j = 0; j < subGroup.size(); j++) {
						var eachSubGroup = subGroup.get(j);

						if (eachSubGroup == null || eachSubGroup.fields == null) {
							continue;
						}

						var allFields = eachSubGroup.fields;
						for (var k = 0; k < allFields.size(); k++) {
							var eachField = allFields.get(k);
							if(eachField.displayFieldName == vFieldName){
							logDebug("(contactObj) updating custom field {" + eachField.displayFieldName + "} = " +  eachField.defaultValue + " to " + vFieldValue);
							eachField.setDefaultValue(vFieldValue);
							retVal = true;
							}
						}
					}
				}
            }
            return retVal;
        }

        this.remove = function() {
            var removeResult = aa.people.removeCapContact(this.capId, this.seqNumber)
            if (removeResult.getSuccess())
                logDebug("(contactObj) contact removed : " + this + " from record " + this.capId.getCustomID());
            else
                logDebug("(contactObj) error removing contact : " + this + " : from record " + this.capId.getCustomID() + " : " + removeResult.getErrorMessage());
            }

        this.isSingleAddressPerType = function() {
            if (this.addresses.length > 1) 
                {
                
                var addrTypeCount = new Array();
                for (y in this.addresses) 
                    {
                    thisAddr = this.addresses[y];
                    addrTypeCount[thisAddr.addressType] = 0;
                    }

                for (yy in this.addresses) 
                    {
                    thisAddr = this.addresses[yy];
                    addrTypeCount[thisAddr.addressType] += 1;
                    }

                for (z in addrTypeCount) 
                    {
                    if (addrTypeCount[z] > 1) 
                        return false;
                    }
                }
            else
                {
                return true;    
                }

            return true;

            }

        this.getAddressTypeCounts = function() { //returns an associative array of how many adddresses are attached.
           
            var addrTypeCount = new Array();
            
            for (y in this.addresses) 
                {
                thisAddr = this.addresses[y];
                addrTypeCount[thisAddr.addressType] = 0;
                }

            for (yy in this.addresses) 
                {
                thisAddr = this.addresses[yy];
                addrTypeCount[thisAddr.addressType] += 1;
                }

            return addrTypeCount;

            }

        this.createPublicUser = function() {

            if (!this.capContact.getEmail())
            { logDebug("(contactObj) Couldn't create public user for : " + this +  ", no email address"); return false; }

            if (String(this.people.getContactTypeFlag()).equals("organization"))
            { logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization"); return false; }
            
            // check to see if public user exists already based on email address
            var getUserResult = aa.publicUser.getPublicUserByEmail(this.capContact.getEmail())
            if (getUserResult.getSuccess() && getUserResult.getOutput()) {
                userModel = getUserResult.getOutput();
                logDebug("(contactObj) createPublicUserFromContact: Found an existing public user: " + userModel.getUserID());
            }

            if (!userModel) // create one
                {
                logDebug("(contactObj) CreatePublicUserFromContact: creating new user based on email address: " + this.capContact.getEmail()); 
                var publicUser = aa.publicUser.getPublicUserModel();
                publicUser.setFirstName(this.capContact.getFirstName());
                publicUser.setLastName(this.capContact.getLastName());
                publicUser.setEmail(this.capContact.getEmail());
                publicUser.setUserID(this.capContact.getEmail());
                publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
                publicUser.setAuditID("PublicUser");
                publicUser.setAuditStatus("A");
                publicUser.setCellPhone(this.people.getPhone2());

                var result = aa.publicUser.createPublicUser(publicUser);
                if (result.getSuccess()) {

                logDebug("(contactObj) Created public user " + this.capContact.getEmail() + "  sucessfully.");
                var userSeqNum = result.getOutput();
                var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

                // create for agency
                aa.publicUser.createPublicUserForAgency(userModel);

                // activate for agency
                var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
                userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(),userSeqNum,"ADMIN");

                // reset password
                var resetPasswordResult = aa.publicUser.resetPassword(this.capContact.getEmail());
                if (resetPasswordResult.getSuccess()) {
                    var resetPassword = resetPasswordResult.getOutput();
                    userModel.setPassword(resetPassword);
                    logDebug("(contactObj) Reset password for " + this.capContact.getEmail() + "  sucessfully.");
                } else {
                    logDebug("(contactObj **WARNING: Reset password for  " + this.capContact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
                }

                // send Activate email
                aa.publicUser.sendActivateEmail(userModel, true, true);

                // send another email
                aa.publicUser.sendPasswordEmail(userModel);
                }
                else {
                    logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
                }
            }

        //  Now that we have a public user let's connect to the reference contact       
            
        if (this.refSeqNumber)
            {
            logDebug("(contactObj) CreatePublicUserFromContact: Linking this public user with reference contact : " + this.refSeqNumber);
            aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), this.refSeqNumber);
            }
            

        return userModel; // send back the new or existing public user
        }

        this.getCaps = function() { // option record type filter
			var resultArray = new Array();
        
            if (this.refSeqNumber) {
                aa.print("ref seq : " + this.refSeqNumber);
                var capTypes = "*/*/*/*";
                
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (appMatch(capTypes,thisCapId)) {
                        resultArray.push(thisCapId)
                        }
                    }
				} 
            
        return resultArray;
        }

        this.getRelatedContactObjs = function() { // option record type filter
        
            if (this.refSeqNumber) {
                var capTypes = null;
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (capTypes && appMatch(capTypes,thisCapId)) {
                        var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
                        var newContactObj = new contactObj(ccsm);
                        resultArray.push(newContactObj)
                        }
                    }
            }
            
        return resultArray;
        }
        
		this.getRelatedRefLicProfObjs = function(){
			
			var refLicProfObjArray = new Array();
			
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 1) {
					serv_prov_code_4_lp = arguments[0];
					}
		
			if(this.refSeqNumber && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  //xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date(aa.util.now()));
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var xRefContactEntList = xRefContactEntityBusiness.getXRefContactEntityList(xRefContactEntity);
			  var xRefContactEntArray = xRefContactEntList.toArray();
			  if(xRefContactEntArray)
			  {
				 for(iLP in xRefContactEntArray){
					 var xRefContactEnt = xRefContactEntArray[iLP];
					 var lpSeqNbr = xRefContactEnt.getEntityID1();
					 var lpObjResult = aa.licenseScript.getRefLicenseProfBySeqNbr(aa.getServiceProviderCode(),lpSeqNbr);
					 var refLicNum = lpObjResult.getOutput().getStateLicense();
					 
					 refLicProfObjArray.push(new licenseProfObject(refLicNum));
				 
				 }
				
			  }
			  else
			  {
				  logDebug("(contactObj.getRelatedRefLicProfObjs) - No Related Reference License License Professionals");
			  }
			  
			  return refLicProfObjArray;
			}
			else
			{
			  logDebug("(contactObj.getRelatedRefLicProfObjs) Some Parameters were empty - unable to get related LPs");
			}

		}
		
		this.linkRefContactWithRefLicProf = function(licnumber, lictype){
			
			var lpObj = new licenseProfObject(licnumber,lictype);
			var refLicProfSeq = lpObj.refLicModel.getLicSeqNbr();
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 3) {
					serv_prov_code_4_lp = arguments[2];
					}
		
			if(this.refSeqNumber && refLicProfSeq && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date(aa.util.now()));
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var existedModel = xRefContactEntityBusiness.getXRefContactEntityByUIX(xRefContactEntity);
			  if(existedModel.getContactSeqNumber())
			  {
				logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
			  }
			  else
			  {
				var XRefContactEntityCreatedResult = xRefContactEntityBusiness.createXRefContactEntity(xRefContactEntity);
				if (XRefContactEntityCreatedResult)
				{
				  logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
				}
				else
				{
				  logDebug("(contactObj) **ERROR:License professional failed to link to reference contact.  Reason: " +  XRefContactEntityCreatedResult.getErrorMessage());
				}
			  }
			}
			else
			{
			  logDebug("(contactObj.linkRefContactWithRefLicProf) Some Parameters are empty - License professional failed to link to reference contact.");
			}

		}
        
        this.createRefLicProf = function(licNum,rlpType,addressType,licenseState) {
            
            // optional 3rd parameter serv_prov_code
            var updating = false;
            var serv_prov_code_4_lp = aa.getServiceProviderCode();
            if (arguments.length == 5) {
                serv_prov_code_4_lp = arguments[4];
                aa.setDelegateAgencyCode(serv_prov_code_4_lp);
                }
            
            // addressType = one of the contact address types, or null to pull from the standard contact fields.
            var refLicProf = getRefLicenseProf(licNum,rlpType);
			var newLicResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseModel");
			var newLic
			if (newLicResult.getSuccess()){
				newLic = newLicResult.getOutput();
			}
			else{
				newLic = aa.licenseScript.createLicenseScriptModel();
			}

            if (refLicProf) {
                updating = true;
                logDebug("(contactObj) Updating existing Ref Lic Prof : " + licNum);
             }

            peop = this.people;
            cont = this.capContact;
            if (cont.getFirstName() != null) newLic.setContactFirstName(cont.getFirstName());
            if (peop.getMiddleName() != null) newLic.setContactMiddleName(peop.getMiddleName()); // use people for this
            if (cont.getLastName() != null)  newLic.setContactLastName(cont.getLastName());
			if (peop.getNamesuffix() != null) newLic.setSuffixName(peop.getNamesuffix());
			if (peop.getBirthDate() != null){ 
				var juDate = peop.getBirthDate();
				var sdtBirthDate = dateFormatted(1+juDate.getMonth(), juDate.getDate(), 1900+juDate.getYear(), "");
				newLic.setBirthDate(aa.util.parseDate(sdtBirthDate));
				logDebug("(contactObj.createRefLicProf) setBirthDate = " + sdtBirthDate);
			}
			if (peop.getMaskedSsn() != null) newLic.setMaskedSsn(peop.getMaskedSsn());
			if (peop.getFein() != null) newLic.setFein(peop.getFein());
			if (peop.getCountry() != null) newLic.setCountry(peop.getCountry());
			if (peop.getCountryCode() != null) newLic.setCountryCode(peop.getCountryCode()); 
            if (peop.getBusinessName() != null) newLic.setBusinessName(peop.getBusinessName());
            if (peop.getPhone1() != null) newLic.setPhone1(peop.getPhone1());
            if (peop.getPhone2() != null) newLic.setPhone2(peop.getPhone2());
			if (peop.getPhone3() != null) newLic.setPhone3(peop.getPhone3())
            if (peop.getEmail() != null) newLic.setEMailAddress(peop.getEmail());
            if (peop.getFax() != null) newLic.setFax(peop.getFax());
            newLic.setAgencyCode(serv_prov_code_4_lp);
			newLic.setServiceProviderCode(serv_prov_code_4_lp);
            //newLic.setAuditDate(sysDate);
			var today = new Date(aa.util.now());
			newLic.setAuditDate(today);
            newLic.setAuditID(currentUserID);
            newLic.setAuditStatus("A");
            newLic.setLicenseType(rlpType);
            newLic.setStateLicense(licNum);
            newLic.setLicState(licenseState);
            //setting this field for a future enhancement to filter license types by the licensing board field. (this will be populated with agency names)
            var agencyLong = lookup("CONTACT_ACROSS_AGENCIES",servProvCode);
            if (!matches(agencyLong,undefined,null,"")) newLic.setLicenseBoard(agencyLong); else newLic.setLicenseBoard("");
 
            var addr = null;

            if (addressType) {
                for (var i in this.addresses) {
                    var cAddr = this.addresses[i];
                    if (addressType.equals(cAddr.getAddressType())) {
                        addr = cAddr;
                    }
                }
            }
            
            if (!addr) addr = peop.getCompactAddress();   //  only used on non-multiple addresses or if we can't find the right multi-address
            
            if (addr.getAddressLine1() != null) newLic.setAddress1(addr.getAddressLine1());
            if (addr.getAddressLine2() != null) newLic.setAddress2(addr.getAddressLine2());
            if (addr.getAddressLine3() != null) newLic.setAddress3(addr.getAddressLine3());
            if (addr.getCity() != null) newLic.setCity(addr.getCity());
            if (addr.getState() != null) newLic.setState(addr.getState());
            if (addr.getZip() != null) newLic.setZip(addr.getZip());
            if (addr.getCountryCode() != null) newLic.setCountryCode(addr.getCountryCode());
            
			var licBusResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseBusiness");
			
            if (updating){
				newLic.setLicSeqNbr(refLicProf.getLicSeqNbr());
				if (licBusResult.getSuccess()) {
					var licBus = licBusResult.getOutput();
					myResult = licBus.editLicenseByPK(newLic);
				}				
			}
            else{
				
				if (licBusResult.getSuccess()) {
					var licBus = licBusResult.getOutput();
					myResult = licBus.createLicense(newLic);
				}
				if (myResult)
                {
					var newRefLicSeqNbr = parseInt(myResult);
					this.linkRefContactWithRefLicProf(licNum,rlpType,serv_prov_code_4_lp);
				}
			}

            if (arguments.length == 5) {
                aa.resetDelegateAgencyCode();
            }
                
            if (myResult)
                {
                logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " From Contact " + this);
                return true;
                }
            else
                {
                logDebug("**WARNING: can't create ref lic prof: " + myResult);
                return false;
                }
        }
        
        this.getAKA = function() {
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            if (this.refSeqNumber) {
                return aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber)).toArray();
                }
            else {
                logDebug("contactObj: Cannot get AKA names for a non-reference contact");
                return false;
                }
            }
            
        this.addAKA = function(firstName,middleName,lastName,fullName,startDate,endDate) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot add AKA name for non-reference contact");
                return false;
                }
                
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var args = new Array();
            var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel",args).getOutput();
            var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel",args).getOutput();

            var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            akaModel.setServiceProviderCode(aa.getServiceProviderCode());
            akaModel.setContactNumber(parseInt(this.refSeqNumber));
            akaModel.setFirstName(firstName);
            akaModel.setMiddleName(middleName);
            akaModel.setLastName(lastName);
            akaModel.setFullName(fullName);
            akaModel.setStartDate(startDate);
            akaModel.setEndDate(endDate);
            auditModel.setAuditDate(new Date(aa.util.now()));
            auditModel.setAuditStatus("A");
            auditModel.setAuditID("ADMIN");
            akaModel.setAuditModel(auditModel);
            a.add(akaModel);

            aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, a);
            }

        this.removeAKA = function(firstName,middleName,lastName) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot remove AKA name for non-reference contact");
                return false;
                }
            
            var removed = false;
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var l = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            
            var i = l.iterator();
            while (i.hasNext()) {
                var thisAKA = i.next();
                if ((!thisAKA.getFirstName() || thisAKA.getFirstName().equals(firstName)) && (!thisAKA.getMiddleName() || thisAKA.getMiddleName().equals(middleName)) && (!thisAKA.getLastName() || thisAKA.getLastName().equals(lastName))) {
                    i.remove();
                    logDebug("contactObj: removed AKA Name : " + firstName + " " + middleName + " " + lastName);
                    removed = true;
                    }
                }   
                    
            if (removed)
                aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, l);
            }

        this.hasPublicUser = function() { 
            if (this.refSeqNumber == null) return false;
            var s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(this.refSeqNumber));
            
            if (s_publicUserResult.getSuccess()) {
                var fpublicUsers = s_publicUserResult.getOutput();
                if (fpublicUsers == null || fpublicUsers.size() == 0) {
                    logDebug("The contact("+this.refSeqNumber+") is not associated with any public user.");
                    return false;
                } else {
                    logDebug("The contact("+this.refSeqNumber+") is associated with "+fpublicUsers.size()+" public users.");
                    return true;
                }
            } else { logMessage("**ERROR: Failed to get public user by contact number: " + s_publicUserResult.getErrorMessage()); return false; }
        }

        this.linkToPublicUser = function(pUserId) { 
           
            if (pUserId != null) {
                var pSeqNumber = pUserId.replace('PUBLICUSER','');
                
                var s_publicUserResult = aa.publicUser.getPublicUser(aa.util.parseLong(pSeqNumber));

                if (s_publicUserResult.getSuccess()) {
                    var linkResult = aa.licenseScript.associateContactWithPublicUser(pSeqNumber, this.refSeqNumber);

                    if (linkResult.getSuccess()) {
                        logDebug("Successfully linked public user " + pSeqNumber + " to contact " + this.refSeqNumber);
                    } else {
                        logDebug("Failed to link contact to public user");
                        return false;
                    }
                } else {
                    logDebug("Could not find a public user with the seq number: " + pSeqNumber);
                    return false;
                }


            } else {
                logDebug("No public user id provided");
                return false;
            }
        }

        this.sendCreateAndLinkNotification = function() {
            //for the scenario in AA where a paper application has been submitted
            var toEmail = this.people.getEmail();

            if (toEmail) {
                var params = aa.util.newHashtable();
                getACARecordParam4Notification(params,acaUrl);
                addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
                addParameter(params,"$$altID$$",capIDString);
                var notificationName;

                if (this.people.getContactTypeFlag() == "individual") {
                    notificationName = this.people.getFirstName() + " " + this.people.getLastName();
                } else {
                    notificationName = this.people.getBusinessName();
                }

                if (notificationName)
                    addParameter(params,"$$notificationName$$",notificationName);
                if (this.refSeqNumber) {
                    var v = new verhoeff();
                    var pinCode = v.compute(String(this.refSeqNumber));
                    addParameter(params,"$$pinCode$$",pinCode);

                    sendNotification(agencyReplyEmail,toEmail,"","PUBLICUSER CREATE AND LINK",params,null);                    
                }

                               
            }

        }

        this.getRelatedRefContacts = function() { //Optional relationship types array 
            
            var relTypes;
            if (arguments.length > 0) relTypes = arguments[0];
            
            var relConsArray = new Array();

            if (matches(this.refSeqNumber,null,undefined,"")) return relConsArray;

            //check as the source
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setContactSeqNumber(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);


            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getEntityID1());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }

            //check as the target
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setEntityID1(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);

            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getContactSeqNumber());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }           

            return relConsArray;
        }
		
		this.editName = function(fName, mName, lName, fullName, businessName, dbaName){
				fNameStr = "" + fName;
				if (fNameStr != "undefined") {
					if (fNameStr == "null")
						this.capContact.setFirstName("");
					else
						this.capContact.setFirstName(fNameStr);
				}
				lNameStr = "" + lName;
				if (lNameStr != "undefined") {
					if (lNameStr == "null")
						this.capContact.setLastName("");
					else
						this.capContact.setLastName(lNameStr);
				}
				mNameStr = "" + mName;
				if (mNameStr != "undefined") {
					if (mNameStr == "null")
						this.capContact.setMiddleName("");
					else
						this.capContact.setMiddleName(mNameStr);
				}
				if (matches(fullName,undefined,null,"")) {
					if (mNameStr == "null")
						this.capContact.setFullName(fNameStr  + " " + lNameStr);
					else
						this.capContact.setFullName(fNameStr + " " + mNameStr + " " + lNameStr);
				}
				else{
					this.capContact.setFullName(String(fullName));
				}
				businessNameStr = "" + businessName;
				if (businessNameStr != "undefined") {
					if (businessNameStr == "null") 
						this.capContact.setBusinessName("");
					else
						this.capContact.setBusinessName(businessNameStr);
				}
				dbaNameStr = "" + dbaName;
				if (dbaNameStr != "undefined") {
					if (dbaNameStr == "null") 
						this.capContact.setTradeName("");
					else
						this.capContact.setTradeName(dbaNameStr);
				}
		}
		
		this.editEmail = function(emailAddress){
			if(!matches(emailAddress,undefined,null,"")) 
				this.capContact.setEmail(emailAddress);
		}

		this.editPhone = function(phone1,phone2,phone3,fax) {
			if(!matches(phone1,undefined,null,"")) 
				this.capContact.setPhone1(phone1);
			if(!matches(phone2,undefined,null,"")) 
				this.capContact.setPhone2(phone2);
			if(!matches(phone3,undefined,null,"")) 
				this.capContact.setPhone3(phone3);
			if(!matches(fax,undefined,null,"")) 
				this.capContact.setFax(fax);
		}

		this.editContactAddress = function(addressType, addr1, addr2, addr3, city, state, zip, phone, country, primary, effectiveDate, expirationDate, addressStatus, overwrite){
		var casm;
		var vOverwrite = (matches(overwrite,"N","No",false)) ? false : true;
		
		var contactAddressListResult = aa.address.getContactAddressListByCapContact(this.capContact);
			if (contactAddressListResult.getSuccess()) { 
					contactAddressList = contactAddressListResult.getOutput();
					for (var x in contactAddressList) {
						cal= contactAddressList[x];
						addrType = "" + cal.getAddressType();
							if (addrType == addressType) {
								cResult = aa.address.getContactAddressByPK(cal.getContactAddressModel());
								if (cResult.getSuccess()) {
									casm = cResult.getOutput();
									if(vOverwrite){
										casm.setAddressLine1(addr1);
										casm.setAddressLine2(addr2);
										casm.setAddressLine3(addr3);
										casm.setCity(city);
										casm.setState(state);
										casm.setZip(zip);
										casm.setPhone(phone);
										casm.setCountryCode(country);
										if(effectiveDate) casm.setEffectiveDate(aa.util.parseDate(effectiveDate));
										if(expirationDate) casm.setExpirationDate(aa.util.parseDate(expirationDate));
										if(matches(primary,"Y",true,"true"))
											casm.getContactAddressModel().setPrimary("Y");
										if(matches(addressStatus,"I",false,"false")){
											casm.getContactAddressModel().setStatus("I");
										}
										else{
											casm.getContactAddressModel().setStatus("A");
										}
										editResult = aa.address.editContactAddress(casm.getContactAddressModel());
										if (!editResult.getSuccess()) {
										logDebug("error modifying existing address : " + editResult.getErrorMessage());
										} else {
										logDebug("Address updated successfully");
										}
									} 
									else{
										// update the existing address expirationDate, deactivate
										// create a new address of the same type
										
										var conAdd = aa.address.createContactAddressModel().getOutput().getContactAddressModel();
										conAdd.setEntityType("CAP_CONTACT");
										conAdd.setEntityID(parseInt(this.capContact.getContactSeqNumber()));
										conAdd.setAddressType("Mailing");
										conAdd.setAddressLine1(addr1);
										conAdd.setAddressLine2(addr2);
										conAdd.setAddressLine3(addr3);
										conAdd.setCity(city);
										conAdd.setState(state);
										conAdd.setZip(zip);
										conAdd.setPhone(phone)
										conAdd.setCountryCode(country);
										if(effectiveDate){ 
											conAdd.setEffectiveDate(aa.util.parseDate(effectiveDate));
										}
										else{
											var today = dateAdd(null,0)
											conAdd.setEffectiveDate(aa.util.parseDate(today));
										}
										
										conAdd.setStatus("A");
										
										//Create AddressList 
										var contactAddrModelArr = aa.util.newArrayList();
										contactAddrModelArr.add(conAdd);
										
										// set the address
										this.people.setContactAddressList(contactAddrModelArr);
										
										editResult = aa.address.editContactAddress(conAdd.getContactAddressModel());
									}
									
									
									
								}
							}
						}	
						convertedContactAddressList = convertContactAddressModelArr(contactAddressList);
						this.people.setContactAddressList(convertedContactAddressList);
			}

		}

		
    }
 
//@ts-check

/**
 * Sets the supplied contact to be the primary contact on the current record
 * @param {number} pContactNbr Sequence number of the contact to make primary.
 * @returns {boolean} FALSE if error, TRUE if success
 */

function contactSetPrimary(pContactNbr) {
    if (typeof capId === typeof undefined || !capId) {
        logDebug("'contactSetPrimary' requires global 'capId' be defined.");
        return false;
    }

    // Makes contact the Primary Contact
    // 06SSP-00186
    if (pContactNbr == null) {
        logDebug("**ERROR: ContactNbr parameter is null");
        return false;
    } else {
        var capContactResult = aa.people.getCapContactByPK(capId, pContactNbr);
        if (capContactResult.getSuccess()) {
            var contact = capContactResult.getOutput();
            //logDebug("contact class is "+contact.getClass());
            var peopleObj = contact.getCapContactModel().getPeople();
            peopleObj.setFlag("Y");
            contact.getCapContactModel().setPeople(peopleObj);
            var editResult = aa.people.editCapContact(contact.getCapContactModel());
            if (editResult.getSuccess()) {
                logDebug("Contact successfully set to Primary");
                return true;
            } else {
                logDebug("**ERROR: Could not set contact to Primary: " + editResult.getErrorMessage());
                return false;
            }
        } else {
            logDebug("**ERROR: Can't get contact: " + capContactResult.getErrorMessage());
            return false;
        }
    }
}
 
//@ts-check

/**
 * Sets the relationship code on the supplied contact, on the current record.
 * @param {number} pContactNbr - Sequence number of the contact.
 * @param {string} pRelation - Set to this relationship code.
 * @returns {boolean} TRUE if success, FALSE if error
 */

function contactSetRelation(pContactNbr, pRelation) {
	// Edits Contact Relationship for specified Contact
	//06SSP-00186
    try {
        aa.cap.getCap(capId);
    } catch (err) {
        logDebug("'contactSetRelation' requires global 'capId' be defined");
        return false;
    }
	if (typeof pContactNbr == "undefined" || pContactNbr == null) {
		logDebug("'contactSetRelation' parameter 'pContactNbr' is required");
		return false;
	}
	if (typeof pRelation == "undefined" || pRelation == null || pRelation == "") {
		logDebug("'contactSetRelation' parameter 'pRelation' is required");
		return false;
	} else {
		var capContactResult = aa.people.getCapContactByPK(capId, pContactNbr);
		if (capContactResult.getSuccess()) {
			var contact = capContactResult.getOutput();
			//logDebug("contact class is "+contact.getClass());
			var peopleObj = contact.getCapContactModel().getPeople();
			peopleObj.setRelation(pRelation);
			contact.getCapContactModel().setPeople(peopleObj);
			var editResult = aa.people.editCapContact(contact.getCapContactModel());
			if (editResult.getSuccess()) {
				logDebug("Contact relationship successfully changed to " + pRelation);
				return true;
			} else {
				logDebug("**ERROR: Could not change contact relationship: " + editResult.getErrorMessage());
				return false;
			}
		} else {
			logDebug("**ERROR: Can't get contact: " + capContactResult.getErrorMessage());
			return false;
		}
	}
}
 
 function convertContactAddressModelArr(contactAddressScriptModelArr)

{

	var contactAddressModelArr = null;

	if(contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0)

	{

		contactAddressModelArr = aa.util.newArrayList();

		for(loopk in contactAddressScriptModelArr)

		{

			contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());

		}

	}	

	return contactAddressModelArr;

}



 
//@ts-check

/**
 * Will attempt to convert the supplied parameter representing a date to a javascript date.
 * If a string is supplied it must be in a format that JS Date Constructor can recognize.
 * Accepts:
 *  - com.accela.aa.emse.dom.ScriptDateTime
 *  - com.accela.aa.emse.util.ScriptDateTime
 *  - class java.util.Date
 *  - java.lang.String (see above conserning format)
 *  - java.sql.Timestamp
 *  - number (assumes milliseconds)
 * 
 * @param {object} thisDate The date to convert.
 * @returns {Date | false} Returns the date in javascript format or false if it encounters an error.
 */

function convertDate(thisDate) {

	if (typeof (thisDate) == "string") {
		var retVal = new Date(String(thisDate));
		if (!retVal.toString().equals("Invalid Date")) {
			return retVal;
		}
	}

	// TODO - next version perform check on result against 'Invalid Date' as above.
	if (typeof (thisDate) == "object") {

		if (!thisDate.getClass) {
			// object without getClass, assume that this is a javascript date already
			return thisDate;
		}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.dom.ScriptDateTime")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

		if (thisDate.getClass().toString().equals("class com.accela.aa.emse.util.ScriptDateTime")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDayOfMonth() + "/" + thisDate.getYear());
		}

		if (thisDate.getClass().toString().equals("class java.util.Date")) {
			return new Date(thisDate.getTime());
		}

		if (thisDate.getClass().toString().equals("class java.lang.String")) {
			return new Date(String(thisDate));
		}

		if (thisDate.getClass().toString().equals("class java.sql.Timestamp")) {
			return new Date(thisDate.getMonth() + "/" + thisDate.getDate() + "/" + thisDate.getYear());
		}
	}

	if (typeof (thisDate) == "number") {
		return new Date(thisDate);  // assume milliseconds
	}

	logDebug("**WARNING** convertDate cannot parse date : " + thisDate);
	return false;

}
 
//@ts-check

/**
 * Converts the string to phone codes (A=1, D=3, etc), useful with the setIVR function.
 * 
 * @param {string} theString String containing information to convert.
 * @returns {string} A string with the converted phone code.
 */

function convertStringToPhone(theString) {
	var n = "22233344455566677778889999";

	var compString = String(theString.toUpperCase());
	var retString = "";

	for (var x = 0; x < compString.length; x++) {
		if (compString[x] >= "A" && compString[x] <= "Z") {
			retString += n[compString.charCodeAt(x) - 65]
		} else {
			retString += compString[x];
		}
	}
	return retString;
}
 
//@ts-check

/**
 * Copies all property addresses from record pFromCapId to record pToCapId. If record pToCapId has a
 * primary address, any primary address in pFromCapId becomes non-primary when copied over.
 *
 * @param {object} pFromCapId ID of record from which to copy.
 * @param {object} pToCapId ID of record to which to copy. If null, the function uses the current record.
 * @returns {number | boolean} Returns the number of copied addressess or false if encounters an error
 */

function copyAddresses(pFromCapId, pToCapId) {
	//Copies all property addresses from pFromCapId to pToCapId
	//If pToCapId is null, copies to current CAP
	//07SSP-00037/SP5017

	if (pToCapId == null) {
		var vToCapId = capId;
	} else {
		var vToCapId = pToCapId;
	}
	if (typeof vToCapId === typeof undefined) {
		logDebug("'copyAddresses' - when 'pToCapId' is not defined global 'capId' is required.");
		return false;
	}

	//check if target CAP has primary address
	var priAddrExists = false;
	var capAddressResult = aa.address.getAddressByCapId(vToCapId);
	if (capAddressResult.getSuccess()) {
		var Address = capAddressResult.getOutput();
		for (var yy in Address) {
			if ("Y" == Address[yy].getPrimaryFlag()) {
				priAddrExists = true;
				logDebug("Target CAP has primary address");
				break;
			}
		}
	} else {
		logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
		return false;
	}

	//get addresses from originating CAP
	var capAddressResult = aa.address.getAddressWithAttributeByCapId(pFromCapId);
	var copied = 0;
	if (capAddressResult.getSuccess()) {
		Address = capAddressResult.getOutput();
		for (var yy in Address) {
			var newAddress = Address[yy];
			newAddress.setCapID(vToCapId);
			if (priAddrExists) {
				//prevent target CAP from having more than 1 primary address
				newAddress.setPrimaryFlag("N");
			}
			aa.address.createAddressWithAPOAttribute(vToCapId, newAddress);
			logDebug("Copied address from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
			copied++;
		}
	} else {
		logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
		return false;
	}
	return copied;
}


 
//@ts-check

/**
 * Copies all app spec info values from current record to the record whose record ID object is newCap. If the
 * target record does not have the same app specific info field, the does not copy the value.
 *
 * @param {object} newCap ID of target record (copy to this record).
 * @param {[string]} [ignoreArr] (optional) - Array of ASI labels ignore and not copy.
 */

function copyAppSpecific(newCap) {

	if (typeof AInfo === typeof undefined) {
		logDebug("'copyAppSpecific' global value 'AInfo' must be defined.");
		return false;
	}

	// copy all App Specific info into new Cap, 1 optional parameter for ignoreArr
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 1) {
		ignoreArr = arguments[1];
		limitCopy = true;
	}

	for (var asi in AInfo) {
		//Check list
		if (limitCopy) {
			var ignore = false;
			for (var i = 0; i < ignoreArr.length; i++) {
				if (ignoreArr[i] == asi) {
					ignore = true;
					break;
				}
			}
			if (ignore) {
				continue;
			}
		}
		editAppSpecific(asi, AInfo[asi], newCap);
	}
} 
function copyAppSpecific4ACA(capFrom) { // copy all App Specific info into new Cap
var i= capFrom.getAppSpecificInfoGroups().iterator();

    while (i.hasNext())
    {
         var group = i.next();
         var fields = group.getFields();
         if (fields != null)
            {
            var iteFields = fields.iterator();
            while (iteFields.hasNext())
            {
                 var field = iteFields.next();

                    if (useAppSpecificGroupName)
                            editAppSpecific4ACA(field.getCheckboxType() + "." + field.getCheckboxDesc(),field.getChecklistComment());
                    else
                            editAppSpecific4ACA(field.getCheckboxDesc(),field.getChecklistComment());
           }
        }
    }
}
 
//@ts-check

/**
 * Copies all ASI fields from the sourceCapId record to the targetCapId record with the exception of the ASI
 * subgroups listed in optional third parameter (array of string)
 *
 * @param {object} sourceCapId ID of record from which to copy.
 * @param {object} targetCapId ID of record to which to copy.
 * @param {string} [ignoreArray] optional - ASI subgroups to ignore during the copy.
 * @returns {boolean | undefined} FALSE in some error conditions, otherwise, nothing is returned 
 * ---
 * **Notes**
 * This function moves the ASI fields themselves, not the values. You can add an ASI group to a record that
 * did not previously include the ASI group. This function does not copy the form portlet designer settings,
 * which can cause problems.
 * 
 */

function copyASIFields(sourceCapId, targetCapId) {
	// optional groups to ignore
	var ignoreArray = new Array();
	for (var i = 2; i < arguments.length; i++) {
		ignoreArray.push(arguments[i])
	}
	if (typeof sourceCapId == "undefined" || sourceCapId == null || typeof targetCapId == "undefined" || targetCapId == null) {
		logDebug("'copyASIFields' requires CapIDs in parameters 'sourceCapId' and 'targetCapId' ");
		return false;
	}

	var targetCap = aa.cap.getCap(targetCapId).getOutput();
	var targetCapType = targetCap.getCapType();
	var targetCapTypeString = targetCapType.toString();
	var targetCapTypeArray = targetCapTypeString.split("/");

	var sourceASIResult = aa.appSpecificInfo.getByCapID(sourceCapId)

	if (sourceASIResult.getSuccess()) {
		var sourceASI = sourceASIResult.getOutput();
	} else {
		logDebug("**ERROR: getting source ASI: " + sourceASIResult.getErrorMessage());
		return false;
	}

	for (var ASICount in sourceASI) {
		var thisASI = sourceASI[ASICount];
		if (!exists(thisASI.getCheckboxType(), ignoreArray)) {
			thisASI.setPermitID1(targetCapId.getID1())
			thisASI.setPermitID2(targetCapId.getID2())
			thisASI.setPermitID3(targetCapId.getID3())
			thisASI.setPerType(targetCapTypeArray[1])
			thisASI.setPerSubType(targetCapTypeArray[2])
			aa.cap.createCheckbox(thisASI)
		}
	}
} 
function copyASITables(pFromCapId, pToCapId) {
	// Function dependencies on addASITable()
	// par3 is optional 0 based string array of table to ignore
	var itemCap = pFromCapId;

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
		var tai = ta.iterator();
	var tableArr = new Array();
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) {
		ignoreArr = arguments[2];
		limitCopy = true;
	}
	while (tai.hasNext()) {
		var tsm = tai.next();

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName() + "";
		var numrows = 0;

		//Check list
		if (limitCopy) {
			var ignore = false;
			for (var i = 0; i < ignoreArr.length; i++)
				if (ignoreArr[i] == tn) {
					ignore = true;
					break;
				}
			if (ignore)
				continue;
		}
		if (!tsm.rowIndex.isEmpty()) {
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
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
				if (readOnlyi.hasNext()) {
					readOnly = readOnlyi.next();
				}

				var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
				tempObject[tcol.getColumnName()] = fieldInfo;
				//tempObject[tcol.getColumnName()] = tval;
			}

			tempArray.push(tempObject); // end of record
		}

		addASITable(tn, tempArray, pToCapId);
		logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	}
} 
//@ts-check

/**
 * Copies the calculated job value from the current record to the record whose record ID object is pToCapId.
 * 
 * @param {object} fromcap ID of record from which to copy.
 * @param {object} newcap ID of record to which to copy.
 */

function copyCalcVal(fromcap, newcap) {
	// 8/8/2008 JHS  creatBCalcValuatn method began using the script model after 6.4  updated this function
	if (typeof newcap == "undefined" || newcap == null || typeof fromcap == "undefined" || fromcap == null) {
		logMessage("'copyCalcVal' requires CapIDs for parameters fromcap and 'newcap'");
		return false;
	}

	var valResult = aa.finance.getCalculatedValuation(fromcap, null);
	if (valResult.getSuccess()) {
		var valArray = valResult.getOutput();
	} else {
		logMessage("**ERROR: Failed to get calc val array: " + valResult.getErrorMessage());
		return false;
	}

	for (var thisCV in valArray) {
		var bcv = valArray[thisCV];
		bcv.setCapID(newcap);
		var createResult = aa.finance.createBCalcValuatn(bcv);
		if (!createResult.getSuccess()) {
			logMessage("**ERROR: Creating new calc valuatn on target cap ID: " + createResult.getErrorMessage());
			return false;
		}
	}
}
 
//@ts-check

/**
 * Copies all conditions from record capId to the current record (if you do not specify toCapId) or the specified record.
 * @param {CapIDModel} fromCapId ID of record from which to copy.
 * @param {CapIDModel} [toCapId] Optional - The ID of the record to which to copy conditions. 
 * @returns {boolean}
 */

// optional toCapID
function copyConditions(fromCapId) {

	var itemCap = capId;
	if (arguments.length == 2){
		itemCap = arguments[1]; // use cap ID specified in args
    }
    try {
        aa.cap.getCap(itemCap);
        aa.cap.getCap(fromCapId);
    } catch (err) {
        logDebug("'copyConditions' requires Source CapID param and global 'capId' OR Target CapID param be defined");
        return false;
    }
    var l_sysDate = (typeof sysDate == "undefined" || sysDate == null) ? aa.date.getCurrentDate() : sysDate;
    var l_currentUserID = (typeof currentUserID == "undefined" || currentUserID == null) ? null : currentUserID;
    if(!l_currentUserID && aa.env.getValue("currentUserID") != ""){
        l_currentUserID = aa.env.getValue("currentUserID");
    } else if(!l_currentUserID && aa.env.getValue("currentUserID") == ""){
        logDebug("'copyConditions' global 'currentUserID' OR  environment variable 'currentUserID' must be defined");
        return false;
    }


	var getFromCondResult = aa.capCondition.getCapConditions(fromCapId);
	if (getFromCondResult.getSuccess()) {
		var condA = getFromCondResult.getOutput();
    } else {
		logDebug("**ERROR: getting cap conditions: " + getFromCondResult.getErrorMessage());
		return false;
	}

	for (var cc in condA) {
		var thisC = condA[cc];

		var addCapCondResult = aa.capCondition.addCapCondition(itemCap, thisC.getConditionType(), thisC.getConditionDescription(), thisC.getConditionComment(), thisC.getEffectDate(), thisC.getExpireDate(), l_sysDate, thisC.getRefNumber1(), thisC.getRefNumber2(), thisC.getImpactCode(), thisC.getIssuedByUser(), thisC.getStatusByUser(), thisC.getConditionStatus(), l_currentUserID, String("A"), null, thisC.getDisplayConditionNotice(), thisC.getIncludeInConditionName(), thisC.getIncludeInShortDescription(), thisC.getInheritable(), thisC.getLongDescripton(), thisC.getPublicDisplayMessage(), thisC.getResolutionAction(), null, null, thisC.getReferenceConditionNumber(), thisC.getConditionGroup(), thisC.getDisplayNoticeOnACA(), thisC.getDisplayNoticeOnACAFee(), thisC.getPriority(), thisC.getConditionOfApproval());
		if (addCapCondResult.getSuccess()) {
			logDebug("Successfully added condition (" + thisC.getImpactCode() + ") " + thisC.getConditionDescription());
        } else {
			logDebug("**ERROR: adding condition (" + cImpact + "): " + addCapCondResult.getErrorMessage());
        }
	}
	return true;
}
 
//@ts-check

/**
 * Copies conditions from the reference parcel parcelIdString and adds them 
 * as conditions to the current record (not to parcels on the current record).
 * @param {string} parcelIdString Parcel number of source parcel.
 * @returns {boolean}
 */

function copyConditionsFromParcel(parcelIdString) {
	if (typeof capId === typeof undefined || !capId) {
		logDebug("'copyConditionsFromParcel' requires global 'capId' be defined.");
		return false;
	}
	var getFromCondResult = aa.parcelCondition.getParcelConditions(parcelIdString)
	if (getFromCondResult.getSuccess()){
		var condA = getFromCondResult.getOutput();
    } else {
        logDebug("**WARNING: getting parcel conditions: " + getFromCondResult.getErrorMessage()); 
        return false 
    }

	for (var cc in condA) {
		var thisC = condA[cc];

		if (!appHasCondition(thisC.getConditionType(), null, thisC.getConditionDescription(), thisC.getImpactCode())) {
            // TODO : 'aa.capCondition.addCapCondition' is Deprecated
			var addCapCondResult = aa.capCondition.addCapCondition(capId, thisC.getConditionType(), thisC.getConditionDescription(), thisC.getConditionComment(), thisC.getEffectDate(), thisC.getExpireDate(), sysDate, thisC.getRefNumber1(), thisC.getRefNumber2(), thisC.getImpactCode(), thisC.getIssuedByUser(), thisC.getStatusByUser(), thisC.getConditionStatus(), currentUserID, "A", thisC.getConditionStatusType(), thisC.getDisplayConditionNotice(), thisC.getIncludeInConditionName(), thisC.getIncludeInShortDescription(), thisC.getInheritable(), thisC.getLongDescripton(), thisC.getPublicDisplayMessage(), thisC.getResolutionAction(), null, null, thisC.getConditionNumber(), thisC.getConditionGroup(), thisC.getDisplayNoticeOnACA(), thisC.getDisplayNoticeOnACAFee());
			if (addCapCondResult.getSuccess()){
				logDebug("Successfully added condition (" + thisC.getImpactCode() + ") " + thisC.getConditionDescription());
            } else {
				logDebug("**ERROR: adding condition (" + thisC.getImpactCode() + "): " + addCapCondResult.getErrorMessage());
            }
		} else {
			logDebug("**WARNING: adding condition (" + thisC.getImpactCode() + "): condition already exists");
        }
	}
	return true;
}
 
//@ts-check

/**
 * Copies all contacts from record pFromCapId to record pToCapId.
 * 
 * **Notes**:
 * 
 * If target record has a primary contact and the source record also has a primary contact, 
 * the target recordends up with 2 primary contacts. 
 * 
 * Functions that return a Cap ID object
 * - getApplication( )
 * - getParent( )
 * - createChild()
 * - createCap() 
 *
 * 
 * ---
 * **Global variables**:
 * - capId
 * ---
 * 
 * @param {CapIDModel} pFromCapId ID of record from which to copy.
 * @param {CapIDModel} [pToCapId] (Optional) ID of record to which to copy. If null, the function uses the current record.
 * @returns {number | false} the amount of contacts that were copied, false otherwise(or in case of error)
 */
function copyContacts(pFromCapId, pToCapId) {
	if (!pToCapId && (typeof capId === typeof undefined || capId === null)){
		logDebug("'copyContacts' Error: Required global variable 'capId' or optional param 'pToCapId' not defined");
		return false;
	}

	var vToCapId = pToCapId || capId;

	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	var Contacts;

	if(!capContactResult.getSuccess()){
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
		return false;
	}
	Contacts = capContactResult.getOutput();

	for (var contactsIdx in Contacts) {
		var newContact = Contacts[contactsIdx].getCapContactModel();

		// Retrieve contact address list and set to related contact
		var contactAddressrs = aa.address.getContactAddressListByCapContact(newContact);
		if (contactAddressrs.getSuccess()) {
			var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
			newContact.getPeople().setContactAddressList(contactAddressModelArr);
		}
		newContact.setCapID(vToCapId);

		// Create cap contact, contact address and contact template
		aa.people.createCapContactWithAttribute(newContact);
		copied++;
		logDebug("Copied contact from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
	}
	return copied;
}

/**
 * From a list of contact adresses returns a list of the models for each one
 * 
 * @param {Array<ContactAdress>} contactAddressScriptModelArr 
 * @returns {Array<ContactAdressModel> | null}
 */
function convertContactAddressModelArr(contactAddressScriptModelArr) {
	var contactAddressModelArr = null;
	if (contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0) {
		contactAddressModelArr = aa.util.newArrayList();
		for (var loopk in contactAddressScriptModelArr) {
			contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());
		}
	}
	return contactAddressModelArr;
} 
function copyContactsByType(pFromCapId, pToCapId, pContactType)
	{
	//Copies all contacts from pFromCapId to pToCapId
	//where type == pContactType
	if (pToCapId==null)
		var vToCapId = capId;
	else
		var vToCapId = pToCapId;
	
	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	if (capContactResult.getSuccess())
		{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
			{
			if(Contacts[yy].getCapContactModel().getContactType() == pContactType)
			    {
			    var newContact = Contacts[yy].getCapContactModel();
			    newContact.setCapID(vToCapId);
			    aa.people.createCapContact(newContact);
			    copied++;
			    logDebug("Copied contact from "+pFromCapId.getCustomID()+" to "+vToCapId.getCustomID());
			    }
		
			}
		}
	else
		{
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage()); 
		return false; 
		}
	return copied;
	} 
 function copyEducation(srcCapId, targetCapId)

{

    if(srcCapId != null && targetCapId != null)

    {

        aa.education.copyEducationList(srcCapId, targetCapId);

    }

}
 
//@ts-check

/**
 * Copies all fees from record sourceCapId to record targetCapId. Excludes voided or credited fees.
 * @param {object} sourceCapId ID of record from which to copy fees.
 * @param {object} targetCapId ID of record to which to copy.
 * @returns {boolean | undefined} FALSE in some error conditions, otherwise, returns nothing
 */

function copyFees(sourceCapId, targetCapId) {

	try {
        aa.cap.getCap(sourceCapId);
        aa.cap.getCap(targetCapId);
    } catch (err) {
        logDebug("'copyFees' requires Source CapID param and Target CapID param be defined");
        return false;
    }

	// var feeSeqArray = new Array();
	// var paymentPeriodArray = new Array();
	// var invoiceNbrArray = new Array();
	// var feeAllocationArray = new Array();

	var feeA = loadFees(sourceCapId)

	for (var x in feeA) {
		var thisFee = feeA[x];
		logMessage("We have a fee " + thisFee.code + " status : " + thisFee.status);

		if (thisFee.status == "INVOICED") {
			addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "Y", targetCapId);
			var feeSeqArray = new Array();
			var paymentPeriodArray = new Array();
			feeSeqArray.push(thisFee.sequence);
			paymentPeriodArray.push(thisFee.period);
			var invoiceResult_L = aa.finance.createInvoice(sourceCapId, feeSeqArray, paymentPeriodArray);

			if (!invoiceResult_L.getSuccess()) {
				aa.print("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
			}
		}

		if (thisFee.status == "NEW") {
			addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "N", targetCapId)
		}

	}

}
 
//@ts-check

/**
 * Copies all licensed professionals from sCapId to record tCapId.
 * @param {object} sCapId ID of record from which to copy licensed professionals.
 * @param {object} tCapId ID of record to which to copy.
 */

function copyLicensedProf(sCapId, tCapId) {
    try{
        aa.cap.getCap(sCapId);
        aa.cap.getCap(tCapId);
    } catch(err){
        logDebug("'copyLicensedProf' requires both parameters for Source CAP and Target CAP");
        return;
    }
	//Function will copy all licensed professionals from source CapID to target CapID
    var licProf = aa.licenseProfessional.getLicensedProfessionalsByCapID(sCapId).getOutput();

	if (licProf != null) {
		for (var x in licProf) {
			licProf[x].setCapID(tCapId);
			aa.licenseProfessional.createLicensedProfessional(licProf[x]);
			logDebug("Copied " + licProf[x].getLicenseNbr());
		}
	} else {
		logDebug("No licensed professional on source");
	}

}
 
//@ts-check

/**
 * Copies a contacts from sCapID to tCapID.
 * @param {object} sCapID ID of record from which to copy.
 * @param {object} tCapID ID of record to which to copy.
 */

function copyOwner(sCapID, tCapID) {
    try{
        aa.cap.getCap(sCapID);
        aa.cap.getCap(tCapID);
    } catch(err){
        logDebug("'copyOwner' requires both parameters for Source CAP and Target CAP");
        return;
    }
	var ownrReq = aa.owner.getOwnerByCapId(sCapID);
	if (ownrReq.getSuccess()) {
		var ownrObj = ownrReq.getOutput();
		if (ownrObj != null) {
			for (var xx in ownrObj) {
				ownrObj[xx].setCapID(tCapID);
				aa.owner.createCapOwnerWithAPOAttribute(ownrObj[xx]);
				logDebug("Copied Owner: " + ownrObj[xx].getOwnerFullName());
			}
		} else {
			logDebug("Error Copying Owner : " + ownrObj.getErrorType() + " : " + ownrObj.getErrorMessage());
		}
	} else {
		logDebug("Warning: No owners exist to copy");
	}
}
 
//@ts-check

/**
 * Copies reference owners from all attached parcels to the current record.
 * 
 * ---
 * **Global Variable**:
 * - capId
 */


function copyOwnersByParcel() {

    try {
        aa.cap.getCap(capId);
    } catch (err) {
        logDebug("'copyOwnersByParcel' requires global 'capId' be defined");
        return;
    }

    //get parcel(s) by capid
    var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

    if (parcels.getSuccess()) {
        parcels = parcels.getOutput();
        if (parcels == null || parcels.length == 0) {
            logDebug("No parcels available for this record");
        } else {
            //get owner(s) by parcel(s)
            for (var i = 0; i < parcels.length; i++) {
                var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
                var parcelNbr = parcels[i].getParcelNumber();
                var parcelUID = parcels[i].getParcelModel().getUID();

                if (parcelOwnersResult.getSuccess()) {
                    var actuallyParcelNumber = parcelNbr != null ? parcelNbr : parcelUID;
                    //aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
                    var ownerArr = parcelOwnersResult.getOutput();
                    //aa.print("Size :" + ownerArr.length);
                    for (var j = 0; j < ownerArr.length; j++) {
                        ownerArr[j].setCapID(capId);
                        aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
                    }
                } else {
                    logDebug("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
                }
            }
        }
    }
}
 
//@ts-check

/**
 * Copies parcel GIS objects to the record.
 * @returns {boolean | undefined} FALSE in some error conditions, otherwise, nothing is returned
 */

function copyParcelGisObjects() {
    try {
        aa.cap.getCap(capId);
    } catch (err) {
        logDebug("'copyParcelGisObjects' requires global 'capId' be defined");
        return false;
    }
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()) {
		var Parcels = capParcelResult.getOutput().toArray();
		for (var zz in Parcels) {

			var ParcelValidatedNumber = Parcels[zz].getParcelNumber();
			logDebug("Looking at parcel " + ParcelValidatedNumber);
			var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
			if (gisObjResult.getSuccess()) {
				var fGisObj = gisObjResult.getOutput();
			} else {
				logDebug("**WARNING: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
				return false;
			}

			for (var a1 in fGisObj) {
				// for each GIS object on the Cap
				var gisTypeScriptModel = fGisObj[a1];
				var gisObjArray = gisTypeScriptModel.getGISObjects();

				for (var b1 in gisObjArray) {
					var gisObjScriptModel = gisObjArray[b1];
					var gisObjModel = gisObjScriptModel.getGisObjectModel();
					var retval = aa.gis.addCapGISObject(capId, gisObjModel.getServiceID(), gisObjModel.getLayerId(), gisObjModel.getGisId());

					if (retval.getSuccess()) {
						logDebug("Successfully added Cap GIS object: " + gisObjModel.getGisId());
					} else {
						logDebug("**WARNING: Could not add Cap GIS Object.  Reason is: " + retval.getErrorType() + ":" + retval.getErrorMessage());
						return false;
					}
				}
			}
		}
	} else {
		logDebug("**ERROR: Getting Parcels from Cap.  Reason is: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage());
		return false;
	}
}
 
//@ts-check

/**
 * Copies all parcels, and parcel attributes, from record pFromCapId to record pToCapId.
 * getApplication( ), getParent( ), createChild(), createCap() functions each return a record ID object.
 * @param {CapIDModel} pFromCapId ID of record from which to copy.
 * @param {CapIDModel} [pToCapId] ID of record to which to copy. If null, the function uses the current record.
 * @returns {boolean | number} FALSE in some error conditions. Number equal to number of parcels coppied.
 *  * 
 * ---
 * **Notes**
 * capId is the record ID object for the current record.
 * getApplication( ), getParent( ), createChild(), createCap() functions each return a record ID object.
 */

function copyParcels(pFromCapId, pToCapId) {
	//Copies all parcels from pFromCapId to pToCapId
	//If pToCapId is null, copies to current CAP
	//07SSP-00037/SP5017
	//
    var vToCapId = pToCapId;
	if (typeof vToCapId == "undefined" || vToCapId == null) {
        vToCapId = capId;
    }
    try {
        aa.cap.getCap(pFromCapId);
        aa.cap.getCap(vToCapId);
    } catch (err) {
        logDebug("'copyParcels' requires Source CapID param and Target CapID param OR global 'capId' be defined");
        return false;
    }
    
	var capParcelResult = aa.parcel.getParcelandAttribute(pFromCapId, null);
	var copied = 0;
	if (capParcelResult.getSuccess()) {
		var Parcels = capParcelResult.getOutput().toArray();
		for (var zz in Parcels) {
			var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
			newCapParcel.setParcelModel(Parcels[zz]);
			newCapParcel.setCapIDModel(vToCapId);
			newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
			newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
			aa.parcel.createCapParcel(newCapParcel);
			logDebug("Copied parcel " + Parcels[zz].getParcelNumber() + " from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
			copied++;
		}
	}
	else {
		logMessage("**ERROR: Failed to get parcels: " + capParcelResult.getErrorMessage());
		return false;
	}
	return copied;
}
 
//@ts-check

/**
 * Copies all scheduled inspections from record pFromCapId to record pToCapId
 * @param {CapIDModel} pFromCapId ID of record from which to copy.
 * @param {CapIDModel} pToCapId ID of record to which to copy. If null, the function uses the current record.
 * @returns {boolean | number} FALSE in some error conditions, otherwise, count of Insp copied
 * ---
 * **Notes**
 * Includes inspections that have a pending-type result, but copies status over as Scheduled. 
 * You do not need to copy the inspection type to the target record. 
 * The function can copy duplicate inspections to the target record.
 * capId is the record ID object for the current record.
 * getApplication( ), getParent( ), createChild(), createCap() functions each return a record ID object.
 */

function copySchedInspections(pFromCapId, pToCapId) {
	//Copies all scheduled inspections from pFromCapId to pToCapId
	//If pToCapId is null, copies to current CAP
	//07SSP-00037/SP5017
	//
    var vToCapId = pToCapId;
	if (typeof vToCapId == "undefined" || vToCapId == null) {
        vToCapId = (typeof capId === typeof undefined || capId == null) ? "" : capId;
    }
    try {
        aa.cap.getCap(pFromCapId);
        aa.cap.getCap(vToCapId);
    } catch (err) {
        logDebug("'copySchedInspections' requires Source CapID param and Target CapID param OR global 'capId' be defined");
        return false;
    }

	var inspResultObj = aa.inspection.getInspections(pFromCapId);

	if (!inspResultObj.getSuccess()) {
		logMessage("**ERROR: Failed to get inspections: " + inspResultObj.getErrorMessage());
		return false;
	}

	var inspCount = 0;
	var schedRes;
	var inspector;
	var inspDate;
	var inspTime;
	var inspType;
	var inspComment;

	var inspList = inspResultObj.getOutput();
	for (var xx in inspList) {
		if ("Insp Scheduled" == inspList[xx].getDocumentDescription()) {
			inspector = inspList[xx].getInspector();
			inspDate = inspList[xx].getScheduledDate();
			inspTime = inspList[xx].getScheduledTime();
			inspType = inspList[xx].getInspectionType();
			inspComment = inspList[xx].getInspectionComments();
			schedRes = aa.inspection.scheduleInspection(vToCapId, inspector, inspDate, inspTime, inspType, inspComment);
			if (schedRes.getSuccess()) {
				logDebug("Copied scheduled inspection from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
				inspCount++;
			} else {
				logDebug("**ERROR: copying scheduling inspection (" + inspType + "): " + schedRes.getErrorMessage());
            }
		}
	}
	return inspCount;
}
 
//@ts-check

/**
 * Returns the number of active tasks in the workflow whose process name is processName.
 * @param {string} processName Process name of workflow
 * @returns {boolean | number} FALSE when some errors are encountered, otherwise, count of Active WF Tasks
 */

function countActiveTasks(processName) {

    try {
        aa.cap.getCap(capId);
    } catch (err) {
        logDebug("'countActiveTasks' requires global 'capId' be defined.");
        return false;
    }

    if(typeof processName == "undefined"){
        processName = "";
    }

	// counts the number of active tasks on a given process
	var numOpen = 0;

	var countResult = aa.workflow.getTaskCount(capId, processName, "Y");
	if (countResult.getSuccess()) {
		numOpen = countResult.getOutput().intValue();
    } else {
		logMessage("**ERROR: Failed to get task count: " + countResult.getErrorMessage());
		return false;
	}

	return numOpen;
}
 
function countIdenticalInspections()
	{
	var cntResult = 0;
	var oldDateStr = "01/01/1900";  // inspections older than this date count as 1
	if (arguments.length > 0) oldDateStr = arguments[0]; // Option to override olddate in the parameter
	oldDate = new Date("oldDateStr");
	
	var oldInspectionFound = false;
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();
		for (xx in inspList)
			{
			if (String(inspType).equals(inspList[xx].getInspectionType()) && String(inspResult).equals(inspList[xx].getInspectionStatus()))
				{
				if (convertDate(inspList[xx].getInspectionStatusDate()) < oldDate)
					{
					if (!oldInspectionFound) { cntResult++ ; oldInspectionFound = true }
					}
				else
					{
					cntResult++
					}
				}
			}
		}	
	logDebug("countIdenticalInspections(" + inspType + "," + inspResult + ", " + oldDateStr +  ") Returns " + cntResult);
	return cntResult;
	}	
	 
function createCap(pCapType, pAppName) 
	{
	// creates a new application and returns the capID object
	// 07SSP-00037/SP5017
	//
	var aCapType = pCapType.split("/");
	if (aCapType.length != 4)
		{
		logDebug("**ERROR in createCap.  The following Application Type String is incorrectly formatted: " + pCapType);
		return ("INVALID PARAMETER");
		}
	
	var appCreateResult = aa.cap.createApp(aCapType[0],aCapType[1],aCapType[2],aCapType[3],pAppName);
	logDebug("Creating cap " + pCapType);
	
	if (!appCreateResult.getSuccess())
		{
		logDebug( "**ERROR: creating CAP " + appCreateResult.getErrorMessage());
		return false;
		}

	var newId = appCreateResult.getOutput();
	logDebug("CAP of type " + pCapType + " created successfully ");
	var newObj = aa.cap.getCap(newId).getOutput();	//Cap object
	
	return newId;
	}

 
function createCapComment(vComment) //optional CapId, optional vDispOnInsp
{
	var vCapId = capId;
	var vDispOnInsp = "N";
	if (arguments.length >= 2 && typeof(arguments[1]) != "undefined" && arguments[1] != null && arguments[1] != "") {
		vCapId = arguments[1];
	}
	if (arguments.length >= 3 && typeof(arguments[2]) != "undefined" && arguments[2] != null && arguments[2] != "") {
		vDispOnInsp = arguments[2];
	}
	var comDate = aa.date.getCurrentDate();
	var capCommentScriptModel = aa.cap.createCapCommentScriptModel();
	capCommentScriptModel.setCapIDModel(vCapId);
	capCommentScriptModel.setCommentType("APP LEVEL COMMENT");
	capCommentScriptModel.setSynopsis("");
	capCommentScriptModel.setText(vComment);
	capCommentScriptModel.setAuditUser(currentUserID);
	capCommentScriptModel.setAuditStatus("A");
	capCommentScriptModel.setAuditDate(comDate);
	var capCommentModel = capCommentScriptModel.getCapCommentModel();
	capCommentModel.setDisplayOnInsp(vDispOnInsp);
	aa.cap.createCapComment(capCommentModel);
	logDebug("Comment Added");
} 
function createChild(grp,typ,stype,cat,desc) // optional parent capId
{
	//
	// creates the new application and returns the capID object
	//

	var itemCap = capId
	if (arguments.length > 5) itemCap = arguments[5]; // use cap ID specified in args
	
	var appCreateResult = aa.cap.createApp(grp,typ,stype,cat,desc);
	logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
	if (appCreateResult.getSuccess())
		{
		var newId = appCreateResult.getOutput();
		logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");
		
		// create Detail Record
		capModel = aa.cap.newCapScriptModel().getOutput();
		capDetailModel = capModel.getCapModel().getCapDetailModel();
		capDetailModel.setCapID(newId);
		aa.cap.createCapDetail(capDetailModel);

		var newObj = aa.cap.getCap(newId).getOutput();	//Cap object
		var result = aa.cap.createAppHierarchy(itemCap, newId); 
		if (result.getSuccess())
			logDebug("Child application successfully linked");
		else
			logDebug("Could not link applications");

		// Copy Parcels

		var capParcelResult = aa.parcel.getParcelandAttribute(itemCap,null);
		if (capParcelResult.getSuccess())
			{
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels)
				{
				logDebug("adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
				newCapParcel.setParcelModel(Parcels[zz]);
				newCapParcel.setCapIDModel(newId);
				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
				aa.parcel.createCapParcel(newCapParcel);
				}
			}

		// Copy Contacts
		capContactResult = aa.people.getCapContactByCapID(itemCap);
		if (capContactResult.getSuccess())
			{
			Contacts = capContactResult.getOutput();
			for (yy in Contacts)
				{
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(newId);
				aa.people.createCapContact(newContact);
				logDebug("added contact");
				}
			}	

		// Copy Addresses
		capAddressResult = aa.address.getAddressByCapId(itemCap);
		if (capAddressResult.getSuccess())
			{
			Address = capAddressResult.getOutput();
			for (yy in Address)
				{
				newAddress = Address[yy];
				newAddress.setCapID(newId);
				aa.address.createAddress(newAddress);
				logDebug("added address");
				}
			}
		
		return newId;
		}
	else
		{
		logDebug( "**ERROR: adding child App: " + appCreateResult.getErrorMessage());
		}
}

 
 function createLicense(initStatus,copyASI) {

	//initStatus - record status to set the license to initially

	//copyASI - copy ASI from Application to License? (true/false)



	var newLic = null;

	var newLicId = null;

	var newLicIdString = null;

	var newLicenseType = appTypeArray[2];



	//create the license record

	newLicId = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], "License",null);



	//field repurposed to represent the current term effective date

	editScheduledDate(sysDateMMDDYYYY,newLicId);

	//field repurposed to represent the original effective date

	editFirstIssuedDate(sysDateMMDDYYYY,newLicId);



	newLicIdString = newLicId.getCustomID();

	updateAppStatus(initStatus,"",newLicId);



	//copy all ASI

	if(copyASI) {

		copyAppSpecific(newLicId);

	}



	return newLicId;	

}



 
 function createParent(grp,typ,stype,cat,desc) 

//

// creates the new application and returns the capID object

// updated by JHS 10/23/12 to use copyContacts that handles addresses

//

	{

	var appCreateResult = aa.cap.createApp(grp,typ,stype,cat,desc);

	logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);

	if (appCreateResult.getSuccess())

		{

		var newId = appCreateResult.getOutput();

		logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");

		

		// create Detail Record

		capModel = aa.cap.newCapScriptModel().getOutput();

		capDetailModel = capModel.getCapModel().getCapDetailModel();

		capDetailModel.setCapID(newId);

		aa.cap.createCapDetail(capDetailModel);



		var newObj = aa.cap.getCap(newId).getOutput();	//Cap object

		var result = aa.cap.createAppHierarchy(newId, capId); 

		if (result.getSuccess())

			logDebug("Parent application successfully linked");

		else

			logDebug("Could not link applications");



		// Copy Parcels



		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);

		if (capParcelResult.getSuccess())

			{

			var Parcels = capParcelResult.getOutput().toArray();

			for (zz in Parcels)

				{

				logDebug("adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber());

				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();

				newCapParcel.setParcelModel(Parcels[zz]);

				newCapParcel.setCapIDModel(newId);

				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());

				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());

				aa.parcel.createCapParcel(newCapParcel);

				}

			}



		// Copy Contacts

		

		copyContacts(capId,newId);

		

		// Copy Addresses

		capAddressResult = aa.address.getAddressByCapId(capId);

		if (capAddressResult.getSuccess())

			{

			Address = capAddressResult.getOutput();

			for (yy in Address)

				{

				newAddress = Address[yy];

				newAddress.setCapID(newId);

				aa.address.createAddress(newAddress);

				logDebug("added address");

				}

			}

		

		return newId;

		}

	else

		{

		logDebug( "**ERROR: adding parent App: " + appCreateResult.getErrorMessage());

		}

	}







 

function createPendingInspection(iGroup,iType) // optional Cap ID
	{
	var itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

	var itmResult = aa.inspection.getInspectionType(iGroup,iType)
	
	if (!itmResult.getSuccess())
		{
		logDebug("**WARNING error retrieving inspection types: " + itmResult.getErrorMessage);
		return false;
		}

	var itmArray = itmResult.getOutput();
	
	if (!itmArray)
		{
		logDebug("**WARNING could not find any matches for inspection group " + iGroup + " and type " + iType);
		return false;
		}

	var itmSeq = null;
	
	for (thisItm in itmArray)
		{
		var it = itmArray[thisItm];
		if (it.getGroupCode().toUpperCase().equals(iGroup.toUpperCase()) && it.getType().toUpperCase().equals(iType.toUpperCase()))
			itmSeq = it.getSequenceNumber();
		}

	if (!itmSeq)
		{
		logDebug("**WARNING could not find an exact match for inspection group " + iGroup + " and type " + iType);
		return false;
		}
		
	var inspModel = aa.inspection.getInspectionScriptModel().getOutput().getInspection();
	
	var activityModel = inspModel.getActivity();
	activityModel.setInspSequenceNumber(itmSeq);
	activityModel.setCapIDModel(itemCap);

	pendingResult = aa.inspection.pendingInspection(inspModel)

	if (pendingResult.getSuccess())
		{
		logDebug("Successfully created pending inspection group " + iGroup + " and type " + iType);
		return true;
		}
	else
		{
		logDebug("**WARNING could not create pending inspection group " + iGroup + " and type " + iType + " Message: " + pendingResult.getErrorMessage());
		return false;
		}
	
}
	
	

 

function createPendingInspFromReqd() // optional Cap ID
	{
	var itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args


	var inspListResult = aa.inspection.getInspectionListForSchedule(itemCap.getID1(),itemCap.getID2(),itemCap.getID3());
	
	if (!inspListResult.getSuccess())
		{
		logDebug("**WARNING error retrieving inspections: " + inspListResult.getErrorMessage());
		return false;
		}
		
	var inspList = inspListResult.getOutput();
	
	for (var i in inspList)
		{
		var thisInsp = inspList[i];
		if (thisInsp.getRequiredInspection().equals("Y"))
			{
			createPendingInspection(thisInsp.getGroupCode(),thisInsp.getType(),itemCap);
			}
		}
	}
 

function createPublicUserFromContact()   // optional: Contact Type, default Applicant
{
    var contactType = "Applicant";
    var contact;
    var refContactNum;
    var userModel;
    if (arguments.length > 0) contactType = arguments[0]; // use contact type specified

    var capContactResult = aa.people.getCapContactByCapID(capId);
    if (capContactResult.getSuccess()) {
		var Contacts = capContactResult.getOutput();
        for (yy in Contacts) {
            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				contact = Contacts[yy];
        }
    }
    
    if (!contact)
    { logDebug("Couldn't create public user for " + contactType + ", no such contact"); return false; }

    if (!contact.getEmail())
    { logDebug("Couldn't create public user for " + contactType + ", no email address"); return false; }

	if (contact.getPeople().getContactTypeFlag().equals("organization"))
	{ logDebug("Couldn't create public user for " + contactType + ", the contact is an organization"); return false; }
	
    // get the reference contact ID.   We will use to connect to the new public user
    refContactNum = contact.getCapContactModel().getRefContactNumber();

    // check to see if public user exists already based on email address
    var getUserResult = aa.publicUser.getPublicUserByEmail(contact.getEmail())
    if (getUserResult.getSuccess() && getUserResult.getOutput()) {
        userModel = getUserResult.getOutput();
        logDebug("CreatePublicUserFromContact: Found an existing public user: " + userModel.getUserID());
	}

    if (!userModel) // create one
    	{
	    logDebug("CreatePublicUserFromContact: creating new user based on email address: " + contact.getEmail()); 
	    var publicUser = aa.publicUser.getPublicUserModel();
	    publicUser.setFirstName(contact.getFirstName());
	    publicUser.setLastName(contact.getLastName());
	    publicUser.setEmail(contact.getEmail());
	    publicUser.setUserID(contact.getEmail());
	    publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
	    publicUser.setAuditID("PublicUser");
	    publicUser.setAuditStatus("A");
	    publicUser.setCellPhone(contact.getCapContactModel().getPeople().getPhone2());

	    var result = aa.publicUser.createPublicUser(publicUser);
	    if (result.getSuccess()) {

		logDebug("Created public user " + contact.getEmail() + "  sucessfully.");
		var userSeqNum = result.getOutput();
		var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

		// create for agency
		aa.publicUser.createPublicUserForAgency(userModel);

		// activate for agency
		var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
			userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(servProvCode,userSeqNum,"ADMIN");

			// reset password
			var resetPasswordResult = aa.publicUser.resetPassword(contact.getEmail());
			if (resetPasswordResult.getSuccess()) {
				var resetPassword = resetPasswordResult.getOutput();
				userModel.setPassword(resetPassword);
				logDebug("Reset password for " + contact.getEmail() + "  sucessfully.");
			} else {
				logDebug("**ERROR: Reset password for  " + contact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
			}

		// send Activate email
		aa.publicUser.sendActivateEmail(userModel, true, true);

		// send another email
		aa.publicUser.sendPasswordEmail(userModel);
	    }
    	else {
    	    logDebug("**Warning creating public user " + contact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
    	}
    }

//  Now that we have a public user let's connect to the reference contact		
	
if (refContactNum)
	{
	logDebug("CreatePublicUserFromContact: Linking this public user with reference contact : " + refContactNum);
	aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refContactNum);
	}
	

return userModel; // send back the new or existing public user
}
 
function createRecord(grp,typ,stype,cat,desc) 
//
// creates the new application and returns the capID object
//
	{
	var appCreateResult = aa.cap.createApp(grp,typ,stype,cat,desc);
	logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
	if (appCreateResult.getSuccess())
		{
		var newId = appCreateResult.getOutput();
		logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");
		
		// create Detail Record
		capModel = aa.cap.newCapScriptModel().getOutput();
		capDetailModel = capModel.getCapModel().getCapDetailModel();
		capDetailModel.setCapID(newId);
		aa.cap.createCapDetail(capDetailModel);

		var newObj = aa.cap.getCap(newId).getOutput();	//Cap object

		// Copy Parcels

		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess())
			{
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels)
				{
				logDebug("adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
				newCapParcel.setParcelModel(Parcels[zz]);
				newCapParcel.setCapIDModel(newId);
				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
				aa.parcel.createCapParcel(newCapParcel);
				}
			}

		// Copy Contacts
		capContactResult = aa.people.getCapContactByCapID(capId);
		if (capContactResult.getSuccess())
			{
			Contacts = capContactResult.getOutput();
			for (yy in Contacts)
				{
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(newId);
				aa.people.createCapContact(newContact);
				logDebug("added contact");
				}
			}	

		// Copy Addresses
		capAddressResult = aa.address.getAddressByCapId(capId);
		if (capAddressResult.getSuccess())
			{
			Address = capAddressResult.getOutput();
			for (yy in Address)
				{
				newAddress = Address[yy];
				newAddress.setCapID(newId);
				aa.address.createAddress(newAddress);
				logDebug("added address");
				}
			}
		
		return newId;
		}
	else
		{
		logDebug( "**ERROR: adding parent App: " + appCreateResult.getErrorMessage());
		}
	}

 
function createRefContactAddressFromAddress(rSeqNbr,nAddrModel,addrType) {
						
	if (nAddrModel && rSeqNbr) {
		var contactAddressScriptModel = aa.address.createContactAddressModel().getOutput();
		contactAddressScriptModel.setServiceProviderCode(servProvCode);
		contactAddressScriptModel.setAuditStatus("A");
		contactAddressScriptModel.setAuditID(currentUserID);
		var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
		contactAddressModel.setEntityID(parseInt(rSeqNbr));
		contactAddressModel.setEntityType("CONTACT");
		contactAddressModel.setAddressType(addrType);
		contactAddressModel.setAddressLine1(nAddrModel.getAddressLine1());
	   	contactAddressModel.setAddressLine2(nAddrModel.getAddressLine2());
	   	contactAddressModel.setAddressLine3(nAddrModel.getCounty());
	   	contactAddressModel.setHouseNumberStart(nAddrModel.getHouseNumberStart());
	   	contactAddressModel.setHouseNumberEnd(nAddrModel.getHouseNumberEnd());
	   	// contactAddressModel.setStreetDirection("ZF");
	   	// contactAddressModel.setStreetPrefix("Pre");
	   	contactAddressModel.setStreetName(nAddrModel.getStreetName());
	   	// contactAddressModel.setStreetSuffix("Suf");
	   	// contactAddressModel.setStreetSuffixDirection("SufD");
	   	contactAddressModel.setCity(nAddrModel.getCity());
	   	contactAddressModel.setState(nAddrModel.getState());
	   	contactAddressModel.setZip(nAddrModel.getZip());
	   	//contactAddressModel.setCountry(nAddrModel.getCountry());
	   	// contactAddressModel.setFax("0982-4343-343");
	   	//var startDate = aa.util.parseDate("09/12/2012");
	  	//var endDate =  conversionDate("09/12/2013");
	   	//contactAddressModel.setEffectiveDate(startDate);

		var contactAddressModel = contactAddressScriptModel.getContactAddressModel();
		var returnModel = aa.address.createContactAddress(contactAddressModel);

		if(returnModel.getSuccess()) {
		 	logDebug("Create Contact Address Successfully: " + returnModel.getOutput().getAddressID());
		 	return returnModel.getOutput();
	  	}
	  	else {
			logDebug("Create Contact Address Failed:" + returnModel.getErrorMessage());
			return false;
	  	}
	} else {
		logDebug("Could not create reference contact address no address model or reference contact sequence number");
		return false;
	}						
} 

function createRefContactsFromCapContactsAndLink(pCapId, contactTypeArray, ignoreAttributeArray, replaceCapContact, overwriteRefContact, refContactExists)
	{

	// contactTypeArray is either null (all), or an array or contact types to process
	//
	// ignoreAttributeArray is either null (none), or an array of attributes to ignore when creating a REF contact
	//
	// replaceCapContact not implemented yet
	//
	// overwriteRefContact -- if true, will refresh linked ref contact with CAP contact data
	//
	// refContactExists is a function for REF contact comparisons.
	//
	// Version 2.0 Update:   This function will now check for the presence of a standard choice "REF_CONTACT_CREATION_RULES".
	// This setting will determine if the reference contact will be created, as well as the contact type that the reference contact will
	// be created with.  If this setting is configured, the contactTypeArray parameter will be ignored.   The "Default" in this standard
	// choice determines the default action of all contact types.   Other types can be configured separately.
	// Each contact type can be set to "I" (create ref as individual), "O" (create ref as organization),
	// "F" (follow the indiv/org flag on the cap contact), "D" (Do not create a ref contact), and "U" (create ref using transaction contact type).

	var standardChoiceForBusinessRules = "REF_CONTACT_CREATION_RULES";


	var ingoreArray = new Array();
	if (arguments.length > 1) ignoreArray = arguments[1];

	var defaultContactFlag = lookup(standardChoiceForBusinessRules,"Default");

	var c = aa.people.getCapContactByCapID(pCapId).getOutput()
	var cCopy = aa.people.getCapContactByCapID(pCapId).getOutput()  // must have two working datasets

	for (var i in c)
	   {
	   var ruleForRefContactType = "U"; // default behavior is create the ref contact using transaction contact type
	   var con = c[i];

	   var p = con.getPeople();

	   var contactFlagForType = lookup(standardChoiceForBusinessRules,p.getContactType());

	   if (!defaultContactFlag && !contactFlagForType) // standard choice not used for rules, check the array passed
	   	{
	   	if (contactTypeArray && !exists(p.getContactType(),contactTypeArray))
			continue;  // not in the contact type list.  Move along.
		}

	   if (!contactFlagForType && defaultContactFlag) // explicit contact type not used, use the default
	   	{
	   	ruleForRefContactType = defaultContactFlag;
	   	}

	   if (contactFlagForType) // explicit contact type is indicated
	   	{
	   	ruleForRefContactType = contactFlagForType;
	   	}

	   if (ruleForRefContactType.equals("D"))
	   	continue;

	   var refContactType = "";

	   switch(ruleForRefContactType)
	   	{
		   case "U":
		     refContactType = p.getContactType();
		     break;
		   case "I":
		     refContactType = "Individual";
		     break;
		   case "O":
		     refContactType = "Organization";
		     break;
		   case "F":
		     if (p.getContactTypeFlag() && p.getContactTypeFlag().equals("organization"))
		     	refContactType = "Organization";
		     else
		     	refContactType = "Individual";
		     break;
		}

	   var refContactNum = con.getCapContactModel().getRefContactNumber();

	   if (refContactNum)  // This is a reference contact.   Let's refresh or overwrite as requested in parms.
	   	{
	   	if (overwriteRefContact)
	   		{
	   		p.setContactSeqNumber(refContactNum);  // set the ref seq# to refresh
	   		p.setContactType(refContactType);

	   						var a = p.getAttributes();

							if (a)
								{
								var ai = a.iterator();
								while (ai.hasNext())
									{
									var xx = ai.next();
									xx.setContactNo(refContactNum);
									}
					}

	   		var r = aa.people.editPeopleWithAttribute(p,p.getAttributes());

			if (!r.getSuccess())
				logDebug("WARNING: couldn't refresh reference people : " + r.getErrorMessage());
			else
				logDebug("Successfully refreshed ref contact #" + refContactNum + " with CAP contact data");
			}

	   	if (replaceCapContact)
	   		{
				// To Be Implemented later.   Is there a use case?
			}

	   	}
	   	else  // user entered the contact freehand.   Let's create or link to ref contact.
	   	{
			var ccmSeq = p.getContactSeqNumber();

			var existingContact = refContactExists(p);  // Call the custom function to see if the REF contact exists

			var p = cCopy[i].getPeople();  // get a fresh version, had to mangle the first for the search

			if (existingContact)  // we found a match with our custom function.  Use this one.
				{
					refPeopleId = existingContact;
				}
			else  // did not find a match, let's create one
				{

				var a = p.getAttributes();

				if (a)
					{
					//
					// Clear unwanted attributes
					var ai = a.iterator();
					while (ai.hasNext())
						{
						var xx = ai.next();
						if (ignoreAttributeArray && exists(xx.getAttributeName().toUpperCase(),ignoreAttributeArray))
							ai.remove();
						}
					}

				p.setContactType(refContactType);
				var r = aa.people.createPeopleWithAttribute(p,a);

				if (!r.getSuccess())
					{logDebug("WARNING: couldn't create reference people : " + r.getErrorMessage()); continue; }

				//
				// createPeople is nice and updates the sequence number to the ref seq
				//

				var p = cCopy[i].getPeople();
				var refPeopleId = p.getContactSeqNumber();

				logDebug("Successfully created reference contact #" + refPeopleId);

				// Need to link to an existing public user.

			    var getUserResult = aa.publicUser.getPublicUserByEmail(con.getEmail())
			    if (getUserResult.getSuccess() && getUserResult.getOutput()) {
			        var userModel = getUserResult.getOutput();
			        logDebug("createRefContactsFromCapContactsAndLink: Found an existing public user: " + userModel.getUserID());

					if (refPeopleId)	{
						logDebug("createRefContactsFromCapContactsAndLink: Linking this public user with new reference contact : " + refPeopleId);
						aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refPeopleId);
						}
					}
				}

			//
			// now that we have the reference Id, we can link back to reference
			//

		    var ccm = aa.people.getCapContactByPK(pCapId,ccmSeq).getOutput().getCapContactModel();

		    ccm.setRefContactNumber(refPeopleId);
		    r = aa.people.editCapContact(ccm);

		    if (!r.getSuccess())
				{ logDebug("WARNING: error updating cap contact model : " + r.getErrorMessage()); }
			else
				{ logDebug("Successfully linked ref contact " + refPeopleId + " to cap contact " + ccmSeq);}


	    }  // end if user hand entered contact
	}  // end for each CAP contact
} 
 
//@ts-check
/**
 * Creates a new reference Licensed Professional from the Contact on the current record whose contact type is pContactType.
 * The Licensed Professional has the state license # of rlpId and license type of rlpType. 
 * If a reference Licensed Professional with state license # rlpId already exists, it UPDATES with data from the Contact.
 * Contact's State field must be populated for the Licensed Prof to be created.
 * The function does not copy the Contact's Middle Name and Address Line 3 to the Licensed Prof.
 * If available, the following app specific info fields copy to the Licensed Prof (field labels must match exactly):
 *  - Insurance Co
 *  - Insurance Amount
 *  - Insurance Exp Date
 *  - Policy #
 *  - Business License #
 *  - Business License Exp Date
 * @param {string} rlpId Reference LP State Lic Number
 * @param {string} rlpType Reference LP Type
 * @param {string} pContactType Contact Type to match on the Record
 * @param {string} [addrTypeToCopy] (unnamed/optional) If populated, then this Address Type used to match Contact Address
 * @returns {boolean} TRUE if add/update was successful. FALSE if add/update was not successful.
 */
function createRefLicProf(rlpId, rlpType, pContactType) {
	// 
	//Creates/updates a reference licensed prof from a Contact
	//06SSP-00074, modified for 06SSP-00238


	if (typeof rlpId == "undefined" || !rlpId) {
		logDebug("'createRefLicProf' - Requires parameter 'rlpId' ");
		return false;
	}
	if (typeof rlpType == "undefined" || !rlpType) {
		logDebug("'createRefLicProf' - Requires parameter 'rlpType' ");
		return false;
	}
	if (typeof capId == "undefined" || !capId) {
		logDebug("'createRefLicProf' - Requires global var 'capId' ");
		return false;
	}
	var l_SysDate;
	var l_CurrentUserID;
	if (typeof currentUserID == "undefined" || !currentUserID) {
		l_CurrentUserID = aa.env.getValue("CurrentUserID");
	} else {
		l_CurrentUserID = currentUserID;
	}
	if (!l_CurrentUserID) {
		logDebug("'createRefLicProf' - Requires either env var 'CurrentUserID' or global var 'currentUserID' ");
		return false;
	}
	if (typeof sysDate == "undefined" || !sysDate) {
		l_SysDate = aa.date.getCurrentDate();
	} else {
		l_SysDate = sysDate;
	}
	if (typeof AInfo == "undefined") {
		logDebug("'createRefLicProf' - global var 'AInfo' is undefined. Will set to new Array");
		AInfo = [];
	}


	var addrTypeToCopy = null;
	if (arguments.length == 4) {
		addrTypeToCopy = arguments[3]; // optional 4th parameter, address type of multi-address to use
	}

	var updating = false;

	var conArr = getPeople(capId);

	if (!conArr.length) {
		logDebug("**WARNING: No contact available");
		return false;
	}

	var newLic = getRefLicenseProf(rlpId);

	if (newLic) {
		updating = true;
		logDebug("Updating existing Ref Lic Prof : " + rlpId);
	} else {
		var newLic = aa.licenseScript.createLicenseScriptModel();
	}

	//get contact record
	if (typeof pContactType == "undefined" || pContactType == null) {
		var cont = conArr[0]; //if no contact type specified, use first contact
	} else {
		var contFound = false;
		for (var yy in conArr) {

			// if (pContactType.equals(conArr[yy].getCapContactModel().getPeople().getContactType())) {
			if (pContactType.toUpperCase() == (conArr[yy].getCapContactModel().getPeople().getContactType()).toUpperCase()) {
				cont = conArr[yy];
				contFound = true;
				break;
			}
		}
		if (!contFound) {
			logDebug("**WARNING: No Contact found of type: " + pContactType);
			return false;
		}
	}

	var peop = cont.getPeople();
	var addr = null;

	if (addrTypeToCopy) {
		var pmcal = peop.getContactAddressList();
		if (pmcal) {
			pmcal = pmcal.toArray();
			for (var thisPm in pmcal) {
				if (addrTypeToCopy.equals(pmcal[thisPm].getAddressType())) {
					addr = pmcal[thisPm];
				}
			}
		}
	}

	if (!addr) {
		//  only used on non-multiple addresses or if we can't find the right multi-address
		// addr = peop.getCompactAddres(); // a missing 's' in 'Address'? Has this never ever been tried?
		addr = peop.getCompactAddress();
	}

	newLic.setContactFirstName(cont.getFirstName());
	//newLic.setContactMiddleName(cont.getMiddleName());  //method not available
	newLic.setContactLastName(cont.getLastName());
	newLic.setBusinessName(peop.getBusinessName());
	newLic.setAddress1(addr.getAddressLine1());
	newLic.setAddress2(addr.getAddressLine2());
	newLic.setAddress3(addr.getAddressLine3());
	newLic.setCity(addr.getCity());
	newLic.setState(addr.getState());
	newLic.setZip(addr.getZip());
	newLic.setPhone1(peop.getPhone1());
	newLic.setPhone2(peop.getPhone2());
	newLic.setEMailAddress(peop.getEmail());
	newLic.setFax(peop.getFax());

	newLic.setAgencyCode(aa.getServiceProviderCode());
	newLic.setAuditDate(l_SysDate);
	newLic.setAuditID(l_CurrentUserID);
	newLic.setAuditStatus("A");

	if (AInfo["Insurance Co"]) {
		newLic.setInsuranceCo(AInfo["Insurance Co"]);
	}
	if (AInfo["Insurance Amount"]) {
		newLic.setInsuranceAmount(parseFloat(AInfo["Insurance Amount"]));
	}
	if (AInfo["Insurance Exp Date"]) {
		newLic.setInsuranceExpDate(aa.date.parseDate(AInfo["Insurance Exp Date"]));
	}
	if (AInfo["Policy #"]) {
		newLic.setPolicy(AInfo["Policy #"]);
	}
	if (AInfo["Business License #"]) {
		newLic.setBusinessLicense(AInfo["Business License #"]);
	}
	if (AInfo["Business License Exp Date"]) {
		newLic.setBusinessLicExpDate(aa.date.parseDate(AInfo["Business License Exp Date"]));
	}

	newLic.setLicenseType(rlpType);
	newLic.setLicState(addr.getState());
	newLic.setStateLicense(rlpId);

	var myResult;
	if (updating) {
		myResult = aa.licenseScript.editRefLicenseProf(newLic);
	} else {
		myResult = aa.licenseScript.createRefLicenseProf(newLic);
	}

	if (myResult.getSuccess()) {
		logDebug("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
		logMessage("Successfully added/updated License No. " + rlpId + ", Type: " + rlpType);
		return true;
	} else {
		logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
		logMessage("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage());
		return false;
	}
}
 

function createRefLicProfFromLicProf()
	{
	//
	// Get the lic prof from the app
	//
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{ capLicenseArr = capLicenseResult.getOutput();  }
	else
		{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

	if (!capLicenseArr.length)
		{ logDebug("WARNING: no license professional available on the application:"); return false; }

	licProfScriptModel = capLicenseArr[0];
	rlpId = licProfScriptModel.getLicenseNbr();
	//
	// Now see if a reference version exists
	//
	var updating = false;

	var newLic = getRefLicenseProf(rlpId)

	if (newLic)
		{
		updating = true;
		logDebug("Updating existing Ref Lic Prof : " + rlpId);
		}
	else
		var newLic = aa.licenseScript.createLicenseScriptModel();

	//
	// Now add / update the ref lic prof
	//
	newLic.setStateLicense(rlpId);
	newLic.setAddress1(licProfScriptModel.getAddress1());
	newLic.setAddress2(licProfScriptModel.getAddress2());
	newLic.setAddress3(licProfScriptModel.getAddress3());
	newLic.setAgencyCode(licProfScriptModel.getAgencyCode());
	newLic.setAuditDate(licProfScriptModel.getAuditDate());
	newLic.setAuditID(licProfScriptModel.getAuditID());
	newLic.setAuditStatus(licProfScriptModel.getAuditStatus());
	newLic.setBusinessLicense(licProfScriptModel.getBusinessLicense());
	newLic.setBusinessName(licProfScriptModel.getBusinessName());
	newLic.setCity(licProfScriptModel.getCity());
	newLic.setCityCode(licProfScriptModel.getCityCode());
	newLic.setContactFirstName(licProfScriptModel.getContactFirstName());
	newLic.setContactLastName(licProfScriptModel.getContactLastName());
	newLic.setContactMiddleName(licProfScriptModel.getContactMiddleName());
	newLic.setContryCode(licProfScriptModel.getCountryCode());
	newLic.setCountry(licProfScriptModel.getCountry());
	newLic.setEinSs(licProfScriptModel.getEinSs());
	newLic.setEMailAddress(licProfScriptModel.getEmail());
	newLic.setFax(licProfScriptModel.getFax());
	newLic.setLicenseType(licProfScriptModel.getLicenseType());
	newLic.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
	newLic.setPhone1(licProfScriptModel.getPhone1());
	newLic.setPhone2(licProfScriptModel.getPhone2());
	newLic.setSelfIns(licProfScriptModel.getSelfIns());
	newLic.setState(licProfScriptModel.getState());
	newLic.setLicState(licProfScriptModel.getState());
	newLic.setSuffixName(licProfScriptModel.getSuffixName());
	newLic.setWcExempt(licProfScriptModel.getWorkCompExempt());
	newLic.setZip(licProfScriptModel.getZip());

	if (updating)
		myResult = aa.licenseScript.editRefLicenseProf(newLic);
	else
		myResult = aa.licenseScript.createRefLicenseProf(newLic);

	if (myResult.getSuccess())
		{
		logDebug("Successfully added/updated License ID : " + rlpId)
		return rlpId;
		}
	else
		{ logDebug("**ERROR: can't create ref lic prof: " + myResult.getErrorMessage()); }
	}

 
 function createRefLP4Lookup(newLicIdString,newLicenseType,conType,conAddrType) {

	//All parameters are required

	//newLicIdString - license altID

	//newLicenseType - Ref LP license type

	//conType - Contact type to use for the reference LP

	//conAddrType - Contact address type to use for the reference LP



	createRefLicProf(newLicIdString,newLicenseType,conType,conAddrType);



	newLic = getRefLicenseProf(newLicIdString);

	if (newLic) {

		//manually set any values on the reference LP

		newLic.setAuditStatus("A");

		aa.licenseScript.editRefLicenseProf(newLic);

		logDebug("Reference LP successfully created");

	} else {

		logDebug("Reference LP not created");

	}



}
 
function dateAdd(td, amt)
// perform date arithmetic on a string
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{

	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) dDate = new Date(aa.util.now());
	else
		dDate = convertDate(td);

	var i = 0;
	if (useWorking)
		if (!aa.calendar.getNextWorkDay) {
			logDebug("getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
			while (i < Math.abs(amt)) {
				dDate.setDate(dDate.getDate() + parseInt((amt > 0 ? 1 : -1), 10));
				if (dDate.getDay() > 0 && dDate.getDay() < 6)
					i++
			}
		} else {
			while (i < Math.abs(amt)) {
				if (amt > 0) {
					dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth() + 1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
					i++;
				} else {
					dDate = new Date(aa.calendar.getPreviousWorkDay(aa.date.parseDate(dDate.getMonth() + 1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
					i++;

				}
			}
		}
	else
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));

	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
} 
function dateAddMonths(pDate, pMonths)
	{
	// Adds specified # of months (pMonths) to pDate and returns new date as string in format MM/DD/YYYY
	// If pDate is null, uses current date
	// pMonths can be positive (to add) or negative (to subtract) integer
	// If pDate is on the last day of the month, the new date will also be end of month.
	// If pDate is not the last day of the month, the new date will have the same day of month, unless such a day doesn't exist in the month, in which case the new date will be on the last day of the month
	//
	if (!pDate) baseDate = new Date(aa.util.now());
	else
		baseDate = convertDate(pDate);

	var day = baseDate.getDate();
	baseDate.setMonth(baseDate.getMonth() + pMonths);
	if (baseDate.getDate() < day)
		{
		baseDate.setDate(1);
		baseDate.setDate(baseDate.getDate() - 1);
		}
	return ((baseDate.getMonth() + 1) + "/" + baseDate.getDate() + "/" + baseDate.getFullYear());
	}

 
	

function dateDiff(date1, date2) {

    return (convertDate(date2).getTime() - convertDate(date1).getTime()) / (1000 * 60 * 60 * 24);
}

 
//@ts-check

/**
 * Returns formatted date in YYYY-MM-DD or MM/DD/YYYY format (default).
 * 	
 * @param {string} pMonth Month of new date, as 2-digit month.
 * @param {string} pDay Day of new date, as 2-digit day.
 * @param {string} pYear Year of new date as 4-digit year.
 * @param {string} pFormat Format to produce string in.
 * @returns {string} Formatted date
 */

function dateFormatted(pMonth, pDay, pYear, pFormat) {
	var mth = "";
	var day = "";
	var ret = "";

	if (pMonth > 9) {
		mth = pMonth.toString();
	} else {
		mth = "0" + pMonth.toString();
	}
	if (pDay > 9) {
		day = pDay.toString();
	} else {
		day = "0" + pDay.toString();
	}
	if (pFormat == "YYYY-MM-DD") {
		ret = pYear.toString() + "-" + mth + "-" + day;
	} else {
		ret = "" + mth + "/" + day + "/" + pYear.toString();
	}
	return ret;
} 
function dateNextOccur (pMonth, pDay, pDate)
	//optional 4th param pOddEven:
	//'ODD' specifies that return date must be next odd year, 'EVEN' means return date is next even year.
	//allows wfDate variable to be used as pDate parameter
	{
	var vDate = new String(pDate);
	if (vDate.length==10 && vDate.indexOf("-")==4 && vDate.indexOf("-",7)==7) //is format YYYY-MM-DD
		var vBaseDate = new Date(vDate.substr(5,2)+"/"+vDate.substr(8,2)+"/"+vDate.substr(0,4));
	else
		var vBaseDate = new Date(vDate);

	var vCurrentYr = vBaseDate.getFullYear().toString();
	var vTestDate = new Date(pMonth+"/"+pDay+"/"+vCurrentYr);
	var vUseOddEven = false;
	var vOddEven;
	var vReturnDate = vTestDate;
	if (arguments.length>3) //optional 4th parameter is used
		{
		var vOddEven = arguments[3].toUpperCase(); //return odd or even year
		vUseOddEven = true;
		}
		
	if (vTestDate > vBaseDate)
		vReturnDate = vTestDate;
	else
		{	
		vTestDate.setFullYear(vTestDate.getFullYear()+1);
		vReturnDate = vTestDate;
		}
 		
	if (vUseOddEven) // use next ODD or EVEN year
		{
		if (vOddEven=="ODD" && vReturnDate.getFullYear()%2==0) //vReturnDate is EVEN year
			vReturnDate.setFullYear(vReturnDate.getFullYear()+1);

		if (vOddEven=="EVEN" && vReturnDate.getFullYear()%2)    //vReturnDate is ODD year
			vReturnDate.setFullYear(vReturnDate.getFullYear()+1);
		}

	return (vReturnDate.getMonth()+1) + "/" + vReturnDate.getDate() + "/" + vReturnDate.getFullYear();  
	}

 
 function deactivateActiveTasks(processName) {



	var workflowResult = aa.workflow.getTasks(capId);

 	if (workflowResult.getSuccess())

  	 	wfObj = workflowResult.getOutput();

  	else



  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }



	

	for (i in wfObj)

		{

   		fTask = wfObj[i];

		if (fTask.getProcessCode().equals(processName))

			if (fTask.getActiveFlag().equals("Y"))

				deactivateTask(fTask.getTaskDescription());

		}



}



 
function deactivateTask(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			var completeFlag = fTask.getCompleteFlag();

			if (useProcess) {
				aa.workflow.adjustTask(capId, stepnumber, processID, "N", completeFlag, null, null);
			} else {
				aa.workflow.adjustTask(capId, stepnumber, "N", completeFlag, null, null);
			}

			logDebug("deactivating Workflow Task: " + wfstr);
		}
	}
}
 
 function decode64(input) {

     var keyStr = "ABCDEFGHIJKLMNOP" +

               "QRSTUVWXYZabcdef" +

               "ghijklmnopqrstuv" +

               "wxyz0123456789+/" +

               "=";



     var output = "";

     var chr1, chr2, chr3 = "";

     var enc1, enc2, enc3, enc4 = "";

     var i = 0;



     // remove all characters that are not A-Z, a-z, 0-9, +, /, or =

     var base64test = /[^A-Za-z0-9\+\/\=]/g;

     if (base64test.exec(input)) {

        alert("There were invalid base64 characters in the input text.\n" +

              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +

              "Expect errors in decoding.");

     }

     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");



     do {

        enc1 = keyStr.indexOf(input.charAt(i++));

        enc2 = keyStr.indexOf(input.charAt(i++));

        enc3 = keyStr.indexOf(input.charAt(i++));

        enc4 = keyStr.indexOf(input.charAt(i++));



        chr1 = (enc1 << 2) | (enc2 >> 4);

        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

        chr3 = ((enc3 & 3) << 6) | enc4;



        output = output + String.fromCharCode(chr1);



        if (enc3 != 64) {

           output = output + String.fromCharCode(chr2);

        }

        if (enc4 != 64) {

           output = output + String.fromCharCode(chr3);

        }



        chr1 = chr2 = chr3 = "";

        enc1 = enc2 = enc3 = enc4 = "";



     } while (i < input.length);



     return unescape(output);

  }

 



function deleteLicensedProfessional(lsm)  {


	// takes a licenseScriptModel and deletes it, along with public user associations
	
	var lic = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.LicenseBusiness").getOutput();
	var clb = aa.proxyInvoker.newInstance("com.accela.pa.people.license.ContractorLicenseBusiness").getOutput();

	if (lsm)
	   {
	   lm = lsm.getLicenseModel();

	   pubusers = aa.publicUser.getPublicUserListByLicenseSeqNBR(licenseNumber).getOutput().toArray();

	   for (p1 in pubusers)
		{
		pu = pubusers[p1].getUserSeqNum();
		clb.deleteContractorLicense(pu, lsm.getLicenseType(),lsm.getAgencyCode(),licenseNumber);
		logDebug("deleted association to public user: " + pubusers[p1].getUserID());
		}

	   lic.removeLicenseByPK(lm);
	   logDebug(licenseNumber + "has been deleted");
	   }
	}
 
function deleteTask(targetCapId,deleteTaskName)
{
	//
	// Get the target Task
	//
	var workflowResult = aa.workflow.getTaskItems(targetCapId, deleteTaskName, null, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

	var tTask = null;

	for (i in wfObj)
		{
   		var fTask = wfObj[i];
  		if (fTask.getTaskDescription().toUpperCase().equals(deleteTaskName.toUpperCase()))
  			{
			var tTask = wfObj[i];
			}

		}

	if (!tTask)
  	  	{ logDebug("**WARNING: Task not found: " + deleteTaskName); return false; }


	logDebug("Removing task " + tTask.getTaskDescription());
	var result = aa.workflow.removeTask(tTask)

	if (!result.getSuccess())
		{ logDebug("error " + result.getErrorMessage()); return false; }

}
 
function describe(obj) {
	var ret = "";
	for (var i in obj)
		if (typeof(obj[i]) == "function")
			ret += "method:" + i + "\n";
		else
			ret += "property:" + i + " = " + obj[i] + "\n";
	return ret;
}
 
function describeObject(obj2describe)
{
    //For Pageflow, use logDebug instead of aa.print (or aa.debug?  haven't tried it)

                logDebug("Object Class: " + obj2describe.getClass());
                
                logDebug("List Object Functions ...");
                //Print function list
                for (x in obj2describe) 
                                if (typeof(obj2describe[x]) == "function")
                                                aa.print("  " + x)

                logDebug("");
                logDebug("List Object Properties ...");
                                                
                //Print properties and values of the current function
                for (x in obj2describe) 
                                if (typeof(obj2describe[x]) != "function")
                                                logDebug("  " + x + " = " + obj2describe[x]);
                                                
}
 
/*
 This function finds the JSON file associated to the module of the record running. 
 The naming convention for the JSON is CONFIGURABLE_RULESET_[solution/module name], 
	for instance CONFIGURABLE_RULESET_LICENSES
 The JSON includes the scripts to be called by event for that solution/module, as an array.
 This function is called from every event Master Script. 
 Sample JSON:
 {
  "WorkflowTaskUpdateAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_INSPECTION_SCHEDULING",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  },
  "ApplicationSubmitBefore": {
    "StandardScripts": [
      "STDBASE_RECORD_VALIDATION",
      "STDBASE_ADDRESS_VALIDATION",
      "STDBASE_PARCEL_VALIDATION"
    ]
  },
  "ApplicationSubmitAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  }
}
 */

function doConfigurableScriptActions() {
	var module = "";

	if (appTypeArray && appTypeArray[0] != undefined) {
		module = appTypeArray[0];
	}

	if (typeof capId !== 'undefined' && capId) {
		if (module == "") {
			var itemCap = aa.cap.getCap(capId).getOutput();
			var itemCapModel = itemCap.getCapModel();
			module = itemCapModel.getModuleName();
		}
	}

	if (module != "") {
		rulesetName = "CONFIGURABLE_RULESET_" + module;
		rulesetName = rulesetName.toUpperCase();
		logDebug("rulesetName: " + rulesetName);

		try {
			var configRuleset = getScriptText(rulesetName);
			if (configRuleset == "") {
				logDebug("No JSON file exists for this module.");
			} else {
				var configJSON = JSON.parse(configRuleset);

				// match event, run appropriate configurable scripts
				settingsArray = [];
				if (configJSON[controlString]) {
					var ruleSetArray = configJSON[controlString];
					var scriptsToRun = ruleSetArray.StandardScripts;
					var customScriptsToRun = ruleSetArray.CustomScripts;
					var script;
					var validScript;

					for (var s in scriptsToRun) {

						if (exists(scriptsToRun[s], customScriptsToRun)) {
							logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s] + " Overridden in CustomScripts, Skipped.");
							continue;
						}

						logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s]);
						script = scriptsToRun[s];
						validScript = getScriptText(script);
						if (validScript != "") {
							logDebug("Script " + script + " exist and executed from Non-Master scripts");
							eval(validScript);
						} else {
							eval(getScriptText(script, null, true)); // now calling this section from master scripts
						}
					}
					for (var cs in customScriptsToRun) {
						logDebug("doConfigurableScriptActions customScriptsToRun[cs]: " + customScriptsToRun[cs]);
						script = customScriptsToRun[cs];
						validScript = getScriptText(script);
						if (validScript == "") {
							logDebug("Configurable custom script " + script + " does not exist.");
						} else {
							eval(validScript);
						}
					}
				}
			}
		} catch (err) {
			logDebug("ERROR: doConfigurableScriptActions " + rulesetName + " Error Message:" + err.message);
		}
	}
} 

function docWrite(dstr,header,indent)
	{
	var istr = "";
	for (i = 0 ; i < indent ; i++)
		istr+="|  ";
	if (header && dstr)
		aa.print(istr + "------------------------------------------------");
	if (dstr) aa.print(istr + dstr);
	if (header)
		aa.print(istr + "------------------------------------------------");
	}


 

function doesASIFieldExistOnRecord(asiFieldName) {
	var itemCap = capId;
	if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

	return (aa.appSpecificInfo.getAppSpecificInfos(itemCap, asiFieldName).getOutput()[0] != 'undefined');

}
 
function doScriptActions() {
	include(prefix + ":" + "*/*/*/*");
	if (typeof(appTypeArray) == "object") {
			include(prefix + ":" + appTypeArray[0] + "/*/*/*");
			include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/*");
			include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/*");
			include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/*");
			include(prefix + ":" + appTypeArray[0] + "/*/" + appTypeArray[2] + "/" + appTypeArray[3]);
			include(prefix + ":" + appTypeArray[0] + "/*/*/" + appTypeArray[3]);
			include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/*/" + appTypeArray[3]);
			include(prefix + ":" + appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3]);
			}
	}
	 
 function doStandardChoiceActions(stdChoiceEntry, doExecution, docIndent) {
    var thisDate = new Date(aa.util.now());
    var thisTime = thisDate.getTime();
    var lastEvalTrue = false;
    stopBranch = false;  // must be global scope

    logDebug("Executing : " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")

    var pairObjArray = getScriptAction(stdChoiceEntry);
    if (!doExecution) docWrite(stdChoiceEntry, true, docIndent);
    for (xx in pairObjArray) {
        doObj = pairObjArray[xx];
        if (doExecution) {
            if (doObj.enabled) {

                if (stopBranch)
                    {
                    stopBranch = false;
                    break;
                    }

                logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Criteria : " + doObj.cri, 2)

        try
            {

                    if (eval(token(doObj.cri)) || (lastEvalTrue && doObj.continuation)) {
                        logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Action : " + doObj.act, 2)
    
                        eval(token(doObj.act));
                        lastEvalTrue = true;
                         }  
                    else {
                        if (doObj.elseact) {
                            logDebug(aa.env.getValue("CurrentUserID") + " : " + stdChoiceEntry + " : #" + doObj.ID + " : Else : " + doObj.elseact, 2)
                            eval(token(doObj.elseact));
                        }
                        lastEvalTrue = false;
            }
        }
        catch(err)
            {
            showDebug = 3;
            logDebug("**ERROR An error occured in the following standard choice " + stdChoiceEntry + "#" + doObj.ID + "  Error:  " + err.message);
            }
                }
        }
        else // just document
        {
            docWrite("|  ", false, docIndent);
            var disableString = "";
            if (!doObj.enabled) disableString = "<DISABLED>";

            if (doObj.elseact)
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act + " ^ " + doObj.elseact, false, docIndent);
            else
                docWrite("|  " + doObj.ID + " " + disableString + " " + doObj.cri + " ^ " + doObj.act, false, docIndent);

            for (yy in doObj.branch) {
                doStandardChoiceActions(doObj.branch[yy], false, docIndent + 1);
            }
        }
    } // next sAction
    if (!doExecution) docWrite(null, true, docIndent);
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    logDebug("Finished: " + stdChoiceEntry + ", Elapsed Time: " + ((thisTime - startTime) / 1000) + " Seconds")
}
 
function editAppName(newname)
	{
	// 4/30/08 - DQ - Corrected Error where option parameter was ignored
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	capResult = aa.cap.getCap(itemCap)

	if (!capResult.getSuccess())
		{logDebug("**WARNING: error getting cap : " + capResult.getErrorMessage()) ; return false }

	capModel = capResult.getOutput().getCapModel()

	capModel.setSpecialText(newname)

	setNameResult = aa.cap.editCapByPK(capModel)

	if (!setNameResult.getSuccess())
		{ logDebug("**WARNING: error setting cap name : " + setNameResult.getErrorMessage()) ; return false }


	return true;
	}

 
function editAppSpecific(itemName,itemValue)  // optional: itemCap
{
	var itemCap = capId;
	var itemGroup = null;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args
   	
  	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: (editAppSpecific) requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		
		itemGroup = itemName.substr(0,itemName.indexOf("."));
		itemName = itemName.substr(itemName.indexOf(".")+1);
	}
   	// change 2/2/2018 - update using: aa.appSpecificInfo.editAppSpecInfoValue(asiField)
	// to avoid issue when updating a blank custom form via script. It was wiping out the field alias 
	// and replacing with the field name
	
	var asiFieldResult = aa.appSpecificInfo.getByList(itemCap, itemName);
	if(asiFieldResult.getSuccess()){
		var asiFieldArray = asiFieldResult.getOutput();
		if(asiFieldArray.length > 0){
			var asiField = asiFieldArray[0];
			if(asiField){
				var origAsiValue = asiField.getChecklistComment();
				asiField.setChecklistComment(itemValue);
	
				var updateFieldResult = aa.appSpecificInfo.editAppSpecInfoValue(asiField);
				if(updateFieldResult.getSuccess()){
					logDebug("Successfully updated custom field: " + itemName + " with value: " + itemValue);
					if(arguments.length < 3) //If no capId passed update the ASI Array
					AInfo[itemName] = itemValue; 
				}
				else
				{ logDebug( "WARNING: (editAppSpecific) " + itemName + " was not updated."); }	
			}
			else
			{ logDebug( "WARNING: (editAppSpecific) " + itemName + " was not updated."); }
		}
	}
	else {
		logDebug("ERROR: (editAppSpecific) " + asiFieldResult.getErrorMessage());
	}
} 
 function editAppSpecific4ACA(itemName, itemValue) {



    var i = cap.getAppSpecificInfoGroups().iterator();



    while (i.hasNext()) {

        var group = i.next();

        var fields = group.getFields();

        if (fields != null) {

            var iteFields = fields.iterator();

            while (iteFields.hasNext()) {

                var field = iteFields.next();

                if ((useAppSpecificGroupName && itemName.equals(field.getCheckboxType() + "." + 



field.getCheckboxDesc())) || itemName.equals(field.getCheckboxDesc())) {

                    field.setChecklistComment(itemValue);

                }

            }

        }

    }

}

 
function editBuildingCount(numBuild) // option CapId
	{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	cd.setBuildingCount(parseFloat(numBuild));

	cdWrite = aa.cap.editCapDetail(cd)

	if (cdWrite.getSuccess())
		{ logDebug("Updated building count to " + numBuild); return true; }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
	} 
 function editCapConditionStatus(pType,pDesc,pStatus,pStatusType) {

	// updates a condition with the pType and pDesc

	// to pStatus and pStatusType, returns true if updates, false if not

	// will not update if status is already pStatus && pStatusType

	// all parameters are required except for pType



	if (pType==null)

		var condResult = aa.capCondition.getCapConditions(capId);

	else

		var condResult = aa.capCondition.getCapConditions(capId,pType);

		

	if (condResult.getSuccess())

		var capConds = condResult.getOutput();

	else

		{ 

		logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

		logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

		return false;

		}





	for (cc in capConds) {

		var thisCond = capConds[cc];

		var cStatus = thisCond.getConditionStatus();

		var cStatusType = thisCond.getConditionStatusType();

		var cDesc = thisCond.getConditionDescription();

		var cImpact = thisCond.getImpactCode();

		logDebug(cStatus + ": " + cStatusType);







		

		if (cDesc.toUpperCase() == pDesc.toUpperCase()) {

			if (!pStatus.toUpperCase().equals(cStatus.toUpperCase())) {

				thisCond.setConditionStatus(pStatus);

				thisCond.setConditionStatusType(pStatusType);

				thisCond.setImpactCode("");

				aa.capCondition.editCapCondition(thisCond);

				return true; // condition has been found and updated

			} else {

				logDebug("ERROR: condition found but already in the status of pStatus and pStatusType");

				return false; // condition found but already in the status of pStatus and pStatusType

			}

		}

	}

	

	logDebug("ERROR: no matching condition found");

	return false; //no matching condition found



}



function days_between(date1, date2) {



    // The number of milliseconds in one day

    var ONE_DAY = 1000 * 60 * 60 * 24



    // Convert both dates to milliseconds

    var date1_ms = date1.getTime()

    var date2_ms = date2.getTime()



    // Calculate the difference in milliseconds

    var difference_ms = Math.abs(date1_ms - date2_ms)



    // Convert back to days and return

    return Math.round(difference_ms/ONE_DAY)



}



 

function editCapContactAttribute(contactSeq,pAttributeName,pNewAttributeValue)
	{

    	var itemCap = capId;
  	if (arguments.length > 3)
  		itemCap = arguments[3]; // use cap ID specified in args
 

	var oldValue = null;
	
	var ca = aa.people.getCapContactByCapID(itemCap).getOutput();

	for (var i in ca)
		{
		var attrfound = false;
		var p = ca[i].getCapContactModel().getPeople();
		
		if (p.getContactSeqNumber() != contactSeq) 
			continue;
		
		var peopAttrArray = p.getAttributes().toArray();

		for (var j in peopAttrArray)
			{
			if ( pAttributeName.equals(peopAttrArray[j].getAttributeName()))
				{
				oldValue = peopAttrArray[j].getAttributeValue();
				peopAttrArray[j].setAttributeValue(pNewAttributeValue);
				attrfound = true;
				break;
				}
			}

		if (attrfound)
			{
			logDebug("Updated Cap Contact: " + contactSeq + ", attribute: " + pAttributeName + " from: " + oldValue + " to: " + pNewAttributeValue);
			ca[i].getCapContactModel().setPeople(p);
			var editResult = aa.people.editCapContactWithAttribute(ca[i].getCapContactModel());

		}
	}
	
}
 
function editChannelReported(channel) // option CapId
	{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }
	
	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }
		
	cd = cdScriptObj.getCapDetailModel();
	
	cd.setReportedChannel(channel);
		
	cdWrite = aa.cap.editCapDetail(cd)
	
	if (cdWrite.getSuccess())
		{ logDebug("Updated channel reported to " + channel) }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
	} 
function editConstTypeCode(constTypeCode) // option CapId
{
	var itemCap = capId;
	if (arguments.length > 1) {
		itemCap = arguments[1]; // use cap ID specified in args
	}
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	cd = cdScriptObj.getCapDetailModel();
	cd.setConstTypeCode(constTypeCode);
	cdWrite = aa.cap.editCapDetail(cd);
	if (cdWrite.getSuccess()) {
		logDebug("Updated Construction Type Code to " + constTypeCode);
		return true;
	} else {
		logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage());
		return false;
	}
}
 
 function editContactType(existingType,newType)

//Function will change contact types from exsistingType to newType, 

//optional paramter capID

{

    var updateCap = capId

    if (arguments.length==3)

        updateCap=arguments[2]



    capContactResult = aa.people.getCapContactByCapID(updateCap);

    if (capContactResult.getSuccess())

        {

        Contacts = capContactResult.getOutput();

        for (yy in Contacts)

            {

            var theContact = Contacts[yy].getCapContactModel();

            if(theContact.getContactType() == existingType)

                {

                theContact.setContactType(newType);

                var peopleModel = theContact.getPeople();

                var contactAddressrs = aa.address.getContactAddressListByCapContact(theContact);

                if (contactAddressrs.getSuccess())

                {

                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());

                    peopleModel.setContactAddressList(contactAddressModelArr);    

                }

                aa.people.editCapContactWithAttribute(theContact);

                //logDebug("Contact for " + theContact.getFullName() + " Updated to " + newType);

                }

            }

        }

    }



 
function editCreatedBy(nCreatedBy) {
	// 4/30/08 - DQ - Corrected Error where option parameter was ignored
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var capResult = aa.cap.getCap(itemCap)

	if (!capResult.getSuccess())
		{logDebug("**WARNING: error getting cap : " + capResult.getErrorMessage()) ; return false }

	var capE = capResult.getOutput();
	var capEModel = capE.getCapModel()

	capEModel.setCreatedBy(nCreatedBy)

	setCreatedByResult = aa.cap.editCapByPK(capEModel);

	if (!setCreatedByResult.getSuccess())
		{ logDebug("**WARNING: error setting cap created by : " + setCreatedByResult.getErrorMessage()) ; return false }

	return true;
} 
function editEstimatedJobValue(jobValue) // option CapId
{
	var itemCap = capId;
	if (arguments.length > 1) {
		itemCap = arguments[1]; // use cap ID specified in args
	}
	var bValScriptObjResult = aa.cap.getBValuatn4AddtInfo(itemCap);
	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!bValScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + bValScriptObjResult.getErrorMessage());
		return false;
	}
	var bValScriptObj = bValScriptObjResult.getOutput();
	if (!bValScriptObj) {
		logDebug("**ERROR: No valuation detail script object");
		return false;
	}
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
		return false;
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return false;
	}
	bValScriptObj.setEstimatedValue(parseFloat(jobValue));
	var vedtResults = aa.cap.editAddtInfo(cdScriptObj, bValScriptObj);
	if (!vedtResults.getSuccess()) {
		logDebug("**Error updating the job value in additional information" + vedtResults.getErrorMessage());
	}
	if (vedtResults !== null && vedtResults.getSuccess() === true) {
		logDebug("Updated the estimated job value to " + jobValue);
	}
}
 
 function editFirstIssuedDate(issuedDate) { // option CapId

    var itemCap = capId



    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args



    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);



    if (!cdScriptObjResult.getSuccess()) { 

        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

    

    var cdScriptObj = cdScriptObjResult.getOutput();



    if (!cdScriptObj) { 

        logDebug("**ERROR: No cap detail script object") ; return false; }



    cd = cdScriptObj.getCapDetailModel();



    var javascriptDate = new Date(issuedDate);



    var vIssuedDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());



    cd.setFirstIssuedDate(vIssuedDate);



    cdWrite = aa.cap.editCapDetail(cd);



    if (cdWrite.getSuccess()) { 

        logDebug("updated first issued date to " + vIssuedDate) ; return true; }

    else { 

        logDebug("**ERROR updating first issued date: " + cdWrite.getErrorMessage()) ; return false ; }



}
 
function editHouseCount(numHouse) // option CapId
	{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }
	
	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }
		
	cd = cdScriptObj.getCapDetailModel();
	
	cd.setHouseCount(parseFloat(numHouse));
		
	cdWrite = aa.cap.editCapDetail(cd)
	
	if (cdWrite.getSuccess())
		{ logDebug("Updated house count to " + numHouse); return true; }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
	} 

function editInspectionRequiredFlag(inspType,reqFlag)
	{
	var itemCap = capId
	if (arguments.length > 2) itemCap = arguments[2]; // use cap ID specified in args


	var result = aa.inspection.getInspMilestoneByCapID(itemCap);

	if(!result.getSuccess())
		{ logDebug("**ERROR retrieving inspection milestones: "  + result.getErrorMessage()) ; return false ; }

	inspMilestones= result.getOutput();

	if (!inspMilestones)
		{ logDebug("No Inspection Milestones found") ; return false ; }

	for (thisM in inspMilestones)
		{
		var obj= inspMilestones[thisM];
		if (inspType.equals(obj.getInspType()))
			{
			if (reqFlag) obj.setInspRequired("Y");
			else obj.setInspRequired("N");

			result = aa.inspection.updateInspectionMilestone(inspMilestones);
			if(result.getSuccess())
				logDebug("inspection milestone updated sucessfully.");
			else
				logDebug("**ERROR: could not update inpsection milestone " +result.getErrorMessage());
			}
		}
	}
 

function editLookup(stdChoice,stdValue,stdDesc) 
	{
	//check if stdChoice and stdValue already exist; if they do, update;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	if (bizDomScriptResult.getSuccess())
		{
		bds = bizDomScriptResult.getOutput();
		}
	else
		{
		logDebug("Std Choice(" + stdChoice + "," + stdValue + ") does not exist to edit, adding...");
		addLookup(stdChoice,stdValue,stdDesc);
		return false;
		}
	var bd = bds.getBizDomain()
		
	bd.setDescription(stdDesc);
	var editResult = aa.bizDomain.editBizDomain(bd)
	
	if (editResult.getSuccess())
		logDebug("Successfully edited Std Choice(" + stdChoice + "," + stdValue + ") = " + stdDesc);
	else
		logDebug("**ERROR editing Std Choice " + editResult.getErrorMessage());
	}

 
function editPriority(priority) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	cd.setPriority(priority);

	cdWrite = aa.cap.editCapDetail(cd)

	if (cdWrite.getSuccess())
		{ logDebug("updated priority to " + priority) ; return true; }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
} 
function editRefAddrAttr(refAddressPK, label, newValue) {

	try {
		var rb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.address.RefAddressBusiness").getOutput();
		var addrResult = aa.address.getRefAddressByPK("" + refAddressPK)
			if (!addrResult.getSuccess()) {
				logDebug("Error getting reference address:  " + addrResult.getErrorMessage());
				return false;
			}

		var addrObj = addrResult.getOutput().getRefAddressModel();
		addressAttrObj = addrObj.getAttributes();
		var itr = addressAttrObj.iterator();
		while (itr.hasNext()) {
			y = itr.next();
			if (label.toUpperCase().equals(y.getAttributeName())) {
				y.setAttributeValue(newValue);
				logDebug("editRefAddrAttr: Setting address attribute " + label + " to " + newValue);
				rb.editRefAddressWithAPOAttribute(aa.getServiceProviderCode(), addrObj, addressAttrObj);
				break;
			}
		}
	} catch (err) {
		logDebug("A Error occured in editRefAddrAttr: " + err.message);
	}

}
 

function editRefLicProfAttribute(pLicNum,pAttributeName,pNewAttributeValue)
	{

	var attrfound = false;
	var oldValue = null;

	licObj = getRefLicenseProf(pLicNum)

	if (!licObj)
		{ logDebug("**WARNING Licensed Professional : " + pLicNum + " not found") ; return false }

	licSeqNum = licObj.getLicSeqNbr();
	attributeType = licObj.getLicenseType();

	if (licSeqNum==null || attributeType=="" || attributeType==null)
		{ logDebug("**WARNING Licensed Professional Sequence Number or Attribute Type missing") ; return false }

	var peopAttrResult = aa.people.getPeopleAttributeByPeople(licSeqNum, attributeType);

	if (!peopAttrResult.getSuccess())
		{ logDebug("**WARNING retrieving reference license professional attribute: " + peopAttrResult.getErrorMessage()); return false }

	var peopAttrArray = peopAttrResult.getOutput();

	for (i in peopAttrArray)
		{
		if ( pAttributeName.equals(peopAttrArray[i].getAttributeName()))
			{
			oldValue = peopAttrArray[i].getAttributeValue()
			attrfound = true;
			break;
			}
		}

	if (attrfound)
		{
		logDebug("Updated Ref Lic Prof: " + pLicNum + ", attribute: " + pAttributeName + " from: " + oldValue + " to: " + pNewAttributeValue)
		peopAttrArray[i].setAttributeValue(pNewAttributeValue);
		aa.people.editPeopleAttribute(peopAttrArray[i].getPeopleAttributeModel());
		}
	else
		{
		logDebug("**WARNING attribute: " + pAttributeName + " not found for Ref Lic Prof: "+ pLicNum)
		/* make a new one with the last model.  Not optimal but it should work
		newPAM = peopAttrArray[i].getPeopleAttributeModel();
		newPAM.setAttributeName(pAttributeName);
		newPAM.setAttributeValue(pNewAttributeValue);
		newPAM.setAttributeValueDataType("Number");
		aa.people.createPeopleAttribute(newPAM);
		*/
		}
	} 
/**
* This function is intended to update reference parcel attributes and refresh the parcel information on the record. 
* If no parcel number is provided, it will update all parcels that contain the attributeName with the supplied attributeValue
*
* Call Example:
* 	editRefParcelAttribute("DELINQUENT TAXES","No","048072002");
*
* @param attributeName {String}
* @param attributeValue {String}
* @param parcelNumber {String}
* @return {Boolean}
*/

function editRefParcelAttribute(attributeName, attributeValue, parcelNumber) //Takes Optional CapId
{
	var matchedParcel = false;
	var updateAllParcels = false;
	var updatedParcel = false;
	var vCapId = null;
	var pb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();

	if (arguments.length > 3)
		vCapId = arguments[3];
	else
		vCapId = capId;

		logDebug("editRefParcelAttribute: Processing Record " + vCapId.getCustomID())
	
	var capPrclArr = aa.parcel.getParcelDailyByCapID(vCapId, null).getOutput();

	if (capPrclArr != null) {
		for (x in capPrclArr) {
			// Check if the parcel number passed in matches and update the one, if no parcel number supplied update all parcels
			if(!matches(parcelNumber,null,undefined,"")){
				if(parcelNumber.equals(capPrclArr[x].getParcelNumber())){
					matchedParcel = true;
				}
				else{
					matchedParcel = false;
				}
			} else {
				updateAllParcels = true;
			}
			
			if(updateAllParcels || matchedParcel) {
			var refPrclObj = aa.parcel.getParceListForAdmin(capPrclArr[x].getParcelNumber(), null, null, null, null, null, null, null, null, null);
			
			if (refPrclObj.getSuccess()) {
				var refPrclArr = refPrclObj.getOutput();
				if (refPrclArr.length) {
					for(iPar in refPrclArr){
					var refParcelModel = refPrclArr[iPar].getParcelModel();
					var refParcelNumber = refParcelModel.getParcelNumber();
					var newParcelAttributeList = aa.util.newArrayList();
					var parcelAttrList = refParcelModel.getParcelAttribute();
					var parcelAttrListIt = parcelAttrList.iterator();
					while(parcelAttrListIt.hasNext())
					{
						var parcelAttrObj = parcelAttrListIt.next();
						
						if(attributeName.equals(parcelAttrObj.getAttributeName())){
							
							parcelAttrObj.setAttributeValue(attributeValue);
							logDebug("Parcel Attribute " + parcelAttrObj.getAttributeName() + " updated value to " + attributeValue);
						}
						newParcelAttributeList.add(parcelAttrObj);
					}
					
					try{
						pb.editParcelWithAttributes(servProvCode, refParcelModel, newParcelAttributeList, "ADMIN");
					} catch (err){
							logDebug("Error Updating Reference Parcel: " + err.message);
						}
					
					var caprefPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(vCapId, refParcelModel);

					if (caprefPrclObj.getSuccess()) {

						var capPrcl = caprefPrclObj.getOutput();
						try{
						capPrcl.setL1ParcelNo(refParcelNumber);
						aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						updatedParcel = true;
						logDebug("Updated Parcel " + capPrclArr[x].getParcelNumber() + " with Reference Data");
						
						} catch (err){
							logDebug("Error Updating Parcel " + capPrclArr[x].getParcelNumber() + ": " +  err.message);
						}
					} else
						logDebug("Failed to Wrap Parcel Model for " + capPrclArr[x].getParcelNumber());
					}
				} else
					logDebug("No matching reference Parcels found for " + capPrclArr[x].getParcelNumber());
			} else
				logDebug("Failed to get reference Parcel for " + capPrclArr[x].getParcelNumber())
			}
		}
	}
	return updatedParcel;
}  
function editReportedChannel(reportedChannel) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	cd.setReportedChannel(reportedChannel);

	cdWrite = aa.cap.editCapDetail(cd);

	if (cdWrite.getSuccess())
		{ logDebug("updated reported channel to " + reportedChannel) ; return true; }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
} 
function editFirstIssuedDate(issuedDate) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	var javascriptDate = new Date(issuedDate);
	var vIssuedDate = aa.date.transToJavaUtilDate(javascriptDate.getTime());

	cd.setFirstIssuedDate(vIssuedDate);

	cdWrite = aa.cap.editCapDetail(cd);

	if (cdWrite.getSuccess())
		{ logDebug("updated first issued date to " + vIssuedDate) ; return true; }
	else
		{ logDebug("**ERROR updating first issued date: " + cdWrite.getErrorMessage()) ; return false ; }
} 

function editTaskACAVisibility(wfstr,visibleTask,visibleComment,restrictRole) // optional process name
	{
	// restrictRole is string of five binary digits
	// representing, 0: all aca users, 1: creator, 2:LP, 3:Contact, 4:Owner
	// example: 01011 = creator, contact, owner have access
	// example: 11111 = everybody
	// example: 00001 = only the owner
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) 
		{
		processName = arguments[3]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
  		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			var fTaskModel = wfObj[i].getTaskItem();
			fTaskModel.setIsRestrictView4ACA(visibleComment ? "Y" : "N");
			fTaskModel.setDisplayInACA(visibleTask ? "Y" : "N");
			fTaskModel.setRestrictRole(restrictRole + "00000");
			//var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);  // doesn't work?   WHY?!?
			var tResult = aa.workflow.editTask(fTaskModel,currentUserID);  // works but adds an audit history.
			if (tResult.getSuccess())
				logDebug("Set Workflow visible flags: " + visibleTask + " , " + visibleComment);
		  	else
	  	  		{ logMessage("**ERROR: Failed to update task, comment visible flags on workflow task: " + tResult.getErrorMessage()); return false; }
			}			
		}
	} 
function editTaskComment(wfstr,wfcomment) // optional process name
	{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) 
		{
		processName = arguments[2]; // subprocess
		useProcess = true;
		}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
  		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			wfObj[i].setDispositionComment(wfcomment);
			var fTaskModel = wfObj[i].getTaskItem();
			var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
			if (tResult.getSuccess())
				logDebug("Set Workflow: " + wfstr + " comment " + wfcomment);
		  	else
	  	  		{ logMessage("**ERROR: Failed to update comment on workflow task: " + tResult.getErrorMessage()); return false; }
			}			
		}
	}

 
function editTaskDueDate(wfstr, wfdate) // optional process name.  if wfstr == "*", set for all tasks
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var taskDesc = wfstr;
	if (wfstr == "*") {
		taskDesc = "";
	}
	var workflowResult = aa.workflow.getTaskItems(capId, taskDesc, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
			wfObj[i].setDueDate(aa.date.parseDate(wfdate));
			var fTaskModel = wfObj[i].getTaskItem();
			var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
			if (tResult.getSuccess())
				logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " due Date " + wfdate);
			else {
				logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
				return false;
			}
		}
	}
}
 
function editTaskSpecific(wfName,itemName,itemValue)  // optional: itemCap
	{
	var updated = false;
	var i=0;
	itemCap = capId;
	if (arguments.length == 4) itemCap = arguments[3]; // use cap ID specified in args
	//
 	// Get the workflows
 	//
	var workflowResult = aa.workflow.getTaskItems(itemCap, wfName, null, null, null, null);
 	if (workflowResult.getSuccess())
 		wfObj = workflowResult.getOutput();
 	else
 		{ logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

 	//
 	// Loop through workflow tasks
 	//
 	for (i in wfObj)
 		{
 		fTask = wfObj[i];
 		stepnumber = fTask.getStepNumber();
 		processID = fTask.getProcessID();
 		if (wfName.equals(fTask.getTaskDescription())) // Found the right Workflow Task
 			{
  		TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap,processID,stepnumber,itemName);
 			if (TSIResult.getSuccess())
 				{
	 			var TSI = TSIResult.getOutput();
				if (TSI != null)
					{
					var TSIArray = new Array();
					TSInfoModel = TSI.getTaskSpecificInfoModel();
					TSInfoModel.setChecklistComment(itemValue);
					TSIArray.push(TSInfoModel);
					TSIUResult = aa.taskSpecificInfo.editTaskSpecInfos(TSIArray);
					if (TSIUResult.getSuccess())
						{
						logDebug("Successfully updated TSI Task=" + wfName + " Item=" + itemName + " Value=" + itemValue);
						AInfo[itemName] = itemValue;  // Update array used by this script
						}
					else
						{ logDebug("**ERROR: Failed to Update Task Specific Info : " + TSIUResult.getErrorMessage()); return false; }
					}
				else
					logDebug("No task specific info field called "+itemName+" found for task "+wfName);
	 			}
	 		else
	 			{
	 			logDebug("**ERROR: Failed to get Task Specific Info objects: " + TSIResult.getErrorMessage());
	 			return false;
	 			}
	 		}  // found workflow task
		} // each task
	}

 
function email(pToEmail, pFromEmail, pSubject, pText) 
	{
	//Sends email to specified address
	//06SSP-00221
	//
	aa.sendMail(pFromEmail, pToEmail, "", pSubject, pText);
	logDebug("Email sent to "+pToEmail);
	return true;
	}

 
function emailContact(mSubj,mText)   // optional: Contact Type, default Applicant
	{
	var replyTo = "noreply@accela.com";
	var contactType = "Applicant"
	var emailAddress = "";

	if (arguments.length == 3) contactType = arguments[2]; // use contact type specified

	var capContactResult = aa.people.getCapContactByCapID(capId);
	if (capContactResult.getSuccess())
		{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
			if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))
				if (Contacts[yy].getEmail() != null)
					emailAddress = "" + Contacts[yy].getEmail();
		}

	if (emailAddress.indexOf("@") > 0)
		{
		aa.sendMail(replyTo, emailAddress, "", mSubj, mText);
		logDebug("Successfully sent email to " + contactType);
		}
	else
		logDebug("Couldn't send email to " + contactType + ", no valid email address");
	} 
 function encode64(input) {

     var keyStr = "ABCDEFGHIJKLMNOP" +

               "QRSTUVWXYZabcdef" +

               "ghijklmnopqrstuv" +

               "wxyz0123456789+/" +

               "=";



     input = escape(input);

     var output = "";

     var chr1, chr2, chr3 = "";

     var enc1, enc2, enc3, enc4 = "";

     var i = 0;



     do {

        chr1 = input.charCodeAt(i++);

        chr2 = input.charCodeAt(i++);

        chr3 = input.charCodeAt(i++);



        enc1 = chr1 >> 2;

        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);

        enc4 = chr3 & 63;



        if (isNaN(chr2)) {

           enc3 = enc4 = 64;

        } else if (isNaN(chr3)) {

           enc4 = 64;

        }



        output = output +

           keyStr.charAt(enc1) +

           keyStr.charAt(enc2) +

           keyStr.charAt(enc3) +

           keyStr.charAt(enc4);

        chr1 = chr2 = chr3 = "";

        enc1 = enc2 = enc3 = enc4 = "";

     } while (i < input.length);



     return output;

  }



 
function endBranch() {
	// stop execution of the current std choice
	stopBranch = true;
	} 
function executeASITable(tableArray)
	{
	// Executes an ASI table as if it were script commands
	// No capability for else or continuation statements
	// Assumes that there are at least three columns named "Enabled", "Criteria", "Action"
	// Will replace tokens in the controls
	
	//var thisDate = new Date(aa.util.now());
	//var thisTime = thisDate.getTime();
	//logDebug("Executing ASI Table, Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds")

	for (xx in tableArray)
		{
 
		var doTableObj = tableArray[xx]; 
		var myCriteria = doTableObj["Criteria"]; aa.print("cri: " + myCriteria)
		var myAction = doTableObj["Action"];  aa.print("act: " + myAction)
		aa.print("enabled: " + doTableObj["Enabled"])
      
		if (doTableObj["Enabled"] == "Yes")
			if (eval(token(myCriteria)))
				eval(token(myAction));

		} // next action
	//var thisDate = new Date(aa.util.now());
	//var thisTime = thisDate.getTime();
	//logDebug("Finished executing ASI Table, Elapsed Time: "  + ((thisTime - startTime) / 1000) + " Seconds")
	}

 
//
// exists:  return true if Value is in Array
//
function exists(eVal, eArray) {
	  for (ii in eArray)
	  	if (eArray[ii] == eVal) return true;
	  return false;
}

 
function externalLP_CA(licNum, rlpType, doPopulateRef, doPopulateTrx, itemCap) {

	/*
	Version: 3.2

	Usage:

	licNum			:  Valid CA license number.   Non-alpha, max 8 characters.  If null, function will use the LPs on the supplied CAP ID
	rlpType			:  License professional type to use when validating and creating new LPs
	doPopulateRef 	:  If true, will create/refresh a reference LP of this number/type
	doPopulateTrx 	:  If true, will copy create/refreshed reference LPs to the supplied Cap ID.   doPopulateRef must be true for this to work
	itemCap			:  If supplied, licenses on the CAP will be validated.  Also will be refreshed if doPopulateRef and doPopulateTrx are true

	returns: non-null string of status codes for invalid licenses

	examples:

	appsubmitbefore   (will validate the LP entered, if any, and cancel the event if the LP is inactive, cancelled, expired, etc.)
	===============
	true ^ cslbMessage = "";
	CAELienseNumber ^ cslbMessage = externalLP_CA(CAELienseNumber,CAELienseType,false,false,null);
	cslbMessage.length > 0 ^ cancel = true ; showMessage = true ; comment(cslbMessage)

	appsubmitafter  (update all CONTRACTOR LPs on the CAP and REFERENCE with data from CSLB.  Link the CAP LPs to REFERENCE.   Pop up a message if any are inactive...)
	==============
	true ^ 	cslbMessage = externalLP_CA(null,"CONTRACTOR",true,true,capId)
	cslbMessage.length > 0 ^ showMessage = true ; comment(cslbMessage);

	Note;  Custom LP Template Field Mappings can be edited in the script below
	 */

	var returnMessage = "";

	var workArray = new Array();
	if (licNum)
		workArray.push(String(licNum));

	if (itemCap) {
		var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
		if (capLicenseResult.getSuccess()) {
			var capLicenseArr = capLicenseResult.getOutput();
		} else {
			logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage());
			return false;
		}

		if (capLicenseArr == null || !capLicenseArr.length) {
			logDebug("**WARNING: no licensed professionals on this CAP");
		} else {
			for (var thisLic in capLicenseArr)
				if (capLicenseArr[thisLic].getLicenseType() == rlpType)
					workArray.push(capLicenseArr[thisLic]);
		}
	} else
		doPopulateTrx = false; // can't do this without a CAP;

	for (var thisLic = 0; thisLic < workArray.length; thisLic++) {
		var licNum = workArray[thisLic];
		var licObj = null;
		var isObject = false;

		if (typeof(licNum) == "object") // is this one an object or string?
		{
			licObj = licNum;
			licNum = licObj.getLicenseNbr();
			isObject = true;
		}

		// Make the call to the California State License Board

		var document;
		var root;
		var aURLArgList = "https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + licNum;
		var vOutObj = aa.httpClient.get(aURLArgList);
		var isError = false;
		if (vOutObj.getSuccess()) {
			var vOut = vOutObj.getOutput();
			var sr = aa.proxyInvoker.newInstance("java.io.StringBufferInputStream", new Array(vOut)).getOutput();
			var saxBuilder = aa.proxyInvoker.newInstance("org.jdom.input.SAXBuilder").getOutput();
			document = saxBuilder.build(sr);
			root = document.getRootElement();
			errorNode = root.getChild("Error");
		} else {
			isError = true;
		}
		if (isError) {
			logDebug("The CSLB web service is currently unavailable");
			continue;
		} else if (errorNode) {
			logDebug("Error for license " + licNum + " : " + errorNode.getText().replace(/\+/g, " "));
			returnMessage += "License " + licNum + " : " + errorNode.getText().replace(/\+/g, " ") + " ";
			continue;
		}

		var lpBiz = root.getChild("BusinessInfo");
		var lpStatus = root.getChild("PrimaryStatus");
		var lpClass = root.getChild("Classifications");
		var lpBonds = root.getChild("ContractorBond");
		var lpWC = root.getChild("WorkersComp");

		// Primary Status
		// 3 = expired, 10 = good, 11 = inactive, 1 = canceled.   We will ignore all but 10 and return text.
		var stas = lpStatus.getChildren();
		for (var i = 0; i < stas.size(); i++) {
			var sta = stas.get(i);

			if (sta.getAttribute("Code").getValue() != "10")
				returnMessage += "License:" + licNum + ", " + sta.getAttribute("Desc").getValue() + " ";
		}

		if (doPopulateRef) // refresh or create a reference LP
		{
			var updating = false;

			// check to see if the licnese already exists...if not, create.

			var newLic = getRefLicenseProf(licNum)

				if (newLic) {
					updating = true;
					logDebug("Updating existing Ref Lic Prof : " + licNum);
				} else {
					var newLic = aa.licenseScript.createLicenseScriptModel();
				}

				if (isObject) // update the reference LP with data from the transactional, if we have some.
				{
					if (licObj.getAddress1())
						newLic.setAddress1(licObj.getAddress1());
					if (licObj.getAddress2())
						newLic.setAddress2(licObj.getAddress2());
					if (licObj.getAddress3())
						newLic.setAddress3(licObj.getAddress3());
					if (licObj.getAgencyCode())
						newLic.setAgencyCode(licObj.getAgencyCode());
					if (licObj.getBusinessLicense())
						newLic.setBusinessLicense(licObj.getBusinessLicense());
					if (licObj.getBusinessName())
						newLic.setBusinessName(licObj.getBusinessName());
					if (licObj.getBusName2())
						newLic.setBusinessName2(licObj.getBusName2());
					if (licObj.getCity())
						newLic.setCity(licObj.getCity());
					if (licObj.getCityCode())
						newLic.setCityCode(licObj.getCityCode());
					if (licObj.getContactFirstName())
						newLic.setContactFirstName(licObj.getContactFirstName());
					if (licObj.getContactLastName())
						newLic.setContactLastName(licObj.getContactLastName());
					if (licObj.getContactMiddleName())
						newLic.setContactMiddleName(licObj.getContactMiddleName());
					if (licObj.getCountryCode())
						newLic.setContryCode(licObj.getCountryCode());
					if (licObj.getEmail())
						newLic.setEMailAddress(licObj.getEmail());
					if (licObj.getCountry())
						newLic.setCountry(licObj.getCountry());
					if (licObj.getEinSs())
						newLic.setEinSs(licObj.getEinSs());
					if (licObj.getFax())
						newLic.setFax(licObj.getFax());
					if (licObj.getFaxCountryCode())
						newLic.setFaxCountryCode(licObj.getFaxCountryCode());
					if (licObj.getHoldCode())
						newLic.setHoldCode(licObj.getHoldCode());
					if (licObj.getHoldDesc())
						newLic.setHoldDesc(licObj.getHoldDesc());
					if (licObj.getLicenseExpirDate())
						newLic.setLicenseExpirationDate(licObj.getLicenseExpirDate());
					if (licObj.getLastRenewalDate())
						newLic.setLicenseLastRenewalDate(licObj.getLastRenewalDate());
					if (licObj.getLicesnseOrigIssueDate())
						newLic.setLicOrigIssDate(licObj.getLicesnseOrigIssueDate());
					if (licObj.getPhone1())
						newLic.setPhone1(licObj.getPhone1());
					if (licObj.getPhone1CountryCode())
						newLic.setPhone1CountryCode(licObj.getPhone1CountryCode());
					if (licObj.getPhone2())
						newLic.setPhone2(licObj.getPhone2());
					if (licObj.getPhone2CountryCode())
						newLic.setPhone2CountryCode(licObj.getPhone2CountryCode());
					if (licObj.getSelfIns())
						newLic.setSelfIns(licObj.getSelfIns());
					if (licObj.getState())
						newLic.setState(licObj.getState());
					if (licObj.getSuffixName())
						newLic.setSuffixName(licObj.getSuffixName());
					if (licObj.getZip())
						newLic.setZip(licObj.getZip());
				}

				// Now set data from the CSLB

				if (lpBiz.getChild("Name").getText() != "")
					newLic.setBusinessName(unescape(lpBiz.getChild("Name").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("Addr1").getText() != "")
					newLic.setAddress1(unescape(lpBiz.getChild("Addr1").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("Addr2").getText() != "")
					newLic.setAddress2(unescape(lpBiz.getChild("Addr2").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("City").getText() != "")
					newLic.setCity(unescape(lpBiz.getChild("City").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("State").getText() != "")
					newLic.setState(unescape(lpBiz.getChild("State").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("Zip").getText() != "")
					newLic.setZip(unescape(lpBiz.getChild("Zip").getText()).replace(/\+/g, " "));
				if (lpBiz.getChild("BusinessPhoneNum").getText() != "")
					newLic.setPhone1(unescape(stripNN(lpBiz.getChild("BusinessPhoneNum").getText()).replace(/\+/g, " ")));
				newLic.setAgencyCode(aa.getServiceProviderCode());
			newLic.setAuditDate(sysDate);
			newLic.setAuditID(currentUserID);
			newLic.setAuditStatus("A");
			newLic.setLicenseType(rlpType);
			newLic.setLicState("CA"); // hardcode CA
			newLic.setStateLicense(licNum);

			if (lpBiz.getChild("IssueDt").getText())
				newLic.setLicenseIssueDate(aa.date.parseDate(lpBiz.getChild("IssueDt").getText()));
			if (lpBiz.getChild("ExpireDt").getText())
				newLic.setLicenseExpirationDate(aa.date.parseDate(lpBiz.getChild("ExpireDt").getText()));
			if (lpBiz.getChild("ReissueDt").getText())
				newLic.setLicenseLastRenewalDate(aa.date.parseDate(lpBiz.getChild("ReissueDt").getText()));

			var wcs = root.getChild("WorkersComp").getChildren();

			for (var j = 0; j < wcs.size(); j++) {
				wc = wcs.get(j);

				if (wc.getAttribute("PolicyNo").getValue())
					newLic.setWcPolicyNo(wc.getAttribute("PolicyNo").getValue());
				if (wc.getAttribute("InsCoCde").getValue())
					newLic.setWcInsCoCode(unescape(wc.getAttribute("InsCoCde").getValue()));
				if (wc.getAttribute("WCEffDt").getValue())
					newLic.setWcEffDate(aa.date.parseDate(wc.getAttribute("WCEffDt").getValue()))
					if (wc.getAttribute("WCExpDt").getValue())
						newLic.setWcExpDate(aa.date.parseDate(wc.getAttribute("WCExpDt").getValue()))
						if (wc.getAttribute("WCCancDt").getValue())
							newLic.setWcCancDate(aa.date.parseDate(wc.getAttribute("WCCancDt").getValue()))
							if (wc.getAttribute("Exempt").getValue() == "E")
								newLic.setWcExempt("Y");
							else
								newLic.setWcExempt("N");

				break; // only use first
			}

			//
			// Do the refresh/create and get the sequence number
			//
			if (updating) {
				var myResult = aa.licenseScript.editRefLicenseProf(newLic);
				var licSeqNbr = newLic.getLicSeqNbr();
			} else {
				var myResult = aa.licenseScript.createRefLicenseProf(newLic);

				if (!myResult.getSuccess()) {
					logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
					continue;
				}

				var licSeqNbr = myResult.getOutput()
			}

			logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " Sequence Number " + licSeqNbr);

			/////
			/////  Attribute Data -- first copy from the transactional LP if it exists
			/////


			if (isObject) // update the reference LP with attributes from the transactional, if we have some.
			{
				var attrArray = licObj.getAttributes();

				if (attrArray) {
					for (var k in attrArray) {
						var attr = attrArray[k];
						editRefLicProfAttribute(licNum, attr.getAttributeName(), attr.getAttributeValue());
					}
				}
			}

			/////
			/////  Attribute Data
			/////
			/////  NOTE!  Agencies may have to configure template data below based on their configuration.  Please note all edits
			/////

			var cbs = root.getChild("Classifications").getChildren();
			for (var m = 0; m < cbs.size(); m++) {
				cb = cbs.get(m);

				if (m == 0) {
					editRefLicProfAttribute(licNum, "CLASS CODE 1", cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum, "CLASS DESC 1", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
				}

				if (m == 1) {
					editRefLicProfAttribute(licNum, "CLASS CODE 2", cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum, "CLASS DESC 2", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
				}
				if (m == 2) {
					editRefLicProfAttribute(licNum, "CLASS CODE 3", cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum, "CLASS DESC 3", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
				}

				if (m == 3) {
					editRefLicProfAttribute(licNum, "CLASS CODE 4", cb.getAttribute("Code").getValue());
					editRefLicProfAttribute(licNum, "CLASS DESC 4", unescape(cb.getAttribute("Desc").getValue()).replace(/\+/g, " "));
				}
			}

			var bos = root.getChild("ContractorBond").getChildren();

			for (var n = 0; n < bos.size(); n++) {
				var bo = bos.get(n);
				if (bo.getAttribute("BondAmt").getValue())
					editRefLicProfAttribute(licNum, "BOND AMOUNT", unescape(bo.getAttribute("BondAmt").getValue()));
				if (bo.getAttribute("BondCancDt").getValue())
					editRefLicProfAttribute(licNum, "BOND EXPIRATION", unescape(bo.getAttribute("BondCancDt").getValue()));

				// Currently unused but could be loaded into custom attributes.
				/*
				aa.print("Bond Surety Type       : " + unescape(bo.getAttribute("SuretyTp").getValue()))
				aa.print("Bond Code              : " + unescape(bo.getAttribute("InsCoCde").getValue()))
				aa.print("Bond Insurance Company : " + unescape(bo.getAttribute("InsCoName").getValue()).replace(/\+/g," "))
				aa.print("Bond Number            : " + unescape(bo.getAttribute("BondNo").getValue()))
				aa.print("Bond Amount            : " + unescape(bo.getAttribute("BondAmt").getValue()))
				aa.print("Bond Effective Date    : " + unescape(bo.getAttribute("BondEffDt").getValue()))
				aa.print("Bond Cancel Date       : " + unescape(bo.getAttribute("BondCancDt").getValue()))
				 */
				break; // only use first bond
			}

			if (doPopulateTrx) {
				var lpsmResult = aa.licenseScript.getRefLicenseProfBySeqNbr(servProvCode, licSeqNbr)
					if (!lpsmResult.getSuccess()) {
						logDebug("**WARNING error retrieving the LP just created " + lpsmResult.getErrorMessage());
					}

					var lpsm = lpsmResult.getOutput();

				// Remove from CAP

				var isPrimary = false;

				if (capLicenseArr != null) {
					for (var currLic in capLicenseArr) {
						var thisLP = capLicenseArr[currLic];
						if (thisLP.getLicenseType() == rlpType && thisLP.getLicenseNbr() == licNum) {
							logDebug("Removing license: " + thisLP.getLicenseNbr() + " from CAP.  We will link the new reference LP");
							if (thisLP.getPrintFlag() == "Y") {
								logDebug("...remove primary status...");
								isPrimary = true;
								thisLP.setPrintFlag("N");
								aa.licenseProfessional.editLicensedProfessional(thisLP);
							}
							var remCapResult = aa.licenseProfessional.removeLicensedProfessional(thisLP);
							if (capLicenseResult.getSuccess()) {
								logDebug("...Success.");
							} else {
								logDebug("**WARNING removing lic prof: " + remCapResult.getErrorMessage());
							}
						}
					}
				}

				// add the LP to the CAP
				var asCapResult = aa.licenseScript.associateLpWithCap(itemCap, lpsm)
					if (!asCapResult.getSuccess()) {
						logDebug("**WARNING error associating CAP to LP: " + asCapResult.getErrorMessage())
					} else {
						logDebug("Associated the CAP to the new LP")
					}

					// Now make the LP primary again
					if (isPrimary) {
						var capLps = getLicenseProfessional(itemCap);

						for (var thisCapLpNum in capLps) {
							if (capLps[thisCapLpNum].getLicenseNbr().equals(licNum)) {
								var thisCapLp = capLps[thisCapLpNum];
								thisCapLp.setPrintFlag("Y");
								aa.licenseProfessional.editLicensedProfessional(thisCapLp);
								logDebug("Updated primary flag on Cap LP : " + licNum);

								// adding this return will cause the test script to work without error, even though this is the last statement executed
								//if (returnMessage.length > 0) return returnMessage;
								//else return null;

							}
						}
					}
			} // do populate on the CAP
		} // do populate on the REF
	} // for each license

	if (returnMessage.length > 0)
		return returnMessage;
	else
		return null;

} // end function 
function feeAmount(feestr) {
	// optional statuses to check for (SR5082)
	//
	var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			feeTotal += feeObjArr[ff].getFee()

			return feeTotal;
} 

//Parameter 1 = CapId, Parameter 2 to n = Fee Code to ignore
function feeAmountExcept(checkCapId) 
	{
   	var checkStatus = false;
	var exceptArray = new Array(); 
	//get optional arguments 
	if (arguments.length > 1)
		{
		checkStatus = true;
		for (var i=1; i<arguments.length; i++)
			exceptArray.push(arguments[i]);
		}
        
	var feeTotal = 0;
	var feeResult=aa.fee.getFeeItems(checkCapId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	for (ff in feeObjArr)
		if ( !checkStatus || !exists(feeObjArr[ff].getFeeCod(),exceptArray) )
			feeTotal+=feeObjArr[ff].getFee()
			
	return feeTotal;
	}

 
function feeBalance(feestr) {
	// Searches payment fee items and returns the unpaid balance of a fee item
	// Sums fee items if more than one exists.  Optional second parameter fee schedule
	var amtFee = 0;
	var amtPaid = 0;
	var feeSch;

	if (arguments.length == 2)
		feeSch = arguments[1];

	var feeResult = aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))) {
			amtFee += feeObjArr[ff].getFee();
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);
			if (pfResult.getSuccess()) {
				var pfObj = pfResult.getOutput();
				for (ij in pfObj)
					if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
						amtPaid += pfObj[ij].getFeeAllocation()
			}
		}
	return amtFee - amtPaid;
}
 
function feeBalanceFromDate(searchDays,feestr)
	{
	// Searches payment fee items and returns the unpaid balance of a fee item
	// searchDays = Days in future or past to search for ex. -120 would search for today -120 days
	// feestr = Fee Code to search for
	// optional 3rd parameter Fee Schedule
	// to get balance of fee schedule use following example feeBalanceFromDate(-120,null,"SCHEDULE");
	// to get balance of all fees use following feeBalanceFromDate(-120,null);
	var amtFee = 0;
	var amtPaid = 0;
	var feeSch;
	var jsFeeDate = new Date(aa.util.now());
	
	var jsStartDate = new Date(aa.util.now());
	jsStartDate.setDate(jsStartDate.getDate() + searchDays);
	

	if (arguments.length == 3) feeSch = arguments[2]; 

	var feeResult=aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	for (ff in feeObjArr)
	{
		jsFeeDate.setTime(feeObjArr[ff].getApplyDate().getEpochMilliseconds());
		if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle())) && (jsFeeDate  >= jsStartDate))
			{
			amtFee+=feeObjArr[ff].getFee();
			var pfResult = aa.finance.getPaymentFeeItems(capId, null);
			if (pfResult.getSuccess())
				{
				var pfObj = pfResult.getOutput();
				for (ij in pfObj)
					if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
						amtPaid+=pfObj[ij].getFeeAllocation()
				}
			}
	}
	return amtFee - amtPaid;
	} 
function feeCopyByDateRange(pStartDate, pEndDate) 
	// gets total for fees assessed during date range
	// optional fee statuses to check for						
	{
	//get End and Start Dates
	var jsStartDate = new Date(pStartDate);
	jsStartDate.setHours(0,0,0,0); //Bring StartDate to 00:00 AM
	var jsEndDate = new Date(pEndDate);
	jsEndDate.setHours(23,59,59,999); //Bring EndDate close to midnight
	
	//logDebug("Start Date: "+ (jsStartDate.getMonth()+1).toString() +"/"+jsStartDate.getDate()+"/"+jsStartDate.getFullYear() + " End Date: " + (jsEndDate.getMonth()+1).toString() +"/"+jsEndDate.getDate()+"/"+jsEndDate.getFullYear());

	//get optional arguments 
	var checkStatus = false;
	var statusArray = new Array(); 
	if (arguments.length > 2)
		{
		checkStatus = true;
		for (var i=2; i<arguments.length; i++)
			statusArray.push(arguments[i]);
		}

	//get all feeitems on CAP
	var feeResult=aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	//get total applicable fees
	var feesTotal = 0;
	var jsFeeDate = new Date(aa.util.now());
	for (ff in feeObjArr)
		{
		jsFeeDate.setTime(feeObjArr[ff].getApplyDate().getEpochMilliseconds());
		//logDebug("Fee Apply Date: "+(jsFeeDate.getMonth()+1).toString() +"/"+ jsFeeDate.getDate()+"/"+jsFeeDate.getFullYear());
		if (jsFeeDate  >= jsStartDate && jsFeeDate <= jsEndDate && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(),statusArray) ) )
			{
			 addFee(ffeObjArr[ff].getFeeCod(),  ffeObjArr[ff].getFeeSchudle() ,  ffeObjArr[ff].getPaymentPeriod() ,  ffeObjArr[ff].getFeeUnit() ,    'Y') 
			//logDebug("Added to Total: "+feeObjArr[ff].getFee());
			}
		}
			
	return feesTotal;
	}

 
function feeExists(feestr) // optional statuses to check for
{
	var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			return true;

	return false;
} 
function feeGetTotByDateRange(pStartDate, pEndDate) 
	// gets total for fees assessed during date range
	// optional fee statuses to check for						
	{
	//get End and Start Dates
	var jsStartDate = new Date(pStartDate);
	jsStartDate.setHours(0,0,0,0); //Bring StartDate to 00:00 AM
	var jsEndDate = new Date(pEndDate);
	jsEndDate.setHours(23,59,59,999); //Bring EndDate close to midnight
	
	//logDebug("Start Date: "+ (jsStartDate.getMonth()+1).toString() +"/"+jsStartDate.getDate()+"/"+jsStartDate.getFullYear() + " End Date: " + (jsEndDate.getMonth()+1).toString() +"/"+jsEndDate.getDate()+"/"+jsEndDate.getFullYear());

	//get optional arguments 
	var checkStatus = false;
	var statusArray = new Array(); 
	if (arguments.length > 2)
		{
		checkStatus = true;
		for (var i=2; i<arguments.length; i++)
			statusArray.push(arguments[i]);
		}

	//get all feeitems on CAP
	var feeResult=aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess())
		{ var feeObjArr = feeResult.getOutput(); }
	else
		{ logDebug( "**ERROR: getting fee items: " + capContResult.getErrorMessage()); return false }
	
	//get total applicable fees
	var feesTotal = 0;
	var jsFeeDate = new Date(aa.util.now());
	for (ff in feeObjArr)
		{
		jsFeeDate.setTime(feeObjArr[ff].getApplyDate().getEpochMilliseconds());
		//logDebug("Fee Apply Date: "+(jsFeeDate.getMonth()+1).toString() +"/"+ jsFeeDate.getDate()+"/"+jsFeeDate.getFullYear());
		if (jsFeeDate  >= jsStartDate && jsFeeDate <= jsEndDate && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(),statusArray) ) )
			{
			feesTotal += feeObjArr[ff].getFee(); 
			//logDebug("Added to Total: "+feeObjArr[ff].getFee());
			}
		}
			
	return feesTotal;
	}

 
//@ts-check
/**
 * Find the sum total Quantity of the Fee Items on the current record (global 'capId') which match.
 * If the supplied Fee Item Code does not exist on the current record, then zero is returned.
 * @param {string} feestr Fee Item Code to search.
 * @returns Returns the Quantity field of the given fee item || returns false if there was an error.
 */
function feeQty(feestr) {
	var feeQty = 0;

    if (typeof feestr === typeof undefined || feestr == null || feestr == "") {
        logDebug("'feeQty' - feestr parameter is undefined, null, or an empty string.");
        return null;
    }
	if (typeof capId === typeof undefined || capId == null) {
		logDebug("'feeQty' capId is undefined.");
		return false;
	}

	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: 'feeQty' getting fee items: " + capContResult.getErrorMessage());
		return false;
	}

	for (var ff in feeObjArr) {
		if (feestr.equals(feeObjArr[ff].getFeeCod())) {
			feeQty += feeObjArr[ff].getFeeUnit();
		}
	}

	return feeQty;
}
 
/**
 * FileObject to handle File Disk IO operations
 * 
 * @param {*} fileName full file name / or aa.io.File object
 * @function readFile() reads the file from disk
 * @function writeLines @param inputArr writes array of strings to the file
 * @function writeString(str) writes string to the file
 * @function createFile() creates the file on disk
 * @function deleteFile() deletes the file from disk
 * @function attachFileToRecord @param recordId, @param docGroup, @param docCategory, {@param docType}, {@param edmsSourceName} attaches the file to the record
 * @function writeDataArraysToFile @param arrayOfArrays, @param innerDelimiter, @param outerDelimiter writes array of arrays to the file
 * @function renameFile @param fileName renames the file on disk. Note: fileName does not include an file extension
 * @returns {FileObject} file object
 * 
 * @requires {@link #getEDMSDefualtSource}
 * 
 * @example
 * var myFile = new FileObject("AccelaTest.csv");
 * myFile.writeString("Column1,Column2,Column3");
 * var arrayOfArrays = [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"], ["j", "k", "l"]];
 * myFile.writeDataArraysToFile(arrayOfArrays, ",", "\n");
 * myFile.attachFileToRecord(capId, "BLDG_GENERAL", "Construction Plans", "application/vnd.ms-excel");
 * myFile.renameFile("AccelaTest3");
 * logDebug("Reading File: " + myFile.readFile());
 * logDebug("Deleting File: " + myFile.deleteFile());
 *
 */
function FileObject(fileName) {
    this.fileObj = null;
    this.fileName = null;
    this.fileExists = false;
    // initialize
    try {
        if (typeof(fileName)== "object")
		{

            if (fileName.getClass().toString().equals("class java.lang.String")) // object without getClass, assume that this is a string
            {
                this.fileName = fileName;
                this.fileObj = aa.io.File(fileName); //#EMSE
                this.filePath = String(this.fileObj);
            }

            if (fileName.getClass().toString().equals("class java.io.File")){
                //exploreObject(fileName);
                this.fileObj = fileName;
                var parts = String(fileName).split('\\');
                this.fileName = parts[parts.length - 1];
                this.filePath = String(this.fileObj);
            }
        }
        else{
            this.fileName = fileName;
            this.fileObj = aa.io.File(fileName); //#EMSE
            this.filePath = String(this.fileObj);
        }

        
        if (this.fileObj) {
            this.fileExists = true;
            logDebug("File " + this.fileName + " exists.");
            logDebug("File Path: " + this.filePath);
        }
    } catch (ex) {
        logDebug("**Error occurred while initializing file " + ex);
    }

    /**
     * Reads the file from disk
     * @returns {Array} array of lines
     */
    this.readFile = function() {
        if (!this.fileExists) {
            logMessage("ERROR", "File " + this.fileName + " does not exists, abort.");
            logDebug("**Error file does not exists, abort.");
            return null;
        }
        var resultsArr = [];
        try {
            // Start reading
            var filePath = this.filePath;
            logDebug("Reading file from disk: " + filePath);
            var br = aa.io.BufferedReader(filePath); //#EMSE
            var line = null;
            while ((line = br.readLine()) != null) {
                resultsArr.push(line);
            }
            br.close();
        } catch (ex) {
            logMessage("ERROR", "Error occurred while reading file from disk.");
            logDebug("Error occurred while reading file from disk: " + ex);
            return null;
        }

        return resultsArr;
    };

    /**
     * Writes array of strings to the file
     * @param {Array} inputArr Array of lines
     * @returns {java.io.File} file object
     */
    this.writeLines = function(inputArr) {
        if (!this.fileExists) {
            this.createFile();
        }
        var writer = null;
        try {
            var filePath = this.filePath;
            writer = aa.io.BufferedWriter(filePath); //EMSE
            for (i in inputArr) {
                if (i > 0)
                    writer.newLine();
                writer.write(inputArr[i]);
            }
        } catch (e) {
            logMessage("ERROR", "An error occurred while writing to file: " + e);
            logDebug("**Error: An error occurred while writing to file: " + e);
            return false;
        } finally {
            try {
                if (writer != null)
                    writer.close();
            } catch (writerCloseEx) {
                logMessage("ERROR", "An error occurred while closing file writer: " + writerCloseEx);
                logDebug("**Error: An error occurred while closing file writer: " + writerCloseEx);
                return false;
            }
        }

        return true;
    };
	

    /**
     * Writes strings to file
     * @param {String} str
     * @returns {java.io.File} file object
     */
    this.writeString = function(str) {
        if (!this.fileExists) {
            this.createFile();
        }
        var writer = null;
        try {
            var filePath = this.filePath;
            writer = aa.io.BufferedWriter(filePath); //#EMSE
            writer.write(str);
        } catch (e) {
            logMessage("ERROR", "An error occurred while writing to file: " + e);
            logDebug("**Error: An error occurred while writing to file: " + e);
            return false;
        } finally {
            try {
                if (writer != null)
                    writer.close();
            } catch (writerCloseEx) {
                logMessage("ERROR", "An error occurred while closing file writer: " + writerCloseEx);
                logDebug("**Error: An error occurred while closing file writer: " + writerCloseEx);
                return false;
            }
        }

        return true;
    };

    this.writeDataArraysToFile = function(arrayOfArrays, innerDelimiter, outerDelimiter) {
        if (!this.fileExists) {
            this.createFile();
        }
        if (isEmpty(innerDelimiter)) innerDelimiter = ",";
        if (isEmpty(outerDelimiter)) outerDelimiter = "\n";

        try{
            this.fileObj = aa.io.writeDataArraysToFile(arrayOfArrays, this.fileName, innerDelimiter, outerDelimiter);

            if (this.fileObj) {
                this.fileExists = true;
                logDebug("File " + this.fileName + " has been updated with" + arrayOfArrays.length + " rows.");
            }
        }
        catch (e) {
            logDebug("**Error: An error occurred while writing to file: " + e);
            return false;
        }

       
    }
    /**
     * Creates the file on Disk
     * @param {string} fullFileName *OPTIONAL Full file name including path and extension
     */
    this.createFile = function() {
        if (this.fileExists) {
            logMessage("ERROR", "File " + this.fileName + " already exists, abort.");
            logDebug("**Error file already exists, abort.");
            return false;
        }
        try {
            if (!this.fileObj.createNewFile()) {
                logMessage("ERROR", "File " + this.fileName + " was not created successfully!");
                logDebug("**Error: File " + this.fileName + " was not created successfully!");
            } else {
                logMessage("INFO", "File " + this.fileName + " was created successfully!");
                logDebug("File " + this.fileName + " was created successfully!");
                this.fileExists = true;
                return true;
            }
        } catch (e) {
            logMessage("ERROR", "An error occurred while creating file: " + e);
            logDebug("**Error: An error occurred while creating file: " + e);
        } finally {
            if (!this.fileExists) {
                logMessage("ERROR", "File was not created successfully.");
            }
        }

        return false;
    };
	
	this.renameFile = function(fileName) {
		 if (!this.fileExists) {
            logMessage("ERROR", "File " + this.fileName + " does not exist, abort.");
            logDebug("**Error file does not exist, abort.");
            return false;
        }
        try {
            if (this.fileExists) {
                var fileRenamed = aa.io.renameFile(this.fileObj, fileName);

                if(fileRenamed){
                    this.fileName = fileName;
                    this.fileObj = fileRenamed;
                    this.filePath = String(this.fileObj);
                }
                logDebug("**INFO: File " + this.fileName + " was renamed successfully to " + fileName);
            } else {
                logDebug("File " + this.fileName + " was not renamed successfully!");
                this.fileExists = true;
                return true;
            }
        } catch (e) {
            logMessage("ERROR", "An error occurred while renaming file: " + e);
            logDebug("**Error: An error occurred while renaming file: " + e);
        }
	}

    this.attachFileToRecord = function(recordId, docGroup, docCategory, docType, edmsSourceName) {

        try {
            if(isEmpty(docType)) docType = "text/plain";
            if(isEmpty(edmsSourceName)) edmsSourceName = getEDMSDefualtSource();

            var itemCap = aa.cap.getCap(recordId).getOutput();
            var itemAppTypeResult = itemCap.getCapType();
	        var itemAppTypeString = itemAppTypeResult.toString(); 
	        var itemAppTypeArray = itemAppTypeString.split("/");
            var itemModule = itemAppTypeArray[0];

            var docContent = aa.document.newDocumentContentModel().getOutput()
            var sbs = aa.io.FileInputStream(this.filePath);
            docContent.setDocInputStream(sbs)
            var newdoc = aa.document.newDocumentModel().getOutput()
            newdoc.setCapID(recordId)
            newdoc.setEntityID(recordId)
            newdoc.setEntityType('CAP')
            newdoc.setDocGroup(docGroup)
            newdoc.setDocCategory(docCategory)
            newdoc.setDocumentContent(docContent)
            newdoc.setFileName(this.fileName)
            newdoc.setDocType(docType)
            newdoc.setSourceName(edmsSourceName);
            newdoc.setSource('STANDARD')
            newdoc.setRecFulNam('ADMIN')
            newdoc.setRecStatus('A')
            newdoc.setModuleName(itemModule)
            newdoc.setServiceProviderCode(aa.getServiceProviderCode())
            var result = aa.document.createDocument(newdoc)
            if (result && result.getSuccess()) {
                var resultOutput = result.getOutput();
                logDebug("Successfully attached file to record: " + resultOutput);
                return true;
            }else{
                logDebug("Error attaching file to record: " + result.getErrorMessage())
                return false;
            }
        } catch (ex) {
            logDebug("Error attaching file to record: " + ex + " Line: " + ex.lineNumber);
            return false;
        }
   
    }
	
	 /**
     * Creates the file on Disk
     * @param {string} fullFileName *OPTIONAL Full file name including path and extension
     */
    this.deleteFile = function() {
        if (!this.fileExists) {
            logMessage("ERROR", "File " + this.fileName + " does not exist, abort.");
            logDebug("**Error file does not exist, abort.");
            return false;
        }
        try {
            if (this.fileExists) {
				var fileDeletedResponse = aa.io.deleteFile(this.fileObj);
                logMessage("INFO", "File " + this.fileName + " was deleted successfully!");
                logDebug("**INFO: File " + this.fileName + " was deleted successfully!");
            } else {
                logMessage("INFO", "File " + this.fileName + " was not deleted successfully!");
                logDebug("File " + this.fileName + " was not deleted successfully!");
                this.fileExists = true;
                return true;
            }
        } catch (e) {
            logMessage("ERROR", "An error occurred while deleting file: " + e);
            logDebug("**Error: An error occurred while deleting file: " + e);
        } finally {
            if (!this.fileExists) {
                logMessage("ERROR", "File was not deleted successfully.");
            }
        }

        return false;
    };
} 
//@ts-check
/**
 * Generates a report and saves it to disk and returns it.
 *
 * @param {object} itemCap
 * @param {string} reportName
 * @param {string} module
 * @param {array} parameters
 * @returns {object} reportFile
 */
function generateReport(itemCap, reportName, module, parameters) {

  //returns the report file which can be attached to an email.
  var user = currentUserID;   // Setting the User Name
  var report;
  var reportOutput;
  var reportInfoModel = aa.reportManager.getReportInfoModelByName(reportName);

  if (reportInfoModel && reportInfoModel.getSuccess()) {
    report = reportInfoModel.getOutput();
  }

  if (report) {
    report.setModule(module);
    report.setCapId(itemCap.getID1() + "-" + itemCap.getID2() + "-" + itemCap.getID3());
    report.setReportParameters(parameters);
    report.getEDMSEntityIdModel().setAltId(itemCap.getCustomID());

    var permit = aa.reportManager.hasPermission(reportName, user);

    if (permit.getOutput().booleanValue()) {
      var reportResult = aa.reportManager.getReportResult(report);
      if (reportResult) {
        reportOutput = reportResult.getOutput();
        var reportFile = aa.reportManager.storeReportToDisk(reportOutput);
        reportFile = reportFile.getOutput();
        return reportFile;
      } else {
        logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
        return false;
      }
    } else {
      logDebug("You have no permission.");
      return false;
    }
  } else {
    logDebug("System failed get report: " + reportName);
    return false;
  }
} 
function generateReport4Workflow(itemCap,reportName,module,parameters) {

  //returns the report file which can be attached to an email.
  var user = currentUserID;   // Setting the User Name
  var report = aa.reportManager.getReportModelByName(reportName);
  report = report.getOutput();
  //report.setModule(module);
  //report.setCapId(itemCap);
  //report.setReportParameters(parameters); 

  var permit = aa.reportManager.hasPermission(reportName,user);

  if (permit.getOutput().booleanValue()) {
    var reportResult = aa.reportManager.runReport(parameters,report);
    if(reportResult) {
      return reportOutput = reportResult.getOutput();
      
    }  else {
      logDebug("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
      return false;
    }
  } else {
    logDebug("You have no permission.");
    return false;
  }
} 
function genericTemplateObject(gtmp) {
	this.ASI = new Array(); //Condition Array
	this.ASIT = new Array();
	this.hasASI = false;
	this.hasTables = false;
	this.template = gtmp;

	var formGroupsObj = template.getTemplateForms();
	var formGroups = new Array();
	if (formGroupsObj != null) {
		aa.print(formGroupsObj);
		formGroups = formGroupsObj.toArray();
		for (grp in formGroups) {
			var subgroupsObj = formGroups[grp].getSubgroups();
			if (subgroupsObj != null) {
				var subgroups = subgroupsObj.toArray();
				this.hasASI = true;
				for (sgrp in subgroups) {
					var sgrpName = subgroups[sgrp].getSubgroupName();
					var fields = subgroups[sgrp].getFields().toArray();
					for (fld in fields) {
						this.ASI[sgrpName + "." + fields[fld].getFieldName()] = fields[fld].getDefaultValue();
					}
				}
			}
		}
	}

	var tableGroupsObj = template.getTemplateTables();
	var tableGroups = new Array();
	if (tableGroupsObj != null) {
		var tableGroups = tableGroupsObj.toArray();
		for (grp in tableGroups) {
			var subgroupsObj = tableGroups[grp].getSubgroups();
			if (subgroupsObj != null) {
				var subgroups = subgroupsObj.toArray();
				for (sgrp in subgroups) {
					var sgrpName = subgroups[sgrp].getSubgroupName();
					this.ASIT[sgrpName] = new Array();
					this.hasTables = true;
					var rowsObj = subgroups[sgrp].getRows();
					if (rowsObj != null) {
						var rows = rowsObj.toArray();
						for (i = 0; i < rows.length; i++) {
							this.ASIT[sgrpName][i] = new Array();
							var fields = rows[i].getValues().toArray();
							for (fld in fields) {
								this.ASIT[sgrpName][i][fields[fld].getFieldName()] = fields[fld].getValue();
							}
						}
					}
				}
			}
		}
	}

	return this;
} 
 function getACADocDownloadParam4Notification(params,acaUrl,docModel) {

	// pass in a hashtable and it will add the additional parameters to the table



	addParameter(params, "$$acaDocDownloadUrl$$", getACADocumentDownloadUrl(acaUrl,docModel));

	

	return params;	

}



 
 function getACADocumentDownloadUrl(acaUrl,documentModel) {

   	

   	//returns the ACA URL for supplied document model



	var acaUrlResult = aa.document.getACADocumentUrl(acaUrl, documentModel);

	if(acaUrlResult.getSuccess())

	{

		acaDocUrl = acaUrlResult.getOutput();

		return acaDocUrl;

	}

	else

	{

		logDebug("Error retrieving ACA Document URL: " + acaUrlResult.getErrorType());

		return false;

	}

}





 
/**
 * Adds a parameter $$acaRecordUrl$$ to a hashtable by buiding a URL path 
 * for the record in ACA
 * 
 * @requires
 * 		addParameter()
 * 		getACARecordURL()
 *
 * @param hashtable
 *			parameters hashtable
 * @param acaUrl
 *			ACA URL Path to append
 * @param {capId}
 *			capId - optional capId object
 * @returns {string}
 *			acaUrl - URL path for the record in ACA
 *
 */

function getACARecordParam4Notification(params,acaUrl) {

	itemCap = (arguments.length == 3) ? arguments[2] : capId;

	addParameter(params, "$$acaRecordUrl$$", getACARecordURL(acaUrl,itemCap));

	return params;	

}



 
/**
 * Builds a URL path for the record in ACA
 * Site URL
 * 
 * @param acaUrl
 *			ACA URL Path to append
 * @param {capId}
 *			capId - optional capId object
 * @returns {string}
 *			acaUrl - URL path for the record in ACA
 *
 */
 
function getACARecordURL(acaUrl) {
	itemCap = (arguments.length == 2) ? arguments[1] : capId;
	var enableCustomWrapper = lookup("ACA_CONFIGS","ENABLE_CUSTOMIZATION_PER_PAGE");
	var acaRecordUrl = "";
	var id1 = itemCap.ID1;
 	var id2 = itemCap.ID2;
 	var id3 = itemCap.ID3;
 	var itemCapModel = aa.cap.getCap(itemCap).getOutput().getCapModel();

   	acaRecordUrl = acaUrl + "/urlrouting.ashx?type=1000";   
	acaRecordUrl += "&Module=" + itemCapModel.getModuleName();
	acaRecordUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaRecordUrl += "&agencyCode=" + aa.getServiceProviderCode();
	if(matches(enableCustomWrapper,"Yes","YES")) acaRecordUrl += "&FromACA=Y";

   	return acaRecordUrl;

} 
/**
 * Builds a URL path for the record in ACA that is appended to the ACA Site URL.
 * 
 * @param {capId}
 * 		capId - optional capId object
 * @returns {string}
 *		acaUrl - URL path for the record in ACA
 *
 */

function getACAUrl(){

	// returns the path to the record on ACA.  Needs to be appended to the site

	itemCap = (arguments.length == 1) ? arguments[0] : capId;
	var enableCustomWrapper = lookup("ACA_CONFIGS","ENABLE_CUSTOMIZATION_PER_PAGE");
   	var acaUrl = "";
	var id1 = itemCap.getID1();
	var id2 = itemCap.getID2();
	var id3 = itemCap.getID3();
	var itemCapModel = aa.cap.getCap(itemCap).getOutput().getCapModel();

	acaUrl += "/urlrouting.ashx?type=1000";
	acaUrl += "&Module=" + itemCapModel.getModuleName();
	acaUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
	acaUrl += "&agencyCode=" + aa.getServiceProviderCode();
	if(matches(enableCustomWrapper,"Yes","YES")) acaUrl += "&FromACA=Y";

	return acaUrl;
} 
function getAddressCountyByAddressType(aType) { //optional capId parameter
	var itemCap = capId
    if (arguments.length > 1)
        itemCap = arguments[1]; // use cap ID specified in args

    var addResult = aa.address.getAddressByCapId(itemCap);

    if (addResult.getSuccess()) {
    	var addArray = addResult.getOutput();
    	for (var jj in addArray) {
    		var thisAddress = addArray[jj];
    		if (thisAddress.getAddressType() != null) {
	      		if (String(thisAddress.getAddressType()).toUpperCase().equals(aType.toUpperCase())) {
	    			return thisAddress.getCounty();
	    		}		
    		} 
    	}
    } else {
    	logDebug("Could not return address: " + addResult.getErrorMessage());
    	return false;
    }

    logDebug("Could not find an address of type: " + aType);
    return false;
} 
function getAddressLineByAddressType(aType) { //optional capId parameter
	var itemCap = capId
    if (arguments.length > 1)
        itemCap = arguments[1]; // use cap ID specified in args

    var addResult = aa.address.getAddressByCapId(itemCap);

    if (addResult.getSuccess()) {
    	var addArray = addResult.getOutput();
    	for (var jj in addArray) {
    		var thisAddress = addArray[jj];
    		if (thisAddress.getAddressType() != null) {
	      		if (String(thisAddress.getAddressType()).toUpperCase().equals(aType.toUpperCase())) {
	    			return thisAddress.getDisplayAddress();
	    		}		
    		} 
    	}
    } else {
    	logDebug("Could not return address: " + addResult.getErrorMessage());
    	return false;
    }

    logDebug("Could not find an address of type: " + aType);
    return false;
} 
 function getAppConditions(params,pType,pStatus,pDesc,pImpact) {



    if (pType==null)

        var condResult = aa.capCondition.getCapConditions(capId);

    else

        var condResult = aa.capCondition.getCapConditions(capId,pType);

        

    if (condResult.getSuccess())

        var capConds = condResult.getOutput();

    else { 

        logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

        logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());

    }

    

    var cStatus;

    var cDesc;

    var cImpact;

    

    var condForEmail = "";



    for (cc in capConds) {

        var thisCond = capConds[cc];

        var cStatus = thisCond.getConditionStatus();

        var cDesc = thisCond.getConditionDescription();

        var cPubDisplayMessage = thisCond.getDispPublicDisplayMessage();

        var cImpact = thisCond.getImpactCode();

        var cType = thisCond.getConditionType();

        if (cStatus==null)

            cStatus = " ";

        if (cDesc==null)

            cDesc = " ";

        if (cImpact==null)

            cImpact = " ";

        //Look for matching condition

        

        if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))

            condForEmail += cDesc + ": " + cPubDisplayMessage;

    }



    addParameter(params, "$$conditions$$", condForEmail);



    return params; 



}
 
function getAppIdByASI(ASIName,ASIValue,ats)
	//
	// returns the cap Id string of an application based on App-Specific Info and applicationtype.  Returns first result only!
	//
	{
	var ata = ats.split("/");
	if (ata.length != 4)
		logDebug("**ERROR: getAppIdByASI in appMatch.  The following Application Type String is incorrectly formatted: " + ats);

	var getCapResult = aa.cap.getCapIDsByAppSpecificInfoField(ASIName,ASIValue);
	if (getCapResult.getSuccess())
		var apsArray = getCapResult.getOutput();
	else
		{ logDebug( "**ERROR: getting caps by app type: " + getCapResult.getErrorMessage()) ; return null }
		

	for (aps in apsArray)
		{
		myCap = aa.cap.getCap(apsArray[aps].getCapID()).getOutput();
		myAppTypeString = myCap.getCapType().toString();
		myAppTypeArray = myAppTypeString.split("/");

		isMatch = true;
		for (xx in ata)
			if (!ata[xx].equals(myAppTypeArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
		
		if (isMatch)
			{
			logDebug("getAppIdByName(" + ASIName + "," + ASIValue + "," + ats + ") Returns " + apsArray[aps].getCapID().toString()); 
			return apsArray[aps].getCapID().toString()
			}
		}
	}

 
function getAppIdByName(gaGroup,gaType,gaName)
//
// returns the cap Id string of an application that has group,type,and name
//
	{
	getCapResult = aa.cap.getByAppType(gaGroup,gaType);
	if (getCapResult.getSuccess())
		var apsArray = getCapResult.getOutput();
	else
		{ logDebug( "**ERROR: getting caps by app type: " + getCapResult.getErrorMessage()) ; return null }
		

	for (aps in apsArray)
		{
		var myCap = aa.cap.getCap(apsArray[aps].getCapID()).getOutput();
		if (myCap.getSpecialText().equals(gaName))
			{
			logDebug("getAppIdByName(" + gaGroup + "," + gaType + "," + gaName + ") Returns " + apsArray[aps].getCapID().toString()); 
			return apsArray[aps].getCapID().toString()
			}
		}
	}
 
function getApplication(appNum) 
//
// returns the capId object of an application
//
	{
	var getCapResult = aa.cap.getCapID(appNum);
	if (getCapResult.getSuccess())
		return getCapResult.getOutput();
	else
		{ logDebug( "**ERROR: getting cap id (" + appNum + "): " + getCapResult.getErrorMessage()) }
	}

 
function getAppSpecific(itemName)  // optional: itemCap
{
	var updated = false;
	var i=0;
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
   	
	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		
		var itemGroup = itemName.substr(0,itemName.indexOf("."));
		var itemName = itemName.substr(itemName.indexOf(".")+1);
	}
	
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
 	{
		var appspecObj = appSpecInfoResult.getOutput();
		
		if (itemName != "")
		{
			for (i in appspecObj)
				if( appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
				{
					return appspecObj[i].getChecklistComment();
					break;
				}
		} // item name blank
	} 
	else
		{ logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}

 
function getCapByAddress(ats) 
//
// returns the capid that matches the current address and app type string
// if multiple records will return the first and warning.
//
	{
	var retArr = new Array();
	
	// get address data
	var addResult = aa.address.getAddressByCapId(capId);
	if (addResult.getSuccess())
		{ var aoArray = addResult.getOutput(); }
	else	
		{ logDebug("**ERROR: getting address by cap ID: " + addResult.getErrorMessage()); return false; }
	
	if (aoArray.length)
		{ var ao = aoArray[0]; }
	else
		{ logDebug("**WARNING: no address for comparison:"); return false; }
	
	// get caps with same address
	var capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),ao.getZip(),ao.getStreetDirection(),null);
	if (capAddResult.getSuccess())
	 	{ var capIdArray=capAddResult.getOutput(); }
	else
	 	{ logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }
	
	
	// loop through related caps
	for (cappy in capIdArray)
		{
		// get file date
		var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
		
		// get cap type
		
		reltype = relcap.getCapType().toString();
		
		var isMatch = true;
		var ata = ats.split("/");
		if (ata.length != 4)
			logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
		else
			for (xx in ata)
				if (!ata[xx].equals(appTypeArray[xx]) && !ata[xx].equals("*"))
					isMatch = false;

		if (isMatch)			
			retArr.push(capIdArray[cappy]);

		} // loop through related caps
		
	if (retArr.length > 1)
		{
		logDebug("**WARNING: Multiple caps returned for this address/apptype") ; return retArr[0] 
		}
	
	if (retArr.length == 0)
		return retArr[0];
		
	}

 
function getCapId() {

	var s_id1 = aa.env.getValue("PermitId1");
	var s_id2 = aa.env.getValue("PermitId2");
	var s_id3 = aa.env.getValue("PermitId3");

	if (s_id1 == null || s_id1 == ""
		 || s_id2 == null || s_id2 == ""
		 || s_id3 == null || s_id3 == "") {
		return null;
	}
	var s_capResult = aa.cap.getCapID(s_id1, s_id2, s_id3);
	if (s_capResult.getSuccess())
		return s_capResult.getOutput();
	else {
		logDebug("function getCapID: failed to get capId from script environment: " + s_capResult.getErrorMessage());
		return null;
	}
}
 
function getCapsWithConditionsRelatedByRefContact(itemCap,capType,pType,pStatus,pDesc,pImpact) {
	var matchingCapArray = new Array();
	var c = aa.people.getCapContactByCapID(itemCap).getOutput()
	for (var i in c)
		   {
		   var con = c[i];
		   if (con.getCapContactModel().getRefContactNumber())
		       {
			var p = con.getPeople();
			var psm = aa.people.createPeopleModel().getOutput()

			psm.setContactSeqNumber(con.getCapContactModel().getRefContactNumber());

			var cResult = aa.people.getCapIDsByRefContact(psm);  // needs 7.1
			if (cResult.getSuccess()) {
				var cList = cResult.getOutput();
				for (var j in cList) {
					var thisCapId = cList[j];
					if (appMatch(capType,thisCapId)) {
						if (pType==null)
							var condResult = aa.capCondition.getCapConditions(thisCapId);
						else
							var condResult = aa.capCondition.getCapConditions(thisCapId,pType);

						if (condResult.getSuccess())
							var capConds = condResult.getOutput();
						else
							{
							logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
							logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
							return false;
							}

						var cStatus;
						var cDesc;
						var cImpact;

						for (cc in capConds)
							{
							var thisCond = capConds[cc];
							var cStatus = thisCond.getConditionStatus();
							var cDesc = thisCond.getConditionDescription();
							var cImpact = thisCond.getImpactCode();
							var cType = thisCond.getConditionType();
							if (cStatus==null)
								cStatus = " ";
							if (cDesc==null)
								cDesc = " ";
							if (cImpact==null)
								cImpact = " ";
							//Look for matching condition

							if ( (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
								matchingCapArray.push(thisCapId);
							}
						}
					}
				}
			}
		}
	} 
function getChildren(pCapType, pParentCapId) 
	{
	// Returns an array of children capId objects whose cap type matches pCapType parameter
	// Wildcard * may be used in pCapType, e.g. "Building/Commercial/*/*"
	// Optional 3rd parameter pChildCapIdSkip: capId of child to skip

	var retArray = new Array();
	if (pParentCapId!=null) //use cap in parameter 
		var vCapId = pParentCapId;
	else // use current cap
		var vCapId = capId;
		
	if (arguments.length>2)
		var childCapIdSkip = arguments[2];
	else
		var childCapIdSkip = null;
		
	var typeArray = pCapType.split("/");
	if (typeArray.length != 4)
		logDebug("**ERROR in childGetByCapType function parameter.  The following cap type parameter is incorrectly formatted: " + pCapType);
		
	var getCapResult = aa.cap.getChildByMasterID(vCapId);
	if (!getCapResult.getSuccess())
		{ logDebug("**WARNING: getChildren returned an error: " + getCapResult.getErrorMessage()); return null }
		
	var childArray = getCapResult.getOutput();
	if (!childArray.length)
		{ logDebug( "**WARNING: getChildren function found no children"); return null ; }

	var childCapId;
	var capTypeStr = "";
	var childTypeArray;
	var isMatch;
	for (xx in childArray)
		{
		childCapId = childArray[xx].getCapID();
		if (childCapIdSkip!=null && childCapIdSkip.getCustomID().equals(childCapId.getCustomID())) //skip over this child
			continue;

		capTypeStr = aa.cap.getCap(childCapId).getOutput().getCapType().toString();	// Convert cap type to string ("Building/A/B/C")
		childTypeArray = capTypeStr.split("/");
		isMatch = true;
		for (yy in childTypeArray) //looking for matching cap type
			{
			if (!typeArray[yy].equals(childTypeArray[yy]) && !typeArray[yy].equals("*"))
				{
				isMatch = false;
				continue;
				}
			}
		if (isMatch)
			retArray.push(childCapId);
		}
		
	logDebug("getChildren returned " + retArray.length + " capIds");
	return retArray;

	}
	
 
function getChildTasks(taskName) {
	var childTasks = new Array();
	var childId = null;
	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		var workflowResult = aa.workflow.getTaskItems(itemCap, taskName, null, null, null, null);
	var wfObj = workflowResult.getOutput();
	for (i in wfObj) {
		var fTaskSM = wfObj[i];
		if (fTaskSM.getTaskDescription().equals(taskName)) {
			var relationArray = aa.workflow.getProcessRelationByCapID(itemCap, null).getOutput()
				for (thisRel in relationArray) {
					y = relationArray[thisRel]
						if (y.getParentTaskName() && y.getParentTaskName().equals(fTaskSM.getTaskDescription()))
							childId = y.getProcessID()
				}
		}
	}

	for (i in wfObj) {
		var fTaskSM = wfObj[i];
		if (fTaskSM.getProcessID() == childId)
			childTasks.push(fTaskSM)
	}

	return childTasks;

}
 
function getCAPConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;

	////////////////////////////////////////
	// Check Records
	////////////////////////////////////////

	if (pType == null)
		var condResult = aa.capCondition.getCapConditions(itemCap);
	else
		var condResult = aa.capCondition.getCapConditions(itemCap, pType);

	if (condResult.getSuccess())
		var capConds = condResult.getOutput();
	else {
		var capConds = new Array();
		logDebug("**WARNING: getting cap conditions: " + condResult.getErrorMessage());
	}

	var cStatus;
	var cDesc;
	var cImpact;

	for (cc in capConds) {
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus();
		var cDesc = thisCond.getConditionDescription();
		var cImpact = thisCond.getImpactCode();
		var cType = thisCond.getConditionType();
		var cComment = thisCond.getConditionComment();
		var cExpireDate = thisCond.getExpireDate();

		if (cStatus == null)
			cStatus = " ";
		if (cDesc == null)
			cDesc = " ";
		if (cImpact == null)
			cImpact = " ";
		//Look for matching condition

		if ((pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
			var r = new condMatchObj;
			r.objType = "Record";
			r.object = thisCond;
			r.status = cStatus;
			r.type = cType;
			r.impact = cImpact;
			r.description = cDesc;
			r.comment = cComment;
			r.expireDate = cExpireDate;

			var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

			r.arObject = langCond;
			r.arDescription = langCond.getResConditionDescription();
			r.arComment = langCond.getResConditionComment();

			resultArray.push(r);
		}
	}

	return resultArray;
}
function getAddressConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Address
	////////////////////////////////////////

	var addrResult = aa.address.getAddressByCapId(itemCap);
	if (!addrResult.getSuccess()) {
		logDebug("**WARNING: getting CAP addresses: " + addrResult.getErrorMessage());
		var addrArray = new Array();
	} else {
		var addrArray = addrResult.getOutput();
		if (!addrArray)
			addrArray = new Array();
	}

	for (var thisAddr in addrArray)
		if (addrArray[thisAddr].getRefAddressId()) {
			addCondResult = aa.addressCondition.getAddressConditions(addrArray[thisAddr].getRefAddressId())
				if (!addCondResult.getSuccess()) {
					logDebug("**WARNING: getting Address Conditions : " + addCondResult.getErrorMessage());
					var addrCondArray = new Array();
				} else {
					var addrCondArray = addCondResult.getOutput();
				}

				for (var thisAddrCond in addrCondArray) {
					var thisCond = addrCondArray[thisAddrCond];
					var cType = thisCond.getConditionType();
					var cStatus = thisCond.getConditionStatus();
					var cDesc = thisCond.getConditionDescription();
					var cImpact = thisCond.getImpactCode();
					var cType = thisCond.getConditionType();
					var cComment = thisCond.getConditionComment();
					var cExpireDate = thisCond.getExpireDate();

					if (cType == null)
						cType = " ";
					if (cStatus == null)
						cStatus = " ";
					if (cDesc == null)
						cDesc = " ";
					if (cImpact == null)
						cImpact = " ";

					if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
						var r = new condMatchObj;
						r.objType = "Address";
						r.addressObj = addrArray[thisAddr];
						r.status = cStatus;
						r.type = cType;
						r.impact = cImpact;
						r.description = cDesc;
						r.comment = cComment;
						r.expireDate = cExpireDate;

						var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

						r.arObject = langCond;
						r.arDescription = langCond.getResConditionDescription();
						r.arComment = langCond.getResConditionComment();

						resultArray.push(r);
					}
				}
		}

	return resultArray;
}
function getParcelConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Parcel
	////////////////////////////////////////

	var parcResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
	if (!parcResult.getSuccess()) {
		logDebug("**WARNING: getting CAP addresses: " + parcResult.getErrorMessage());
		var parcArray = new Array();
	} else {
		var parcArray = parcResult.getOutput();
		if (!parcArray)
			parcArray = new Array();
	}

	for (var thisParc in parcArray)
		if (parcArray[thisParc].getParcelNumber()) {
			parcCondResult = aa.parcelCondition.getParcelConditions(parcArray[thisParc].getParcelNumber())
				if (!parcCondResult.getSuccess()) {
					logDebug("**WARNING: getting Parcel Conditions : " + parcCondResult.getErrorMessage());
					var parcCondArray = new Array();
				} else {
					var parcCondArray = parcCondResult.getOutput();
				}

				for (var thisParcCond in parcCondArray) {
					var thisCond = parcCondArray[thisParcCond];
					var cType = thisCond.getConditionType();
					var cStatus = thisCond.getConditionStatus();
					var cDesc = thisCond.getConditionDescription();
					var cImpact = thisCond.getImpactCode();
					var cType = thisCond.getConditionType();
					var cComment = thisCond.getConditionComment();
					var cExpireDate = thisCond.getExpireDate();

					if (cType == null)
						cType = " ";
					if (cStatus == null)
						cStatus = " ";
					if (cDesc == null)
						cDesc = " ";
					if (cImpact == null)
						cImpact = " ";

					if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
						var r = new condMatchObj;
						r.objType = "Parcel";
						r.parcelObj = parcArray[thisParc];
						r.status = cStatus;
						r.type = cType;
						r.impact = cImpact;
						r.description = cDesc;
						r.comment = cComment;
						r.expireDate = cExpireDate;

						var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

						r.arObject = langCond;
						r.arDescription = langCond.getResConditionDescription();
						r.arComment = langCond.getResConditionComment();

						resultArray.push(r);
					}
				}
		}

	return resultArray;
}
function getLicenseConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check License
	////////////////////////////////////////

	var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);

	if (!capLicenseResult.getSuccess()) {
		logDebug("**WARNING: getting CAP licenses: " + capLicenseResult.getErrorMessage());
		var licArray = new Array();
	} else {
		var licArray = capLicenseResult.getOutput();
		if (!licArray)
			licArray = new Array();
	}

	for (var thisLic in licArray)
		if (licArray[thisLic].getLicenseProfessionalModel().getLicSeqNbr()) {
			var licCondResult = aa.caeCondition.getCAEConditions(licArray[thisLic].getLicenseProfessionalModel().getLicSeqNbr());
			if (!licCondResult.getSuccess()) {
				logDebug("**WARNING: getting license Conditions : " + licCondResult.getErrorMessage());
				var licCondArray = new Array();
			} else {
				var licCondArray = licCondResult.getOutput();
			}

			for (var thisLicCond in licCondArray) {
				var thisCond = licCondArray[thisLicCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus == null)
					cStatus = " ";
				if (cDesc == null)
					cDesc = " ";
				if (cImpact == null)
					cImpact = " ";

				if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
					var r = new condMatchObj;
					r.objType = "License";
					r.licenseObj = licArray[thisLic];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();

					resultArray.push(r);
				}
			}
		}

	return resultArray;
}

function getContactConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";

	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS", "I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();

	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Contacts
	////////////////////////////////////////


	var capContactResult = aa.people.getCapContactByCapID(itemCap);

	if (!capContactResult.getSuccess()) {
		logDebug("**WARNING: getting CAP contact: " + capContactResult.getErrorMessage());
		var conArray = new Array();
	} else {
		var conArray = capContactResult.getOutput();
		if (!conArray)
			conArray = new Array();
	}

	for (var thisCon in conArray)
		if (conArray[thisCon].getCapContactModel().getRefContactNumber()) {
			var conCondResult = aa.commonCondition.getCommonConditions("CONTACT", conArray[thisCon].getCapContactModel().getRefContactNumber());

			if (!conCondResult.getSuccess()) {
				logDebug("**WARNING: getting contact Conditions : " + licCondResult.getErrorMessage());
				var conCondArray = new Array();
			} else {
				var conCondArray = conCondResult.getOutput();
			}

			for (var thisConCond in conCondArray) {
				var thisCond = conCondArray[thisConCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus == null)
					cStatus = " ";
				if (cDesc == null)
					cDesc = " ";
				if (cImpact == null)
					cImpact = " ";

				if ((pType == null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus == null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc == null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact == null || pImpact.toUpperCase().equals(cImpact.toUpperCase()))) {
					var r = new condMatchObj;
					r.objType = "Contact";
					r.contactObj = conArray[thisCon];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();

					resultArray.push(r);
				}
			}
		}

	return resultArray;
}

function getConditions(pType, pStatus, pDesc, pImpact) // optional capID
{
	var conditions = getCAPConditions(pType, pStatus, pDesc, pImpact);
	var addressConditions = getAddressConditions(pType, pStatus, pDesc, pImpact);
	if (addressConditions) {
		for (var i = 0; i < addressConditions.length; i++) {
			conditions.push(addressConditions[i]);
		}
	}

	var parcelConditions = getParcelConditions(pType, pStatus, pDesc, pImpact);
	if (parcelConditions) {
		for (var i = 0; i < parcelConditions.length; i++) {
			conditions.push(parcelConditions[i]);
		}
	}

	var licenseConditions = getLicenseConditions(pType, pStatus, pDesc, pImpact);
	if (licenseConditions) {
		for (var i = 0; i < licenseConditions.length; i++) {
			conditions.push(licenseConditions[i]);
		}
	}

	var contactConditons = getContactConditions(pType, pStatus, pDesc, pImpact);
	if (contactConditons) {
		for (var i = 0; i < contactConditons.length; i++) {
			conditions.push(contactConditons[i]);
		}
	}

	return conditions;
}

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
function getContactArray()
	{
	// Returns an array of associative arrays with contact attributes.  Attributes are UPPER CASE
	// optional capid
	// added check for ApplicationSubmitAfter event since the contactsgroup array is only on pageflow,
	// on ASA it should still be pulled normal way even though still partial cap
	var thisCap = capId;
	if (arguments.length == 1) thisCap = arguments[0];

	var cArray = new Array();

	if (arguments.length == 0 && !cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") // we are in a page flow script so use the capModel to get contacts
		{
		capContactArray = cap.getContactsGroup().toArray() ;
		}
	else
		{
		var capContactResult = aa.people.getCapContactByCapID(thisCap);
		if (capContactResult.getSuccess())
			{
			var capContactArray = capContactResult.getOutput();
			}
		}

	if (capContactArray)
		{
		for (yy in capContactArray)
			{
			var aArray = new Array();
			aArray["lastName"] = capContactArray[yy].getPeople().lastName;
			aArray["refSeqNumber"] = capContactArray[yy].getCapContactModel().getRefContactNumber();
			aArray["firstName"] = capContactArray[yy].getPeople().firstName;
			aArray["middleName"] = capContactArray[yy].getPeople().middleName;
			aArray["businessName"] = capContactArray[yy].getPeople().businessName;
			aArray["contactSeqNumber"] =capContactArray[yy].getPeople().contactSeqNumber;
			aArray["contactType"] =capContactArray[yy].getPeople().contactType;
			aArray["relation"] = capContactArray[yy].getPeople().relation;
			aArray["phone1"] = capContactArray[yy].getPeople().phone1;
			aArray["phone2"] = capContactArray[yy].getPeople().phone2;
			aArray["email"] = capContactArray[yy].getPeople().email;
			aArray["addressLine1"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine1();
			aArray["addressLine2"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine2();
			aArray["city"] = capContactArray[yy].getPeople().getCompactAddress().getCity();
			aArray["state"] = capContactArray[yy].getPeople().getCompactAddress().getState();
			aArray["zip"] = capContactArray[yy].getPeople().getCompactAddress().getZip();
			aArray["fax"] = capContactArray[yy].getPeople().fax;
			aArray["notes"] = capContactArray[yy].getPeople().notes;
			aArray["country"] = capContactArray[yy].getPeople().getCompactAddress().getCountry();
			aArray["fullName"] = capContactArray[yy].getPeople().fullName;
			aArray["peopleModel"] = capContactArray[yy].getPeople();

			var pa = new Array();

			if (arguments.length == 0 && !cap.isCompleteCap()) {
				var paR = capContactArray[yy].getPeople().getAttributes();
				if (paR) pa = paR.toArray();
				}
			else
				var pa = capContactArray[yy].getCapContactModel().getPeople().getAttributes().toArray();
	                for (xx1 in pa)
                   		aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;

        	cArray.push(aArray);
			}
		}
	return cArray;
	}

 
 function getContactArrayBefore()

                {

                // Returns an array of associative arrays with contact attributes.  Attributes are UPPER CASE

                // optional capid

                // added check for ApplicationSubmitAfter event since the contactsgroup array is only on pageflow,

                // on ASA it should still be pulled normal way even though still partial cap

 

 

                var envContactList = aa.env.getValue("ContactList");

 

                var capContactArray = envContactList.toArray();

 

                var cArray = new Array();

 

                if (capContactArray)

                                {

                                for (yy in capContactArray)

                                                {

                                                var aArray = new Array();

                                                aArray["lastName"] = capContactArray[yy].getPeople().lastName;

                                                aArray["refSeqNumber"] = capContactArray[yy].getRefContactNumber();

                                                aArray["firstName"] = capContactArray[yy].getPeople().firstName;

                                                aArray["middleName"] = capContactArray[yy].getPeople().middleName;

                                                aArray["businessName"] = capContactArray[yy].getPeople().businessName;

                                                aArray["contactSeqNumber"] =capContactArray[yy].getPeople().contactSeqNumber;

                                                aArray["contactType"] =capContactArray[yy].getPeople().contactType;

                                                aArray["relation"] = capContactArray[yy].getPeople().relation;

                                                aArray["phone1"] = capContactArray[yy].getPeople().phone1;

                                                aArray["phone2"] = capContactArray[yy].getPeople().phone2;

                                                aArray["email"] = capContactArray[yy].getPeople().email;

                                                aArray["addressLine1"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine1();

                                                aArray["addressLine2"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine2();

                                                aArray["city"] = capContactArray[yy].getPeople().getCompactAddress().getCity();

                                                aArray["state"] = capContactArray[yy].getPeople().getCompactAddress().getState();

                                                aArray["zip"] = capContactArray[yy].getPeople().getCompactAddress().getZip();

                                                aArray["fax"] = capContactArray[yy].getPeople().fax;

                                                aArray["notes"] = capContactArray[yy].getPeople().notes;

                                                aArray["country"] = capContactArray[yy].getPeople().getCompactAddress().getCountry();

                                                aArray["fullName"] = capContactArray[yy].getPeople().fullName;

 

 

                                                var pa = capContactArray[yy].getPeople().getAttributes().toArray();

                                for (xx1 in pa)

                                                aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;

                                                cArray.push(aArray);

		                                }

                                        }

                return cArray;

                }



 
 function getContactByType(conType,capId) {

    var contactArray = getPeople(capId);



    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            return contactArray[thisContact].getPeople();

    }



    return false;

}



 
function getContactObj(itemCap,typeToLoad)
{
    // returning the first match on contact type
    var capContactArray = null;
    var cArray = new Array();

    if (itemCap.getClass() == "com.accela.aa.aamain.cap.CapModel")   { // page flow script 
        var capContactArray = cap.getContactsGroup().toArray() ;
        }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            }
        }
    
    if (capContactArray) {
        for (var yy in capContactArray) {
            if (capContactArray[yy].getPeople().contactType.toUpperCase().equals(typeToLoad.toUpperCase())) {
                logDebug("getContactObj returned the first contact of type " + typeToLoad + " on record " + itemCap.getCustomID());
                return new contactObj(capContactArray[yy]);
            }
        }
    }
    
    logDebug("getContactObj could not find a contact of type " + typeToLoad + " on record " + itemCap.getCustomID());
    return false;
            
} 
 function getContactObjsBySeqNbr(itemCap,seqNbr) {
	/*var result = aa.people.getCapContactByPK(itemCap,seqNbr);
	
    if (result.getSuccess()) {
		var csm = result.getOutput();
		return new contactObj(csm);
	}*/
	var capContactArray = null;

	var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
        var capContactArray = capContactResult.getOutput();
    }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (String(capContactArray[yy].getPeople().contactSeqNumber).equals(String(seqNbr))) {
                logDebug("getContactObjsBySeqNbr returned the contact on record " + itemCap.getCustomID());
                return new contactObj(capContactArray[yy]);
            }
        }
    }
        
}



 
function getContactObjs(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
    var typesToLoad = false;
    if (arguments.length == 2) typesToLoad = arguments[1];
    var capContactArray = new Array();
    var cArray = new Array();
    //if (itemCap.getClass().toString().equals("com.accela.aa.aamain.cap.CapModel"))   { // page flow script 
	 if ("ApplicationSubmitBefore".equals(aa.env.getValue("EventName"))) {
		var envContactList = aa.env.getValue("ContactList");
        var capContactArray = envContactList.toArray();
	}
    else if (!cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") {

        if (cap.getApplicantModel()) {
            capContactArray[0] = cap.getApplicantModel();
        }
            
        if (cap.getContactsGroup().size() > 0) {
            var capContactAddArray = cap.getContactsGroup().toArray();
            for (ccaa in capContactAddArray)
                capContactArray.push(capContactAddArray[ccaa]);     
        }
    }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            }
        }

    if (capContactArray) {
        for (var yy in capContactArray) {
            if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }
    
    logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
    return cArray;
            
}
 
 function getContactObjsByCap(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
	var typesToLoad = false;
	if (arguments.length == 2) typesToLoad = arguments[1];
	var capContactArray = null;
	var cArray = new Array();

	var capContactArray = cap.getContactsGroup().toArray() ;
	
	if (capContactArray) {
		for (var yy in capContactArray)	{
			if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
				cArray.push(new contactObj(capContactArray[yy]));
			}
		}
	}
	
	logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
	return cArray;
			
}



 
 function getContactParams4Notification(params,conType) {

	// pass in a hashtable and it will add the additional parameters to the table

	// pass in contact type to retrieve



	contactArray = getContactArray();



	for(ca in contactArray) {

		thisContact = contactArray[ca];



		if (thisContact["contactType"] == conType) {



			conType = conType.toLowerCase();



			addParameter(params, "$$" + conType + "LastName$$", thisContact["lastName"]);

			addParameter(params, "$$" + conType + "FirstName$$", thisContact["firstName"]);

			addParameter(params, "$$" + conType + "MiddleName$$", thisContact["middleName"]);

			addParameter(params, "$$" + conType + "BusinesName$$", thisContact["businessName"]);

			addParameter(params, "$$" + conType + "ContactSeqNumber$$", thisContact["contactSeqNumber"]);

			addParameter(params, "$$" + conType + "$$", thisContact["contactType"]);

			addParameter(params, "$$" + conType + "Relation$$", thisContact["relation"]);

			addParameter(params, "$$" + conType + "Phone1$$", thisContact["phone1"]);

			addParameter(params, "$$" + conType + "Phone2$$", thisContact["phone2"]);

			addParameter(params, "$$" + conType + "Email$$", thisContact["email"]);

			addParameter(params, "$$" + conType + "AddressLine1$$", thisContact["addressLine1"]);

			addParameter(params, "$$" + conType + "AddressLine2$$", thisContact["addressLine2"]);

			addParameter(params, "$$" + conType + "City$$", thisContact["city"]);

			addParameter(params, "$$" + conType + "State$$", thisContact["state"]);

			addParameter(params, "$$" + conType + "Zip$$", thisContact["zip"]);

			addParameter(params, "$$" + conType + "Fax$$", thisContact["fax"]);

			addParameter(params, "$$" + conType + "Notes$$", thisContact["notes"]);

			addParameter(params, "$$" + conType + "Country$$", thisContact["country"]);

			addParameter(params, "$$" + conType + "FullName$$", thisContact["fullName"]);

		}

	}



	return params;	

}



 
function getCSLBInfo(doPop,doWarning)   // doPop = true populate the cap lic prof with this data
					// doWarning = true, message if license is expired.
	{
	// Requires getNode and getProp functions.
	//
	// Get the first lic prof from the app
	//
	var capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{ var capLicenseArr = capLicenseResult.getOutput();  }
	else
		{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }

	if (capLicenseArr == null || !capLicenseArr.length)
		{ logDebug("**WARNING: no licensed professionals on this CAP"); return false; }

	var licProfScriptModel = capLicenseArr[0];
	var rlpId = licProfScriptModel.getLicenseNbr();

	//
	// Now make the call to the California State License Board
	//

	var getout = aa.httpClient.get("https://www2.cslb.ca.gov/IVR/License+Detail.aspx?LicNum=" + rlpId);
	if (getout.getSuccess())
	  var lpXML = getout.getOutput();
	else
	   { logDebug("**ERROR: communicating with CSLB: " + getout.getErrorMessage()); return false; }

	// Check to see if error message in the XML:

	if (lpXML.indexOf("<Error>") > 0 )
		{
		logDebug("**ERROR: CSLB information returned an error: " + getNode(getNode(lpXML,"License"),"**ERROR"))
		return false;
		}

	var lpBiz = getNode(lpXML,"BusinessInfo");
	var lpStatus = getNode(lpXML,"PrimaryStatus");
	var lpClass = getNode(lpXML,"Classifications");
	var lpBonds = getNode(lpXML,"ContractorBond");
	var lpWC = getNode(lpXML,"WorkersComp");

	if (doWarning)
		{
		var expDate = new Date(getNode(lpBiz,"ExpireDt"));
		if (expDate < startDate)
			{
			showMessage = true ;
			comment("**WARNING: Professional License expired on " + expDate.toString());
			}
		}

	if (doPop)
		{
		licProfScriptModel.setAddress1(getNode(lpBiz,"Addr1").replace(/\+/g," "));
		licProfScriptModel.setAddress2(getNode(lpBiz,"Addr2").replace(/\+/g," "));
		licProfScriptModel.setBusinessName(getNode(lpBiz,"Name").replace(/\+/g," "));
		licProfScriptModel.setCity(getNode(lpBiz,"City").replace(/\+/g," "));
		licProfScriptModel.setLicenseExpirDate(aa.date.parseDate(getNode(lpBiz,"ExpireDt")))
		licProfScriptModel.setLicesnseOrigIssueDate(aa.date.parseDate(getNode(lpBiz,"IssueDt")))
		licProfScriptModel.setState(getNode(lpBiz,"State").replace(/\+/g," "))
		licProfScriptModel.setPhone1(getNode(lpBiz,"BusinessPhoneNum"))
		licProfScriptModel.setState(getNode(lpBiz,"State").replace(/\+/g," "))
		licProfScriptModel.setZip(getNode(lpBiz,"Zip"))
		aa.m_licenseProfessional.editLicensedProfessional(licProfScriptModel);
		}
	}

 
 function getDateDiff(DatetoComp) {



    var date1 = new Date(DatetoComp);

    var sysDate = aa.date.getCurrentDate();

    var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "MM/DD/YYYY");

    //aa.print("sysDateMMDDYYYY:" + sysDateMMDDYYYY + "--DatetoComp:" + DatetoComp);



    var date2 = new Date(sysDateMMDDYYYY);

    var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24));

    //aa.print("diffDays:" + diffDays);

    return diffDays;

}



 
function getDepartmentName(username)
	{
	var suo = aa.person.getUser(username).getOutput(); 
	var dpt = aa.people.getDepartmentList(null).getOutput();
	for (var thisdpt in dpt)
	  	{
	  	var m = dpt[thisdpt]
	  	var  n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode() 
	  
	  	if (n.equals(suo.deptOfUser)) 
	  	return(m.getDeptName())
  		}
  	}
  
   
function getDocOperation(docModelList)
{


	var docModel = docModelList.get(0);
	if(docModel == null)
	{


		return false;
	}

	
	if(docModel.getCategoryByAction() == null || "".equals(docModel.getCategoryByAction()))
	{


		return "UPLOAD";
	}
	//Judging it's check in
	else if("CHECK-IN".equals(docModel.getCategoryByAction()))
	{
		return "CHECK_IN";
	}
	//Judging it's resubmit or normal upload.
	else if("RESUBMIT".equals(docModel.getCategoryByAction()))
	{
		return "RESUBMIT";
	}
}
 
function getDocumentList() {
	// Returns an array of documentmodels if any
	// returns an empty array if no documents

	var docListArray = new Array();

	docListResult = aa.document.getCapDocumentList(capId,currentUserID);

	if (docListResult.getSuccess()) {		
		docListArray = docListResult.getOutput();
	}
	return docListArray;
} 
/*
* Get EDMS Defualt Source
* @returns {string} edmsSource
*/
function getEDMSDefualtSource(){
    var edmsStandardChoice = "EDMS";
    var edmsSource = "";
    var cntItems = 0;

    try{
        var bizDomScriptResult = aa.bizDomain.getBizDomain(edmsStandardChoice);
        if (bizDomScriptResult.getSuccess()) {
            var bizDomScriptObj = bizDomScriptResult.getOutput();
            if (bizDomScriptObj != null) {
                cntItems = bizDomScriptObj.size();
                logDebug("getEDMSDefualtSource: " + edmsStandardChoice + " size = " + cntItems);

                if (cntItems > 0) {
                    var bizDomScriptArr = bizDomScriptObj.toArray();

                    if(typeof(bizDomScriptArr) != "undefined"){
                        for (var i = 0; i < bizDomScriptArr.length; i++) {
                            var bizDomainValue = bizDomScriptArr[i].getBizdomainValue();
                            var bizDomainValueDesc = String(bizDomScriptArr[i].getDescription()).toUpperCase();
                            var bizDomainAuditStatus = bizDomScriptArr[i].getAuditStatus();

                            if(bizDomainAuditStatus == "A" && bizDomainValueDesc.indexOf("DEFAULT=YES") > -1){
                                edmsSource = bizDomainValue;
                                if(cntItems > 1){
                                    logDebug("getEDMSDefualtSource: WARNING StandardChoice "+ edmsStandardChoice + " has more than one active item. Using first item " + edmsSource);
                                }
                                break;
                            }
                        }
                    }

                }
                else
                {
                    logDebug("getEDMSDefualtSource: WARNING edmsStandardChoice "+ edmsStandardChoice + " does not have items or items disabled.");
                }
            } else {
                logDebug("getEDMSDefualtSource: WARNING edmsStandardChoice "+edmsStandardChoice +" is not found"  );
            }
        }
        else
        {
            logDebug("getEDMSDefualtSource **ERROR: getting standard choice " + edmsStandardChoice + " :" + bizDomScriptResult.getErrorMessage());
        }
    } catch (ex) {
        logDebug("getEDMSDefualtSource Error: " + ex + " Line: " + ex.lineNumber);
    }   
	return edmsSource;

} 
function getGISBufferInfo(svc,layer,numDistance)
	{
	// returns an array of associative arrays
	// each additional parameter will return another value in the array
	//x = getGISBufferInfo("flagstaff","Parcels","50","PARCEL_ID1","MAP","BOOK","PARCEL","LOT_AREA");
	//
	//for (x1 in x)
	//   {
	//   aa.print("Object " + x1)
	//   for (x2 in x[x1])
	//      aa.print("  " + x2 + " = " + x[x1][x2])
	//   }

	var distanceType = "feet";
	var retArray = new Array();
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		for (argnum = 3; argnum < arguments.length ; argnum++)
			buf.addAttributeName(arguments[argnum]);
		}
	else
		{ aa.print("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ aa.print("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var n = proxObj[z1].getAttributeNames();
				var v = proxObj[z1].getAttributeValues();
				
				var valArray = new Array();
				
				//
				// 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
				// hardcoded this to GIS_ID
				//
				
				valArray["GIS_ID"] = proxObj[z1].getGisId()
				for (n1 in n)
					{
					valArray[n[n1]] = v[n1];
					}
				retArray.push(valArray);
				}
			
			}
		}
	return retArray
	}

 
function getGISInfo(svc,layer,attributename)
	{
	// use buffer info to get info on the current object by using distance 0
	// usage: 
	//
	// x = getGISInfo("flagstaff","Parcels","LOT_AREA");
	//
	
	var distanceType = "feet";
	var retString;
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributename);
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				}
			
			}
		}
	return retString
	}

 
function getGISInfoArray(svc,layer,attributename)
{
	// use buffer info to get info on the current object by using distance 0
	// usage: 
	//
	// x = getGISInfo("flagstaff","Parcels","LOT_AREA");
	//
	
	var distanceType = "feet";
	var retArray = new Array();
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributename);
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
	{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
		{ 
			logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false 
		}	
		
		for (a2 in proxArr)
		{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
					var v = proxObj[z1].getAttributeValues();
					for(var i in v)
					{
						retArray.push(v[i]);
					}
			}
			
		}
	}
	return retArray;
}

 

function getGuideSheetObjects(inspId) {
	//
	// Returns an array of guide sheet objects
	// Optional second parameter, cap ID to load from
	// requires guideSheetObject definition
	//

	var retArray = new Array()
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var r = aa.inspection.getInspections(itemCap);  // have to use this method to get guidesheet data

	if (r.getSuccess())
	 	{
		var inspArray = r.getOutput();

		for (i in inspArray)
			{
			if (inspArray[i].getIdNumber() == inspId)
				{
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets()

				if (gs)
					{
					gsArray = gs.toArray();
					for (var loopk in gsArray)
						{
						a = gsArray[loopk];
						
						var gsItems = gsArray[loopk].getItems().toArray()
						for (var loopi in gsItems)
							{
							var gso = new guideSheetObject(gsArray[loopk],gsItems[loopi]);
							retArray.push(gso);
							}						
						}
					} // if there are guidesheets
				else
					logDebug("No guidesheets for this inspection");
				} // if this is the right inspection
			} // for each inspection
		} // if there are inspections

	logDebug("loaded " + retArray.length + " guidesheet items");
	return retArray;
	}
 
/**
* Add Inspection Result Sumbit After Parameters for use in Notification Templates. 
* This should be called from InspectionResultSubmitAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getInspectionResultParams4Notification(params) {

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspResult) addParameter(params, "$$inspResult$$", inspResult);

	if (inspComment) addParameter(params, "$$inspComment$$", inspComment);

	if (inspResultDate) addParameter(params, "$$inspResultDate$$", inspResultDate);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

} 
/**
* Add Inspection Schedule After Parameters for use in Notification Templates. 
* This should be called from InspectionScheduleAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getInspectionScheduleParams4Notification(params) {

	if (inspId) addParameter(params, "$$inspId$$", inspId);

	if (inspInspector) addParameter(params, "$$inspInspector$$", inspInspector);

	if (InspectorFirstName) addParameter(params, "$$InspectorFirstName$$", InspectorFirstName);

	if (InspectorMiddleName) addParameter(params, "$$InspectorMiddleName$$", InspectorMiddleName);

	if (InspectorLastName) addParameter(params, "$$InspectorLastName$$", InspectorLastName);

	if (inspGroup) addParameter(params, "$$inspGroup$$", inspGroup);
	
	if (inspType) addParameter(params, "$$inspType$$", inspType);
	
	if (inspSchedDate) addParameter(params, "$$inspSchedDate$$", inspSchedDate);

	return params;

}

 
// function getInspector: returns the inspector ID (string) of the scheduled inspection.  Returns the first result
//
function getInspector(insp2Check)
	{
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()))
				{
				// have to re-grab the user since the id won't show up in this object.
				inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
				return inspUserObj.getUserID();
				}
		}
	return false;
	}

 
function getLastInspector(insp2Check)
	// function getLastInspector: returns the inspector ID (string) of the last inspector to result the inspection.
	//
	{
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();
		
		inspList.sort(compareInspDateDesc)
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()) && !inspList[xx].getInspectionStatus().equals("Scheduled"))
				{
				// have to re-grab the user since the id won't show up in this object.
				inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
				return inspUserObj.getUserID();
				}
		}
	return null;
	}

	function compareInspDateDesc(a, b) {
		if (a.getScheduledDate() == null) {
			return 1;
		}
		if (b.getScheduledDate() == null) {
			return -1;
		}
		return b.getScheduledDate().getEpochMilliseconds() - a.getScheduledDate().getEpochMilliseconds();
	} 
function getLastScheduledInspector(insp2Check)
	// function getLastInspector: returns the inspector ID (string) of the last inspector that is assigned to the inspection.
	//
	{
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		inspList = inspResultObj.getOutput();

		inspList.sort(compareInspDateDesc)
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().equals("Scheduled"))
				{
				// have to re-grab the user since the id won't show up in this object.
				inspUserObj = aa.person.getUser(inspList[xx].getInspector().getFirstName(),inspList[xx].getInspector().getMiddleName(),inspList[xx].getInspector().getLastName()).getOutput();
				return inspUserObj.getUserID();
				}
		}
	return null;
	}

 
/**
 * Builds an array of licenseProfObjects from a transaction record
 * 
 * @param {capId}
 * 		capId - optional capId object
 * @param {Array}
 * 		licenseTypeArray - optional array of License Professional Types
 * @returns {Array}
 *		Array of licenseProfObjects
 *
 */

function getLicensedProfessionalObjectsByRecord(pCapId,licenseTypeArray){
	var itemCap = capId;
	if (pCapId != null){
        itemCap = pCapId; // use cap ID specified in args
    }
    
	var licenseProfObjArray = new Array();
	var licenseProfResult = aa.licenseProfessional.getLicensedProfessionalsByCapID(itemCap);
	if(licenseProfResult.getSuccess()){
		var licenseProfList = licenseProfResult.getOutput();
		var licenseProfObjArray= new Array();
		if (licenseProfList) {
			for (thisLP in licenseProfList) {
				if(licenseProfList[thisLP].getLicenseNbr() != null){
					if (!licenseTypeArray || exists(licenseProfList[thisLP].getLicenseType(), licenseTypeArray))
					var vLPObj = new licenseProfObject(licenseProfList[thisLP].getLicenseNbr());
					licenseProfObjArray.push(vLPObj);
				}
			}
		}
	}
	
	return licenseProfObjArray;
} 
function getLicenseProfessional(itemcapId)
{
	capLicenseArr = null;
	var s_result = aa.licenseProfessional.getLicenseProf(itemcapId);
	if(s_result.getSuccess())
	{
		capLicenseArr = s_result.getOutput();
		if (capLicenseArr == null || capLicenseArr.length == 0)
		{
			aa.print("WARNING: no licensed professionals on this CAP:" + itemcapId);
			capLicenseArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to license professional: " + s_result.getErrorMessage());
		capLicenseArr = null;
	}
	return capLicenseArr;
}
 
function getNextSequence(maskName) {
	var agencySeqBiz = aa.proxyInvoker.newInstance("com.accela.sg.AgencySeqNextBusiness").getOutput();
	var params = aa.proxyInvoker.newInstance("com.accela.domain.AgencyMaskDefCriteria").getOutput();
	params.setAgencyID(aa.getServiceProviderCode());
	params.setMaskName(maskName);
	params.setRecStatus("A");
	params.setSeqType("Agency");

	var seq = agencySeqBiz.getNextMaskedSeq("ADMIN", params, null, null);

	return seq;
}
 
function getNode(fString,fName)
	{
	 var fValue = "";
	 var startTag = "<"+fName+">";
	 var endTag = "</"+fName+">";

	 startPos = fString.indexOf(startTag) + startTag.length;
	 endPos = fString.indexOf(endTag);
	 // make sure startPos and endPos are valid before using them
	 if (startPos > 0 && startPos < endPos)
		  fValue = fString.substring(startPos,endPos);

	 return unescape(fValue);
	}
	
 

function GetOwnersByParcel()
{
//get parcel(s) by capid
var parcels = aa.parcel.getParcelDailyByCapID(capId,null);

if(parcels.getSuccess())
{
	 parcels = parcels.getOutput();
	 if(parcels == null || parcels.length == 0) 
	 {
	   	aa.print("There is no any parcel for the cap.");
	 }
	 else
	 {
	    //get owner(s) by parcel(s)
	    for (var i =0; i< parcels.length; i++)
	    {
				var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
				var parcelNbr = parcels[i].getParcelNumber();
				var parcelUID = parcels[i].getParcelModel().getUID();
				if (parcelOwnersResult.getSuccess())
				{
						var actuallyParcelNumber = parcelNbr != null?parcelNbr:parcelUID;
						//aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
						var ownerArr = parcelOwnersResult.getOutput();
						//aa.print("Size :" + ownerArr.length);
						for (j = 0; j < ownerArr.length; j++)
						{
							ownerArr[j].setCapID(capId);
							aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
						}		
				}
				else
				{
						aa.print("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
				}
	    }
	 }

} 
} 
function getParcelConditions(pType,pStatus,pDesc,pImpact) // optional capID
{
	var resultArray = new Array();
	var lang = "en_US";
	
	var bizDomainModel4Lang = aa.bizDomain.getBizDomainByValue("I18N_SETTINGS","I18N_DEFAULT_LANGUAGE");
	if (bizDomainModel4Lang.getSuccess())
		lang = bizDomainModel4Lang.getOutput().getDescription();
			
	if (arguments.length > 4)
		var itemCap = arguments[4]; // use cap ID specified in args
	else
		var itemCap = capId;
	////////////////////////////////////////
	// Check Parcel
	////////////////////////////////////////
	
	var parcResult = aa.parcel.getParcelDailyByCapID(itemCap,null);
	if (!parcResult.getSuccess())
		{
		logDebug("**WARNING: getting CAP addresses: "+ parcResult.getErrorMessage());
		var parcArray = new Array();
		}
	else
		{
		var parcArray = parcResult.getOutput();
		if (!parcArray) parcArray = new Array();
		}
		
	for (var thisParc in parcArray)
		if (parcArray[thisParc].getParcelNumber())
			{
			parcCondResult = aa.parcelCondition.getParcelConditions(parcArray[thisParc].getParcelNumber())
			if (!parcCondResult.getSuccess())
				{
				logDebug("**WARNING: getting Parcel Conditions : "+parcCondResult.getErrorMessage());
				var parcCondArray = new Array();
				}
			else
				{
				var parcCondArray = parcCondResult.getOutput();
				}
			
			for (var thisParcCond in parcCondArray)
				{
				var thisCond = parcCondArray[thisParcCond];
				var cType = thisCond.getConditionType();
				var cStatus = thisCond.getConditionStatus();
				var cDesc = thisCond.getConditionDescription();
				var cImpact = thisCond.getImpactCode();
				var cType = thisCond.getConditionType();
				var cComment = thisCond.getConditionComment();
				var cExpireDate = thisCond.getExpireDate();

				if (cType == null)
					cType = " ";
				if (cStatus==null)
					cStatus = " ";
				if (cDesc==null)
					cDesc = " ";
				if (cImpact==null)
					cImpact = " ";

				if ( (pType==null || pType.toUpperCase().equals(cType.toUpperCase())) && (pStatus==null || pStatus.toUpperCase().equals(cStatus.toUpperCase())) && (pDesc==null || pDesc.toUpperCase().equals(cDesc.toUpperCase())) && (pImpact==null || pImpact.toUpperCase().equals(cImpact.toUpperCase())))
					{
					var r = new condMatchObj;
					r.objType = "Parcel";
					r.parcelObj = parcArray[thisParc];
					r.status = cStatus;
					r.type = cType;
					r.impact = cImpact;
					r.description = cDesc;
					r.comment = cComment;
					r.expireDate = cExpireDate;

					var langCond = aa.condition.getCondition(thisCond, lang).getOutput();

					r.arObject = langCond;
					r.arDescription = langCond.getResConditionDescription();
					r.arComment = langCond.getResConditionComment();
			
					resultArray.push(r);
					}
				}
			}

	return resultArray;
}
 
function getParent() 
	{
	// returns the capId object of the parent.  Assumes only one parent!
	//
	getCapResult = aa.cap.getProjectParents(capId,1);
	if (getCapResult.getSuccess())
		{
		parentArray = getCapResult.getOutput();
		if (parentArray.length)
			return parentArray[0].getCapID();
		else
			{
			logDebug( "**WARNING: GetParent found no project parent for this application");
			return false;
			}
		}
	else
		{ 
		logDebug( "**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
		return false;
		}
	}

 
function getParentByCapId(itemCap) 
	{
	// returns the capId object of the parent.  Assumes only one parent!
	//
	getCapResult = aa.cap.getProjectParents(itemCap,1);
	if (getCapResult.getSuccess())
		{
		parentArray = getCapResult.getOutput();
		if (parentArray.length)
			return parentArray[0].getCapID();
		else
			{
			logDebug( "**WARNING: GetParent found no project parent for this application");
			return false;
			}
		}
	else
		{ 
		logDebug( "**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
		return false;
		}
	} 
 function getParentCapID4Renewal() {

    parentLic = getParentLicenseCapID(capId); 

    pLicArray = String(parentLic).split("-"); 

    var parentLicenseCAPID = aa.cap.getCapID(pLicArray[0],pLicArray[1],pLicArray[2]).getOutput();



    return parentLicenseCAPID;

}



 

function getParentLicenseCapID(itemCap)
{
	if (itemCap == null || aa.util.instanceOfString(itemCap))
	{
		return null;
	}
	
	var licenseCap = null;
	
	var result2 = aa.cap.getProjectByChildCapID(itemCap, "Renewal", null);
	if(result2.getSuccess())
		{
			licenseProjects = result2.getOutput();
			if (licenseProjects != null && licenseProjects.length > 0)
			{
			licenseProject = licenseProjects[0];
			return licenseProject.getProjectID();
			}
		}

	var result = aa.cap.getProjectByChildCapID(itemCap, "EST", null);
    	if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels != null && projectScriptModels.length > 0)
		{
		projectScriptModel = projectScriptModels[0];
		licenseCap = projectScriptModel.getProjectID();
		return licenseCap;
		}
	}
	

	logDebug("**WARNING: Could not find parent license Cap for child CAP(" + itemCap + "): ");
		  return false;
		  
	
}

 
function getParents(pAppType) {
	// returns the capId array of all parent caps
	//Dependency: appMatch function
	//

	var i = 1;
	while (true) {
		if (!(aa.cap.getProjectParents(capId, i).getSuccess()))
			break;

		i += 1;
	}
	i -= 1;

	getCapResult = aa.cap.getProjectParents(capId, i);
	myArray = new Array();

	if (getCapResult.getSuccess()) {
		parentArray = getCapResult.getOutput();

		if (parentArray.length) {
			for (x in parentArray) {
				if (pAppType != null) {
					//If parent type matches apType pattern passed in, add to return array
					if (appMatch(pAppType, parentArray[x].getCapID()))
						myArray.push(parentArray[x].getCapID());
				} else
					myArray.push(parentArray[x].getCapID());
			}

			return myArray;
		} else {
			logDebug("**WARNING: GetParent found no project parent for this application");
			return null;
		}
	} else {
		logDebug("**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
		return null;
	}
} 
 function getPartialCapID(capid)

{

    if (capid == null || aa.util.instanceOfString(capid))

    {

        return null;

    }

    //1. Get original partial CAPID  from related CAP table.

    var result = aa.cap.getProjectByChildCapID(capid, "EST", null);

    if(result.getSuccess())

    {

        projectScriptModels = result.getOutput();

        if (projectScriptModels == null || projectScriptModels.length == 0)

        {

            aa.print("ERROR: Failed to get partial CAP with CAPID(" + capid + ")");

            return null;

        }

        //2. Get original partial CAP ID from project Model

        projectScriptModel = projectScriptModels[0];

        return projectScriptModel.getProjectID();

    }  

    else 

    {

        aa.print("ERROR: Failed to get partial CAP by child CAP(" + capid + "): " + result.getErrorMessage());

        return null;

    }

}



 
 function getPeople(capId)

{

	capPeopleArr = null;

	var s_result = aa.people.getCapContactByCapID(capId);

	if(s_result.getSuccess())

	{

		capPeopleArr = s_result.getOutput();

		if(capPeopleArr != null || capPeopleArr.length > 0)

		{

			for (loopk in capPeopleArr)	

			{

				var capContactScriptModel = capPeopleArr[loopk];

				var capContactModel = capContactScriptModel.getCapContactModel();

				var peopleModel = capContactScriptModel.getPeople();

				var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);

				if (contactAddressrs.getSuccess())

				{

					var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());

					peopleModel.setContactAddressList(contactAddressModelArr);    

				}

			}

		}

		

		else

		{

			aa.print("WARNING: no People on this CAP:" + capId);

			capPeopleArr = null;

		}

	}

	else

	{

		aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());

		capPeopleArr = null;	

	}

	return capPeopleArr;

}



 
 function getPrimaryAddressLineParam4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table



    var addressLine = "";



	adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");



	if (adResult.getSuccess()) {

		ad = adResult.getOutput().getAddressModel();



		addParameter(params, "$$addressLine$$", ad.getDisplayAddress());

	}



	return params;

}



 
 function getPrimaryOwnerParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table



	capOwnerResult = aa.owner.getOwnerByCapId(capId);



	if (capOwnerResult.getSuccess()) {

		owner = capOwnerResult.getOutput();



		for (o in owner) {

			thisOwner = owner[o];

			if (thisOwner.getPrimaryOwner() == "Y") {

				addParameter(params, "$$ownerFullName$$", thisOwner.getOwnerFullName());

				addParameter(params, "$$ownerPhone$$", thisOwner.getPhone);

				break;	

			}

		}

	}

	return params;

}



 
function getProp(fString,fName)
	{
	 var fValue = "";
	 var startTag = fName + "='";
	 var endTag = "'";
	 startPos = fString.indexOf(startTag) + startTag.length;
	 if (startPos > 0)
	   fValue = fString.substring(startPos);

	 endPos = fValue.indexOf(endTag);
	 if (endPos > 0)
	  fValue = fValue.substring(0,endPos);

	return unescape(fValue);
	}

 
function getRecordParams4Notification(params) {

	itemCapId = (arguments.length == 2) ? arguments[1] : capId;
	// pass in a hashtable and it will add the additional parameters to the table

	var itemCapIDString = itemCapId.getCustomID();
	var itemCap = aa.cap.getCap(itemCapId).getOutput();
	var itemCapName = itemCap.getSpecialText();
	var itemCapStatus = itemCap.getCapStatus();
	var itemFileDate = itemCap.getFileDate();
	var itemCapTypeAlias = itemCap.getCapType().getAlias();
	var itemHouseCount;
	var itemFeesInvoicedTotal;
	var itemBalanceDue;
	
	var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);		
	if (itemCapDetailObjResult.getSuccess())
	{
		itemCapDetail = itemCapDetailObjResult.getOutput();
		itemHouseCount = itemCapDetail.getHouseCount();
		itemFeesInvoicedTotal = itemCapDetail.getTotalFee();
		itemBalanceDue = itemCapDetail.getBalance();
	}
	
	var workDesc = workDescGet(itemCapId);

	addParameter(params, "$$altID$$", itemCapIDString);

	addParameter(params, "$$capName$$", itemCapName);
	
	addParameter(params, "$$recordTypeAlias$$", itemCapTypeAlias);

	addParameter(params, "$$capStatus$$", itemCapStatus);

	addParameter(params, "$$fileDate$$", itemFileDate);

	addParameter(params, "$$balanceDue$$", "$" + parseFloat(itemBalanceDue).toFixed(2));
	
	addParameter(params, "$$workDesc$$", (workDesc) ? workDesc : "");

	return params;

}



 
/**
Title : getRefAddressId
Purpose : Look up a Reference Address ID. For use with addParcelAndOwnerFromRefAddress()
Script Type : EMSE, Pageflow, Batch

@param {capId} {capIDModel}
@return {RefAddId}
 */
function getRefAddressId()
{
    var itemCap = capId
	if (arguments.length > 0) itemCap = arguments[0]; // use cap ID specified in args
	var capAddrResult = aa.address.getAddressByCapId(itemCap);
	if (capAddrResult.getSuccess())
	{			
		var addresses = capAddrResult.getOutput();
			
		for (zz in addresses)
		{
			var addrRefId = addresses[zz].getRefAddressId();
			if (addrRefId==null)
			{
                logDebug("No reference address ID found for Address "+zz);
			    continue;
			}
			else{
                return addrRefId;
            }
		}
	}
} 
/**
Title : getRefLicenseProf
Purpose : Look up a Reference License Professional
Functional Area : Licensing
Description : Look up a Reference License Professional by the License Number and Optional License Type
Script Type : EMSE, Pageflow, Batch
Call Example: getRefLicenseProf("RN17-00058","Nurse Practitioner");

@param refstlic {String}
@param [licenseType] {String}
@return {refLicObj}
 */
function getRefLicenseProf(refstlic,licenseType)
	{
	var refLicObj = null;
	var refLicenseResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(),refstlic);
	if (!refLicenseResult.getSuccess())
		{ logDebug("**ERROR retrieving Ref Lic Profs : " + refLicenseResult.getErrorMessage()); return false; }
	else
		{
		var newLicArray = refLicenseResult.getOutput();
		if (!newLicArray) return null;
		for (var thisLic in newLicArray)
			if(!matches(licenseType,null,undefined,"")){
				if (refstlic.toUpperCase().equals(newLicArray[thisLic].getStateLicense().toUpperCase()) && 
					licenseType.toUpperCase().equals(newLicArray[thisLic].getLicenseType().toUpperCase()))
					refLicObj = newLicArray[thisLic];
			}
			else if (refstlic && newLicArray[thisLic] && refstlic.toUpperCase().equals(newLicArray[thisLic].getStateLicense().toUpperCase()))
				refLicObj = newLicArray[thisLic];
		}

	return refLicObj;
	}

 

function getRelatedCapsByAddress(ats) 
//
// returns and array of capids that share the same address as the current cap
//
	{
	var retArr = new Array();
	
	// get address data
	var addResult = aa.address.getAddressByCapId(capId);
	if (addResult.getSuccess())
		{ var aoArray = addResult.getOutput(); }
	else	
		{ logDebug("**ERROR: getting address by cap ID: " + addResult.getErrorMessage()); return false; }
	
	for (zzz in aoArray)
		{
		var ao = aoArray[zzz];
		// get caps with same address
		capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),null,ao.getStreetDirection(),null);
		if (capAddResult.getSuccess())
			{ var capIdArray=capAddResult.getOutput(); }
		else
			{ logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());  return false; }


		// loop through related caps
		for (cappy in capIdArray)
			{
			// skip if current cap
			if (capId.getCustomID().equals(capIdArray[cappy].getCustomID()))
				continue;

			// get cap id
			var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();


			// get cap type

			var reltypeArray = relcap.getCapType().toString().split("/");

			var isMatch = true;
			var ata = ats.split("/");
			if (ata.length != 4)
				logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
			else
				for (xx in ata)
					if (!ata[xx].equals(reltypeArray[xx]) && !ata[xx].equals("*"))
						isMatch = false;

			if (isMatch)			
				retArr.push(capIdArray[cappy]);

			} // loop through related caps
		
		}
	if (retArr.length > 0)
		return retArr;
		
	}

 

function getRelatedCapsByParcel(ats) 
//
// returns and array of capids that match parcels on the current app.  Includes all parcels.
// ats, app type string to check for
//
	{
	var retArr = new Array();
	
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (capParcelResult.getSuccess())
		{ var Parcels = capParcelResult.getOutput().toArray(); }
	else	
		{ logDebug("**ERROR: getting parcels by cap ID: " + capParcelResult.getErrorMessage()); return false; }

	for (zz in Parcels)
		{
		var ParcelValidatedNumber = Parcels[zz].getParcelNumber();

		// get caps with same parcel
		var capAddResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);
		if (capAddResult.getSuccess())
			{ var capIdArray=capAddResult.getOutput(); }
		else
			{ logDebug("**ERROR: getting similar parcels: " + capAddResult.getErrorMessage());  return false; }

		// loop through related caps
		for (cappy in capIdArray)
			{
			// skip if current cap
			if (capId.getCustomID().equals(capIdArray[cappy].getCustomID()))
				continue;
			
			// get cap ids			
			var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
			// get cap type
			var reltypeArray = relcap.getCapType().toString().split("/");

			var isMatch = true;
			var ata = ats.split("/");
			if (ata.length != 4)
				logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
			else
				for (xx in ata)
					if (!ata[xx].equals(reltypeArray[xx]) && !ata[xx].equals("*"))
						isMatch = false;

			if (isMatch)			
				retArr.push(capIdArray[cappy]);

			} // loop through related caps
		}
		
	if (retArr.length > 0)
		return retArr;
		
	}

 
 function getRenewalCapByParentCapIDForReview(parentCapid)

{

    if (parentCapid == null || aa.util.instanceOfString(parentCapid))

    {

        return null;

    }

    //1. Get parent license for review

    var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Review");

    if(result.getSuccess())

    {

        projectScriptModels = result.getOutput();

        if (projectScriptModels == null || projectScriptModels.length == 0)

        {

            aa.print("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for review");

            return null;

        }

        //2. return parent CAPID.

        projectScriptModel = projectScriptModels[0];

        return projectScriptModel;

    }  

    else 

    {

      aa.print("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for review: " + result.getErrorMessage());

      return null;

    }

}



 
function getReportedChannel() // option CapId
{
	var itemCap = capId
	if (arguments.length > 0)
		itemCap = arguments[0]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	var sReturn = cd.getReportedChannel();

	if(sReturn != null)
		return sReturn;
	else
		return "";
}
 
 function getRootNode(nodeId, depth)
{
	if (depth > 9)
	{
		return nodeId;
	}
	var depthCount = depth + 1;
	var currentNode = nodeId;
	var directParentsResult = aa.cap.getProjectByChildCapID(currentNode,'R',null);
    if (directParentsResult.getSuccess())
    {
		directParents = directParentsResult.getOutput();
		for(var ff in directParents) {
			
			if (directParents[ff])
			{
				
				var id1 = directParents[ff].getProjectID().getID1();
				var id2 = directParents[ff].getProjectID().getID2();
				var id3 = directParents[ff].getProjectID().getID3();				
				
				while (!isSameNode(currentNode,directParents[ff].getProjectID()))
				{
					currentNode = getRootNode(directParents[ff].getProjectID(), depthCount);					
				}
			}			
		}
    }
	return currentNode;

}



 
 function getRoots(nodeId)

{

	var rootsArray = new Array();

	var directParentsResult = aa.cap.getProjectByChildCapID(nodeId,'R',null);

	

    if (directParentsResult.getSuccess())

    {

		tmpdirectParents = directParentsResult.getOutput();

		for(ff in tmpdirectParents) {

			if (tmpdirectParents[ff]) {

				

				var tmpNode = getRootNode(tmpdirectParents[ff].getProjectID(), 1);

				var id1 = tmpNode.getID1();

				var id2 = tmpNode.getID2();

				var id3 = tmpNode.getID3();

				var pCapId = aa.cap.getCapID(id1,id2,id3).getOutput();

				rootsArray.push(pCapId);

			}

		}

    }

	return rootsArray;

}



 
function getScheduledInspId(insp2Check)
	{
	// warning, returns only the first scheduled occurrence
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(insp2Check).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
				return inspList[xx].getIdNumber();
		}
	return false;
	}

 
//
// Get the standard choices domain for this application type
//
// Uses free-form alphanumeric indexing.   All enabled script controls will execute.   See getScriptAction_v_1_6 to revert back to sequential numbering scheme
//
function getScriptAction(strControl)
	{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;
	
	var bizDomScriptResult = aa.bizDomain.getBizDomain(strControl);
	
	if (bizDomScriptResult.getSuccess())
		{
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
		
		for (var i in bizDomScriptArray)
			{
			// this list is sorted the same as the UI, no reason to re-sort
			
			var myObj= new pairObj(bizDomScriptArray[i].getBizdomainValue());
			myObj.load(bizDomScriptArray[i].getDescription());
			if (bizDomScriptArray[i].getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		}
	
	return actArray;
	}

 
//
// Get the standard choices domain for this application type
//
// Requires sequential numbering scheme (01,02,03, etc.) and the maxEntries variable
//
// Rename to getScriptAction and place in your custom functions folder to revert back to master script version 1.6 functionality.
//
//
//
function getScriptAction_v1_6(strControl)
	{
	var actArray = new Array();
	var maxLength = String("" + maxEntries).length;

	for (var count=1; count <= maxEntries; count++)  // Must be sequential from 01 up to maxEntries
		{
		var countstr = "000000" + count;
		countstr = String(countstr).substring(countstr.length,countstr.length - maxLength);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(strControl,countstr);

	   	if (bizDomScriptResult.getSuccess())
	   		{
			bizDomScriptObj = bizDomScriptResult.getOutput();
			var myObj= new pairObj(bizDomScriptObj.getBizdomainValue());
			myObj.load(bizDomScriptObj.getDescription());
			if (bizDomScriptObj.getAuditStatus() == 'I') myObj.enabled = false;
			actArray.push(myObj);
			}
		else
			{
			break;
			}
		}
	return actArray;
	}

 
function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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
 
function getShortNotes() // option CapId
{
	var itemCap = capId
	if (arguments.length > 0)
		itemCap = arguments[0]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	var sReturn = cd.getShortNotes();

	if(sReturn != null)
		return sReturn;
	else
		return "";
}
 
function getTaskDueDate(wfstr) // optional process name.
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var taskDesc = wfstr;
	if (wfstr == "*") {
		taskDesc = "";
	}
	var workflowResult = aa.workflow.getTaskItems(capId, taskDesc, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dueDate = wfObj[i].getDueDate();
			if (dueDate)
				return new Date(dueDate.getMonth() + "/" + dueDate.getDayOfMonth() + "/" + dueDate.getYear());
		}
	}
} 
function getTaskStatusForEmail(stask) {
	// returns a string of task statuses for a workflow group
	var returnStr = ""
		var taskResult = aa.workflow.getTaskItems(capId, null, stask, "Y", null, null);
	if (taskResult.getSuccess()) {
		var taskArr = taskResult.getOutput();
	} else {
		logDebug("**ERROR: getting tasks : " + taskResult.getErrorMessage());
		return false
	}

	for (xx in taskArr)
		if (taskArr[xx].getProcessCode().equals(stask) && taskArr[xx].getCompleteFlag().equals("Y")) {
			returnStr += "Task Name: " + taskArr[xx].getTaskDescription() + "\n";
			returnStr += "Task Status: " + taskArr[xx].getDisposition() + "\n";
			if (taskArr[xx].getDispositionComment() != null)
				returnStr += "Task Comments: " + taskArr[xx].getDispositionComment() + "\n";
			returnStr += "\n";
		}
	logDebug(returnStr);
	return returnStr;
} 
 function getURLToNewRecord(ACAURL,servProvCode,group,typetype,subtype,category) {



    var smb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.servicemanagement.ServiceManagementBusiness").getOutput();

    var sm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.servicemanagement.ServiceModel").getOutput();

    var ctm = aa.cap.getCapTypeModel().getOutput();

    

    ctm.setGroup(group);

    ctm.setType(typetype); 

    ctm.setSubType(subtype);

    ctm.setCategory(category);

    sm.setCapType(ctm);

    sm.setServPorvCode(servProvCode);

    var svcs = smb.getServices(sm).toArray();

    

    // returning first service found 

    

    for (var i in svcs) {

        return ACAURL + "/AgencyRedirect.aspx?agency=" + servProvCode + "&name=" + escape(svcs[i].getServiceName());

    }

    // or nothing

    

    return false;

}
 
function getUserEmail() {
    //optional parameter for userid
    var userId = currentUserID;
    if (arguments.length > 0)
        userId = arguments[0];

    var systemUserObjResult = aa.person.getUser(userId.toUpperCase());

    if (systemUserObjResult.getSuccess()) {
        var systemUserObj = systemUserObjResult.getOutput();

        var userEmail = systemUserObj.getEmail();

        if (userEmail)
            return userEmail;
        else
            return false; 

    } else {
        aa.print(systemUserObjResult.getErrorMessage());
        return false;
    }
}
 
function getUserFullName() {
    //optional parameter for userid
    var userId = currentUserID;
    if (arguments.length > 0)
        userId = arguments[0];

    var systemUserObjResult = aa.person.getUser(userId.toUpperCase());

    if (systemUserObjResult.getSuccess()) {
        var systemUserObj = systemUserObjResult.getOutput();

        var userEmail = systemUserObj.getEmail();
        var userFullName = "";

        if (!matches(systemUserObj.getFirstName(),null,undefined,"")) userFullName = systemUserObj.getFirstName();
        if (!matches(systemUserObj.getLastName(),null,undefined,"")) userFullName += " " + systemUserObj.getLastName();
        
        if (userFullName != "")
            return userFullName;
        else
            return false; 

    } else {
        logDebug(systemUserObjResult.getErrorMessage());
        return false;
    }
}
 
/**
 * getUserObjs
 * Description: Returns an array of userObj objects for all users in the system
 * 
 * @return array {userObj}
 */
function getUserObjs(){ 
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput();
		} else {
			logDebug("**ERROR: getUserObjs: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
                userObjArray.push(new userObj(userId));
        }
	}
	
	return userObjArray;
	
} 
/**
 * getUserObjsByDiscipline
 * Description: Returns an array of userObj objects for all users in the system that match userDiscipline
 * 
 * @param userDiscipline {string}
 * @return array {userObj}
 */
function getUserObjsByDiscipline(userDiscipline){
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserListByDiscipline(userDiscipline);
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput().toArray();
		} else {
			logDebug("**ERROR: getUserObjsByDiscipline: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
			var vUserObj = new userObj(userId);
			userObjArray.push(vUserObj);
        }
	}
	
	return userObjArray;
} 
/**
 * getUserObjsByDisciplineAndDistrict
 * Description: Returns an array of userObj objects for all users in the system that match userDiscipline and districtName
 * 
 * @param userDiscipline {string}
 * @param districtName {string}
 * @return array {userObj}
 */
function getUserObjsByDisciplineAndDistrict(userDiscipline, districtName){ 
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserListByDiscipline(userDiscipline);
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput().toArray();
		} else {
			logDebug("**ERROR: getUserObjsByDisciplineAndDistrict: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
				var vUserObj = new userObj(userId);
				var vUserDistArray = vUserObj.getUserDistricts();
				
				if (!districtName|| exists(districtName, vUserDistArray)) {
					userObjArray.push(vUserObj);
				}
        }
	}
	
	return userObjArray;
	
} 
/**
 * getUserObjsByDistrict
 * Description: Returns an array of userObj objects for all users in the system that match districtName
 * 
 * @param districtName {string}
 * @return array {userObj}
 */
function getUserObjsByDistrict(districtName){ 
	var userObjArray = new Array();
	var sysUserList
	var sysUserResult = aa.people.getSysUserList(aa.util.newQueryFormat());
	
	if (sysUserResult.getSuccess()) {
			sysUserList = sysUserResult.getOutput()
		} else {
			logDebug("**ERROR: getUserObjsByDistrict: " + sysUserResult.getErrorMessage());
			return userObjArray;
		}
	
	for(var iUser in sysUserList){
		var userId = sysUserList[iUser].getUserID();
		if (userId) {
				var vUserObj = new userObj(userId);
				var vUserDistArray = vUserObj.getUserDistricts();
				
				if (!districtName|| exists(districtName, vUserDistArray)) {
					userObjArray.push(vUserObj);
				}
        }
	}
	
	return userObjArray;
	
} 
/**
* Add Workflow Task Update After Parameters for use in Notification Templates. 
* This should be called from WorkflowTaskUpdateAfter Event
*
* @param params {HashMap}
* @return {HashMap}
*/

function getWorkflowParams4Notification(params) {

	// pass in a hashtable and it will add the additional parameters to the table
	// This should be called from WorkflowTaskUpdateAfter Event

	if (wfTask) addParameter(params, "$$wfTask$$", wfTask);

	if (wfStatus) addParameter(params, "$$wfStatus$$", wfStatus);

	if (wfDate) addParameter(params, "$$wfDate$$", wfDate);

	if (wfComment) addParameter(params, "$$wfComment$$", wfComment);
	
	if (wfStaffUserID) addParameter(params, "$$wfStaffUserID$$", wfStaffUserID);
	
	if (wfHours) addParameter(params, "$$wfHours$$", wfHours);

	return params;

} 

function guideSheetObject(gguidesheetModel,gguidesheetItemModel)
	{
	this.gsType = gguidesheetModel.getGuideType();
	this.gsSequence = gguidesheetModel.getGuidesheetSeqNbr();
	this.gsDescription = gguidesheetModel.getGuideDesc();
	this.gsIdentifier = gguidesheetModel.getIdentifier();
	this.item = gguidesheetItemModel;
	this.text = gguidesheetItemModel.getGuideItemText()
	this.status = gguidesheetItemModel.getGuideItemStatus();
	this.comment = gguidesheetItemModel.getGuideItemComment();
	this.score = gguidesheetItemModel.getGuideItemScore();
	
	this.info = new Array();
	this.infoTables = new Array();
	this.validTables = false;				//true if has ASIT info
	this.validInfo = false;				//true if has ASI info

	
	this.loadInfo = function() {
		var itemASISubGroupList = this.item.getItemASISubgroupList();
		//If there is no ASI subgroup, it will throw warning message.
		if(itemASISubGroupList != null)
		{
			this.validInfo = true;
			var asiSubGroupIt = itemASISubGroupList.iterator();
			while(asiSubGroupIt.hasNext())
			{
				var asiSubGroup = asiSubGroupIt.next();
				var asiItemList = asiSubGroup.getAsiList();
				if(asiItemList != null)
				{
					var asiItemListIt = asiItemList.iterator();
					while(asiItemListIt.hasNext())
					{
						var asiItemModel = asiItemListIt.next();
						this.info[asiItemModel.getAsiName()] = asiItemModel.getAttributeValue();
					}
				}
			}
		}
		

	}
	
	this.loadInfoTables = function() {

		var guideItemASITs = this.item.getItemASITableSubgroupList();
		if (guideItemASITs!=null)
		for(var j = 0; j < guideItemASITs.size(); j++)
		{
			var guideItemASIT = guideItemASITs.get(j);
			var tableArr = new Array();
			var columnList = guideItemASIT.getColumnList();
			for (var k = 0; k < columnList.size() ; k++ )
			{
				var column = columnList.get(k);
				var values = column.getValueMap().values();
				var iteValues = values.iterator();
				while(iteValues.hasNext())
				{
					var i = iteValues.next();
					var zeroBasedRowIndex = i.getRowIndex()-1;
					if (tableArr[zeroBasedRowIndex] == null) tableArr[zeroBasedRowIndex] = new Array();
					tableArr[zeroBasedRowIndex][column.getColumnName()] = i.getAttributeValue()
				}
			}
			
			this.infoTables["" + guideItemASIT.getTableName()] = tableArr;
			this.validTables = true;
		}
	}
} 
function handleError(err,context) {
	var rollBack = true;
	var showError = true;

	if (showError) showDebug = true;
	logDebug((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
	}
	 
//check if target CAP has primary address
function hasPrimaryAddressInCap(capID) {
	var isPrimaryAddressExist = false;
	var capAddressResult = aa.address.getAddressByCapId(capID);
	if (capAddressResult.getSuccess()) {
		var addressModelArray = capAddressResult.getOutput();
		for (k in addressModelArray) {
			if ("Y" == addressModelArray[k].getPrimaryFlag()) {
				isPrimaryAddressExist = true;
				logDebug("Target CAP has primary address");
				break;
			}

		}
	} else {
		logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
	}
	return isPrimaryAddressExist;
} 

function xmlEscapeXMLToHTML(xmlData) {
    /*************************************************************************************
    Function:       xmlEscapeXMLToHTML

    author:         xwisdom@yahoo.com

    description:
        Encodes XML data for use in a web page

    ************************************************************************************/
    var gt;

    var str = xmlData;

    //replace & with &
    gt = -1;
    while (str.indexOf("&", gt + 1) > -1) {
        var gt = str.indexOf("&", gt + 1);
        var newStr = str.substr(0, gt);
        newStr += "&";
        newStr = newStr + str.substr(gt + 1, str.length);
        str = newStr;
    }

    //replace < with <
    gt = -1;
    while (str.indexOf("<", gt + 1) > -1) {
        var gt = str.indexOf("<", gt + 1);
        var newStr = str.substr(0, gt);
        newStr += "<";
        newStr = newStr + str.substr(gt + 1, str.length);
        str = newStr;
    }

    //replace > with >
    gt = -1;
    while (str.indexOf(">", gt + 1) > -1) {
        var gt = str.indexOf(">", gt + 1);
        var newStr = str.substr(0, gt);
        newStr += ">";
        newStr = newStr + str.substr(gt + 1, str.length);
        str = newStr;
    }

    //replace \n with <br>
    gt = -1;
    while (str.indexOf("\n", gt + 1) > -1) {
        var gt = str.indexOf("\n", gt + 1);
        var newStr = str.substr(0, gt);
        newStr += "<br>";
        newStr = newStr + str.substr(gt + 1, str.length);
        str = newStr;
    }

    return str

}  // end function xmlEscapeXMLToHTML

 
//@ts-check
/**
 * Uses function 'getScriptText' to fetch EMSE Script source code using the supplied script name.
 * The returned script text is emmediately evalueated in the current context.
 * @param {stinrg} s Script Code of EMSE Script to be included
 * @returns {boolean} TRUE if successful match on Script Code | FALSE in other cases
 */
function include(s) {
	try {
		var inclStartTime = null;
		var thisDate = new Date(aa.util.now());
		var thisTime = thisDate.getTime();
		if (typeof startTime === typeof undefined) {
			inclStartTime = thisTime;
		} else {
			inclStartTime = startTime;
		}
		var st = getScriptText(s);
		if (st.length) {
			logDebug("Executing script : " + s + ", Elapsed Time: " + ((thisTime - inclStartTime) / 1000) + " Seconds")
			eval(st);
			return true;
		}
	} catch (err) {
		handleError(err, s);
	}
	return false;
} 
//@ts-check
/**
 * Dynamically adds a workflow process as a subprocess to an existing task.
 * @param {string} taskName Name of the task that is the parent for the sub-process.
 * @param {string} process Name of the reference workflow process that the function adds a subprocess.
 * @param {boolean} completeReqd True if you must complete the subprocess before you promote the parent task. Otherwise, false.
 * @returns {boolean} True if successful, false if not.
 */
function insertSubProcess(taskName, process, completeReqd) {
	var theTask = null;

	var itemCap;
	if (typeof capId === typeof undefined) {
		logDebug("'insertSubProcess' requires global 'capId' be defined.");
		return false;
	} else {
		itemCap = capId;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, taskName, null, null, null, null);
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	} else {
		logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		if (taskName.toUpperCase().equals(wfObj[i].getTaskDescription().toUpperCase())) {
			theTask = wfObj[i];
		}
	}

	if (theTask) {
		var result = aa.workflow.insertSubProcess(theTask, process, completeReqd)
		if (!result.getSuccess()) {
			logDebug("error " + result.getErrorMessage());
			return false;
		}

		logDebug("attached subprocess " + process + " to " + taskName);
		return true;
	} else {
		logDebug("couldn't find task " + taskName);
		return false;
	}
} 
//@ts-check
/**
 * @param {string} sourceTaskName 
 * @param {string} newTaskName 
 * @param {string} insertTaskType 
 * @returns {object} of task type if successful, {false} if not successful.
 */
function insertTask(sourceTaskName, newTaskName, insertTaskType) {
	var itemCap;
	if (arguments.length > 3) {
		itemCap = arguments[3];
	} else {
		if (typeof capId === typeof undefined) {
			logDebug("capId is undefined.");
			return false;
		} else {
			itemCap = capId;
		}
	}

	var tTask;

	//get the task by the task path
	var taskResult1 = aa.workflow.getTask(itemCap, sourceTaskName);
	if (taskResult1.getSuccess()) {
		tTask = taskResult1.getOutput();
		aa.print("get task successful : task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
	} else {
		aa.print("ERROR: Failed to get task! Name = " + sourceTaskName + ";" + taskResult1.getErrorMessage());
	}

	//change the task name
	tTask.setTaskDescription(newTaskName);

	var taskResult = aa.workflow.insertTask(tTask, insertTaskType);
	if (taskResult.getSuccess()) {
		var processId = tTask.getProcessID();
		var stepNum = tTask.getStepNumber();
		var taskResult1 = aa.workflow.getTask(itemCap, stepNum, processId);

		if (taskResult1.getSuccess()) {
			tTask = taskResult1.getOutput();
			aa.print("insert task successful : inserted task name = " + tTask.getTaskDescription() + "; Process name = " + tTask.getProcessCode());
		} else {
			aa.print("ERROR: Failed to get task! Name = " + newTaskName + ";" + taskResult1.getErrorMessage());
			return false;
		}

	} else {
		aa.print("ERROR: Failed to insert task! Name = " + newTaskName + ";" + taskResult.getErrorMessage());
		return false;
	}

	return tTask; // returns task item
}
 
//@ts-check
/**
 * Cancels all scheduled and incomplete inspections on the current record.
 * @returns {boolean} Returns true if successful, false if not.
 */
function inspCancelAll() {
	if (typeof capId === typeof undefined) {
		logDebug("capId is undefined.");
		return false;
	}
	var isCancelled = false;
	var inspResults = aa.inspection.getInspections(capId);
	if (inspResults.getSuccess()) {
		var inspAll = inspResults.getOutput();
		var inspectionId;
		var cancelResult;
		for (var ii in inspAll) {
			if (inspAll[ii].getDocumentDescription().equals("Insp Scheduled") && inspAll[ii].getAuditStatus().equals("A")) {
				inspectionId = inspAll[ii].getIdNumber();		// Inspection identifier	
				cancelResult = aa.inspection.cancelInspection(capId, inspectionId);
				if (cancelResult.getSuccess()) {
					logMessage("Cancelling inspection: " + inspAll[ii].getInspectionType());
					isCancelled = true;
				}
				else {
					logMessage("**ERROR", "**ERROR: Cannot cancel inspection: " + inspAll[ii].getInspectionType() + ", " + cancelResult.getErrorMessage());
				}
			}
		}
	}
	else {
		logMessage("**ERROR: getting inspections: " + inspResults.getErrorMessage());
	}

	return isCancelled;
}

 
//@ts-check
/**
 * Invoices all assessed fees with fee code of fcode and fee period of fperiod.
 * @param {string} fcode Fee code of the fee to invoice.
 * @param {string} fperiod Fee period of the fee to invoice.
 * @returns {boolean} Returns true if the function finds the assessed. Otherwise, returns false.
 */
function invoiceFee(fcode, fperiod) {
	//invoices all assessed fees having fcode and fperiod
	// SR5085 LL
	if (typeof capId === typeof undefined) {
        logDebug("'invoiceFee' requires global 'capId' be defined.");
        return false;
    }
	// REMOVE check on type 'string'. Replace with undefined check.
	if (typeof fcode === typeof undefined) {
        logDebug("'invoiceFee' parameter 'fcode' must be present.");
        return false;
    }

	if (typeof feeSeqList === typeof undefined) {
        feeSeqList = new Array();
    }
	if (typeof paymentPeriodList === typeof undefined) {
		paymentPeriodList = new Array();
    }

	var feeFound = false;
	var getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (var feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
				feeFound = true;
				logDebug("Assessed fee " + fcode + " found and tagged for invoicing");
			}
	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}
	return feeFound;
} 
//@ts-check
/**
 * Checks to see if the passed in string is blank or not. Returns true if blank, false if not.
 * @param {string} str
 * @returns {boolean} Returns true if blank, false if not.
 */
function isBlank(str) {

    return (!str || /^\s*$/.test(str));

}

 
//@ts-check
/**
 * Checks if the parameter is null/undefined or parameter length is 0.
 * Does not check for type. Caller must ensure type is 'string' to yield a good result.
 * @param {string} str 
 * @returns {boolean} Returns true if the string is empty, otherwise false.
 */
function isEmpty(str) {
	return (!str || 0 === str.length);
} 
//@ts-check
/**
 * Compares the two supplied PeopleModel instances. (com.accela.aa.emse.dom.CapContactScriptModel)
 * If values of first-name, last-name, and Contact Type are the same then they are considered to match.
 * Does not ignore case (uppercase, lowercase) when comparing values.
 * @param {object} capContactScriptModel People Model
 * @param {object} capContactScriptModel2 People Model
 * @returns {boolean} Returns true if the people models are the same, otherwise false.
 */
function isMatchPeople(capContactScriptModel, capContactScriptModel2) {

	if (typeof capContactScriptModel === typeof undefined 
            || typeof capContactScriptModel2 === typeof undefined  
            || capContactScriptModel == null 
            || capContactScriptModel2 == null) {
        logDebug("'isMatchPeople' needs two instances of CapContactScriptModel as parameters.");
		return false;
	}

	var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
	var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
	var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
	var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
	var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
	var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
	var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
	var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();

	if ((contactType1 == null && contactType2 != null) || (contactType1 != null && contactType2 == null)) {
		return false;
	}

	if (contactType1 != null && !contactType1.equals(contactType2)) {
		return false;
	}

	if ((firstName1 == null && firstName2 != null) || (firstName1 != null && firstName2 == null)) {
		return false;
	}

	if (firstName1 != null && !firstName1.equals(firstName2)) {
		return false;
	}

	if ((lastName1 == null && lastName2 != null) || (lastName1 != null && lastName2 == null)) {
		return false;
	}

	if (lastName1 != null && !lastName1.equals(lastName2)) {
		return false;
	}

	if ((fullName1 == null && fullName2 != null) || (fullName1 != null && fullName2 == null)) {
		return false;
	}

	if (fullName1 != null && !fullName1.equals(fullName2)) {
		return false;
	}

	return true;
}
 
//@ts-check
/**
 * This function tests if a record has an expiration that is ready for renewal.
 * @param {object} capid CapID object
 * @returns {boolean} Returns true if the record has an expiration that is ready for renewal, otherwise false.
 */
function isReadyRenew(capid) {
    if (typeof capid === typeof undefined || capid == null || aa.util.instanceOfString(capid)) {
        logDebug("'isReadyRenew' Parameter 'capid' cannot be null, undefined, or string");
        return false;
    }
    var result = aa.expiration.isExpiredLicenses(capid);
    if (result.getSuccess()) {
        return true;
    }
    else {
        logDebug("ERROR: 'isReadyRenew' Failed to get expiration with CAP(" + capid + "): " + result.getErrorMessage());
    }
    return false;
}
 
function isRenewProcess(parentCapID, partialCapID) {
    //1. Check to see parent CAP ID is null.
    if (parentCapID == null || partialCapID == null)
    { logDebug("ERROR: the parentCapID or the partialCap ID is null"); return false; }
    //2. Get CAPModel by PK for partialCAP.
    var result = aa.cap.getCap(partialCapID);
    if (result.getSuccess()) {
        capScriptModel = result.getOutput();
        //2.1. Check to see if it is partial CAP.
        if (capScriptModel.isCompleteCap()) {
            logDebug("ERROR: It is not partial CAP(" + capScriptModel.getCapID() + ")");
            return false;
        }
    }
    else {
        logDebug("ERROR: Fail to get CAPModel (" + partialCapID + "): " + result.getErrorMessage());
        return false;
    }
    //3.  Check to see if the renewal was initiated before.
    result = aa.cap.getProjectByMasterID(parentCapID, "Renewal", "Incomplete");
    if (result.getSuccess()) {
        partialProjects = result.getOutput();
        if (partialProjects != null && partialProjects.length > 0) {
            //Avoid to initiate renewal process multiple times.
            logDebug("Warning: Renewal process was initiated before. ( " + parentCapID + ")");
            return false;
        }

    }
    //4 . Check to see if parent CAP is ready for renew.
    return isReadyRenew(parentCapID);
}
 
 function isSameNode(node1, node2)

{

	if (node1 == null || node1 == undefined || node2 == null || node2 == undefined)

	{

		return false;

	}

	return node1.getID1() == node2.getID1() && node1.getID2() == node2.getID2() && node1.getID3() == node2.getID3();

}



 
function isScheduled(inspType)
	{
	var found = false;
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess())
		{
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(inspType).equals(inspList[xx].getInspectionType()))
				found = true;
		}
	return found;
	}

 
function isTaskActive(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
	}
}
 
function isTaskComplete(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, "Y", null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getCompleteFlag().equals("Y"))
				return true;
			else
				return false;
	}
}
 
function isTaskStatus(wfstr, wfstat) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length > 2) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, wfstat, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getDisposition() != null) {
				if (fTask.getDisposition().toUpperCase().equals(wfstat.toUpperCase()))
					return true;
				else
					return false;
			}
	}
	return false;
}
 

function jsDateToASIDate(dateValue)
{
  //Converts Javascript Date to ASI 0 pad MM/DD/YYYY
  //
  if (dateValue != null)
  {
	if (Date.prototype.isPrototypeOf(dateValue))
	{
	    var M = "" + (dateValue.getMonth()+1); 
	    var MM = "0" + M; 
	    MM = MM.substring(MM.length-2, MM.length); 
	    var D = "" + (dateValue.getDate()); 
	    var DD = "0" + D; 
	    DD = DD.substring(DD.length-2, DD.length); 
	    var YYYY = "" + (dateValue.getFullYear()); 
	    return MM + "/" + DD + "/" + YYYY;
	}
	else
	{
		logDebug("Parameter is not a javascript date");
		return ("INVALID JAVASCRIPT DATE");
	}
  }
  else
  {
	logDebug("Parameter is null");
	return ("NULL PARAMETER VALUE");
  }
}

 
function jsDateToMMDDYYYY(pJavaScriptDate)
	{
	//converts javascript date to string in MM/DD/YYYY format
	//
	if (pJavaScriptDate != null)
		{
		if (Date.prototype.isPrototypeOf(pJavaScriptDate))
	return (pJavaScriptDate.getMonth()+1).toString()+"/"+pJavaScriptDate.getDate()+"/"+pJavaScriptDate.getFullYear();
		else
			{
			logDebug("Parameter is not a javascript date");
			return ("INVALID JAVASCRIPT DATE");
			}
		}
	else
		{
		logDebug("Parameter is null");
		return ("NULL PARAMETER VALUE");
		}
	}

 
function licEditExpInfo (pExpStatus, pExpDate)
	{
	//Edits expiration status and/or date
	//Needs licenseObject function
	//06SSP-00238
	//
	var lic = new licenseObject(null);
	if (pExpStatus!=null)
		{
		lic.setStatus(pExpStatus);
		}
		
	if (pExpDate!=null)
		{
		lic.setExpiration(pExpDate);
		}
	}
	
 
/**
Title : licenseObject
Purpose : Licence Object Class
Functional Area : Licensing
Description : Licence Object Class that links Reference License Professional by the License Number and Optional License Type to allow updates
Script Type : EMSE, Pageflow, Batch
Call Example: var licObj = new licenseObject("RN17-00058", capId,"Nurse Practitioner");

Methods: 
setExpiration(expDate) - Update Expiration date on the Renewal and the linked Reference License
setIssued(issuedDate) - Update Issued date on the linked Reference License
setLastRenewal(lastRenewalAADate) - Update the Last Renewal date on the linked Reference License 
setStatus(licStat) - Update Status on the Renewal
getStatus() - Get the Renewal Expiration Status
getCode() - Get the Renewal Expiration Code

@param licnumber {String}
@param [vCapId] {capId}
@param [licenseType] {String}
@return {refLicObj}
 */

function licenseObject(licnumber,vCapId,vLicType)  // optional renewal Cap ID -- uses the expiration on the renewal CAP.
	{
	itemCap = capId;
	if (!matches(vCapId,undefined,null,"")) itemCap = vCapId; // use cap ID specified in args


	this.refProf = null;		// licenseScriptModel (reference licensed professional)
	this.b1Exp = null;		// b1Expiration record (renewal status on application)
	this.b1ExpDate = null;
	this.b1ExpCode = null;
	this.b1Status = null;
	this.refExpDate = null;
	this.licNum = licnumber;	// License Number
	this.licType = vLicType		// Licence Type (optional)


	// Load the reference License Professional if we're linking the two
	if (licnumber) // we're linking
		{
		var newLic = getRefLicenseProf(licnumber,this.licType)
		if (newLic)
				{
				this.refProf = newLic;
				tmpDate = newLic.getLicenseExpirationDate();
				if (tmpDate)
						this.refExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
				logDebug("(licenseObject) Loaded reference license professional with Expiration of " + this.refExpDate);
				}
		}

   	// Load the renewal info (B1 Expiration)

   	b1ExpResult = aa.expiration.getLicensesByCapID(itemCap)
   		if (b1ExpResult.getSuccess())
   			{
   			this.b1Exp = b1ExpResult.getOutput();
			tmpDate = this.b1Exp.getExpDate();
			if (tmpDate)
				this.b1ExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
			this.b1Status = this.b1Exp.getExpStatus();
			logDebug("(licenseObject) Found renewal record of status : " + this.b1Status + ", Expires on " + this.b1ExpDate);
			}
		else
			{ logDebug("(licenseObject) **ERROR: Getting B1Expiration Object for Cap.  Reason is: " + b1ExpResult.getErrorType() + ":" + b1ExpResult.getErrorMessage()) ; return false }


   	this.setExpiration = function(expDate)
   		// Update expiration date
   		{
   		var expAADate = aa.date.parseDate(expDate);

   		if (this.refProf) {
   			this.refProf.setLicenseExpirationDate(expAADate);
   			aa.licenseScript.editRefLicenseProf(this.refProf);
   			logDebug("(licenseObject) Updated Reference License Expiration to " + expDate); }

   		if (this.b1Exp)  {
 				this.b1Exp.setExpDate(expAADate);
				aa.expiration.editB1Expiration(this.b1Exp.getB1Expiration());
				logDebug("(licenseObject) Updated Renewal Expiration Date to " + expDate); }
   		}

	this.setIssued = function(issuedDate)
		// Update Issued date
		{
		var issuedAADate = aa.date.parseDate(issuedDate);

		if (this.refProf) {
			this.refProf.setLicenseIssueDate(issuedAADate);
			aa.licenseScript.editRefLicenseProf(this.refProf);
			logDebug("(licenseObject) Updated Reference License Issued Date to " + issuedDate); }

		}
	this.setLastRenewal = function(lastRenewalDate)
		// Update expiration date
		{
		var lastRenewalAADate = aa.date.parseDate(lastRenewalDate)

		if (this.refProf) {
			this.refProf.setLicenseLastRenewalDate(lastRenewalAADate);
			aa.licenseScript.editRefLicenseProf(this.refProf);
			logDebug("(licenseObject) Updated Reference License Last Renewal Date to " + lastRenewalDate); }
		}

	this.setStatus = function(licStat)
		// Update expiration status
		{
		if (this.b1Exp)  {
			this.b1Exp.setExpStatus(licStat);
			aa.expiration.editB1Expiration(this.b1Exp.getB1Expiration());
			logDebug("(licenseObject) Updated Renewal Expiration Status to " + licStat); }
		}

	this.getStatus = function()
		// Get Expiration Status
		{
		if (this.b1Exp) {
			return this.b1Exp.getExpStatus();
			}
		}

	this.getCode = function()
		// Get Expiration Code
		{
		if (this.b1Exp) {
			return this.b1Exp.getExpCode();
			}
		}
	} 
/**
* License Professional Object 
* <p>
* Properties: 
*	refLicModel - Reference LP Model
*	capLicProfScriptModel - Transactional LP Model
*	infoTables - Table Array ex infoTables[name][row][column].getValue()
*	attribs - Array of LP Attributes ex attribs[name]
*	valid - Get the Attributes for LP
*	validTables - true if LP has infoTables
*	validAttrs - true if LP has attributes
* </p>
* <p>
* Methods: 
*	getEmailTemplateParams(params,[vLicenseType],[reference]) - LP Parameters for use in Notification Templates, defualts to reference
*	refreshTables() - Get all the Table Values, done this way to keep it clean when a row is added
*	getMaxRowByTable(vTableName) - Get max row from table for sequencing
*	addTableRow(vTableName, vValueArray) - Add Row to Table
*	addTableFromASIT(vTableName, vASITArray) - Process an ASIT row into People Info
*	removeTableRow(vTableName, vRowIndex) - Remove Row from Table
*	removeTable(vTableName) - Remove Table
*	setTableEnabledFlag(vTableName, vRowIndex, isEnabled) - Enable or Disable Table Row by index
*	setDisplayInACA4Table(vTableName, vIsVisible) - Makes table visible in ACA Lookup ('Y'/'N')
*	getAttribute(vAttributeName) - Get method for attributes
*	setAttribute(vAttributeName, vAttributeValue) - Set method for attributes
*	setPrimary(vCapId,vPrimary) - Sets the Primary flag on the Record License Professional ('Y'/'N')
*	updateFromRecordContactByType(vCapId, vContactType, vUpdateAddress, vUpdatePhoneEmail, [vAddressType]) - Update From Record Contact by Contact Type, uses first contact of type found. If contactType == "" then uses primary. If vAddressType is popualted it will use contact address list rather than compact address
*	updateFromAddress(vCapId) - Updates Reference License Prof address to the primary address on the record
*	updateFromRecordLicensedProf(vCapId) - Update Reference LP from Record Licensed Prof
*	copyToRecord(vCapId, vReplace) - Copy Reference Licensed Professional to a Record
*	enable() - Enable the Ref License Professional
*	disable() - Disable the Ref License Professional
*	getAssociatedRecords() - Returns an array of associated Record IDs
*	updateRecord() - Save Changes to this object to Reference Licensed Professional
* </p>
* <p>
* Call Example:
* 	var lPObj = new licenseProfObject("16LIC-00001","General Contractor");
*	var lpRecordArray = lPObj.getAssociatedRecords();
*	var lpParams = aa.util.newHashtable();
*	lPObj.getEmailTemplateParams(lpParams);
* </p>
* @param licnumber {String} license number
* @param [lictype] {String} license type (optional)
* @param [vCapId] {capIdModel} (optional)
* @return {licenseProfObject}
*/

function licenseProfObject(licnumber, lictype, vCapId) {
	//Populate the License Model
	this.refLicModel = null; //Reference LP Model
	this.capLicProfScriptModel = null; //Transactional LP Model
	this.infoTableGroupCodeObj = null;
	this.infoTableSubGroupCodesObj = null;
	this.infoTables = new Array(); //Table Array ex infoTables[name][row][column].getValue()
	this.attribs = new Array(); //Array of LP Attributes ex attribs[name]
	this.valid = false; //true if LP is valid
	this.validTables = false; //true if LP has infoTables
	this.validAttrs = false; //true if LP has attributes

	var itemCap = (vCapId) ? vCapId : capId;

	if(itemCap){
		var capLicenseResult = aa.licenseScript.getLicenseProf(itemCap);
		if (capLicenseResult.getSuccess())
			{ capLicenseArr = capLicenseResult.getOutput();
				if  (capLicenseArr == null) capLicenseArr = new Array();
			}
		else
			{ logDebug("**ERROR: getting lic prof: " + capLicenseResult.getErrorMessage()); return false; }


		if (!capLicenseArr || capLicenseArr.length == 0) {
			logDebug("WARNING: no license professional available on the application:");
		}

		if (capLicenseArr && capLicenseArr.length > 0) {
			for (var iCapLP in capLicenseArr) {
				var licProfScriptModel = capLicenseArr[iCapLP];
				var rlpId = licProfScriptModel.getLicenseNbr();
				var rlpType = licProfScriptModel.getLicenseType();

				if (rlpId == licnumber) {
					this.capLicProfScriptModel = licProfScriptModel;
				}
			}
		}
		
	}

	var result = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), licnumber);
	if (result.getSuccess()) {
		var tmp = result.getOutput();
		if (lictype == null)
			lictype = "";
		if (tmp != null)
			for (lic in tmp)
				if (tmp[lic].getLicenseType().toUpperCase() == lictype.toUpperCase() || lictype == "") {
					this.refLicModel = tmp[lic];
					if (lictype == "") {
						lictype = this.refLicModel.getLicenseType();
					}
					break;
				}
	}
	
	//Get the People Info Tables
	if (this.refLicModel != null) {
		this.infoTableGroupCodeObj = this.refLicModel.getInfoTableGroupCodeModel();
		if (this.infoTableGroupCodeObj == null) {
			//12ACC-00187
			var infoSvc = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput();
			if (infoSvc.getInfoTableGroupCodeModel() != null) {
				infoSvc.getInfoTableGroupCodeModel().setServProvCode(aa.getServiceProviderCode());
				infoSvc.getInfoTableGroupCodeModel().setCategory(1);
				infoSvc.getInfoTableGroupCodeModel().setReferenceId("");
				infoSvc.getInfoTableGroupCodeModel().setName(lictype.toUpperCase());
				var tmpGrp = aa.licenseProfessional.getRefInfoTableGroupCode(infoSvc).getOutput();
				if (tmpGrp != null) { //If table was found set reference ID and write to DB
					tmpGrp.setReferenceId(this.refLicModel.getLicSeqNbr());
					infoSvc.setInfoTableGroupCodeModel(tmpGrp);
					aa.licenseProfessional.createRefInfoTable(infoSvc);

					//Recapture new data with Table Model
					var tmp = null;
					tmp = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), licnumber).getOutput();
					for (lic in tmp)
						if (tmp[lic].getLicenseType().toUpperCase() == lictype.toUpperCase()) {
							this.refLicModel = tmp[lic];
							break;
						}
					//Get the Table Group Code and continue on
					this.infoTableGroupCodeObj = this.refLicModel.getInfoTableGroupCodeModel();
				}
			}
		}
	}

	if (this.infoTableGroupCodeObj != null) {
		var tmp = this.infoTableGroupCodeObj.getSubgroups();
		if (tmp != null)
			this.infoTableSubGroupCodesObj = tmp.toArray();
	}

	//Set flags that can be used for validation
	this.validTables = (this.infoTableSubGroupCodesObj != null);
	this.valid = (this.refLicModel != null);
	
	this.getEmailTemplateParams = function (params,vLicenseType,reference) {
		var vLicType = lictype;
		var vFromReferenece = true;
		if(vLicenseType) vLicType = vLicenseType;
		if(reference == false) vFromReferenece = false;
		
		if(this.refLicModel != null && vFromReferenece){
			addParameter(params, "$$" + vLicType + "LastName$$", this.refLicModel.getContactLastName());
			addParameter(params, "$$" + vLicType + "FirstName$$", this.refLicModel.getContactFirstName());
			addParameter(params, "$$" + vLicType + "MiddleName$$", this.refLicModel.getContactMiddleName());
			addParameter(params, "$$" + vLicType + "BusinesName$$", this.refLicModel.getBusinessName());
			addParameter(params, "$$" + vLicType + "BusinesLicense$$", this.refLicModel.getBusinessLicense());
			addParameter(params, "$$" + vLicType + "BusinesName2$$", this.refLicModel.getBusinessName2());
			addParameter(params, "$$" + vLicType + "LicSeqNbr$$", this.refLicModel.getLicSeqNbr());
			addParameter(params, "$$" + vLicType + "$$", this.refLicModel.getLicenseType());
			addParameter(params, "$$" + vLicType + "LicenseState$$", this.refLicModel.getLicState());
			addParameter(params, "$$" + vLicType + "LicenseExpirationDate$$", this.refLicModel.getLicenseExpirationDate());
			addParameter(params, "$$" + vLicType + "LicenseInsuranceExpDate$$", this.refLicModel.getInsuranceExpDate()); 
			addParameter(params, "$$" + vLicType + "LicenseIssueDate$$", this.refLicModel.getLicenseIssueDate()); 
			addParameter(params, "$$" + vLicType + "Phone1$$", this.refLicModel.getPhone1());
			addParameter(params, "$$" + vLicType + "Phone2$$", this.refLicModel.getPhone2());
			addParameter(params, "$$" + vLicType + "Phone3$$", this.refLicModel.getPhone3());
			addParameter(params, "$$" + vLicType + "Email$$", this.refLicModel.getEMailAddress());
			addParameter(params, "$$" + vLicType + "AddressLine1$$", this.refLicModel.getAddress1());
			addParameter(params, "$$" + vLicType + "AddressLine2$$", this.refLicModel.getAddress2());
			addParameter(params, "$$" + vLicType + "AddressLine3$$", this.refLicModel.getAddress3());
			addParameter(params, "$$" + vLicType + "City$$", this.refLicModel.getCity());
			addParameter(params, "$$" + vLicType + "State$$", this.refLicModel.getState());
			addParameter(params, "$$" + vLicType + "Zip$$", this.refLicModel.getZip());
			addParameter(params, "$$" + vLicType + "Fax$$", this.refLicModel.getFax());
			addParameter(params, "$$" + vLicType + "Country$$", this.refLicModel.getCountry());
			addParameter(params, "$$" + vLicType + "WcExpDate$$", this.refLicModel.getWcExpDate());
			addParameter(params, "$$" + vLicType + "WcPolicyNo$$", this.refLicModel.getWcPolicyNo());
			addParameter(params, "$$" + vLicType + "WcInsCoCode$$", this.refLicModel.getWcInsCoCode());	
		}
		else if(this.capLicProfScriptModel != null && !vFromReferenece){
			addParameter(params, "$$" + vLicType + "LastName$$", this.capLicProfScriptModel.getContactLastName());
			addParameter(params, "$$" + vLicType + "FirstName$$", this.capLicProfScriptModel.getContactFirstName());
			addParameter(params, "$$" + vLicType + "MiddleName$$", this.capLicProfScriptModel.getContactMiddleName());
			addParameter(params, "$$" + vLicType + "BusinesName$$", this.capLicProfScriptModel.getBusinessName());
			addParameter(params, "$$" + vLicType + "BusinesLicense$$", this.capLicProfScriptModel.getBusinessLicense());
			addParameter(params, "$$" + vLicType + "BusinesName2$$", this.capLicProfScriptModel.getBusName2());
			addParameter(params, "$$" + vLicType + "LicSeqNbr$$", this.capLicProfScriptModel.getLicenseNbr());
			addParameter(params, "$$" + vLicType + "$$", this.capLicProfScriptModel.getLicenseType());
			addParameter(params, "$$" + vLicType + "LicenseState$$", this.capLicProfScriptModel.getLicState());
			addParameter(params, "$$" + vLicType + "LicenseExpirationDate$$", this.capLicProfScriptModel.getLicenseExpirDate());
			addParameter(params, "$$" + vLicType + "LicenseIssueDate$$", this.capLicProfScriptModel.getLicesnseOrigIssueDate()); 
			addParameter(params, "$$" + vLicType + "Phone1$$", this.capLicProfScriptModel.getPhone1());
			addParameter(params, "$$" + vLicType + "Phone2$$", this.capLicProfScriptModel.getPhone2());
			addParameter(params, "$$" + vLicType + "Phone3$$", this.capLicProfScriptModel.getPhone3());
			addParameter(params, "$$" + vLicType + "Email$$", this.capLicProfScriptModel.getEmail());
			addParameter(params, "$$" + vLicType + "AddressLine1$$", this.capLicProfScriptModel.getAddress1());
			addParameter(params, "$$" + vLicType + "AddressLine2$$", this.capLicProfScriptModel.getAddress2());
			addParameter(params, "$$" + vLicType + "AddressLine3$$", this.capLicProfScriptModel.getAddress3());
			addParameter(params, "$$" + vLicType + "City$$", this.capLicProfScriptModel.getCity());
			addParameter(params, "$$" + vLicType + "State$$", this.capLicProfScriptModel.getState());
			addParameter(params, "$$" + vLicType + "Zip$$", this.capLicProfScriptModel.getZip());
			addParameter(params, "$$" + vLicType + "Fax$$", this.capLicProfScriptModel.getFax());
			addParameter(params, "$$" + vLicType + "Country$$", this.capLicProfScriptModel.getCountry());	
		}
		return params;

	}

	//Get all the Table Values, done this way to keep it clean when a row is added
	//Can also be used to refresh manually
	this.refreshTables = function () {
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				var tableArr = new Array()
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
				if (columnsList != null) {
					columnsList = columnsList.toArray();
					for (column in columnsList) {
						var tmpCol = columnsList[column].getTableValues();
						//aa.print(columnsList[column])
						if (tmpCol != null) {
							tmpCol = tmpCol.toArray();
							tmpCol.sort(function (a, b) {
								return a.getRowNumber() - b.getRowNumber()
							})
							//EMSE Dom gets by column, need to pivot to list by row to make usable
							for (var row = 0; row < tmpCol.length; row++) {
								tmpCol[row].setRowNumber(row); //Fix the row numbers
								if (tableArr[row] == null)
									tableArr[row] = new Array();
								tableArr[row][columnsList[column].getName()] = tmpCol[row];
							}
						}
					}
				}
				this.infoTables[this.infoTableSubGroupCodesObj[tbl].getName()] = tableArr;
			}
		}
	}
	this.refreshTables(); //Invoke the Table Refresh to popualte our table arrays

	//Get max row from table for sequencing
	this.getMaxRowByTable = function (vTableName) {
		var maxRow = -1;
		if (this.validTables) {
			var tbl = this.infoTables[vTableName];
			if (tbl != null) {
				for (row in tbl)
					for (col in tbl[row]) //due to way data is stored must loop through all row/columns
						if (maxRow < parseInt(tbl[row][col].getRowNumber()))
							maxRow = parseInt(tbl[row][col].getRowNumber());
			}
		}
		return maxRow;
	}

	//Add Row to Table
	this.addTableRow = function (vTableName, vValueArray) {
		var retVal = false;
		var newRowArray = new Array();
		if (this.validTables)
			for (tbl in this.infoTableSubGroupCodesObj)
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var maxRow = this.getMaxRowByTable(vTableName) + 1;
					var colsArr = this.infoTableSubGroupCodesObj[tbl].getColumnDefines().toArray();
					var colNum = 0;
					colsArr.sort(function (a, b) {
						return (parseInt(a.getDisplayOrder()) - parseInt(b.getDisplayOrder()))
					});
					for (col in colsArr) {
						//12ACC-00189
						var tmpTv = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput().getInfoTableValueModel();
						tmpTv.setAuditStatus("A");
						tmpTv.setServProvCode(aa.getServiceProviderCode());
						tmpTv.setColumnNumber(colNum++);
						tmpTv.setAuditDate(colsArr[col].getAuditDate()); //need proper date
						if (typeof(currentUserID) != 'undefined') //check to make sure a current userID exists
							tmpTv.setAuditId(currentUserID);
						else
							tmpTv.setAuditId("ADMIN"); //default to admin
						tmpTv.setInfoId(colsArr[col].getId());
						tmpTv.setRowNumber(maxRow); //use static new row variable from object
						for (val in vValueArray)
							if (val.toString().toUpperCase() == colsArr[col].getName().toString().toUpperCase()) {
								tmpTv.setValue(vValueArray[val].toString()); //Get Value from associative array
							}

						colsArr[col].addTableValue(tmpTv);
						retVal = true;
					}
					this.refreshTables(); //refresh associative arrays
				}
		return retVal;
	}

	//Process an ASIT row into People Info
	this.addTableFromASIT = function (vTableName, vASITArray) {
		var retVal = true;
		if (this.validTables)
			for (row in vASITArray) { //for Each Row in the ASIT execute the add
				if (!this.addTableRow(vTableName, vASITArray[row]))
					retVal = false;
			}
		else
			retVal = false;
		return retVal;
	}

	//Remove Row from Table
	this.removeTableRow = function (vTableName, vRowIndex) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							var tmpCol = columnsList[column].getTableValues();
							if (tmpCol != null) {
								tmpCol = tmpCol.toArray();
								//aa.print(tmpCol.length);
								if (vRowIndex <= tmpCol.length) {
									var tmpList = aa.util.newArrayList()
										for (row in tmpCol) {
											if (tmpCol[row].getRowNumber() != vRowIndex) {
												tmpList.add(tmpCol[row]);
												//aa.print(tmpCol[row].getColumnNumber() + " :" + tmpCol[row].getRowNumber());
											} else {
												retVal = true;
											}
										}
										columnsList[column].setTableValues(tmpList);
								} //End Remove
							} //end column Check
						} //end column loop
					} //end column list check
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check

		return retVal;
	}

	this.removeTable = function (vTableName) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							var tmpCol = columnsList[column].getTableValues();
							if (tmpCol != null) {
								var tmpList = aa.util.newArrayList()
									columnsList[column].setTableValues(tmpList);
								retVal = true;
							} //End Remove
						} //end column loop
					} //end column list check
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check

		return retVal;
	}

	//Enable or Disable Table Row by index
	this.setTableEnabledFlag = function (vTableName, vRowIndex, isEnabled) {
		var updated = false
			var tmp = null
			tmp = this.infoTables[vTableName];
		if (tmp != null)
			if (tmp[vRowIndex] != null) {
				for (col in tmp[vRowIndex]) {
					tmp[vRowIndex][col].setAuditStatus(((isEnabled) ? "A" : "I"));
					updated = true;
				}
			}
		return updated;
	}

	//Makes table visible in ACA Lookup
	//vIsVisible = 'Y' or 'N'
	this.setDisplayInACA4Table = function (vTableName, vIsVisible) {
		var retVal = false;
		if (this.validTables) {
			for (tbl in this.infoTableSubGroupCodesObj) {
				if (this.infoTableSubGroupCodesObj[tbl].getName() == vTableName) {
					var columnsList = this.infoTableSubGroupCodesObj[tbl].getColumnDefines();
					if (columnsList != null) {
						columnsList = columnsList.toArray();
						for (column in columnsList) {
							columnsList[column].setDisplayLicVeriForACA(vIsVisible);
							retVal = true;
						} //end column loop
					} //end column list check
					if (retVal) {
						var tmpList = aa.util.newArrayList();
						for (col in columnsList) {
							tmpList.add(columnsList[col]);
						}
						this.infoTableSubGroupCodesObj[tbl].setColumnDefines(tmpList);
					}
					break; //exit once table found
				} //end Table loop
			} //end table loop
		} //end table valid check
		return retVal;
	}

	//Get the Attributes for LP
	if (this.valid) {
		var tmpAttrs = this.refLicModel.getAttributes();
		if (tmpAttrs != null) {
			var tmpAttrsList = tmpAttrs.values()
				var tmpIterator = tmpAttrsList.iterator();
			if (tmpIterator.hasNext()) {
				var tmpAttribs = tmpIterator.next().toArray();
				for (x in tmpAttribs) {
					if(tmpAttribs[x].getAttributeLabel())
						this.attribs[tmpAttribs[x].getAttributeLabel().toUpperCase()] = tmpAttribs[x];
				}
				this.validAttrs = true;
			}
		}
	}

	//get method for Attributes
	this.getAttribute = function (vAttributeName) {
		var retVal = null;
		if (this.validAttrs) {
			var tmpVal = this.attribs[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null)
				retVal = tmpVal.getAttributeValue();
		}
		return retVal;
	}

	//Set method for Attributes
	this.setAttribute = function (vAttributeName, vAttributeValue) {
		var retVal = false;
		if (this.validAttrs) {
			var tmpVal = this.attribs[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null) {
				tmpVal.setAttributeValue(vAttributeValue);
				retVal = true;
			}
		}
		return retVal;
	}
	
	this.setPrimary = function(vCapId,vPrimary){
		//Get the LP from the Record
	
		if (this.valid) {
			var capLicenseResult = aa.licenseProfessional.getLicenseProf(vCapId);
			var capLicenseArr = new Array();
			var existing = false;
			if (capLicenseResult.getSuccess()) {
				capLicenseArr = capLicenseResult.getOutput();
			}

			if (capLicenseArr != null) {
				for (capLic in capLicenseArr) {
					var lpsm = capLicenseArr[capLic];
					if (lpsm.getLicenseNbr() + "" == this.refLicModel.getStateLicense() + ""
						 && lpsm.getLicenseType() + "" == this.refLicModel.getLicenseType() + "") {
							lpsm.setPrintFlag(vPrimary ? "Y" : "N");
							aa.licenseProfessional.editLicensedProfessional(lpsm);
					}
				}
			}
		}
	}

	//Update From Record Contact by Contact Type
	//Uses first contact of type found
	//If contactType == "" then uses primary
	//If vAddressType is popualted it will use contact address list rather than compact address
	this.updateFromRecordContactByType = function (vCapId, vContactType, vUpdateAddress, vUpdatePhoneEmail, vAddressType) {
		var retVal = false;
		if (this.valid) {
			var conArr = new Array();
			var capContResult = aa.people.getCapContactByCapID(vCapId);

			if (capContResult.getSuccess()) {
				conArr = capContResult.getOutput();
			} else {
				retVal = false;
			}

			for (contact in conArr) {
				if (vContactType.toString().toUpperCase() ==
					conArr[contact].getPeople().getContactType().toString().toUpperCase()
					 || (vContactType.toString() == "" && conArr[contact].getPeople().getFlag() == "Y")) {

					cont = conArr[contact];
					peop = cont.getPeople();
					addr = peop.getCompactAddress();
					

					this.refLicModel.setContactFirstName(cont.getFirstName());
					this.refLicModel.setContactMiddleName(peop.getMiddleName()); //get mid from peop
					this.refLicModel.setContactLastName(cont.getLastName());
					this.refLicModel.setBusinessName(peop.getBusinessName());
					if (vUpdateAddress && vAddressType == null) {
						// Use Compact Address
						this.refLicModel.setAddress1(addr.getAddressLine1());
						this.refLicModel.setAddress2(addr.getAddressLine2());
						this.refLicModel.setAddress3(addr.getAddressLine3());
						this.refLicModel.setCity(addr.getCity());
						this.refLicModel.setState(addr.getState());
						this.refLicModel.setZip(addr.getZip());
					}
					if(vUpdateAddress && vAddressType){
						// Use Contact Address List
						var capContactModel = cont.getCapContactModel(); 
						var contactAddressListResult = aa.address.getContactAddressListByCapContact(capContactModel);
						
						if (contactAddressListResult.getSuccess()) { 
						var contactAddressList = contactAddressListResult.getOutput();
						foundAddressType = false;
							for (var x in contactAddressList) {
								var cal= contactAddressList[x];
								var addrType = cal.getAddressType();
								logDebug("Contact Address Type: " + addrType);
								if (addrType == vAddressType) {
									foundAddressType = true;
									contactAddressID = cal.getAddressID();
									cResult = aa.address.getContactAddressByPK(cal.getContactAddressModel());
									if (cResult.getSuccess()) {
										casm = cResult.getOutput(); // contactAddressScriptModel
										//aa.print(casm);
										this.refLicModel.setAddress1(casm.getAddressLine1());
										this.refLicModel.setAddress2(casm.getAddressLine2());
										this.refLicModel.setCity(casm.getCity());
										this.refLicModel.setState(casm.getState());
										this.refLicModel.setZip(casm.getZip());
									}
								}
							}	
						}
					}
					if (vUpdatePhoneEmail) {
						this.refLicModel.setPhone1(peop.getPhone1());
						this.refLicModel.setPhone2(peop.getPhone2());
						this.refLicModel.setPhone3(peop.getPhone3());
						this.refLicModel.setEMailAddress(peop.getEmail());
						this.refLicModel.setFax(peop.getFax());
					}
					//Audit Fields
					this.refLicModel.setAgencyCode(aa.getServiceProviderCode());
					this.refLicModel.setAuditDate(sysDate);
					this.refLicModel.setAuditID(currentUserID);
					this.refLicModel.setAuditStatus("A");

					retVal = true;
					break;
				}
			}
		}
		return retVal;
	}

	this.updateFromAddress = function (vCapId) {
		var retVal = false;
		if (this.valid) {
			var capAddressResult = aa.address.getAddressByCapId(vCapId);
			var addr = null;
			if (capAddressResult.getSuccess()) {
				Address = capAddressResult.getOutput();
				for (yy in Address) {
					if ("Y" == Address[yy].getPrimaryFlag()) {
						addr = Address[yy];
						logDebug("Target CAP has primary address");
						break;
					}
				}
				if (addr == null) {
					addr = Address[0];
				}
			} else {
				logMessage("**ERROR: Failed to get addresses: " + capAddressResult.getErrorMessage());
			}

			if (addr != null) {
				var addrLine1 = addr.getAddressLine1();
				if (addrLine1 == null) {
					addrLine1 = addr.getHouseNumberStart();
					addrLine1 += (addr.getStreetDirection() != null ? " " + addr.getStreetDirection() : "");
					addrLine1 += (addr.getStreetName() != null ? " " + addr.getStreetName() : "");
					addrLine1 += (addr.getStreetSuffix() != null ? " " + addr.getStreetSuffix() : "");
					addrLine1 += (addr.getUnitType() != null ? " " + addr.getUnitType() : "");
					addrLine1 += (addr.getUnitStart() != null ? " " + addr.getUnitStart() : "");
				}
				this.refLicModel.setAddress1(addrLine1);
				this.refLicModel.setAddress2(addr.getAddressLine2());
				this.refLicModel.setCity(addr.getCity());
				this.refLicModel.setState(addr.getState());
				this.refLicModel.setZip(addr.getZip());
				retVal = true;
			} else {
				retVal = false;
			}
		}
		return retVal;
	}

	//Update From Record Licensed Prof
	//License Number and Type must match that of the Record License Prof
	this.updateFromRecordLicensedProf = function (vCapId) {
		var retVal = false;
		if (this.valid) {

			var capLicenseResult = aa.licenseProfessional.getLicenseProf(vCapId);
			var capLicenseArr = new Array();
			if (capLicenseResult.getSuccess()) {
				capLicenseArr = capLicenseResult.getOutput();
			} else {
				retVal = false;
			}

			for (capLic in capLicenseArr) {
				if (capLicenseArr[capLic].getLicenseNbr() + "" == this.refLicModel.getStateLicense() + ""
					 && capLicenseArr[capLic].getLicenseType() + "" == this.refLicModel.getLicenseType() + "") {

					licProfScriptModel = capLicenseArr[capLic];

					this.refLicModel.setAddress1(licProfScriptModel.getAddress1());
					this.refLicModel.setAddress2(licProfScriptModel.getAddress2());
					this.refLicModel.setAddress3(licProfScriptModel.getAddress3());
					this.refLicModel.setAgencyCode(licProfScriptModel.getAgencyCode());
					this.refLicModel.setAuditDate(licProfScriptModel.getAuditDate());
					this.refLicModel.setAuditID(licProfScriptModel.getAuditID());
					this.refLicModel.setAuditStatus(licProfScriptModel.getAuditStatus());
					this.refLicModel.setBusinessLicense(licProfScriptModel.getBusinessLicense());
					this.refLicModel.setBusinessName(licProfScriptModel.getBusinessName());
					this.refLicModel.setCity(licProfScriptModel.getCity());
					this.refLicModel.setCityCode(licProfScriptModel.getCityCode());
					this.refLicModel.setContactFirstName(licProfScriptModel.getContactFirstName());
					this.refLicModel.setContactLastName(licProfScriptModel.getContactLastName());
					this.refLicModel.setContactMiddleName(licProfScriptModel.getContactMiddleName());
					this.refLicModel.setContryCode(licProfScriptModel.getCountryCode());
					this.refLicModel.setCountry(licProfScriptModel.getCountry());
					this.refLicModel.setEinSs(licProfScriptModel.getEinSs());
					this.refLicModel.setEMailAddress(licProfScriptModel.getEmail());
					this.refLicModel.setFax(licProfScriptModel.getFax());
					this.refLicModel.setLicOrigIssDate(licProfScriptModel.getLicesnseOrigIssueDate());
					this.refLicModel.setPhone1(licProfScriptModel.getPhone1());
					this.refLicModel.setPhone2(licProfScriptModel.getPhone2());
					this.refLicModel.setSelfIns(licProfScriptModel.getSelfIns());
					this.refLicModel.setState(licProfScriptModel.getState());
					this.refLicModel.setLicState(licProfScriptModel.getState());
					this.refLicModel.setSuffixName(licProfScriptModel.getSuffixName());
					this.refLicModel.setWcExempt(licProfScriptModel.getWorkCompExempt());
					this.refLicModel.setZip(licProfScriptModel.getZip());

					//new
					this.refLicModel.setFein(licProfScriptModel.getFein());
					//licProfScriptModel.getBirthDate()
					//licProfScriptModel.getTitle()
					this.refLicModel.setPhone3(licProfScriptModel.getPhone3());
					this.refLicModel.setBusinessName2(licProfScriptModel.getBusName2());

					retVal = true;
				}
			}
		}
		return retVal;
	}

	//Copy Reference Licensed Professional to a Record
	//If replace is true will remove and readd lic_prof
	//Currently wont copy infoTables...
	this.copyToRecord = function (vCapId, vReplace) {
		var retVal = false;
		if (this.valid) {
			var capLicenseResult = aa.licenseProfessional.getLicenseProf(vCapId);
			var capLicenseArr = new Array();
			var existing = false;
			if (capLicenseResult.getSuccess()) {
				capLicenseArr = capLicenseResult.getOutput();
			}

			if (capLicenseArr != null) {
				for (capLic in capLicenseArr) {
					if (capLicenseArr[capLic].getLicenseNbr() + "" == this.refLicModel.getStateLicense() + ""
						 && capLicenseArr[capLic].getLicenseType() + "" == this.refLicModel.getLicenseType() + "") {
						if (vReplace) {
							aa.licenseProfessional.removeLicensedProfessional(capLicenseArr[capLic]);
							break;
						} else {
							existing = true;
						}
					}
				}
			}

			if (!existing) {
				capListResult = aa.licenseScript.associateLpWithCap(vCapId, this.refLicModel);
				retVal = capListResult.getSuccess();
				//Add peopleInfoTables via Workaround (12ACC-00186)
				if (this.validTables && retVal) {
					var tmpLicProfObj = aa.licenseProfessional.getLicenseProfessionScriptModel().getOutput();
					this.infoTableGroupCodeObj.setCapId1(vCapId.getID1());
					this.infoTableGroupCodeObj.setCapId2(vCapId.getID2());
					this.infoTableGroupCodeObj.setCapId3(vCapId.getID3());
					//save ref values
					var tmpRefId = this.infoTableGroupCodeObj.getReferenceId();
					var tmpRefType = this.infoTableGroupCodeObj.getReferenceType();
					var tmpRefDesc = this.infoTableGroupCodeObj.getReferenceDesc();
					//update Ref Values
					this.infoTableGroupCodeObj.setReferenceId(this.refLicModel.getStateLicense());
					this.infoTableGroupCodeObj.setReferenceType(this.refLicModel.getLicenseType());
					this.infoTableGroupCodeObj.setReferenceDesc("Description");
					this.infoTableGroupCodeObj.setCategory(1);
					tmpLicProfObj.setInfoTableGroupCodeModel(this.infoTableGroupCodeObj);
					aa.licenseProfessional.createInfoTable(tmpLicProfObj);
					//Set the cap back to null
					this.infoTableGroupCodeObj.setCapId1(null);
					this.infoTableGroupCodeObj.setCapId2(null);
					this.infoTableGroupCodeObj.setCapId3(null);
					//Set the ref values back
					this.infoTableGroupCodeObj.setReferenceId(tmpRefId);
					this.infoTableGroupCodeObj.setReferenceType(tmpRefType);
					this.infoTableGroupCodeObj.setReferenceDesc(tmpRefDesc);
				}
			}
		}
		return retVal;
	}

	this.enable = function () {
		this.refLicModel.setAuditStatus("A");
	}
	this.disable = function () {
		this.refLicModel.setAuditStatus("I");
	}

	//get records associated to license
	this.getAssociatedRecords = function () {
		var retVal = new Array();
		if (this.valid) {
			var resObj = aa.licenseScript.getCapIDsByLicenseModel(this.refLicModel);
			if (resObj.getSuccess()) {
				var tmp = resObj.getOutput();
				if (tmp != null) //make sure your not setting to null otherwise will not work like array
					retVal = tmp;
			}
		}
		return retVal;
	}

	//Save Changes to this object to Ref Licensed Professional
	this.updateRecord = function () {
		var retVal = false
			if (this.valid) {
				this.refreshTables(); //Must ensure row#s are good or wont show in ACA
				var res = aa.licenseScript.editRefLicenseProf(this.refLicModel);
				retVal = res.getSuccess();
			}
			return retVal;
	}

	return this
}
 
 function linkPublicUserToContact()   // optional: Contact Type, default Applicant

{

    var contactType = "Applicant";

    var contact;

    var refContactNum;

    var userModel;

    if (arguments.length > 0) contactType = arguments[0]; // use contact type specified



    var capContactResult = aa.people.getCapContactByCapID(capId);

    if (capContactResult.getSuccess()) {

		var Contacts = capContactResult.getOutput();

        for (yy in Contacts) {

            if (contactType.equals(Contacts[yy].getCapContactModel().getPeople().getContactType()))

				contact = Contacts[yy];

        }

    }

    

    if (!contact)

    { logDebug("Couldn't link public user for " + contactType + ", no such contact"); return false; }





	if (contact.getPeople().getContactTypeFlag().equals("organization"))

	{ logDebug("Couldn't link public user for " + contactType + ", the contact is an organization"); return false; }

	

    // get the reference contact ID.   We will use to connect to the new public user

    refContactNum = contact.getCapContactModel().getRefContactNumber();



    // check to see if public user exists already based on email address

    var getUserResult = aa.publicUser.getPublicUserByPUser(publicUserID);

    if (getUserResult.getSuccess() && getUserResult.getOutput()) {

        userModel = getUserResult.getOutput();

        logDebug("linkPublicUserToContact: Found an existing public user: " + userModel.getUserID());

	} else {

		logDebug("Couldn't link public user for " + contactType + ", no such public user"); return false;

	}



	//  Now that we have a public user let's connect to the reference contact		

	

	if (refContactNum)

		{

		logDebug("linkPublicUserToContact: Linking this public user with reference contact : " + refContactNum);

		aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), refContactNum);

		}

	

	return userModel; // send back the new or existing public user

}

 
function loadAddressAttributes(thisArr)
{
	//
	// Returns an associative array of Address Attributes
	// Optional second parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var fcapAddressObj = null;
   	var capAddressResult = aa.address.getAddressWithAttributeByCapId(itemCap);
   	if (capAddressResult.getSuccess())
   		var fcapAddressObj = capAddressResult.getOutput();
   	else
     		logDebug("**ERROR: Failed to get Address object: " + capAddressResult.getErrorType() + ":" + capAddressResult.getErrorMessage())

  	for (i in fcapAddressObj)
  	{
  		addressAttrObj = fcapAddressObj[i].getAttributes().toArray();
  		for (z in addressAttrObj)
			thisArr["AddressAttribute." + addressAttrObj[z].getB1AttributeName()]=addressAttrObj[z].getB1AttributeValue();

		// Explicitly load some standard values
		thisArr["AddressAttribute.PrimaryFlag"] = fcapAddressObj[i].getPrimaryFlag();
		thisArr["AddressAttribute.HouseNumberStart"] = fcapAddressObj[i].getHouseNumberStart();
		thisArr["AddressAttribute.StreetDirection"] = fcapAddressObj[i].getStreetDirection();
		thisArr["AddressAttribute.StreetName"] = fcapAddressObj[i].getStreetName();
		thisArr["AddressAttribute.StreetSuffix"] = fcapAddressObj[i].getStreetSuffix();
		thisArr["AddressAttribute.City"] = fcapAddressObj[i].getCity();
		thisArr["AddressAttribute.State"] = fcapAddressObj[i].getState();
		thisArr["AddressAttribute.Zip"] = fcapAddressObj[i].getZip();
		thisArr["AddressAttribute.AddressStatus"] = fcapAddressObj[i].getAddressStatus();
		thisArr["AddressAttribute.County"] = fcapAddressObj[i].getCounty();
		thisArr["AddressAttribute.Country"] = fcapAddressObj[i].getCountry();
		thisArr["AddressAttribute.AddressDescription"] = fcapAddressObj[i].getAddressDescription();
		thisArr["AddressAttribute.XCoordinate"] = fcapAddressObj[i].getXCoordinator();
		thisArr["AddressAttribute.YCoordinate"] = fcapAddressObj[i].getYCoordinator();
  	}
}
 

function loadAddressAttributes4ACA(thisArr)
{
	//
	// Returns an associative array of Address Attributes from ACA cap model
	// 
	//

	fcapAddressObj = cap.getAddressModel();

  	if (!fcapAddressObj)
  		{ logDebug("No Address to get attributes"); return false; }
  	
	addressAttr = fcapAddressObj.getAttributes();
		
	if (!addressAttr)
		{ logDebug("No attributes on this address") ; return false ; }

	addressAttrObj = addressAttr.toArray();

	for (z in addressAttrObj)
		thisArr["AddressAttribute." + addressAttrObj[z].getB1AttributeName()]=addressAttrObj[z].getB1AttributeValue();

	// Explicitly load some standard values
	thisArr["AddressAttribute.PrimaryFlag"] = fcapAddressObj.getPrimaryFlag();
	thisArr["AddressAttribute.HouseNumberStart"] = fcapAddressObj.getHouseNumberStart();
	thisArr["AddressAttribute.StreetDirection"] = fcapAddressObj.getStreetDirection();
	thisArr["AddressAttribute.StreetName"] = fcapAddressObj.getStreetName();
	thisArr["AddressAttribute.StreetSuffix"] = fcapAddressObj.getStreetSuffix();
	thisArr["AddressAttribute.City"] = fcapAddressObj.getCity();
	thisArr["AddressAttribute.State"] = fcapAddressObj.getState();
	thisArr["AddressAttribute.Zip"] = fcapAddressObj.getZip();
	thisArr["AddressAttribute.AddressStatus"] = fcapAddressObj.getAddressStatus();
	thisArr["AddressAttribute.County"] = fcapAddressObj.getCounty();
	thisArr["AddressAttribute.Country"] = fcapAddressObj.getCountry();
	thisArr["AddressAttribute.AddressDescription"] = fcapAddressObj.getAddressDescription();
	thisArr["AddressAttribute.XCoordinate"] = fcapAddressObj.getXCoordinator();
	thisArr["AddressAttribute.YCoordinate"] = fcapAddressObj.getYCoordinator();
}
 
function loadAppSpecific(thisArr) {
	// 
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

    	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
	 	{
		var fAppSpecInfoObj = appSpecInfoResult.getOutput();

		for (loopk in fAppSpecInfoObj)
			{
			if (useAppSpecificGroupName)
				thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			else
				thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			}
		}
	}

 
function loadAppSpecific4ACA(thisArr) {
	//
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	// uses capModel in this event


	var itemCap = capId;
	if (arguments.length >= 2)
		{
		itemCap = arguments[1]; // use cap ID specified in args

    		var fAppSpecInfoObj = aa.appSpecificInfo.getByCapID(itemCap).getOutput();

		for (loopk in fAppSpecInfoObj)
			{
			if (useAppSpecificGroupName)
				thisArr[fAppSpecInfoObj[loopk].getCheckboxType() + "." + fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			else
				thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			}
		}
	else
		{
		var capASI = cap.getAppSpecificInfoGroups();
		if (!capASI) {
			logDebug("No ASI for the CapModel");
			}
		else {
			var i= cap.getAppSpecificInfoGroups().iterator();

			while (i.hasNext())
				{
				 var group = i.next();
				 var fields = group.getFields();
				 if (fields != null)
					{
					var iteFields = fields.iterator();
					while (iteFields.hasNext())
						{
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
function loadAppSpecific4Contact(thisArr, contactSeqNbr) {
	var itemCap = capId;
	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args

	var capContactResult = aa.people.getCapContactByPK(itemCap, contactSeqNbr);
	if (capContactResult.getSuccess()) {
		var capContact = capContactResult.getOutput().getCapContactModel();

		if (capContact == null || capContact.getTemplate() == null || capContact.getTemplate().getTemplateForms() == null) {
			//logDebug("No found any Contact Template !");
			return;
		}

		var template = capContact.getTemplate();
		var templateForms = template.getTemplateForms();

		for (var i = 0; i < templateForms.size(); i++) {
			var eachForm = templateForms.get(i);

			//Sub Group
			var subGroup = eachForm.subgroups;

			if (subGroup == null) {
				continue;
			}

			for (var j = 0; j < subGroup.size(); j++) {
				var eachSubGroup = subGroup.get(j);

				if (eachSubGroup == null || eachSubGroup.fields == null) {
					continue;
				}

				var allFields = eachSubGroup.fields;
				for (var k = 0; k < allFields.size(); k++) {
					var eachField = allFields.get(k);
					thisArr[eachField.displayFieldName] = eachField.defaultValue;
				}
			}
		}
	}

} 


function loadASITable(tname) {

 	//
 	// Returns a single ASI Table array of arrays
	// Optional parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
	var tai = ta.iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();
	  var tn = tsm.getTableName();

      if (!tn.equals(tname)) continue;

	  if (tsm.rowIndex.isEmpty())
	  	{
			logDebug("Couldn't load ASI Table " + tname + " it is empty");
			return false;
		}

   	  var tempObject = new Array();
	  var tempArray = new Array();

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
      var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
	  var numrows = 1;

	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
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
		tempArray.push(tempObject);  // end of record
	  }
	  return tempArray;
	}

 
function loadASITables() {

 	//
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	// Optional parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
	var tai = ta.iterator();

	if(tai != null && typeof(tai).hasNext != "undefined"){

		while (tai.hasNext())
		{
		var tsm = tai.next();

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName();
		var numrows = 0;
		tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

		if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

		if (!tsm.rowIndex.isEmpty())
			{
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
			var numrows = 1;

			while (tsmfldi.hasNext())  // cycle through fields
				{
				if (!tsmcoli.hasNext())  // cycle through columns
					{
					var tsmcoli = tsm.getColumns().iterator();
					tempArray.push(tempObject);  // end of record
					var tempObject = new Array();  // clear the temp obj
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
				//tempObject[tcol.getColumnName()] = tval;
				}

				tempArray.push(tempObject);  // end of record
			}

		var copyStr = "" + tn + " = tempArray";
		logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
		eval(copyStr);  // move to table name
		}

	}

}

 
function loadASITables4ACA() {

 	//
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
	//

	var itemCap = capId;
    if (1 == arguments.length) {
        itemCap = arguments[0];
        var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput()
    } else var gm = cap.getAppSpecificTableGroupModel();
    for (var ta = gm.getTablesMap(), tai = ta.values().iterator(); tai.hasNext();) {
        var tsm = tai.next();
        if (!tsm.rowIndex.isEmpty()) {
            var tempObject = new Array,
            tempArray = new Array,
            tn = tsm.getTableName();
            tn = String(tn).replace(/[^a-zA-Z0-9]+/g, ""),
            isNaN(tn.substring(0, 1)) || (tn = "TBL" + tn);
            for (var tsmfldi = tsm.getTableField().iterator(), tsmcoli = tsm.getColumns().iterator(), numrows = 1; tsmfldi.hasNext();) {
                if (!tsmcoli.hasNext()) {
                    var tsmcoli = tsm.getColumns().iterator();
                    tempArray.push(tempObject);
                    var tempObject = new Array;
                    numrows++
                }
                               
                               var tcol = tsmcoli.next();
                               var tobj = tsmfldi.next(); 
                               var tval = ""; 
                               try 
                               { 
                                      tval = tobj.getInputValue(); 
                               } 
                               catch (ex) 
                               { 
                                      tval = tobj; 
                               }
                               tempObject[tcol.getColumnName()] = tval;
            }
            tempArray.push(tempObject);
            var copyStr = "" + tn + " = tempArray";
            logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)"),
            eval(copyStr)
        }
    }
}
 
function loadASITablesBefore() {

	//
	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	//Sometimes "AppSpecificTableGroupModel" is a list
	var gm = aa.env.getValue("AppSpecificTableGroupModel");

	var gmItem = gm;

	if (gm != null && typeof(gm).size != "undefined" && gm.size() > 0) {
		gmItem = gm.get(0);
	} else {
		gmItem = gm;
	}

	if (null != gmItem && gmItem != "") {
		var ta = gmItem.getTablesMap().values();
		var tai = ta.iterator();
		while (tai.hasNext()) {
			var tsm = tai.next();

			if (tsm.rowIndex.isEmpty())
				continue; // empty table

			var tempObject = new Array();
			var tempArray = new Array();
			var tn = tsm.getTableName();

			var numrows = 0;
			tn = String(tn).replace(/[^a-zA-Z0-9]+/g, '');

			if (!isNaN(tn.substring(0, 1)))
				tn = "TBL" + tn // prepend with TBL if it starts with a number

					if (!tsm.rowIndex.isEmpty()) {
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

					var copyStr = "" + tn + " = tempArray";
			aa.print("ASI Table Array : " + tn + " (" + numrows + " Rows)");
			eval(copyStr); // move to table name
		}
	}
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
  				  	{ logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " +  ltresult.getErrorMessage()); return false; }
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


//////////////////

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

 

function loadGuideSheetItems(inspId) {
	//
	// Returns an associative array of Guide Sheet Items
	// Optional second parameter, cap ID to load from
	//

	var retArray = new Array()
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var r = aa.inspection.getInspections(itemCap)

	if (r.getSuccess())
	 	{
		var inspArray = r.getOutput();

		for (i in inspArray)
			{
			if (inspArray[i].getIdNumber() == inspId)
				{
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets()

				if (gs)
					{
					gsArray = gs.toArray();
					for (var loopk in gsArray)
						{
						var gsItems = gsArray[loopk].getItems().toArray()
						for (var loopi in gsItems)
							retArray[gsItems[loopi].getGuideItemText()] = gsItems[loopi].getGuideItemStatus();
						}
					} // if there are guidesheets
				else
					logDebug("No guidesheets for this inspection");
				} // if this is the right inspection
			} // for each inspection
		} // if there are inspections

	logDebug("loaded " + retArray.length + " guidesheet items");
	return retArray;
	}
 
function loadParcelAttributes(thisArr) {
	//
	// Returns an associative array of Parcel Attributes
	// Optional second parameter, cap ID to load from
	//
	
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

	var fcapParcelObj = null;
   	var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
   	if (capParcelResult.getSuccess())
   		var fcapParcelObj = capParcelResult.getOutput().toArray();
   	else
     		logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage())
  	
  	for (i in fcapParcelObj)
  		{
  		// parcelArea += fcapParcelObj[i].getParcelArea()  // change requested 5/22/2017 by J.White
		if (fcapParcelObj[i].getParcelArea()){
				parcelArea += parseFloat(fcapParcelObj[i].getParcelArea());
		}

  		parcelAttrObj = fcapParcelObj[i].getParcelAttribute().toArray();
  		for (z in parcelAttrObj)
			thisArr["ParcelAttribute." + parcelAttrObj[z].getB1AttributeName()]=parcelAttrObj[z].getB1AttributeValue();

		// Explicitly load some standard values
		thisArr["ParcelAttribute.Block"] = fcapParcelObj[i].getBlock();
		thisArr["ParcelAttribute.Book"] = fcapParcelObj[i].getBook();
		thisArr["ParcelAttribute.CensusTract"] = fcapParcelObj[i].getCensusTract();
		thisArr["ParcelAttribute.CouncilDistrict"] = fcapParcelObj[i].getCouncilDistrict();
		thisArr["ParcelAttribute.ExemptValue"] = fcapParcelObj[i].getExemptValue();
		thisArr["ParcelAttribute.ImprovedValue"] = fcapParcelObj[i].getImprovedValue();
		thisArr["ParcelAttribute.InspectionDistrict"] = fcapParcelObj[i].getInspectionDistrict();
		thisArr["ParcelAttribute.LandValue"] = fcapParcelObj[i].getLandValue();
		thisArr["ParcelAttribute.LegalDesc"] = fcapParcelObj[i].getLegalDesc();
		thisArr["ParcelAttribute.Lot"] = fcapParcelObj[i].getLot();
		thisArr["ParcelAttribute.MapNo"] = fcapParcelObj[i].getMapNo();
		thisArr["ParcelAttribute.MapRef"] = fcapParcelObj[i].getMapRef();
		thisArr["ParcelAttribute.ParcelStatus"] = fcapParcelObj[i].getParcelStatus();
		thisArr["ParcelAttribute.SupervisorDistrict"] = fcapParcelObj[i].getSupervisorDistrict();
		thisArr["ParcelAttribute.Tract"] = fcapParcelObj[i].getTract();
		thisArr["ParcelAttribute.PlanArea"] = fcapParcelObj[i].getPlanArea();
  		}
	}
 
function loadTasks(ltcapidstr)
	{
	if (typeof(ltcapidstr) == "string")
                {
		var ltresult = aa.cap.getCapID(ltcapidstr);
	 	if (ltresult.getSuccess())
  		 	ltCapId = ltresult.getOutput();
	  	else
  		  	{ logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " +  ltresult.getErrorMessage()); return false; }
                }
	else
		ltCapId = ltcapidstr;

  	var taskArr = new Array();

	var workflowResult = aa.workflow.getTasks(ltCapId);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else
		{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }

	for (i in wfObj)
		{
		fTask = wfObj[i];
		var myTask = new Task();
		myTask.status = fTask.getDisposition();
		myTask.comment = fTask.getDispositionComment();
		myTask.process = fTask.getProcessCode();
                if (fTask.getStatusDate()) myTask.statusdate = "" + (fTask.getStatusDate().getMonth() + 1) + "/" + fTask.getStatusDate().getDate() + "/" + (fTask.getStatusDate().getYear() + 1900);
		myTask.processID = fTask.getProcessID();
		myTask.note = fTask.getDispositionNote();
		myTask.step = fTask.getStepNumber();
		myTask.active = fTask.getActiveFlag(); 
		taskArr[fTask.getTaskDescription()] = myTask;
		}
	return taskArr;
	}


function Task() // Task Object
	{
	this.status = null
	this.comment = null;
	this.note = null;
    this.statusdate = null;
	this.process = null;
	this.processID = null;
    this.step = null;
    this.active = null;
	}
	


 
function loadTaskSpecific(thisArr) 
	{
 	// 
 	// Appends the Task Specific Info to App Specific Array
 	// If useTaskSpecificGroupName==true, appends wf process code.wftask. to TSI field label
	// Optional second parameter, cap ID to load from
	//
	
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

 	var workflowResult = aa.workflow.getTasks(itemCap);
 	if (workflowResult.getSuccess())
 		var wfObj = workflowResult.getOutput();
 	else
 		{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()) ; return false; }
 
 	for (i in wfObj)
 		{
 		var fTask = wfObj[i];
 		var stepnumber = fTask.getStepNumber();
 		var processID = fTask.getProcessID();
 		var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(itemCap, processID, stepnumber)
 		if (TSIResult.getSuccess())
 			{
 			var TSI = TSIResult.getOutput();
 			for (a1 in TSI)
  				{
  				if (useTaskSpecificGroupName)
  	  				thisArr[fTask.getProcessCode() + "." + fTask.getTaskDescription() + "." + TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
  	  			else
	  				thisArr[TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
				}
 			}
 		}
	}
 
function logDebug(dstr) {
	vLevel = 1
	if (arguments.length > 1)
		vLevel = arguments[1];
	if ((showDebug & vLevel) == vLevel || vLevel == 1)
		debug += dstr + br;
	if ((showDebug & vLevel) == vLevel)
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}
 

function logGlobals(globArray) {

	for (loopGlob in globArray)
		logDebug("{" + loopGlob + "} = " + globArray[loopGlob])
	}

 

function logMessage(dstr)
	{
	message+=dstr + br;
	}
 
function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}

 
function lookupDateRange(stdChoiceEntry,dateValue) // optional val number 
	{
	var valNumber = 1;
	if (arguments.length == 3) valNumber = arguments[2];

	var compDate = new Date(dateValue);
	var domArr
	for (var count=1; count <= 9999; count++)  // Must be sequential from 01 up to 9999
		{
		var countstr = "0000" + count;
		var countstr = String(countstr).substring(countstr.length,countstr.length - 4);
		var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoiceEntry,countstr);
	   	
	   	if (bizDomScriptResult.getSuccess())
	   		{
			var bizDomScriptObj = bizDomScriptResult.getOutput();
			var domVal = bizDomScriptObj.getDescription();
			if (bizDomScriptObj.getAuditStatus() != 'I')
				{
				var domOld = domArr;
				var domArr = domVal.split("\\^")
				var domDate = new Date(domArr[0])
				if (domDate >= compDate)     //  found the next tier, use the last value
					if (domOld)
						return domOld[valNumber];
					else
						break;
				}					
			}
		else
			if (domArr)
				return domArr[valNumber];
			else
				break;
		}
	}	
 
function lookupFeesByValuation(stdChoiceEntry,stdChoiceValue,capval) // optional arg number 
	{
	var valNumber = 1;
	if (arguments.length == 4) valNumber = arguments[3];

	var saveVal ; 
	var lookupStr = lookup(stdChoiceEntry,stdChoiceValue);
	
	if (lookupStr)
		{
		workArr = lookupStr.split("^");
		for (var i in workArr)
			{
                        aa.print(workArr[i]);
			workVals = workArr[i].split("|");
			if (workVals[0] > capval) 
				return saveVal;
			else
				if (valNumber == 1)
					saveVal = workVals[valNumber];
				else
					{
					saveVal = parseInt((capval - workVals[0])/100);
					if ((capval - workVals[0]) % 100 > 0) saveVal++;
					saveVal = saveVal * workVals[valNumber];
					}
			}
		}
	return saveVal;
	}


 
function lookupFeesByValuationSlidingScale(stdChoiceEntry,stdChoiceValue,capval) // optional arg number 
	{
	var valNumber = 2;
	if (arguments.length == 4) valNumber = (arguments[3] + 1);

	var saveVal ; 
	var lookupStr = lookup(stdChoiceEntry,stdChoiceValue);
	
	if (lookupStr)
		{
		workArr = lookupStr.split("^");
		for (var i in workArr)
			{
                        aa.print(workArr[i]);
                        
                        
			workVals = workArr[i].split("|");
			if (workVals[0] > capval) 
				return saveVal;
			else
				if (valNumber == 2)
					saveVal = workVals[valNumber];
				else
					{
					var divisor = workVals[1];
					saveVal = parseInt((capval - workVals[0])/divisor);
					if ((capval - workVals[0]) % divisor > 0) saveVal++;
					saveVal = saveVal * workVals[valNumber];
					}
			}
		}
	return saveVal;
	}

 
function loopTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "L");
			else
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "L");

			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Looping...");
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Looping...");
		}
	}
} 
function lpSet(desiredSetId) {
	this.refresh = function () {

		var theSet = aa.set.getSetByPK(this.id).getOutput();
		this.status = theSet.getSetStatus();
		this.setId = theSet.getSetID();
		this.name = theSet.getSetTitle();
		this.comment = theSet.getSetComment();
		this.model = theSet.getSetHeaderModel();
		this.statusComment = theSet.getSetStatusComment();

		var memberResult = aa.set.getLPSetMembersByPK(this.id);

		if (!memberResult.getSuccess()) {
			logDebug("**WARNING** error retrieving set members " + memberResult.getErrorMessage());
		} else {
			this.members = memberResult.getOutput().toArray();
			this.size = this.members.length;
			if (this.members.length > 0) {
				this.empty = false;
				}
			logDebug("lpSet: loaded set " + this.id + " of status " + this.status + " with " + this.size + " records");
		}
	}

	this.add = function (addLicNum) {
		var setMemberStatus;
		if (arguments.length == 2)
			setMemberStatus = arguments[1];

		try {
			var addLic = getRefLicenseProf(addLicNum);
			var addResult = aa.set.addLPSetMember(this.id, addLic.licSeqNbr);

			if (!addResult.getSuccess()) {
				logDebug("**WARNING** error removing license from set " + this.id + " : " + addResult.getErrorMessage());
			} else {
				logDebug("lpSet: added LP " + addLicNum + " from set " + this.id);
			}
		} catch (err) {
			logDebug("**ERROR** error adding license from set " + this.id + " : " + err.message);
		}

	}

	this.remove = function (removeLicNum) {
		try {
			var removeLic = getRefLicenseProf(removeLicNum);
			var removeResult = aa.set.removeSetHeadersListByLP(this.id, removeLic.licSeqNbr)
				if (!removeResult.getSuccess()) {
					logDebug("**WARNING** error removing license from set " + this.id + " : " + removeResult.getErrorMessage());
				} else {
					logDebug("lpSet: removed license " + removeLicNum + " from set " + this.id);
				}
		} catch (err) {
			logDebug("**ERROR** error removing license from set " + this.id + " : " + err.message);
		}
	}

	this.update = function () {
		var sh = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.SetBusiness").getOutput();
		this.model.setSetStatus(this.status)
		this.model.setSetID(this.setId);
		this.model.setSetTitle(this.name);
		this.model.setSetComment(this.comment);
		this.model.setSetStatusComment(this.statusComment);
		this.model.setRecordSetType(this.type);

		logDebug("lpSet: updating set header information");
		try {
			updateResult = sh.updateSetBySetID(this.model);
		} catch (err) {
			logDebug("**WARNING** error updating set header failed " + err.message);
		}

	}

	this.id = desiredSetId;
	this.name = desiredSetId;
	this.type = null;
	this.comment = null;

	if (arguments.length > 1 && arguments[1])
		this.name = arguments[1];
	if (arguments.length > 2 && arguments[2])
		this.type = arguments[2];
	if (arguments.length > 3 && arguments[3])
		this.comment = arguments[3];

	this.size = 0;
	this.empty = true;
	this.members = new Array();
	this.status = "";
	this.statusComment = "";
	this.model = null;

	var theSetResult = aa.set.getSetByPK(this.id);

	if (theSetResult.getSuccess()) {
		this.refresh();
	} else // add the set
	{
		theSetResult = aa.set.createSet(this.id, this.name, "LICENSE_PROFESSIONAL", this.comment); // Options: CAP (Default), LICENSE_PROFESSIONAL, PARCEL, ADDRESS, RANDOMAUDIT
		if (!theSetResult.getSuccess()) {
			logDebug("**WARNING** error creating set " + this.id + " : " + theSetResult.getErrorMessage);
		} else {
			logDebug("lpSet: Created new set " + this.id + " of type " + this.type);
			this.refresh();
		}
	}

}
 

//
// matches:  returns true if value matches any of the following arguments
//
function matches(eVal, argList) {
	for (var i = 1; i < arguments.length; i++) {
		if (arguments[i] == eVal) {
			return true;
		}
	}
	return false;
} 
function nextWorkDay(td)   
	// uses app server to return the next work day.
	// Only available in 6.3.2
	// td can be "mm/dd/yyyy" (or anything that will convert to JS date)
	{
	
	if (!td) 
		dDate = new Date(aa.util.now());
	else
		dDate = convertDate(td);

	if (!aa.calendar.getNextWorkDay)
		{
		logDebug("getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
		}
	else
		{
		var dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth()+1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
		}

	return (dDate.getMonth()+1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();;
	}


 
function openUrlInNewWindow(myurl)
 {
 //
 // showDebug or showMessage must be true for this to work
 //
 newurl = "<SCRIPT LANGUAGE=\"JavaScript\">\r\n<!--\r\n newwin = window.open(\""
 newurl+=myurl
 newurl+="\"); \r\n  //--> \r\n </SCRIPT>"
 
 comment(newurl)
 }

 
function pairObj(actID) {
	this.ID = actID;
	this.cri = null;
	this.act = null;
	this.elseact = null;
	this.enabled = true;
	this.continuation = false;
	this.branch = new Array();

	this.load = function (loadStr) {
		//
		// load() : tokenizes and loades the criteria and action
		//
		loadArr = loadStr.split("\\^");
		if (loadArr.length < 2 || loadArr.length > 3) {
			logMessage("**ERROR: The following Criteria/Action pair is incorrectly formatted.  Two or three elements separated by a caret (\"^\") are required. " + br + br + loadStr)
		} else {
			this.cri = loadArr[0];
			this.act = loadArr[1];
			this.elseact = loadArr[2];

			if (this.cri.length() == 0)
				this.continuation = true; // if format is like ("^action...") then it's a continuation of previous line

			var a = loadArr[1];
			var bb = a.indexOf("branch(");
			while (!enableVariableBranching && bb >= 0) {
				var cc = a.substring(bb);
				var dd = cc.indexOf("\")");
				if (dd < 0)
					break;
				if (dd >= 9)
					this.branch.push(cc.substring(8, dd));
				a = cc.substring(dd);
				bb = a.indexOf("branch(");
			}

		}
	}
} 
function parcelConditionExists(condtype)
	{
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (!capParcelResult.getSuccess())
		{ logDebug("**WARNING: error getting cap parcels : " + capParcelResult.getErrorMessage()) ; return false }

	var Parcels = capParcelResult.getOutput().toArray();
	for (zz in Parcels)
		{
		pcResult = aa.parcelCondition.getParcelConditions(Parcels[zz].getParcelNumber());
		if (!pcResult.getSuccess())
			{ logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage()) ; return false }
		pcs = pcResult.getOutput();
		for (pc1 in pcs)
			if (pcs[pc1].getConditionType().equals(condtype)) return true;
		}
	}

 
function parcelExistsOnCap()
{
	// Optional parameter, cap ID to load from
	//

	var itemCap = capId;
	if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args

	var fcapParcelObj = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
	if (capParcelResult.getSuccess())
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	else
		{ logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage()); return false; }

	for (i in fcapParcelObj)
	{
		return true;
	}

	return false;
}
 
function paymentByTrustAccount(fSeqNbr) //optional: itemCap
  {
	// function  performs the following:
	// retrieve primary trust account on capId 
	// initiates payment from identified trust account for the ammount of the fee associated with fseqNbr
	// if payment successful applies payment in full to fee associated with fseqNbr
	// generates receipt for payment for fee associated with fseqNbr
	// if any of the above fails returns false, otherwise will return true.
	// fee must be invoiced for function to work, use optional capId parameter with addFee() call to ensure fee is invoiced prior to this function being called.
	// 06/08/2011 - Joseph Cipriano - Truepoint Solutions: Made revision to function.  Alter call to pull Primary Trust Account on Cap to use method aa.trustAccount.getPrimaryTrustAccountByCAP().

        feeSeqNbr = fSeqNbr;
	itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
	
	//get fee details
	//retrieve a list of invoices by capID
	iListResult = aa.finance.getInvoiceByCapID(itemCap,null);
	if (iListResult.getSuccess())
	  {
		iList = iListResult.getOutput();
		invNbr = "";
		feeAmount = "";
		iFound = false;
		
		//find invoice by matching fee sequence numbers with one passed in
		for (iNum in iList)
		  {
			fList = aa.invoice.getFeeItemInvoiceByInvoiceNbr(iList[iNum].getInvNbr()).getOutput()
			for (fNum in fList)
        	  if (fList[fNum].getFeeSeqNbr() == feeSeqNbr)
			    {	
				  invNbr = iList[iNum].getInvNbr();
				  feeAmount = fList[fNum].getFee();
				  var amtPaid = 0;
					var pfResult = aa.finance.getPaymentFeeItems(capId, null);
					if (pfResult.getSuccess()) {
						var pfObj = pfResult.getOutput();
						for (ij in pfObj){
						  if (pfObj[ij].getFeeSeqNbr() == feeSeqNbr) {
								amtPaid = pfObj[ij].getFeeAllocation();
						  }
						}
					}
					feeAmount = feeAmount - amtPaid;
				  iFound = true;
				  logMessage("Invoice Number Found: " + invNbr);
				  logMessage("Fee Amount: " + feeAmount);
				  break;
				}
		  }
		  if (!iFound)
			{
			  logMessage("Invoice not found");
			  return false;
			}
	  }
	else
	  {
		logDebug("Error: could not retrieve invoice list: " + iListResult.getErrorMessage());
		return false;
	  }

	
	//retrieve trust account
	//will likely need more logic here to select correct trust account
	//will select first account found on cap
        var tPAcctResult = aa.trustAccount.getPrimaryTrustAccountByCAP(itemCap);

	if (tPAcctResult.getSuccess())
	  {
		tAccountID = tPAcctResult.getOutput().getAcctID();
		tAcctResult = aa.trustAccount.getTrustAccountByAccountID(tAccountID);
		if (tAcctResult.getSuccess())
		  {
			tAcct = tAcctResult.getOutput();
			if (tAcct.getOverdraft == "Y")
			 {
				logDebug("Overdraft allowed");
				if ((tAcct.getAcctBalance() + tAcct.getOverdraftLimit()) < feeAmount)
				  {
					logDebug("The trust account balance plus overdraft allowance is less than invoiced fee amount.")
					logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
					logDebug("Trust Account Overlimit allowance: " + tAcct.getOverdraftLimit());
					return false;
				  }
			 }	  
			else
			{
				if (tAcct.getOverdraft == "N")
				{
					if (tAcct.getAcctBalance() < feeAmount)
					{
						logDebug("The trust account balance is less than invoiced fee amount.")
						logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
						return false;
					}
				}	
			}
			comment("Trust Account ID: " + tAcct.getAcctID());  
			logDebug("Trust Account Balance: " + tAcct.getAcctBalance());
		  }

	  }
	else
	  {
		logDebug("Error: could not retrieve trust account object: " + tPAcctResult.getErrorMessage());
		return false;
	  }
	  
	//prepare payment
	//create paymentscriptmodel
	p = aa.finance.createPaymentScriptModel();
	p.setAuditDate(aa.date.getCurrentDate());
	p.setAuditStatus("A");
	p.setCapID(itemCap);
	p.setCashierID(p.getAuditID());
	p.setPaymentSeqNbr(p.getPaymentSeqNbr());
	p.setPaymentAmount(feeAmount);
	p.setAmountNotAllocated(feeAmount);
	p.setPaymentChange(0);
	p.setPaymentComment("Trust Account Auto-Deduct: " + tAccountID);
	p.setPaymentDate(aa.date.getCurrentDate());
	p.setPaymentMethod("Trust Account");
	p.setPaymentStatus("Paid");
	p.setAcctID(tAccountID);
 
	//create payment
	presult = aa.finance.makePayment(p);
	if (presult.getSuccess()) 
	  {
		//get additional payment information
		pSeq = presult.getOutput();
		logDebug("Payment successful");
		pReturn = aa.finance.getPaymentByPK(itemCap,pSeq,currentUserID);
		if (pReturn.getSuccess()) 
			{
				pR = pReturn.getOutput();
				logDebug("PaymentSeq: " + pR.getPaymentSeqNbr());
			}
		else
			{
				logDebug("Error retrieving payment, must apply payment manually: " + pReturn.getErrorMessage());
				return false;
			}
		
	  }
	else 
	  {
		logDebug("error making payment: " + presult.getErrorMessage());
		return false;
	  }
	
	//apply payment
	//need to figure out how to get payment script model of resulting payment, and paymentFeeStatus and paymentIvnStatus
	feeSeqNbrArray = new Array() ; 
	feeSeqNbrArray.push(feeSeqNbr);
	
	invNbrArray = new Array();
	invNbrArray.push(invNbr);
	
	feeAllocArray = new Array();
	feeAllocArray.push(feeAmount);

	applyResult = aa.finance.applyPayment(itemCap,pR.getPaymentSeqNbr(),feeAmount,feeSeqNbrArray,invNbrArray,feeAllocArray,aa.date.getCurrentDate(),"Paid","Paid",pR.getCashierID(),null);
		
	if (applyResult.getSuccess()) 
	  {
		//get additional payment information
		apply = applyResult.getOutput();
		logDebug("Apply Payment Successful");
	  }
	else 
	  {
		logDebug("error applying funds: " + applyResult.getErrorMessage());
		return false;
	  }
	
	
	//generate receipt
	receiptResult = aa.finance.generateReceipt(itemCap,aa.date.getCurrentDate(),pR.getPaymentSeqNbr(),pR.getCashierID(),null);

	if (receiptResult.getSuccess())
	  {
		receipt = receiptResult.getOutput();
		logDebug("Receipt successfully created: ");// + receipt.getReceiptNbr());
	  }
	else 
	  {
		logDebug("error generating receipt: " + receiptResult.getErrorMessage());
		return false;
	  }
	   
	 //everything committed successfully
	 return true;
  } 
function paymentByTrustAccount(fSeqNbr) //optional: itemCap
  {
	// function  performs the following:
	// retrieve primary trust account on capId 
	// initiates payment from identified trust account for the ammount of the fee associated with fseqNbr
	// if payment successful applies payment in full to fee associated with fseqNbr
	// generates receipt for payment for fee associated with fseqNbr
	// if any of the above fails returns false, otherwise will return true.
	// fee must be invoiced for function to work, use optional capId parameter with addFee() call to ensure fee is invoiced prior to this function being called.
	// 06/08/2011 - Joseph Cipriano - Truepoint Solutions: Made revision to function.  Alter call to pull Primary Trust Account on Cap to use method aa.trustAccount.getPrimaryTrustAccountByCAP().

        feeSeqNbr = fSeqNbr;
	itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
	
	// 06/08/2011 - Joseph Cipriano - Truepoint Solutions: Remarked out section on validating if the record has a Licensed Professional.
	/*
	//Make sure there is at least one Licensed Professional on cap.
	capLicenseResult = aa.licenseScript.getLicenseProf(capId);
	if (capLicenseResult.getSuccess())
		{
		lpArray = capLicenseResult.getOutput();
		//Alter condition below. Added condition to also check if the lpArray is null.
		if (lpArray == null || lpArray.length == 0) return false; //no LPs found
		}
	else
		{
		//no LPs found
		return false;
		}
        */

	//get fee details
	//retrieve a list of invoices by capID
	iListResult = aa.finance.getInvoiceByCapID(itemCap,null);
	if (iListResult.getSuccess())
	  {
		iList = iListResult.getOutput();
		invNbr = "";
		feeAmount = "";
		iFound = false;
		
		//find invoice by matching fee sequence numbers with one passed in
		for (iNum in iList)
		  {
			fList = aa.invoice.getFeeItemInvoiceByInvoiceNbr(iList[iNum].getInvNbr()).getOutput()
			for (fNum in fList)
        	  if (fList[fNum].getFeeSeqNbr() == feeSeqNbr)
			    {	
				  invNbr = iList[iNum].getInvNbr();
				  feeAmount = fList[fNum].getFee();
				  iFound = true;
				  logMessage("Invoice Number Found: " + invNbr);
				  logMessage("Fee Amount: " + feeAmount);
				  break;
				}
		  }
		  if (!iFound)
			{
			  logMessage("Invoice not found");
			  return false;
			}
	  }
	else
	  {
		logDebug("Error: could not retrieve invoice list: " + iListResult.getErrorMessage());
		return false;
	  }

	
	//retrieve trust account
	//will likely need more logic here to select correct trust account
	//will select first account found on cap
        var tPAcctResult = aa.trustAccount.getPrimaryTrustAccountByCAP(itemCap);

	if (tPAcctResult.getSuccess())
	  {
		tAccountID = tPAcctResult.getOutput().getAcctID();
		tAcctResult = aa.trustAccount.getTrustAccountByAccountID(tAccountID);
		if (tAcctResult.getSuccess())
		  {
			tAcct = tAcctResult.getOutput();
			if (tAcct.getOverdraft == "Y")
			 {
				logDebug("Overdraft allowed");
				if ((tAcct.getAcctBalance() + tAcct.getOverdraftLimit()) < feeAmount)
				  {
					logDebug("The trust account balance plus overdraft allowance is less than invoiced fee amount.")
					logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
					logDebug("Trust Account Overlimit allowance: " + tAcct.getOverdraftLimit());
					return false;
				  }
			 }	  
			else
			{
				if (tAcct.getOverdraft == "N")
				{
					if (tAcct.getAcctBalance() < feeAmount)
					{
						logDebug("The trust account balance is less than invoiced fee amount.")
						logMessage("Trust Account Balance: " + tAcct.getAcctBalance());
						return false;
					}
				}	
			}
			comment("Trust Account ID: " + tAcct.getAcctID());  
			logDebug("Trust Account Balance: " + tAcct.getAcctBalance());
		  }

	  }
	else
	  {
		logDebug("Error: could not retrieve trust account object: " + tPAcctResult.getErrorMessage());
		return false;
	  }
	  
	//prepare payment
	//create paymentscriptmodel
	p = aa.finance.createPaymentScriptModel();
	p.setAuditDate(aa.date.getCurrentDate());
	p.setAuditStatus("A");
	p.setCapID(itemCap);
	p.setCashierID(p.getAuditID());
	p.setPaymentSeqNbr(p.getPaymentSeqNbr());
	p.setPaymentAmount(feeAmount);
	p.setAmountNotAllocated(feeAmount);
	p.setPaymentChange(0);
	p.setPaymentComment("Trust Account Auto-Deduct: " + tAccountID);
	p.setPaymentDate(aa.date.getCurrentDate());
	p.setPaymentMethod("Trust Account");
	p.setPaymentStatus("Paid");
	p.setAcctID(tAccountID);
 
	//create payment
	presult = aa.finance.makePayment(p);
	if (presult.getSuccess()) 
	  {
		//get additional payment information
		pSeq = presult.getOutput();
		logDebug("Payment successful");
		pReturn = aa.finance.getPaymentByPK(itemCap,pSeq,currentUserID);
		if (pReturn.getSuccess()) 
			{
				pR = pReturn.getOutput();
				logDebug("PaymentSeq: " + pR.getPaymentSeqNbr());
			}
		else
			{
				logDebug("Error retrieving payment, must apply payment manually: " + pReturn.getErrorMessage());
				return false;
			}
		
	  }
	else 
	  {
		logDebug("error making payment: " + presult.getErrorMessage());
		return false;
	  }
	
	//apply payment
	//need to figure out how to get payment script model of resulting payment, and paymentFeeStatus and paymentIvnStatus
	feeSeqNbrArray = new Array() ; 
	feeSeqNbrArray.push(feeSeqNbr);
	
	invNbrArray = new Array();
	invNbrArray.push(invNbr);
	
	feeAllocArray = new Array();
	feeAllocArray.push(feeAmount);

	applyResult = aa.finance.applyPayment(itemCap,pR.getPaymentSeqNbr(),feeAmount,feeSeqNbrArray,invNbrArray,feeAllocArray,aa.date.getCurrentDate(),"Paid","Paid",pR.getCashierID(),null);
		
	if (applyResult.getSuccess()) 
	  {
		//get additional payment information
		apply = applyResult.getOutput();
		logDebug("Apply Payment Successful");
	  }
	else 
	  {
		logDebug("error applying funds: " + applyResult.getErrorMessage());
		return false;
	  }
	
	
	//generate receipt
	receiptResult = aa.finance.generateReceipt(itemCap,aa.date.getCurrentDate(),pR.getPaymentSeqNbr(),pR.getCashierID(),null);

	if (receiptResult.getSuccess())
	  {
		receipt = receiptResult.getOutput();
		logDebug("Receipt successfully created: ");// + receipt.getReceiptNbr());
	  }
	else 
	  {
		logDebug("error generating receipt: " + receiptResult.getErrorMessage());
		return false;
	  }
	   
	 //everything committed successfully
	 return true;
  } 
function paymentGetNotAppliedTot() //gets total Amount Not Applied on current CAP
	{
	var amtResult = aa.cashier.getSumNotAllocated(capId);
	if (amtResult.getSuccess())
		{
		var appliedTot = amtResult.getOutput();
		//logDebug("Total Amount Not Applied = $"+appliedTot.toString());
		return parseFloat(appliedTot);
		}
	else
		{
		logDebug("**ERROR: Getting total not applied: " + amtResult.getErrorMessage()); 
		return false;
		}
	return false;
	}

 
/**
 * Pops and deletes value from standard choice queue
 * @param {*} keyVal 
 * @param {*} cacheStore 
 */
function popCache(keyVal, cacheStore) {
    var lu = null;
    var bdv = aa.bizDomain.getBizDomainByValue(cacheStore, keyVal).getOutput();
    if (bdv) {
        lu = String(bdv.getDescription());
    }

    if (bdv) {
        var bz = new com.accela.aa.aamain.systemConfig.BizDomainBusiness();
        bz.deleteBizDomianValue(aa.getServiceProviderCode(), cacheStore, keyVal);
    }
    return lu;
} 
function prepareRenewal() {

    if (isRenewProcess(parentCapId, capId)) {
        logDebug("CAPID(" + parentCapId + ") is ready for renew. PartialCap (" + capId + ")");

        //Associate partial cap with parent CAP.
        var result = aa.cap.createRenewalCap(parentCapId, capId, true);
        if (result.getSuccess()) {
            // Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
            aa.cap.updateAccessByACA(capId, "N");
        }
        else
        { logDebug("ERROR: Associate partial cap with parent CAP. " + result.getErrorMessage()); return false };

        return true;
    }
    else
    { logDebug("Renewal Process did not finish properly"); return false; }
}
 
function proximity(svc,layer,numDistance)  // optional: distanceType
	{
	// returns true if the app has a gis object in proximity
	// use with all events except ApplicationSubmitBefore
	// 6/20/07 JHS - Changed errors to Warnings in case GIS server unavailable.

	var distanceType = "feet"
	if (arguments.length == 4) distanceType = arguments[3]; // use distance type in arg list

	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(layer + "_ID");
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }

	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }

		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			if (proxObj.length)
				{
				return true;
				}
			}
		}
	}

 
function proximityToAttribute(svc,layer,numDistance,distanceType,attributeName,attributeValue)
	{
	// returns true if the app has a gis object in proximity that contains the attributeName = attributeValue
	// use with all events except ApplicationSubmitBefore
	// example usage:
	// 01 proximityToAttribute("flagstaff","Parcels","50","feet","BOOK","107") ^ DoStuff...

	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributeName);
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				
				if (retString && retString.equals(attributeValue))
					return true;
				}
			
			}
		}
	}

 
/**
 * pushes to a caching standard choice
 * @param {*} keyVal 
 * @param {*} keyData 
 * @param {*} cacheStore 
 * @param {boolean} override 
 */
function pushCache(keyVal, keyData, cacheStore, override) {
    var isCached = false;
    var bdv = aa.bizDomain.getBizDomainByValue(cacheStore, keyVal).getOutput();
    if (bdv && override) {
        bdv.setDescription(keyData);
        isCached = aa.bizDomain.editBizDomain(bdv.getBizDomain()).getSuccess();
    }
    else {
        isCached = aa.bizDomain.createBizDomain(cacheStore, keyVal, 'A', keyData).getSuccess();
    }
    return isCached;
} 
/**
 * Recalcs fees
 * @param itemCap {capIdModel}
 * @returns {boolean}
 */
function recalcFees(itemCap){
	var valobj = aa.finance.getContractorSuppliedValuation(itemCap,null).getOutput();	
	var estValue = 0;
	var calcValue = 0;
	var feeFactor = "CONT";
	if (valobj.length) {
		estValue = valobj[0].getEstimatedValue();
		calcValue = valobj[0].getCalculatedValue();
		feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
	}
	var feeValue = estValue;
	if(feeFactor != "CONT"){ 
		feeValue = calcValue;
	}
	//perform the recalculation
	var res = aa.finance.reCalculateFees(itemCap, feeFactor, feeValue);
	
	return res.getSuccess();
}

 
function refLicProfGetAttribute(pLicNum, pAttributeName)
	{
	//Gets value of custom attribute from reference license prof record
	//07SSP-00033/SP5014

	//validate parameter values
	if (pLicNum==null || pLicNum.length==0 || pAttributeName==null || pAttributeName.length==0)
		{
		logDebug("Invalid license number or attribute name parameter");
		return ("INVALID PARAMETER");
		}

	//get reference License Professional record

	var newLic = getRefLicenseProf(pLicNum)

	//get reference License Professional's license seq num
	var licSeqNum = 0;
	var attributeType = "";
	if (newLic)
		{
		licSeqNum = newLic.getLicSeqNbr();
		attributeType = newLic.getLicenseType();
		logDebug("License Seq Num: "+licSeqNum + ", License Type: "+attributeType);
		}
	else
		{
		logMessage("No reference licensed professional found with state license number of "+pLicNum);
		logDebug("No reference licensed professional found with state license number of "+pLicNum);
		return ("NO LICENSE FOUND");
		}

	//get ref Lic Prof custom attribute using license seq num & attribute type
	if ( !(licSeqNum==0 || licSeqNum==null || attributeType=="" || attributeType==null) )
		{
		var peopAttrResult = aa.people.getPeopleAttributeByPeople(licSeqNum, attributeType);
			if (!peopAttrResult.getSuccess())
			{
			logDebug("**ERROR retrieving reference license professional attribute: " + peopAttrResult.getErrorMessage());
			return false;
			}

		var peopAttrArray = peopAttrResult.getOutput();
		if (peopAttrArray)
			{
			for (i in peopAttrArray)
				{
				if ( pAttributeName.equals(peopAttrArray[i].getAttributeName()) )
					{
					logDebug("Reference record for license "+pLicNum+", attribute "+pAttributeName+": "+peopAttrArray[i].getAttributeValue());
					return peopAttrArray[i].getAttributeValue();
					}
				}
			logDebug("Reference record for license "+pLicNum+" has no attribute named "+pAttributeName);
			return ("ATTRIBUTE NOT FOUND");
			}
		else
			{
			logDebug("Reference record for license "+pLicNum+" has no custom attributes");
			return ("ATTRIBUTE NOT FOUND");
			}
		}
	else
		{
		logDebug("Missing seq nbr or license type");
		return false;
		}
	}
 
function refLicProfGetDate (pLicNum, pDateType)
	{
	//Returns expiration date from reference licensed professional record.  Skips disabled reference licensed professionals.
	//pDateType parameter decides which date field is returned.  Options: "EXPIRE" (default), "RENEW","ISSUE","BUSINESS","INSURANCE"
	//Internal Functions needed: convertDate(), jsDateToMMDDYYYY()
	//07SSP-00033/SP5014  Edited for SR5054A.R70925
	//
	if (pDateType==null || pDateType=="")
		var dateType = "EXPIRE";
	else
		{
		var dateType = pDateType.toUpperCase();
		if ( !(dateType=="ISSUE" || dateType=="RENEW" || dateType=="BUSINESS" || dateType=="INSURANCE") )
			dateType = "EXPIRE";
		}

	if (pLicNum==null || pLicNum=="")
		{
		logDebug("Invalid license number parameter");
		return ("INVALID PARAMETER");
		}

	var newLic = getRefLicenseProf(pLicNum)

	if (newLic)
		{
		var jsExpDate = new Date(aa.util.now());

 		if (dateType=="EXPIRE")
			{
			if (newLic.getLicenseExpirationDate())
				{
				jsExpDate = convertDate(newLic.getLicenseExpirationDate());
				logDebug(pLicNum+" License Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no License Expiration Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="INSURANCE")
			{
			if (newLic.getInsuranceExpDate())
				{
				jsExpDate = convertDate(newLic.getInsuranceExpDate());
				logDebug(pLicNum+" Insurance Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Insurance Expiration Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="BUSINESS")
			{
			if (newLic.getBusinessLicExpDate())
				{
				jsExpDate = convertDate(newLic.getBusinessLicExpDate());
				logDebug(pLicNum+" Business Lic Expiration Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Business Lic Exp Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="ISSUE")
			{
			if (newLic.getLicenseIssueDate())
				{
				jsExpDate = convertDate(newLic.getLicenseIssueDate());
				logDebug(pLicNum+" License Issue Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Issue Date");
				return ("NO DATE FOUND");
				}
			}
		else if (dateType=="RENEW")
			{
			if (newLic.getLicenseLastRenewalDate())
				{
				jsExpDate = convertDate(newLic.getLicenseLastRenewalDate());
				logDebug(pLicNum+" License Last Renewal Date: "+jsDateToMMDDYYYY(jsExpDate));
				return jsExpDate;
				}
			else
				{
				logDebug("Reference record for license "+pLicNum+" has no Last Renewal Date");
				return ("NO DATE FOUND");
				}
			}
		else
			return ("NO DATE FOUND");
		}
	}

 
function removeAllFees(itemCap) // Removes all non-invoiced fee items for a CAP ID
{
	getFeeResult = aa.fee.getFeeItems(itemCap, null, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();

				var editResult = aa.finance.removeFeeItem(itemCap, feeSeq);
				if (editResult.getSuccess()) {
					logDebug("Removed existing Fee Item: " + feeList[feeNum].getFeeCod());
				} else {
					logDebug("**ERROR: removing fee item (" + feeList[feeNum].getFeeCod() + "): " + editResult.getErrorMessage());
					break
				}
			}
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				logDebug("Invoiced fee " + feeList[feeNum].getFeeCod() + " found, not removed");
			}
		}
	} else {
		logDebug("**ERROR: getting fee items (" + feeList[feeNum].getFeeCod() + "): " + getFeeResult.getErrorMessage())
	}

} 
	function removeASITable(tableName) // optional capId
  	{
	//  tableName is the name of the ASI table
	//  tableValues is an associative array of values.  All elements MUST be strings.
  	var itemCap = capId
	if (arguments.length > 1)
		itemCap = arguments[1]; // use cap ID specified in args

	var tssmResult = aa.appSpecificTableScript.removeAppSpecificTableInfos(tableName,itemCap,currentUserID)

	if (!tssmResult.getSuccess())
		{ aa.print("**WARNING: error removing ASI table " + tableName + " " + tssmResult.getErrorMessage()) ; return false }
        else
	logDebug("Successfully removed all rows from ASI Table: " + tableName);

	}

 
//@ts-check

function removeCapCondition(cType, cDesc) {
	var capCondResult;
	var ccs;
	var condAppliedOnly= false;
	var condRemoved =false;
	
	if (typeof cType !== 'string') {
		logDebug("removeCapCondition(): The condition type parameter is the wrong data type.");
		return false;
	}

	if (typeof cDesc !== 'string') {
		logDebug("removeCapCondition(): The condition name or description parameter is the wrong data type.");
		return false;
	}

	//if we get this far, the capId isn't null and is the right type of class
	var itemCap = capId;

	//if the arguments are more than the required two parameters, use the first argument as the capId
	if (arguments.length > 2) {
		logDebug("removeCapCondition(): Using passed in capId object: " + arguments[2]);
		itemCap = arguments[2];
	}

	//test for undefined and null on capId object
	if (typeof itemCap === 'undefined' || itemCap == null) {
		logDebug("removeCapCondition(): capId environment variable is undefined or null.");
		return false;
	}

	//test that the capId object is the right class
	if (itemCap.class != 'class com.accela.aa.aamain.cap.CapIDModel') {
		logDebug("removeCapCondition(): capId object is " + itemCap.class + " and it needs to be class com.accela.aa.aamain.cap.CapIDModel.");
		return false;
	}
	
	if (arguments.length > 3) {
		if(typeof arguments[3] == 'boolean')
			{
			condAppliedOnly = arguments[3]; 
			logDebug("removeCapCondition(): check condition applied status: " + condAppliedOnly);
			}
	}

	//get the conditions for the capId object. Throw an error and log it if there is a problem.
	try {
		capCondResult = aa.capCondition.getCapConditions(itemCap, cType);
	} catch (err) {
		logDebug("removeCapCondition(): **ERROR** Unable to get cap conditions: " + err.message);
	}

	//if the transaction was not successful, throw an error and log it.
	if (!capCondResult.getSuccess()) {
		logDebug("removeCapCondition(): **ERROR** error getting cap conditions : " + capCondResult.getErrorMessage());
		return false;
	}


	//if there is output, set the variable and continue. Otherwise, log error and return.
	if (!capCondResult.getOutput()) {
		logDebug("removeCapCondition(): **ERROR** no output from retrieving the cap conditions.");
		return false;
	}

	ccs = capCondResult.getOutput();
	logDebug("removeCapCondition(): number of matching conditions on the capId object: " + ccs.length);

	for (var pc1 in ccs) {
		if (ccs[pc1].getConditionDescription().equals(cDesc) && (!condAppliedOnly || ccs[pc1].getConditionStatusType() == "Applied" )) 
		{
			var rmCapCondResult;
			try {
				ccs[pc1].setConditionStatusType("Not Applied"); 
				ccs[pc1].setConditionStatus("Not Applied"); 
				var updateCondStatus = aa.capCondition.editCapCondition(ccs[pc1]); 
				if(updateCondStatus.getSuccess())
					{
					logDebug("removeCapCondition(): Successfully updated condition status to 'Not Applied' from CAP: " + itemCap + "  (" + cType + ") " + cDesc);
					rmCapCondResult = aa.capCondition.deleteCapCondition(itemCap, ccs[pc1].getConditionNumber());
					if (rmCapCondResult.getSuccess()) {
						logDebug("removeCapCondition(): Successfully removed condition from CAP: " + itemCap + "  (" + cType + ") " + cDesc);
						condRemoved=true;
					} else {
						logDebug("removeCapCondition(): **ERROR** unable to remove condition from CAP: " + itemCap + "  (" + cType + "): " + rmCapCondResult.getErrorMessage());
						condRemoved=false;
						   }
					}
				else
					{
					logDebug("removeCapCondition(): **ERROR** unable to update condition status to 'Not Applied' from CAP: " + itemCap + "  (" + cType + "): " + updateCondStatus.getErrorMessage());
					}	
				
			} catch (err) {
				logDebug("removeCapCondition(): **ERROR** unable to delete the condition from the cap: " + err.message);
			}
			
		}
		else
			{
			logDebug("removeCapCondition(): Condition cap " + itemCap + "  (" + cType + ") " + ccs[pc1].getConditionDescription() +" is not match with the condition description or status");
			}
	}
	return condRemoved;
}


 
function removeFee(fcode, fperiod) // Removes all fee items for a fee code and period
{
	getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();

				var editResult = aa.finance.removeFeeItem(capId, feeSeq);
				if (editResult.getSuccess()) {
					logDebug("Removed existing Fee Item: " + fcode);
				} else {
					logDebug("**ERROR: removing fee item (" + fcode + "): " + editResult.getErrorMessage());
					break
				}
			}
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				logDebug("Invoiced fee " + fcode + " found, not removed");
			}
		}
	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}

} 
function removeParcelCondition(parcelNum,cType,cDesc)
//if parcelNum is null, condition is added to all parcels on CAP
	{
	if (!parcelNum)
		{
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess())
			{
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels)
				{
				parcelNum = Parcels[zz].getParcelNumber()
				logDebug("Adding Condition to parcel #" + zz + " = " + parcelNum);
				var pcResult = aa.parcelCondition.getParcelConditions(parcelNum);
				if (!pcResult.getSuccess())
					{ logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage()) ; return false }
				var pcs = pcResult.getOutput();
				for (pc1 in pcs)
					{
					if (pcs[pc1].getConditionType().equals(cType) && pcs[pc1].getConditionDescription().equals(cDesc))
						{
						var rmParcelCondResult = aa.parcelCondition.removeParcelCondition(pcs[pc1].getConditionNumber(),parcelNum); 
						if (rmParcelCondResult.getSuccess())
							logDebug("Successfully removed condition to Parcel " + parcelNum + "  (" + cType + ") " + cDesc);
						}
					else
						logDebug( "**ERROR: removing condition to Parcel " + parcelNum + "  (" + cType + "): " + rmParcelCondResult.getErrorMessage());
					}
				}
			}
		}
	else
		{
		var pcResult = aa.parcelCondition.getParcelConditions(parcelNum);
		if (!pcResult.getSuccess())
			{ logDebug("**WARNING: error getting parcel conditions : " + pcResult.getErrorMessage()) ; return false }
		var pcs = pcResult.getOutput();
		for (pc1 in pcs)
			{
			if (pcs[pc1].getConditionType().equals(cType) && pcs[pc1].getConditionDescription().equals(cDesc))
				{
				var rmParcelCondResult = aa.parcelCondition.removeParcelCondition(pcs[pc1].getConditionNumber(),parcelNum); 
			        if (rmParcelCondResult.getSuccess())
					logDebug("Successfully removed condition to Parcel " + parcelNum + "  (" + cType + ") " + cDesc);
				}
			else
				logDebug( "**ERROR: removing condition to Parcel " + parcelNum + "  (" + cType + "): " + rmParcelCondResult.getErrorMessage());
			}
		}
	}

 
function removeRefContactAddressFromRecordContact(itemCap,cSeqNumber,rConAddrModel) {

	if (itemCap && cSeqNumber && rConAddrModel) {
		var xRefContactAddress = aa.address.createXRefContactAddressModel().getOutput();
		xRefContactAddress.setCapID(itemCap);
		xRefContactAddress.setAddressID(rConAddrModel.getAddressID());
		// Set the daily contact id to xRefContactAddress model
		xRefContactAddress.setEntityID(aa.util.parseLong(cSeqNumber));
		xRefContactAddress.setEntityType(rConAddrModel.getEntityType());
		// Create
		var xrefResult = aa.address.deleteXRefContactAddress(xRefContactAddress.getXRefContactAddressModel());

		if (xrefResult.getSuccess) {
			logDebug("Successfully removed reference contact address to cap contact: " + cSeqNumber);
			return true;
		} else {
			logDebug("Failed to remove reference contact address to cap: " + xrefResult.getErrorMessage());
			return false;
		}

	} else {
		logDebug("Could not remove reference contact address no address model, capId or cap contact sequence number");
		return false;		
	}

} 
function removeTask(targetCapId, removeTaskName) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	//
	// Get the target Task
	//
	var workflowResult = aa.workflow.getTaskItems(targetCapId, removeTaskName, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**WARNING: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	var tTask = null;

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(removeTaskName.toUpperCase()) && (!useProcess || fTask.getProcessCode().toUpperCase().equals(processName.toUpperCase()))) {
			tTask = wfObj[i];
		}
	}

	if (!tTask) {
		logDebug("**WARNING: Task to remove not found: " + removeTaskName);
		return false;
	}

	var result = aa.workflow.removeTask(tTask)

		if (!result.getSuccess()) {
			logDebug("**WARNING: error removing task " + result.getErrorMessage());
			return false;
		} else {
			logDebug("Removed task " + tTask.getTaskDescription());
		}

}
 
function replaceMessageTokens(m)
	{
	//  tokens in pipes will attempt to interpret as script variables
	//  tokens in curly braces will attempt to replace from AInfo (ASI, etc)
	//
	//  e.g.   |capId|  or |wfTask|  or |wfStatus|
	//
	//  e.g.   {Expiration Date}  or  {Number of Electrical Outlets}
	//
	//  e.g.   m = "Your recent license application (|capIdString|) has successfully passed |wfTask| with a status of |wfStatus|"

	while (m.indexOf("|"))
	  {
	  var s = m.indexOf("|")
	  var e = m.indexOf("|",s+1)
	  if (e <= 0) break; // unmatched
	  var r = m.substring(s+1,e)

	  var evalstring = "typeof(" + r + ") != \"undefined\" ? " + r + " : \"undefined\""
	  var v = eval(evalstring)
	  var pattern = new RegExp("\\|" + r + "\\|","g")
	  m = String(m).replace(pattern,v)
	  }

	while (m.indexOf("{"))
	  {
	  var s = m.indexOf("{")
	  var e = m.indexOf("}",s+1)
	  if (e <= 0) break; // unmatched
	  var r = m.substring(s+1,e)

	  var evalstring = "AInfo[\"" + r + "\"]"
	  var v = eval(evalstring)
	  var pattern = new RegExp("\\{" + r + "\\}","g")
	  m = String(m).replace(pattern,v)

	  }

	 return m
	 }
 


function replaceNode(fString,fName,fContents)
	{
	 var fValue = "";
	var startTag = "<"+fName+">";
	 var endTag = "</"+fName+">";

		 startPos = fString.indexOf(startTag) + startTag.length;
		 endPos = fString.indexOf(endTag);
		 // make sure startPos and endPos are valid before using them
		 if (startPos > 0 && startPos <= endPos)
		 		{
				  fValue = fString.substring(0,startPos) + fContents + fString.substring(endPos);
 					return unescape(fValue);
			}

	}

 
function resultInspection(inspType, inspStatus, resultDate, resultComment) //optional capId
{
	var itemCap = capId
		if (arguments.length > 4)
			itemCap = arguments[4]; // use cap ID specified in args

		var foundID;
	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList)
			if (String(inspType).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
				foundID = inspList[xx].getIdNumber();
	}

	if (foundID) {
		resultResult = aa.inspection.resultInspection(itemCap, foundID, inspStatus, resultDate, resultComment, currentUserID)

			if (resultResult.getSuccess()) {
				logDebug("Successfully resulted inspection: " + inspType + " to Status: " + inspStatus)
			} else {
				logDebug("**WARNING could not result inspection : " + inspType + ", " + resultResult.getErrorMessage());
			}
	} else {
		logDebug("Could not result inspection : " + inspType + ", not scheduled");
	}

}
 
/**
 * results workflow task and sets the status and performs next step based on configured status
 * @param wfstr
 * @param wfstat
 * @param wfcomment
 * @param wfnote
 * @returns {Boolean}
 */
function resultWorkflowTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var statObj = aa.workflow.getTaskStatus(fTask, wfstat);
			var dispo = "U";
			if (statObj.getSuccess()) {
				var status = statObj.getOutput();
				dispo = status.getResultAction();
			} else {
				logDebug("Could not get status action resulting to no change")
			}

			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);
			else
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);

			logMessage("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
		}
	}
} 
function runEvent(eventName, controlString) {
	try {
		var savePrefix = prefix; // store value of global variable

		if (controlString) {
			if (doStdChoices) {
				doStandardChoiceActions(controlString, true, 0);
			} else {
				logDebug("runEvent:  Can't execute standard choices for control string " + controlString + " because doStdChoices is false");
			}
		}

		prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", eventName);
		if (prefix) {
			if (doScripts) {
				doScriptActions();
			} else {
				logDebug("runEvent:  Can't execute scripts for event " + eventName + " because doScripts is false");
			}
		} else {
			logDebug("runEvent:  Can't execute scripts for event " + eventName + " because prefix is not defined in std Choice EMSE_VARIABLE_BRANCH_PREFIX");
		}

		prefix = savePrefix; // set it back

	} catch (err) {
		handleError(err, s);
	}
}
 
function runReport4Email(itemCap,reportName,conObj,rParams,eParams,emailTemplate,module,mailFrom) {
	//If email address available for contact type then email the report, otherwise return false;

	var reportSent = false;

	if (conObj) {
		if (!matches(conObj.people.getEmail(),null,undefined,"")) {
			//Send the report via email
			var rFile;
			rFile = generateReport(itemCap,reportName,module,rParams);
	
			if (rFile) {
				var rFiles = new Array();
				rFiles.push(rFile);
				sendNotification(mailFrom,conObj.people.getEmail(),"",emailTemplate,eParams,rFiles,itemCap);
				return true;
			}
		} else {
			reportSent = false;
		}
	} else {
		reportSent = false;
	}

	if (!reportSent) {
		return false;
	}
}
 
function runReport4EmailOrPrint(itemCap,reportName,conObj,rParams,eParams,emailTemplate,module) {
	//If email address available for contact type then email the report, otherwise pop up the report on the screen

	var popUpReport = false;

	if (conObj) {
		if (!matches(conObj.people.getEmail(),null,undefined,"")) {
			//Send the report via email
			var rFile;
			rFile = generateReport(itemCap,reportName,module,rParams);
	
			if (rFile) {
				var rFiles = new Array();
				rFiles.push(rFile);
				sendNotification(sysFromEmail,conObj.people.getEmail(),"",emailTemplate,eParams,rFiles);
				comment("Email with " + reportName + " was sent to " + conObj.people.getEmail());
				popUpReport = true;
			}
		} else {
			popUpReport = true;
		}
	} else {
		popUpReport = true;
	}

	if (popUpReport) {
		var rOutput = generateReport4Workflow(itemCap,reportName,module,rParams);
		showMessage = true;
		comment(rOutput);
	}
} 
/**
 * Runs a report with any specified parameters and attaches it to the record
 *
 * @example
 *		runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");
 *		runReportAttach(capId,"ReportName",paramHashtable);
 * @param capId
 *			itemCapId - capId object 
 * @param {report parameter pairs} or {hashtable}
 *			optional parameters are report parameter pairs or a parameters hashtable
 * @returns {boolean}
 *			if the report was generated and attached return true
 *
 */
function runReportAttach(itemCapId,aaReportName)
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
		// for example: runReportAttach(capId,"ReportName","altid",capId.getCustomID(),"months","12");
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
/**
 * Schedule Inspection
 * @param itemCap {capIDModel}
 * @param iType {string}
 * @param DaysAhead {number}
 * @param [inspTime] {string}
 * @param [inspComm] {string}
 */
function scheduleInspect(itemCap,iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
	{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3) 
		if (arguments[2] != null)
		{
		var inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 4)
	    if (arguments[3] != null)
		    inspTime = arguments[3];
	
	if (arguments.length == 5)
	    if (arguments[4] != null)
	        inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(itemCap, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
	
	if (schedRes.getSuccess())
		logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
	else
		logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
	}
 
function scheduleInspectDate(iType,DateToSched) // optional inspector ID.
// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110)
// DQ - Added Optional 5th parameter inspComm
	{
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3)
		if (arguments[2] != null)
			{
			var inspRes = aa.person.getUser(arguments[2]);
			if (inspRes.getSuccess())
				inspectorObj = inspRes.getOutput();
			}

        if (arguments.length >= 4)
            if(arguments[3] != null)
		        inspTime = arguments[3];

		if (arguments.length >= 5)
		    if(arguments[4] != null)
		        inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(DateToSched), inspTime, iType, inspComm)

	if (schedRes.getSuccess())
		logDebug("Successfully scheduled inspection : " + iType + " for " + DateToSched);
	else
		logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
	}

 
function scheduleInspection(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
	{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3) 
		if (arguments[2] != null)
		{
		var inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 4)
	    if (arguments[3] != null)
		    inspTime = arguments[3];
	
	if (arguments.length == 5)
	    if (arguments[4] != null)
	        inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
	
	if (schedRes.getSuccess())
		logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
	else
		logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
	}

 

function searchProject(pProjType,pSearchType) 
{
	// Searches Related Caps
	// pProjType = Application type marking highest point to search.  Ex. Building/Project/NA/NA
	// pSearchType = Application type to search for. Ex. Building/Permit/NA/NA 
	// Returns CapID array of all unique matching SearchTypes
	
    var i = 1;
	var typeArray;
	var duplicate = false;
	var childArray = new Array();
	var tempArray = new Array();
	var temp2Array = new Array();
	var searchArray = new Array();
	var childrenFound = false;
	var isMatch;
        while (true)
        {
	 if (!(aa.cap.getProjectParents(capId,i).getSuccess()))
             break;
         i += 1;
        }
        i -= 1;

	getCapResult = aa.cap.getProjectParents(capId,i);
        myArray = new Array();
	myOutArray = new Array();
	
	if(pProjType != null)
	{
		var typeArray = pProjType.split("/");
		if (typeArray.length != 4)
			logDebug("**ERROR in childGetByCapType function parameter.  The following cap type parameter is incorrectly formatted: " + pCapType);
	}

	if (getCapResult.getSuccess())
	{
		parentArray = getCapResult.getOutput();
		if (parentArray.length)
		{
			for(x in parentArray)
				childTypeArray = parentArray[x].getCapType().toString().split("/");
				isMatch = true;
				for (yy in childTypeArray) //looking for matching cap type
				{
				if (!typeArray[yy].equals(childTypeArray[yy]) && !typeArray[yy].equals("*"))
					{
						isMatch = false;
						break;	 
					}
				}
				if(isMatch)
					myArray.push(parentArray[x].getCapID());
		}
	}

	if (!myArray.length)
		return childArray;

	searchArray = myArray;
	var temp = ""


	if(pSearchType != null)
	{
		typeArray = pSearchType.split("/");
		if (typeArray.length != 4)
			logDebug("**ERROR in childGetByCapType function parameter.  The following cap type parameter is incorrectly formatted: " + pSearchType);
	}


	while (true)
		{
			for(x in searchArray)
				{
					tempArray = getChildren("*/*/*/*",searchArray[x]);
					if (tempArray == null)
						continue;
					for(y in tempArray)
						{
							duplicate = false;
							for(z in childArray)
							{
								if ( childArray[z].getCustomID().equals(tempArray[y].getCustomID()) )
									{duplicate = true; break;}
							}			
							if (!duplicate)
							{
								temp2Array.push(tempArray[y]);
								if(!capId.getCustomID().equals(tempArray[y].getCustomID()))
								{
									var chkTypeArray = aa.cap.getCap(tempArray[y]).getOutput().getCapType().toString().split("/");
									isMatch = true;
									for (p in chkTypeArray) //looking for matching cap type
									{
										if (typeArray[p] != chkTypeArray[p] && typeArray[p] != "*")
										{
											isMatch = false;
											break;
										}
									}
									if(isMatch)
										{childArray.push(tempArray[y]);}
								}		 
							}
						}

				}

			if(temp2Array.length)
				searchArray = temp2Array;
			else
				break;
			temp2Array = new Array();
		}
	return childArray;
}

 
 function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)

{

	var itemCap = capId;

	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args



	var id1 = itemCap.ID1;

 	var id2 = itemCap.ID2;

 	var id3 = itemCap.ID3;



	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);





	var result = null;

	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

	if(result.getSuccess())

	{

		logDebug("Sent email successfully!");

		return true;

	}

	else

	{

		logDebug("Failed to send mail. - " + result.getErrorType());

		return false;

	}

}
 
/**
 * Requires parity between CONTACT TYPE and CONTACT RELATIONSHIP standard choices
 */
function setContactRelToContactType() {
	try {

		iCont = null;
		contactArray = new Array();
		contactArray = getContactArray();
		if (contactArray.length > 0) {
			for (iCont in contactArray) {
				tContact = contactArray[iCont];
				aa.print("ContactName: " + tContact["firstName"] + " " + tContact["lastName"] + " " + tContact["contactType"]);
				contactSetRelation(tContact["contactSeqNumber"], tContact["contactType"]);
			}
		}
	} catch (err) {
		logDebug("A JavaScript Error occured in setContactRelToContactType function: " + err.message + " In Line " + err.lineNumber);
	}
}
 
function setContactsSyncFlag(syncFlagValue) {
  var itemCapId = capId;

  if (arguments.length > 1) {
    itemCapId = arguments[1];
  }

  var c = aa.people.getCapContactByCapID(itemCapId).getOutput();
  if (!c) logDebug("No contact found.");
  for (var i in c) {
    var con = c[i];
    var cm = con.getCapContactModel();
    var contactType = con.getPeople().getContactType();
    if (cm) {
      cm.setSyncFlag(syncFlagValue);
      var r = aa.people.updateCapContactSyncFlag(cm);
      if (r.getSuccess()) logDebug("Sync flag for contact " + contactType + " was updated.");
      else logDebug("**WARNING: Sync flag for contact " + contactType + " was not updated. " + r.getErrorMessage());
    }
  }
}
 
function setContactTypeFlagByType(itemCap) {
	
	var contactsA = getContactObjs(itemCap);

	for (var x in contactsA) {
		thisContact = contactsA[x];
		
		var typeFlag = lookup("CONTACT TYPE FLAG",thisContact.type);

		if (typeFlag == undefined)
			continue; //skip if not setup in the lookup

		thisContact.people.setContactTypeFlag(typeFlag);

		thisContact.save();
	}	
}

 
function setIVR(ivrnum)
	{
	/* Removed by Peter Peng, 4/9/2012
	capModel = cap.getCapModel();
	capIDModel = capModel.getCapID();
	capIDModel.setTrackingID(12345678);
	capModel.setCapID(capIDModel);
	aa.cap.editCapByPK(capModel);
	*/

	// new a CapScriptModel
	var scriptModel = aa.cap.newCapScriptModel().getOutput();

	// get a new CapModel
	var capModel = scriptModel.getCapModel();
	var capIDModel = capModel.getCapID();

	capIDModel.setServiceProviderCode(scriptModel.getServiceProviderCode());
	capIDModel.setID1(aa.env.getValue("PermitId1"));
	capIDModel.setID2(aa.env.getValue("PermitId2"));
	capIDModel.setID3(aa.env.getValue("PermitId3"));

	capModel.setTrackingNbr(ivrnum);
	capModel.setCapID(capIDModel);

	// update tracking number
	aa.cap.editCapByPK(capModel);
	logDebug("IVR Tracking Number updated to " + ivrnum);
	}


 
 function setLicExpirationDate(itemCap) {

    //itemCap - license capId

    //the following are optional parameters

    //calcDateFrom - MM/DD/YYYY - the from date to use in the date calculation

    //dateOverride - MM/DD/YYYY - override the calculation, this date will be used

    //renewalStatus - if other than active override the status  





    var licNum = itemCap.getCustomID();



    if (arguments.length == 1) {

        calcDateFrom = null;

        dateOverride = null;

        renewalStatus = null;

    }



    if (arguments.length == 2) {

        calcDateFrom = arguments[1];

        dateOverride = null;

        renewalStatus = null;

    }



    if (arguments.length == 3) {

        calcDateFrom = arguments[1];

        dateOverride = arguments[2];

        renewalStatus = null;

    }



    if (arguments.length == 4) {

        calcDateFrom = arguments[1];

        dateOverride = arguments[2];

        renewalStatus = arguments[3];

    }



    var tmpNewDate = "";

    

    b1ExpResult = aa.expiration.getLicensesByCapID(itemCap);

    

    if (b1ExpResult.getSuccess()) {



        this.b1Exp = b1ExpResult.getOutput();

        //Get expiration details

        var expUnit = this.b1Exp.getExpUnit();

        var expInterval = this.b1Exp.getExpInterval();



        if(expUnit == null) {

            logDebug("Could not set the expiration date, no expiration unit defined for expiration code: " + this.b1Exp.getExpCode());

            return false;

        }



        if(expUnit == "Days") {

            tmpNewDate = dateAdd(calcDateFrom, expInterval);

        }



        if(expUnit == "Months") {

            tmpNewDate = dateAddMonths(calcDateFrom, expInterval);

        }



        if(expUnit == "Years") {

            tmpNewDate = dateAddMonths(calcDateFrom, expInterval * 12);

        }

    }



    thisLic = new licenseObject(licNum,itemCap); 



    if(dateOverride == null) {

        thisLic.setExpiration(dateAdd(tmpNewDate,0));

    } else {

        thisLic.setExpiration(dateAdd(dateOverride,0));

    }



    if(renewalStatus != null) {

        thisLic.setStatus(renewalStatus); 

    } else {

        thisLic.setStatus("Active"); 

    }



    logDebug("Successfully set the expiration date and status");



    return true;



}
 
function setTask(wfstr, isOpen, isComplete) // optional process name isOpen, isComplete take 'Y' or 'N'
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 4) {
		processName = arguments[3]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			var completeFlag = fTask.getCompleteFlag();

			if (useProcess)
				aa.workflow.adjustTask(capId, stepnumber, processID, isOpen, isComplete, null, null);
			else
				aa.workflow.adjustTask(capId, stepnumber, isOpen, isComplete, null, null);

				logDebug("set Workflow Task: " + wfstr);
		}
	}
}
 
String.prototype.trim = String.prototype.trim || function() {
        return this.replace(/^\s+|\s+$/,"");
}

String.prototype.left = function(n) {
        return this.substr(0,n);
};

String.prototype.right = function(n) {
        return this.substr((this.length-n),this.length);
}; 
function stripNN(fullStr) {
    var allowed = "0123456789.";
    var stripped = "";
    for (i = 0; i < fullStr.length(); i++)
        if (allowed.indexOf(String.fromCharCode(fullStr.charAt(i))) >= 0)
        stripped += String.fromCharCode(fullStr.charAt(i))
    return stripped;
}
 
function taskCloseAllExcept(pStatus,pComment) 
	{
	// Closes all tasks in CAP with specified status and comment
	// Optional task names to exclude
	// 06SSP-00152
	//
	var taskArray = new Array();
	var closeAll = false;
	if (arguments.length > 2) //Check for task names to exclude
		{
		for (var i=2; i<arguments.length; i++)
			taskArray.push(arguments[i]);
		}
	else
		closeAll = true;

	var workflowResult = aa.workflow.getTasks(capId);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  else
  	{ 
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); 
		return false; 
		}
	
	var fTask;
	var stepnumber;
	var processID;
	var dispositionDate = aa.date.getCurrentDate();
	var wfnote = " ";
	var wftask;
	
	for (i in wfObj)
		{
   	fTask = wfObj[i];
		wftask = fTask.getTaskDescription();
		stepnumber = fTask.getStepNumber();
		//processID = fTask.getProcessID();
		if (closeAll)
			{
			aa.workflow.handleDisposition(capId,stepnumber,pStatus,dispositionDate,wfnote,pComment,systemUserObj,"Y");
			logMessage("Closing Workflow Task " + wftask + " with status " + pStatus);
			logDebug("Closing Workflow Task " + wftask + " with status " + pStatus);
			}
		else
			{
			if (!exists(wftask,taskArray))
				{
				aa.workflow.handleDisposition(capId,stepnumber,pStatus,dispositionDate,wfnote,pComment,systemUserObj,"Y");
				logMessage("Closing Workflow Task " + wftask + " with status " + pStatus);
				logDebug("Closing Workflow Task " + wftask + " with status " + pStatus);
				}
			}
		}
	}

 
function taskStatus(wfstr) // optional process name and capID
{
	var useProcess = false;
	var processName = "";
	var itemCap = capId;
	if (arguments.length >= 2) {
		processName = arguments[1]; // subprocess
		if (processName)
			useProcess = true;
	}

	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args


	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			return fTask.getDisposition()
	}
} 
/*
DQ 09/03/2009 - Added Check to ensure Task status date is not null prior to getting status date
Function will return false on fail
*/
function taskStatusDate(wfstr) // optional process name, capId
{
	var itemCap = capId;
	if (arguments.length == 3)
		itemCap = arguments[2]; // use cap ID specified in args

	var useProcess = false;
	var processName = "";
	if (arguments.length > 1 && arguments[1] != null) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + wfObj.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getStatusDate() != null)
				return "" + (fTask.getStatusDate().getMonth() + 1) + "/" + fTask.getStatusDate().getDate() + "/" + (parseInt(fTask.getStatusDate().getYear()) + 1900);
			else {
				logMessage("**ERROR: NULL workflow task " + fTask.getTaskDescription() + " status date. ");
				return false;
			}
	}
}
 

function token(tstr)
	{
	if (!disableTokens)
		{
		re = new RegExp("\\{","g") ; tstr = String(tstr).replace(re,"AInfo[\"");
		re = new RegExp("\\}","g") ; tstr = String(tstr).replace(re,"\"]");
		}
	return String(tstr);
  	}

 

function transferFeesAndPayments(sourceCapId, targetCapId) {
	//
	// Step 1: Unapply payments from the Source
	//
	var piresult = aa.finance.getPaymentByCapID(capId, null).getOutput()

		var feeSeqArray = new Array();
	var invoiceNbrArray = new Array();
	var feeAllocationArray = new Array();

	for (ik in piresult) {
		var thisPay = piresult[ik];
		var pfResult = aa.finance.getPaymentFeeItems(capId, null);
		if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			for (ij in pfObj)
				if (pfObj[ij].getPaymentSeqNbr() == thisPay.getPaymentSeqNbr()) {
					feeSeqArray.push(pfObj[ij].getFeeSeqNbr());
					invoiceNbrArray.push(pfObj[ij].getInvoiceNbr());
					feeAllocationArray.push(pfObj[ij].getFeeAllocation());
				}
		}

		if (feeSeqArray.length > 0) {
			z = aa.finance.applyRefund(capId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "FeeStat", "InvStat", "123");
			if (z.getSuccess()) {
				logDebug("Refund applied");
			} else {
				logDebug("Error applying refund " + z.getErrorMessage());
			}
		}
	}

	//
	// Step 2: add the fees to the target and void from the source
	//

	feeA = loadFees();

	for (var x in feeA) {
		thisFee = feeA[x];
		logDebug("status is " + thisFee.status);
		if (thisFee.status == "INVOICED") {
			addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "Y", targetCapId);
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

	//
	// Step 3: transfer the funds from Source to Target
	//

	var unapplied = paymentGetNotAppliedTot();

	var xferResult = aa.finance.makeFundTransfer(capId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, unapplied, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
	if (xferResult.getSuccess())
		logDebug("Successfully did fund transfer to : " + targetCapId.getCustomID());
	else
		logDebug("**ERROR: doing fund transfer to (" + targetCapId.getCustomID() + "): " + xferResult.getErrorMessage());

	//
	// Step 4: On the target, loop through payments then invoices to auto-apply
	//

	var piresult = aa.finance.getPaymentByCapID(targetCapId, null).getOutput()

		for (ik in piresult) {
			var feeSeqArray = new Array();
			var invoiceNbrArray = new Array();
			var feeAllocationArray = new Array();

			var thisPay = piresult[ik];
			var applyAmt = 0;
			var unallocatedAmt = thisPay.getAmountNotAllocated()

				if (unallocatedAmt > 0) {

					var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

						for (var invCount in invArray) {
							var thisInvoice = invArray[invCount];
							var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
							if (balDue > 0) {
								feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

								for (targetFeeNum in feeT) {
									var thisTFee = feeT[targetFeeNum];

									if (thisTFee.getFee() > unallocatedAmt)
										applyAmt = unallocatedAmt;
									else
										applyAmt = thisTFee.getFee(); // use balance here?

									unallocatedAmt = unallocatedAmt - applyAmt;

									feeSeqArray.push(thisTFee.getFeeSeqNbr());
									invoiceNbrArray.push(thisInvoice.getInvNbr());
									feeAllocationArray.push(applyAmt);
								}
							}
						}

						applyResult = aa.finance.applyPayment(targetCapId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123");

					if (applyResult.getSuccess())
						logDebug("Successfully applied payment");
					else
						logDebug("**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());

				}
		}
}
 
function transferFunds(parentAppNum,dollarAmount) 
// does fund transfer from current app to parentAppNum, but only if current app has enough non-applied funds
// needs function paymentGetNotAppliedTot()
	{
	//validate dollarAmount is number 
	var checkNum = parseFloat(dollarAmount);
	if (isNaN(checkNum))
		{
		logDebug("dollarAmount parameter is not a number, no funds will be transferred");
		return false;
		}

	//check that enough non-applied funds are available
	var fundsAvail = paymentGetNotAppliedTot();
	if (fundsAvail < parseFloat(dollarAmount))
		{
		logDebug("Insufficient funds $"+fundsAvail.toString()+ " available. Fund transfer of $"+dollarAmount.toString()+" not done.");
		logMessage("Insufficient funds available. No funds transferred.");
		return false;
		}

	//enough funds - proceed with transfer
	var getCapResult = aa.cap.getCapID(parentAppNum);
	if (getCapResult.getSuccess())
		{
		var parentId = getCapResult.getOutput();
		
		var xferResult = aa.finance.makeFundTransfer(capId, parentId, currentUserID, "", "", sysDate, sysDate, "", sysDate, dollarAmount, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");

		
		if (xferResult.getSuccess())
			logDebug("Successfully did fund transfer to : " + parentAppNum);
		else
			logDebug( "**ERROR: doing fund transfer to (" + parentAppNum + "): " + xferResult.getErrorMessage());
		}
	else
		{ 
		logDebug( "**ERROR: getting parent cap id (" + parentAppNum + "): " + getCapResult.getErrorMessage()) 
		}
	}

 
function transferReceiptAndApply(receiptCapId,targetCapId)
{
    var amtResult = parseFloat(aa.cashier.getSumNotAllocated(receiptCapId).getOutput());

    var bDueResult = aa.cashier.getTotalFeeAmount(targetCapId);
    var balanceDue = 0;

    if (bDueResult.getSuccess()) {
        balanceDue = bDueResult.getOutput();
    }

    var transferAmt = balanceDue;

    if (amtResult <= 0) {
        logDebug("insufficient funds to do transfer from receipt record");
        return false;
    }

    if (amtResult < balanceDue) {
        transferAmt = amtResult; 
    }
  


  var xferResult = aa.finance.makeFundTransfer(receiptCapId,targetCapId,currentUserID,"","",sysDate,sysDate,"",sysDate,transferAmt,"NA","Fund Transfer","NA","R",null,"","NA","");
  if (xferResult.getSuccess())
       logDebug("Successfully transferred $" +transferAmt + " from " + receiptCapId + " to " + targetCapId);
  else
       logDebug("Error transferring funds " + xferResult.getErrorMessage());
 

    var piresult = aa.finance.getPaymentByCapID(targetCapId,null).getOutput()

    for (ik in piresult)
        {
        var feeSeqArray = new Array();
        var invoiceNbrArray = new Array();
        var feeAllocationArray = new Array();


        var thisPay = piresult[ik];
        var applyAmt = 0;
        var unallocatedAmt = thisPay.getAmountNotAllocated()

        if (unallocatedAmt > 0)
            {

            var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

            for (var invCount in invArray)
                {
                var thisInvoice = invArray[invCount];
                var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
                if (balDue > 0)
                    {
                    feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

                    for (targetFeeNum in feeT)
                        {
                        var thisTFee = feeT[targetFeeNum];

                        if (thisTFee.getFee() > unallocatedAmt)
                            applyAmt = unallocatedAmt;
                        else
                            applyAmt = thisTFee.getFee()   // use balance here?

                        unallocatedAmt = unallocatedAmt - applyAmt;

                        feeSeqArray.push(thisTFee.getFeeSeqNbr());
                        invoiceNbrArray.push(thisInvoice.getInvNbr());
                        feeAllocationArray.push(applyAmt);
                        }
                    }
                }

                applyResult = aa.finance.applyPayment(targetCapId,thisPay,feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123")

                if (applyResult.getSuccess()) {
                    logDebug("Successfully applied payment");
                    return transferAmt;
                }
                    
                else {
                    logDebug( "**ERROR: applying payment to fee (" + thisTFee.getFeeDescription() + "): " + applyResult.getErrorMessage());
                    return false;
                }
                    

            }
    }

} 
function updateAppStatus(stat,cmt) // optional cap id
{
	var itemCap = capId;
	if (arguments.length == 3) 
		itemCap = arguments[2]; // use cap ID specified in args

	var updateStatusResult = aa.cap.updateAppStatus(itemCap, "APPLICATION", stat, sysDate, cmt, systemUserObj);
	if (updateStatusResult.getSuccess())
		logDebug("Updated application status to " + stat + " successfully.");
	else
		logDebug("**ERROR: application status update to " + stat + " was unsuccessful.  The reason is "  + updateStatusResult.getErrorType() + ":" + updateStatusResult.getErrorMessage());
}

 
 function updateEnfOfficer(enfName) // option CapId

    {

    var itemCap = capId

    if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args



    var cdScriptObjResult = aa.cap.getCapDetail(itemCap);

    if (!cdScriptObjResult.getSuccess())

        { logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }



    var cdScriptObj = cdScriptObjResult.getOutput();



    if (!cdScriptObj)

        { logDebug("**ERROR: No cap detail script object") ; return false; }



    cd = cdScriptObj.getCapDetailModel();



    cd.setEnforceOfficerName(enfName);



    cdWrite = aa.cap.editCapDetail(cd)



    if (cdWrite.getSuccess())

        { logDebug("updated enf officer name to " + enfName) }

    else

        { logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }

    }



 
function updateFee(fcode, fsched, fperiod, fqty, finvoice, pDuplicate, pFeeSeq) {
	// Updates an assessed fee with a new Qty.  If not found, adds it; else if invoiced fee found, adds another with adjusted qty.
	// optional param pDuplicate -if "N", won't add another if invoiced fee exists (SR5085)
	// Script will return fee sequence number if new fee is added otherwise it will return null (SR5112)
	// Optional param pSeqNumber, Will attempt to update the specified Fee Sequence Number or Add new (SR5112)
	// 12/22/2008 - DQ - Correct Invoice loop to accumulate instead of reset each iteration

	// If optional argument is blank, use default logic (i.e. allow duplicate fee if invoiced fee is found)
	if (pDuplicate == null || pDuplicate.length == 0)
		pDuplicate = "Y";
	else
		pDuplicate = pDuplicate.toUpperCase();

	var invFeeFound = false;
	var adjustedQty = fqty;
	var feeSeq = null;
	feeUpdated = false;

	if (pFeeSeq == null)
		getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, fperiod);
	else
		getFeeResult = aa.finance.getFeeItemByPK(capId, pFeeSeq);

	if (getFeeResult.getSuccess()) {
		if (pFeeSeq == null)
			var feeList = getFeeResult.getOutput();
		else {
			var feeList = new Array();
			feeList[0] = getFeeResult.getOutput();
		}
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				if (pDuplicate == "Y") {
					logDebug("Invoiced fee " + fcode + " found, subtracting invoiced amount from update qty.");
					adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
					invFeeFound = true;
				} else {
					invFeeFound = true;
					logDebug("Invoiced fee " + fcode + " found.  Not updating this fee. Not assessing new fee " + fcode);
				}
			}

			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
			}
		}

		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW") && !feeUpdated) // update this fee item
			{
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				var editResult = aa.finance.editFeeItemUnit(capId, adjustedQty + feeList[feeNum].getFeeUnit(), feeSeq);
				feeUpdated = true;
				if (editResult.getSuccess()) {
					logDebug("Updated Qty on Existing Fee Item: " + fcode + " to Qty: " + fqty);
					if (finvoice == "Y") {
						feeSeqList.push(feeSeq);
						paymentPeriodList.push(fperiod);
					}
				} else {
					logDebug("**ERROR: updating qty on fee item (" + fcode + "): " + editResult.getErrorMessage());
					break
				}
			}
	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}

	// Add fee if no fee has been updated OR invoiced fee already exists and duplicates are allowed
	if (!feeUpdated && adjustedQty != 0 && (!invFeeFound || invFeeFound && pDuplicate == "Y"))
		feeSeq = addFee(fcode, fsched, fperiod, adjustedQty, finvoice);
	else
		feeSeq = null;
	updateFeeItemInvoiceFlag(feeSeq, finvoice);
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
 
function updateGuidesheetASIField(inspId,gName,gItem,asiGroup,asiSubGroup, asiLabel,newValue) {
	//updates the guidesheet ID to nGuideSheetID if not currently populated
	//optional capId

	var itemCap = capId;
	//if (arguments > 7) itemCap = arguments[7];

	var r = aa.inspection.getInspections(itemCap);

	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (inspArray[i].getIdNumber() == inspId) {
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets();

				if (gs) {
					for(var i=0;i< gs.size();i++) {
						var guideSheetObj = gs.get(i);
						if (guideSheetObj && gName.toUpperCase() == guideSheetObj.getGuideType().toUpperCase()) {

							var guidesheetItem = guideSheetObj.getItems();
							for(var j=0;j< guidesheetItem.size();j++) {
								var item = guidesheetItem.get(j);
								//1. Filter Guide Sheet items by Guide sheet item name && ASI group code
								if(item && gItem == item.getGuideItemText() && asiGroup == item.getGuideItemASIGroupName()) {
									var ASISubGroups = item.getItemASISubgroupList();
									if(ASISubGroups) {
										//2. Filter ASI sub group by ASI Sub Group name
										for(var k=0;k< ASISubGroups.size();k++) {
											var ASISubGroup = ASISubGroups.get(k);
											if(ASISubGroup && ASISubGroup.getSubgroupCode() == asiSubGroup) {
												var ASIModels =  ASISubGroup.getAsiList();
												if(ASIModels) {
													//3. Filter ASI by ASI name
													for( var m = 0; m< ASIModels.size();m++) {
														var ASIModel = ASIModels.get(m);
														if(ASIModel && ASIModel.getAsiName() == asiLabel) {
															logDebug("Change ASI value from:"+ ASIModel.getAttributeValue() +" to "+newValue);
															//4. Reset ASI value
															ASIModel.setAttributeValue(newValue);		
														}
													}
												}
											}
										}
									}
								}
							}							

							//Update the guidesheet
							var updateResult = aa.guidesheet.updateGGuidesheet(guideSheetObj,guideSheetObj.getAuditID());
							if (updateResult.getSuccess()) {
								logDebug("Successfully updated " + gName + " on inspection " + inspId + ".");
								return true;
							} else {
								logDebug("Could not update guidesheet ID: " + updateResult.getErrorMessage());
								return false;
							}
						}
					}
				} else {
					// if there are guidesheets
					logDebug("No guidesheets for this inspection");
					return false;
				}
			}
		}
	} else {
		logDebug("No inspections on the record");
		return false;
	}
	logDebug("No updates to the guidesheet made");
	return false;
}  
function updateGuidesheetID(inspId,gName,nGuideSheetID) {
	//updates the guidesheet ID to nGuideSheetID if not currently populated
	//optional capId

	var itemCap = capId;
	if (arguments > 2) itemCap = arguments[2];

	var r = aa.inspection.getInspections(itemCap);

	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (inspArray[i].getIdNumber() == inspId) {
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets();

				if (gs) {
					gsArray = gs.toArray();
					for (var loopk in gsArray) {
						if (gName.toUpperCase() == gsArray[loopk].getGuideType().toUpperCase()) {
							gsArray[loopk].setIdentifier(nGuideSheetID);
							var updateResult = aa.guidesheet.updateGGuidesheet(gsArray[loopk],gsArray[loopk].getAuditID());
							if (updateResult.getSuccess()) {
								logDebug("Successfully updated " + gName + " on inspection " + inspId + " to and ID of " + nGuideSheetID);
								return true;
							} else {
								logDebug("Could not update guidesheet ID: " + updateResult.getErrorMessage());
								return false;
							}
						}
					}
				} else {
					// if there are guidesheets
					logDebug("No guidesheets for this inspection");
					return false;
				}
			}
		}
	} else {
		logDebug("No inspections on the record");
		return false;
	}
	logDebug("No updates to the guidesheet made");
	return false;
} 
function updatePlanReviewWorkflow(wfTask,status,wfComments,updateIndicator) {
	// updateIndicator determines if to update workflow or inspection
	// if a value of "W" workflow will be updated
	// if a value of "I" inspection will be updated
	// otherwise will return a false

	if (updateIndicator == "I") {
		var sysDateYYYYMMDD = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"YYYY-MM-DD");
		resultInspection(wfTask,status,sysDateYYYYMMDD,wfComments);
	} else if (updateIndicator == "W") {
		var action = "";

		action = lookup(docReviewStatusStdChoice,status);

		if (!matches(action,"",undefined)) {
			if (action == "Next") {
				closeTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "No Change") {
				updateTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "Loop") {
				loopTask(wfTask,status,wfComments,"");
				return true;
			} else if (action == "Branch") {
				branchTask(wfTask,status,wfComments,"");
				return true;
			} else {
				logDebug("Workflow not updated, action not defined");
				return false;
			}
		} else {
			logDebug("Workflow not updated, workflow task name not found");
			return false;
			
		}
	} else {

		logDebug("updateIndicator of " + updateIndicator + "is not a valid value only W or I are expected");
		return false;
	}
}
 
function updateRefParcelToCap() //Takes Optional CapId
{
	var vCapId = null;
	if (arguments.length > 0)
		vCapId = arguments[0];
	else
		vCapId = capId;
	
	var capPrclArr = aa.parcel.getParcelDailyByCapID(vCapId, null).getOutput();
	if (capPrclArr != null) {
		var pb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
		
		for (x in capPrclArr) {
			var prclObj = aa.parcel.getParceListForAdmin(capPrclArr[x].getParcelNumber(), null, null, null, null, null, null, null, null, null);
			if (prclObj.getSuccess()) {
				
				var prclArr = prclObj.getOutput();
				if (prclArr.length) {
					var prcl = prclArr[0].getParcelModel();
					var refParcelNumber = prcl.getParcelNumber();
					var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(vCapId, prcl);

					if (capPrclObj.getSuccess()) {
						
						var capPrcl = capPrclObj.getOutput();
						capPrcl.setL1ParcelNo(refParcelNumber);
						aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						pb.updateParcelDistrictWithRef(aa.getServiceProviderCode(), capPrcl, "ADMIN")
						logDebug("Updated Parcel " + capPrclArr[x].getParcelNumber() + " with Reference Data");
					} else
						logDebug("Failed to Wrap Parcel Model for " + capPrclArr[x].getParcelNumber());

				} else
					logDebug("No matching reference Parcels found for " + capPrclArr[x].getParcelNumber());
			} else
				logDebug("Failed to get reference Parcel for " + capPrclArr[x].getParcelNumber())
		}
	}
}  

function updateShortNotes(newSN) // option CapId
	{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess())
		{ logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage()) ; return false; }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj)
		{ logDebug("**ERROR: No cap detail script object") ; return false; }

	cd = cdScriptObj.getCapDetailModel();

	cd.setShortNotes(newSN);

	cdWrite = aa.cap.editCapDetail(cd)

	if (cdWrite.getSuccess())
		{ logDebug("updated short notes to " + newSN) }
	else
		{ logDebug("**ERROR writing capdetail : " + cdWrite.getErrorMessage()) ; return false ; }
	}

 
function updateTask(wfstr, wfstat, wfcomment, wfnote) // optional process name, cap id
{
	var useProcess = false;
	var processName = "";
	if (arguments.length > 4) {
		if (arguments[4] != "") {
			processName = arguments[4]; // subprocess
			useProcess = true;
		}
	}
	var itemCap = capId;
	if (arguments.length == 6)
		itemCap = arguments[5]; // use cap ID specified in args

	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				aa.workflow.handleDisposition(itemCap, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			else
				aa.workflow.handleDisposition(itemCap, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, "U");
			logMessage("Updating Workflow Task " + wfstr + " with status " + wfstat);
			logDebug("Updating Workflow Task " + wfstr + " with status " + wfstat);
		}
	}
}
 
function updateTaskAssignedDate(wfstr, wfAssignDate) // optional process name
{
	// Update the task assignment date
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var assignDate = aa.util.now();
			var tempDate = new Date(wfAssignDate);
			assignDate.setTime(tempDate.getTime())
			if (assignDate) {
				var taskItem = fTask.getTaskItem();
				taskItem.setAssignmentDate(assignDate);

				var adjustResult = aa.workflow.adjustTaskWithNoAudit(taskItem);
				if (adjustResult.getSuccess())
					logDebug("Updated Workflow Task : " + wfstr + " Assigned Date to " + wfAssignDate);
				else
					logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());
			} else
				logDebug("Couldn't update assigned date.  Invalid date : " + wfAssignDate);
		}
	}
} 
function updateTaskDepartment(wfstr, wfDepartment) // optional process name
{
	// Update the task assignment department
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 3) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (var i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			if (wfDepartment) {
				var taskUserObj = fTask.getTaskItem().getAssignedUser()
					taskUserObj.setDeptOfUser(wfDepartment);

				fTask.setAssignedUser(taskUserObj);
				var taskItem = fTask.getTaskItem();

				var adjustResult = aa.workflow.assignTask(taskItem);
				if (adjustResult.getSuccess())
					logDebug("Updated Workflow Task : " + wfstr + " Department Set to " + wfDepartment);
				else
					logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());
			} else
				logDebug("Couldn't update Department.  Invalid department : " + wfDepartment);
		}
	}
}
 
function updateWorkDesc(newWorkDes) // optional CapId
{
	var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args


		var workDescResult = aa.cap.getCapWorkDesByPK(itemCap);
	var workDesObj;

	if (!workDescResult.getSuccess()) {
		aa.print("**ERROR: Failed to get work description: " + workDescResult.getErrorMessage());
		return false;
	}

	var workDesScriptObj = workDescResult.getOutput();
	if (workDesScriptObj) {
		workDesObj = workDesScriptObj.getCapWorkDesModel();
	} else {
		aa.print("**ERROR: Failed to get workdes Obj: " + workDescResult.getErrorMessage());
		return false;
	}

	workDesObj.setDescription(newWorkDes);
	aa.cap.editCapWorkDes(workDesObj);

	aa.print("Updated Work Description to : " + newWorkDes);

}
 
/**
 * User Object
 * Constructor:
 * @param vUserId {string} User ID
 * @return {boolean}
 *
 * Methods:
 * getEmailTemplateParams
 * @param params {HashTable}
 * @param [userType] {string} Used to create email paramerters
 * @return params {HashTable}
 *
 * getUserDisciplines()
 * @return disciplineArray {array}
 *
 * getUserDistricts()
 * @return districtArray {array}
 */
function userObj(vUserId){
	this.userID = null;
	this.userFirstName = null;
	this.userLastName =  null;
	this.userMiddleName = null;
	this.userInitial = null;
	this.userEmail = null;
	this.userTitle = null;
	this.phoneNumber = null;
	this.dailyInspUnits = null;
	this.isInspector = null;
	this.userStatus = null;
	this.billingRate = null;
	this.cashierID = null;
	this.userObject = null;
	this.userFullName = null;
	
	var iNameResult = null;
	
	if(vUserId)
		iNameResult = aa.person.getUser(vUserId.toUpperCase());

	if (iNameResult.getSuccess()){
		var iUserObj = null;
		iUserObj = iNameResult.getOutput();
		this.userObject = iUserObj;
		this.userID = iUserObj.getUserID();
		this.userFirstName = iUserObj.getFirstName();
		this.userLastName =  iUserObj.getLastName();
		this.userMiddleName = iUserObj.getMiddleName();
		this.userFullName = iUserObj.getFullName();
		this.userInitial = iUserObj.getInitial();
		this.userEmail = iUserObj.getEmail();
		this.userTitle = iUserObj.getTitle();
		this.phoneNumber = iUserObj.getPhoneNumber();
		this.dailyInspUnits = iUserObj.getDailyInspUnits();
		this.isInspector = iUserObj.getIsInspector();
		this.userStatus = iUserObj.getUserStatus();
		this.billingRate = iUserObj.getRate1();
		this.cashierID = iUserObj.getCashierID();
	}
	else{ logDebug("**ERROR retrieving user model for" + vUserId + " : " + iNameResult.getErrorMessage()) ; return false ; }
	
 this.getEmailTemplateParams = function (params, userType) {
			if(matches(userType,null,undefined,"")) userType = "user";
			
            addParameter(params, "$$" + userType + "LastName$$", this.userLastName);
            addParameter(params, "$$" + userType + "FirstName$$", this.userFirstName);
            addParameter(params, "$$" + userType + "MiddleName$$", this.userMiddleName);
            addParameter(params, "$$" + userType + "Initials$$", this.userInitial);
            addParameter(params, "$$" + userType + "PhoneNumber$$", this.phoneNumber);
            addParameter(params, "$$" + userType + "Email$$", this.userEmail);
            addParameter(params, "$$" + userType + "Title$$", this.userTitle);
			addParameter(params, "$$" + userType + "DailyInspUnits$$", this.dailyInspUnits);
			addParameter(params, "$$" + userType + "BillingRate$$", this.billingRate);
			addParameter(params, "$$" + userType + "CashierID$$", this.cashierID);
            addParameter(params, "$$" + userType + "FullName$$", this.userFullName);
            return params;
            }

	this.getUserDistricts = function () {
		var result = aa.people.getUserDistricts(this.userID);
		var userDistrictModelArray = result.getOutput();
		var districtArray = new Array();
		
		for(iD in userDistrictModelArray){
			var userDistrictModel = userDistrictModelArray[iD];
			if(userDistrictModel.getRecStatus() == 'A'){
				districtArray.push(userDistrictModel.getDistrict());
			}
		}
		
		return districtArray;
	}
	
	this.getUserDisciplines = function () {
		var result = aa.people.getUserDisciplines(this.userID);
		var userDisciplineModelArray = result.getOutput();
		var disciplineArray = new Array();
		
		for(iD in userDisciplineModelArray){
			var userDisciplineModel = userDisciplineModelArray[iD];
			if(userDisciplineModel.getRecStatus() == 'A'){
				disciplineArray.push(userDisciplineModel.getDiscipline());
			}
		}
		
		return disciplineArray;
	}	
} 
function validateGisObjects()
	{
	// returns true if the app has GIS objects that validate in GIS
	//
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap
		{
		var gischk = aa.gis.getGISObjectAttributes(fGisObj[a1]);

		if (gischk.getSuccess())
			var gisres = gischk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving GIS Attributes.  Reason is: " + gischk.getErrorType() + ":" + gischk.getErrorMessage()) ; return false }	
		
		if (gisres != null)
			return true;  // we have a gis object from GIS
		}
	}

 
/*  Verhoeff algorithm for check digit	http://en.wikipedia.org/wiki/Verhoeff_algorithm

	usage:  
		x = new verhoeff();
		y = x.compute("524243");
		aa.print(x.check(y));
*/

function verhoeff() {
	var F = new Array();
	F[ 0 ] = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 );
	F[ 1 ] = new Array( 1, 5, 7, 6, 2, 8, 3, 0, 9, 4 );

	for ( var i = 2; i < 8; i++ ) {
	    F[ i ] = new Array();
	    for ( var j = 0; j < 10; j++ )
	        F[ i ][ j ] = F[ i - 1 ][ F[ 1 ][ j ]];
	}

	Op = new Array();
	Op[0] = new Array( 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 );
	Op[1] = new Array( 1, 2, 3, 4, 0, 6, 7, 8, 9, 5 );
	Op[2] = new Array( 2, 3, 4, 0, 1, 7, 8, 9, 5, 6 );
	Op[3] = new Array( 3, 4, 0, 1, 2, 8, 9, 5, 6, 7 );
	Op[4] = new Array( 4, 0, 1, 2, 3, 9, 5, 6, 7, 8 );
	Op[5] = new Array( 5, 9, 8, 7, 6, 0, 4, 3, 2, 1 );
	Op[6] = new Array( 6, 5, 9, 8, 7, 1, 0, 4, 3, 2 );
	Op[7] = new Array( 7, 6, 5, 9, 8, 2, 1, 0, 4, 3 );
	Op[8] = new Array( 8, 7, 6, 5, 9, 3, 2, 1, 0, 4 );
	Op[9] = new Array( 9, 8, 7, 6, 5, 4, 3, 2, 1, 0 );

	Inv = new Array( 0, 4, 3, 2, 1, 5, 6, 7, 8, 9 );
	
	reverse_str =  function( str )	{
	    var rev = "";
	    for ( var i = str.length - 1; i >= 0; i-- )
	        rev = rev + str.charAt( i );
	    return rev;
	}

	this.check =  function ( num )	{
	    var a = reverse_str( num );
	    var check = 0;
	    for ( var i=0; i < a.length; i++ )
	        check = Op[ check ][ F[ i % 8 ][ a.charAt( i )]];
	    if ( check != 0 )
	        return false;
	    else
	        return true;
	}

	this.compute = function(num) {
	    var a = "x" + reverse_str( num );
	    var check = 0;
	    for ( var i = 1; i < a.length; i++ )
	        check = Op[ check ][ F[ i % 8 ][ a.charAt( i )]];
	    return num + Inv[ check ];
	}
} 
function workDescGet(pCapId)
	{
	//Gets work description
	//07SSP-00037/SP5017
	//
	var workDescResult = aa.cap.getCapWorkDesByPK(pCapId);
	
	if (!workDescResult.getSuccess())
		{
		logDebug("**ERROR: Failed to get work description: " + workDescResult.getErrorMessage()); 
		return false;
		}
		
	var workDescObj = workDescResult.getOutput();
	var workDesc = workDescObj.getDescription();
	
	return workDesc;
	}
	 
function zeroPad(num,count)
{ 
var numZeropad = num + '';
while(numZeropad.length < count) {

numZeropad = "0" + numZeropad; 
}
return numZeropad;
} 



/**
 * CUSTOM FUNCTIONS BELOW HERE
 * 
 */


/**
 * 
 * @param {*} cfname custom field to get value of
 * @param {*} documentId documentId 
 * @returns value of Document ASI
 * 
 */

function getDocumentAsiValue(cfname, documentId) {

	var docTemplate = aa.document.getDocumentByPK(documentId).getOutput().getTemplate();

	if(docTemplate != null)
	{
		var tmplForms = docTemplate.getTemplateForms().toArray();

		for(tf in tmplForms)
		{
			var subGrp = tmplForms[tf].getSubgroups().toArray();
			for(sg in subGrp){
				var theFields = subGrp[sg].fields.toArray();
				for(tf2 in theFields){
					var aFldObj = theFields[tf2];
					if(aFldObj.fieldName == cfname){
					aa.print('{' + aFldObj.fieldName +'} = '+aFldObj.checklistComment)
						return aFldObj.checklistComment
						break
					}
				}
			}
		}
	}

}//END getDocumentAsiValue()



/**
 * 
 * @param {*} fromCapID 
 * @param {*} toCapID 
 * @param {*} cfname custom field to use 
 * @param {*} cfValue value to compare to
 */
function copyDocumentsByCFValue(fromCapID, toCapID, cfname, cfValue) {
    var opDocArray = aa.document.getDocumentListByEntity(fromCapID.toString(),"CAP").getOutput();
    var vDocArray = opDocArray.toArray();
    for (var vCounter in vDocArray) {
        var vDoc = aa.document.getDocumentByPK(vDocArray[vCounter].documentNo).getOutput();
        var docTemplate = aa.document.getDocumentByPK(vDoc.documentNo).getOutput().getTemplate();
        var copyDoc = false;
        
        if(docTemplate != null)
        {
            var tmplForms = docTemplate.getTemplateForms().toArray();

            for(tf in tmplForms)
            {
                var subGrp = tmplForms[tf].getSubgroups().toArray();
                for(sg in subGrp){
                    var theFields = subGrp[sg].fields.toArray();
                    for(tf2 in theFields){
                        var aFldObj = theFields[tf2];
                        if(aFldObj.fieldName == cfname && aFldObj.checklistComment == cfValue){
                            copyDoc = true;
                            break;
                        }
                    }

                    if(copyDoc) break;
                }

                if(copyDoc) break;
            }
        }

        if(copyDoc){
            aa.document.createDocumentAssociation(vDocArray[vCounter], toCapID.toString(), "CAP");
        }
    }
}//END copyDocumentsByCFValue()


/**
* Add the parcel and owner to the record from the reference addresss.
* @param {bool} addPrcl  - Add parcel if set to true
* @param {bool} addOwner - Add owner if set to true
* @returns bool
*/
function addPrclAndOwnerFromRefAddress(addPrcl, addOwner) // optional capID
{
     var itemCap = capId
     if (arguments.length > 2)
         itemCap = arguments[2]; // use cap ID specified in args

     //get the record address.
     var capAddrRes = aa.address.getAddressByCapId(itemCap);
     if (capAddrRes.getSuccess()){
         var addresses = capAddrRes.getOutput();
         var refAddr = null;
         for (zz in addresses){
             var anAddr = addresses[zz];
             //exploreObject(anAddr);
             refAddr = anAddr.getUID(); 
             break;
         }

         //
         if(addPrcl){
             if(refAddr != null){
                 // first add the primary parcel
                 //
                 var primaryParcelResult = aa.parcel.getPrimaryParcelByRefAddressID(refAddr, "Y");
                 if (primaryParcelResult.getSuccess())
                     var primaryParcel = primaryParcelResult.getOutput();
                 else {
                     logDebug("ERROR: Failed to get primary parcel for ref Address " + refAddr + " , " + primaryParcelResult.getErrorMessage());
                     return false;
                 }
             
                 var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, primaryParcel).getOutput()
             
                 var createPMResult = aa.parcel.createCapParcel(capParModel);
                 if (createPMResult.getSuccess())
                 {
                     logDebug("created CAP Parcel");
                 }
                 else {
                     logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
                 }
             }
         }

         if(addOwner){
             // Now the owners
             //
         
             var parcelListResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
             if (parcelListResult.getSuccess())
                 var parcelList = parcelListResult.getOutput();
             else {
                 logDebug("**ERROR: Failed to get Parcel List " + parcelListResult.getErrorMessage());
                 return false;
             }
         
             for (var thisP in parcelList) {
                 var ownerListResult = aa.owner.getOwnersByParcel(parcelList[thisP]);
                 if (ownerListResult.getSuccess())
                     var ownerList = ownerListResult.getOutput();
                 else {
                     logDebug("**ERROR: Failed to get Owner List " + ownerListResult.getErrorMessage());
                     return false;
                 }
         
                 for (var thisO in ownerList) {
                     ownerList[thisO].setCapID(itemCap);
                     createOResult = aa.owner.createCapOwnerWithAPOAttribute(ownerList[thisO]);
         
                     if (createOResult.getSuccess())
                         logDebug("Created CAP Owner");
                     else {
                         logDebug("**WARNING: Failed to create CAP Owner " + createOResult.getErrorMessage());
                     }
                 }
             }
         }
     }
     else{
         logDebug("ERROR - Unable to get address from cap: " + capAddrRes.getErrorMessage());
         return false;
     }

     return true;
}