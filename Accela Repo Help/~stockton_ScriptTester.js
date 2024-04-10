// var myCapId = "C-20-47";
var myCapId = "P23-0072"; //Amendment Record
var myUserId = "ADMIN";
var eventName = 'BATCH'


var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ aa.env.setValue("EventName", eventName); var vEventName = eventName; var controlString = eventName; var tmpID = aa.cap.getCapID(myCapId).getOutput(); if (tmpID != null) { aa.env.setValue("PermitId1", tmpID.getID1()); aa.env.setValue("PermitId2", tmpID.getID2()); aa.env.setValue("PermitId3", tmpID.getID3()); } aa.env.setValue("CurrentUserID", myUserId); var preExecute = "PreExecuteForAfterEvents"; var documentOnly = false; var SCRIPT_VERSION = 3.0; var useSA = false; var SA = null; var SAScript = null; var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { useSA = true; SA = bzr.getOutput().getDescription(); bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT"); if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); } } if (SA) { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript, SA, useProductScript)); } else { eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript)); eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript)); } eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript)); if (documentOnly) { doStandardChoiceActions2(controlString, false, 0); aa.env.setValue("ScriptReturnCode", "0"); aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed."); aa.abortScript(); } var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName); var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS"; var doStdChoices = true; var doScripts = false; var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0; if (bzr) { var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE"); doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT"); doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I"; } function getScriptText(vScriptName, servProvCode, useProductScripts) { if (!servProvCode) servProvCode = aa.getServiceProviderCode(); vScriptName = vScriptName.toUpperCase(); var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput(); try { if (useProductScripts) { var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName); } else { var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN"); } return emseScript.getScriptText() + ""; } catch (err) { return ""; } } logGlobals(AInfo); if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try { doStandardChoiceActions(controlString, true, 0); } catch (err) { logDebug(err.message) } if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g, "\r"); aa.print(z); 

// if (runEvent && typeof (doConfigurableScriptActions) == "function") doConfigurableScriptActions();


//
// User code goes here
//


try {
	logDebug('>>>>>>>> Start of script test')

	showDebug = true;
	publicUser = true;

	var emailParameters = aa.util.newHashtable()
	var theURL = "https://aca-supp.accela.com/stockton";
	addParameter(emailParameters, "$$acaRecordUrl$$", getACARecordURL(theURL));

	logDebug(emailParameters)


}
catch (err) {
	logDebug("A JavaScript Error occured: " + err.message);
}





// end user code
aa.env.setValue("ScriptReturnCode", "1");
aa.env.setValue("ScriptReturnMessage", debug)

// END SCRIPT TESTER
// HELPER FUNCTIONS BELOW

function exploreObject(objExplore) {
	logDebug("Methods:");
	for (var x in objExplore) {
		try {
			if (typeof (objExplore[x]) === "function") {
				logDebug("<font color=blue><u><b>" + x + "</b></u></font> ");
				logDebug("   " + objExplore[x] + "<br>");
			}
		} catch (err) {
			logDebug("exploreObject(): **ERROR** in Functions: " + err.Message);
		}
		var counter = objExplore.length;
	}
	logDebug("");
	logDebug("Properties:");
	for (var y in objExplore) {
		try {
			if (typeof (objExplore[y]) !== "function") {
				logDebug("  <b> " + y + ": </b> " + objExplore[y]);
			}
		} catch (err) {
			logDebug("exploreObject(): **ERROR** in Properties: " + err.Message);
		}
	}
}

function feeExistsByCapID(feestr, itemCap) // optional statuses to check for
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
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}
	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			return true;
	return false;
} 




function sendApplicationNotice(days, asi2check){
	var sysDate = aa.date.getCurrentDate();	
	var date2check = dateAdd(sysDate, days);
	var dateArray = date2check.split('/');
	var dateFormat = dateFormatted(dateArray[0], dateArray[1], dateArray[2]);
	logDebug('Date to check: ' + dateFormat + ' for ASI: ' + asi2check);
	var capList = aa.cap.getCapIDsByAppSpecificInfoField(asi2check, dateFormat)
		
	if (capList.getSuccess()){
		capList = capList.getOutput()
		if (capList && capList.length > 0){
			for (i in capList){
				var cap = capList[i]; //capIdScriptModel
				var capScript = aa.cap.getCap(cap.getCapID()).getOutput() //capScriptModel

				if (capScript.getCapType() != 'Planning/Project/NA/NA'){
					continue;
				}
				var capID = capScript.getCapID();
				logDebug('!!! Sending Notice for ' + capID.getCustomID())

				var eParams = aa.util.newHashtable()
				addParameter(eParams, '$$expirationDate$$', dateFormat);
				getRecordParams4Notification(eParams, capID);
				var contact = getContactByType('Applicant', capID)
				var contactEmail = contact.getEmail();
				addParameter(eParams, '$$contactFirstName$$', contact.getFirstName());
				addParameter(eParams, '$$contactEmail$$', contact.getEmail());

				if (asi2check == 'Approval Expired'){
					if (contactEmail != null && (days == 2 || days == 30)){
						sendNotification('', contactEmail, '', 'PLN_PRJ_APPROVAL_EXPIRING', eParams, new Array());
					}  else if (contactEmail != null && days == -1){
						updateAppStatus('Approval Expired', 'Approval was expired by batch script')
						sendNotification('', contactEmail, '', 'PLN_PRJ_aPPROVAL_EXPIRED', eParams, new Array());
					} else {
						logDebug('>>>FAILED to send notice, not applicant email')
					}
				} else if (asi2check == 'Application Expires'){
					if (contactEmail != null && (days == 2 || days == 30)){
						sendNotification('', contactEmail, '', 'PLN_PRJ_APPLICATION_EXPIRING', eParams, new Array());
					}  else if (contactEmail != null && days == -1){
						updateAppStatus('Application Expired', 'Application was expired by batch script')
						sendNotification('', contactEmail, '', 'PLN_PRJ_APPLICATION_EXPIRED', eParams, new Array());
					} else {
						logDebug('>>>FAILED to send notice, not applicant email')
					}
				}
			}
		}

	}
}





function dateAddHC(td, amt)
// perform date arithmetic on a string
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{
    var datesArrray = getCalendarEvents("WORKFLOW", "Business Days", 24);
    var useWorking = false;
    if (arguments.length == 3)
        useWorking = true;

    if (!td){
        dDate = new Date();
        dDate.setHours(0,0,0,0);
    }
    else{
        dDate = convertDate(td);
        dDate.setHours(0,0,0,0);
    }

    var i = 0;
    var nonWorking = false;
    if (useWorking){
        while (i < Math.abs(amt)) {
            if (amt > 0) {
                if(!isHoliday((dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear(), datesArrray)){
                    dDate = convertDate(dateAdd(dDate,1));
                    i++;
                }
                else{
                    dDate = convertDate(dateAdd(dDate,1));
                    //Sandy Sun - If distribution day is on weekend/holiday, start counting from next day
                    if (i == 0) {
                        i++;
                    }                    
                }
            }
            else {
                if (!isHoliday((dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear(), datesArrray)){
                    dDate = convertDate(dateAdd(dDate,-1));
                    i++;
                }
                else {
                    dDate = convertDate(dateAdd(dDate,-1));
                }
            }
        }
        
        // we have identified the target date using the working calendar, now we need
        // to confirm that the target date is a working day
        nonWorking = isHoliday((dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear(), datesArrray);
        while (nonWorking) 
        {
            if (amt >= 0 ) {
                dDate = convertDate(dateAdd(dDate,1));
            }
            else{
                dDate = convertDate(dateAdd(dDate,-1));
            }
                nonWorking = isHoliday((dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear(), datesArrray);
        }
    }
    else
        dDate.setDate(dDate.getDate() + parseInt(amt, 10));

    return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
} 

//Function to check if dDate is a marked as holiday or weekend in Agency Holiday calendar
function isHoliday(dDate, hcEvents){
    //var hcEvents = getCalendarEvents("AGENCY HOLIDAY", "Fresno", 24);
    dDate = convertDate(dDate);
    dDate.setHours(0,0,0,0);
    
    for(each in hcEvents){
        var eventDte = hcEvents[each];
        var eventJsDate = new Date(eventDte.getTime())
        eventJsDate.setHours(0,0,0,0);
        
        //if(eventJsDate.getTime() == dDate.getTime()) return true;
        if (days_between(eventJsDate,dDate) >= 0  && days_between(eventJsDate,dDate) < 1) return true
    }
    
    return false;
}

//function to load events from the given calendar
//It will only load allDay events
function getCalendarEvents(calType, calName){
    var numberOfMonths = 12; //Default to load number of months to 12
    var eventDateArray = [];
    //if use provided a third parameter use this for number of months to load into the array
    //if parameter is not a number, then it will stay as defaulted
    if(arguments.length == 3) {
        if(!isNaN(arguments[2])) numberOfMonths = arguments[2];
    }
    
    // var thisCalId = getCalendarId(calType, calName);
	// exploreObject(aa.calendar.getCalendars("WORKFLOW", "Business Days").getOutput())

	var calendarArray = aa.calendar.getCalendars(calName, calType).getOutput()
	var calendarID = calendarArray[0].getCalendarID();
	exploreObject(calendarArray[0])
    
    for(var i = 1; i <= numberOfMonths; i++){
        var events = aa.calendar.getEventSeriesByCalendarID(calendarID, (new Date()).getYear()+1900, (new Date()).getMonth()+i).getOutput();
        for(eachEvent in events){
            var anEvent = events[eachEvent];
            if(anEvent.isAllDayEvent())
                eventDateArray.push(events[eachEvent].getStartDate());
        }
    }
    
    return eventDateArray;
}

