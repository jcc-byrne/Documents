/*----------------------------------------------------------------------------------------------------------------------/
| Program: 		BATCH_UPDATE_REF_LP.js
| Trigger: 		Batch:  Update REF LP with data from Florida State
| Client:  		COLA
| Date:			03/15/2024
| Version: 		Base Version 1.0

| Author:  		Jacob Clay - Byrne Software
|
| Description:
|
| Notes:
|
|
---------------------------------------------------------------------------------------------------------------------*/

/*=======================================================/
Including all Accela Internal Library
/=======================================================*/
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM"));
var SCRIPT_VERSION = 3;
/*======================================================*/

/*=======================================================/
Variables needed to log parameters below in eventLog
/=======================================================*/
var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");
var batchJobName = "" + aa.env.getValue("batchJobName");
// var batchFromdate = "" + aa.env.getValue("fromDate");
// var batchToDate = "" + aa.env.getValue("toDate");
var batchJobResult = aa.batchJob.getJobID();
var batchJobID = 0;
var eventType = "";
var startDt = sysDate;
var batchDescription = "";
var br = "<br>";

/*======================================================*/

/*======================================================/
Setting up current user id in case system doesn't provide info.
/======================================================*/
var currentUserID = "ADMIN";
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
/*======================================================*/

if (batchJobResult.getSuccess())
{
	batchJobID = batchJobResult.getOutput();
	aa.print("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
}
else
{
	aa.print("Batch job ID not found " + batchJobResult.getErrorMessage() + br);
}


aa.print("Start of Job" + br);
aa.print("Current Date: " + sysDate.getMonth() + "/" + sysDate.getDayOfMonth() + "/" + sysDate.getYear() + " " + sysDate.getHourOfDay() + ":" + sysDate.getMinute() + br);
aa.print("-------------------------------------------------- " + br);

var sysDate = aa.date.getCurrentDate();
var sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(),sysDate.getDayOfMonth(),sysDate.getYear(),"");

var stateLPArray = [];

    //STEP 1.A - Get Environment Parameters for updating Reference LP
    var ADDRESS_1 = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_1').toUpperCase() == 'TRUE' ? true : false;
    var ADDRESS_2 = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_2').toUpperCase() == 'TRUE' ? true : false;
    var ADDRESS_3 = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_3').toUpperCase() == 'TRUE' ? true : false;
    var ADDRESS_CITY = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_CITY').toUpperCase() == 'TRUE' ? true : false;
    var ADDRESS_STATE = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_STATE').toUpperCase() == 'TRUE' ? true : false;
    var ADDRESS_ZIP = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'ADDRESS_ZIP').toUpperCase() == 'TRUE' ? true : false;
    var DOING_BUSINESS_AS = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'DOING_BUSINESS_AS').toUpperCase() == 'TRUE' ? true : false;
    var LIC_DATE_EFFECTIVE = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'LIC_DATE_EFFECTIVE').toUpperCase() == 'TRUE' ? true : false;
    var LIC_DATE_EXPIRES = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'LIC_DATE_EXPIRES').toUpperCase() == 'TRUE' ? true : false;
    var LIC_DATE_ORIGINAL = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'LIC_DATE_ORIGINAL').toUpperCase() == 'TRUE' ? true : false;
    var PRIMARY_STATUS = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'PRIMARY_STATUS').toUpperCase() == 'TRUE' ? true : false;
    var SECONDARY_STATUS = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'SECONDARY_STATUS').toUpperCase() == 'TRUE' ? true : false;
    var FULL_NAME = lookup('DBPR_LICENSE_FIELD_EDITABLE', 'FULL_NAME').toUpperCase() == 'TRUE' ? true : false;



mainProcess();
aa.print("End of Job" + br);



//different license types can be found from this website
//http://www.myfloridalicense.com/dbpr/instant-public-records/
function mainProcess(){
try {

    //STEP 1.A - Get State Data

    // if testing set to "true" to limit the results, otherwise you'll be looping through 250k+ rows
    var isTesting = false;

    //GET request to State of Florida, return array of arrays
    stateLPArray = getStateLicenses(stateLPArray, isTesting);


    //STEP 1.B - Get all Reference License Professionals from Environment
    var agency = aa.getServiceProviderCode();
    // var sql = "SELECT top 10 LIC_NBR, LIC_TYPE, LIC_SEQ_NBR, REC_STATUS from rstate_lic where SERV_PROV_CODE = ? and LIC_NBR = 'CBC033311' " ;
    var sql = "SELECT LIC_NBR, LIC_TYPE, LIC_SEQ_NBR, REC_STATUS from rstate_lic where SERV_PROV_CODE = ? " ;

    var result = aa.db.select(sql,[agency]);

    if (result.getSuccess()){
        var data = result.getOutput();
        aa.print("Count: " + data.size());
        
        for(i = 0; i < data.size(); i++){
            var refLicNbr = data.get(i).get("LIC_NBR");
            var refLicType = data.get(i).get("LIC_TYPE");
            var refLicSeqNbr = data.get(i).get("LIC_SEQ_NBR");

            aa.print(refLicNbr + " ----------- " + br);
            //STEP 2 - Check State Data for Lic Number
            var stateLicData = findStateLicense(refLicNbr)

            //STEP 3 - IF State Data exists, update Reference LP            
            var licProfRes = aa.licenseScript.getRefLicenseProfBySeqNbr(agency, refLicSeqNbr); //LicenseScriptModel

            if(!licProfRes.getSuccess()){
                aa.print("-> UNABLE TO GET LICPROF FOR " + refLicNbr + br);
                continue;
            } 

            var updateLP = updateRefLicProf(licProfRes.getOutput(), stateLicData)

            if (updateLP){
                aa.print('---> UPDATED LICPROF: ' + refLicNbr)
            } else {
                aa.print('---> ERROR FAILED TO UPDATE LICPROF: ' + refLicNbr)

            }

        }
    }
    
} catch(err){
    aa.print(err)
    aa.print('Something went wrong, check the CSV Links')
    aa.document.sendEmailByTemplateName('noreply@accela.com','', '', 'DBPR_BATCH_ERROR', aa.util.newHashtable(), [])
}
}




function getStateLicenses(licArr, testing){
        aa.print('Fetching State Licenses')
        var stdChoiceList = aa.bizDomain.getBizDomain('DBPR_DOWNLOAD_LINKS')

        if(stdChoiceList.getSuccess()){
            stdChoiceList = stdChoiceList.getOutput().toArray();

            for (i in stdChoiceList){
                var row = stdChoiceList[i]
                if (row.getAuditStatus() != 'A') continue;
                var url = row.getDescription();
                aa.print('Fetching licenses from '+ url)
                // exploreObject(row)

                var headers = aa.util.newHashMap();
                headers.put('User-Agent', 'Application')
                var vOutObj = aa.httpClient.get(url, headers);


                if (vOutObj.getSuccess()) {
                    var vOut = vOutObj.getOutput();
                    var lines = vOut.split('\n'); // Split the result into lines
                    var maxLines = Math.min(20, lines.length); // Limit to the first 20 lines for testing
                    var arrLength;
                    if (testing) {
                        arrLength = maxLines;
                    } else {
                        arrLength = lines.length;
                    }
                            
                    // Loop through each line
                    for (var i = 0; i < arrLength; i++) {
                        // aa.print('loop through lines')
                        var line = lines[i].trim(); // Trim any leading or trailing whitespace
                        var newArr = []
                             // Split the line by commas, ignoring commas within quotes
                            var columns = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
                            
                            // Process each column
                            for (var j = 0; j < columns.length; j++) {
                                // aa.print('COL_'+j)
            
                                // Remove leading and trailing quotes (if any)
                                columns[j] = columns[j].replace(/^"(.*)"$/, '$1');
                                

                                newArr.push(columns[j])
                                // Print or process the column as needed
                                // aa.print(columns[j]);
                            }


                        licArr.push(newArr)    
                    }
                } else {
                    aa.print('error');
                }


    
            }
    

        }
    
    return licArr
}

function findStateLicense(licNbr){
        var licenseToFind = licNbr

        var foundLicense = [];
        for (var i = 0; i < stateLPArray.length; i++) {
            if (stateLPArray[i][stateLPArray[i].length - 1] == licenseToFind) {
                foundLicense.push(stateLPArray[i]);
                break;
            }
        }
        
        if (foundLicense) {
            logDebug("Found:" + foundLicense);
            return foundLicense
        } else {
            logDebug("License not found.");
            return false
        }
}


function updateRefLicProf(licScriptModel, arrayForUpdate){
        arrayFiltered = arrayForUpdate[0]
        var occupationCode = arrayFiltered[1]
        var profFullName = arrayFiltered[2]
        var profDBA = arrayFiltered[3]
        var addLine1 = arrayFiltered[5];
        var addLine2 = arrayFiltered[6];
        var addLine3 = arrayFiltered[7]
        var addCity = arrayFiltered[8]
        var addState = arrayFiltered[9]
        var addZip = arrayFiltered[10]
        var countyCode = arrayFiltered[11]
        var profStatusPrim = arrayFiltered[13]
        var profStatusSec = arrayFiltered[14]
        var profDateIss = arrayFiltered[15]
        var profDateEff = arrayFiltered[16]
        var profDateExp = arrayFiltered[17]
        
        if (FULL_NAME && profFullName){
            // licScriptModel.setContactFirstName(profFullName);
            licScriptModel.setBusinessName2(profDBA);

        }

        if (DOING_BUSINESS_AS && profDBA){
            licScriptModel.setBusinessName(profDBA);
        }


        if (ADDRESS_1 && addLine1){
            licScriptModel.setAddress1(addLine1);
        }

        if (ADDRESS_2 && addLine2){
            licScriptModel.setAddress2(addLine2);
        }

        if (ADDRESS_3 && addLine3){
            licScriptModel.setAddress3(addLine3);
        }

        if (ADDRESS_CITY && addCity){
            licScriptModel.setCity(addCity);
        }

        if (ADDRESS_STATE && addState){
            licScriptModel.setState(addState);
        }

        if (ADDRESS_ZIP && addZip){
            licScriptModel.setZip(addZip);
        }

        if (LIC_DATE_ORIGINAL && profDateIss){
            licScriptModel.setLicOrigIssDate(aa.date.parseDate(profDateIss));
        }

        if (LIC_DATE_EFFECTIVE && profDateEff){
            licScriptModel.setLicenseIssueDate(aa.date.parseDate(profDateEff));
        }

        if (LIC_DATE_EXPIRES && profDateExp){
            licScriptModel.setBusinessLicExpDate(aa.date.parseDate(profDateExp));
            licScriptModel.setLicenseExpirationDate(aa.date.parseDate(profDateExp));
        }

        if (PRIMARY_STATUS && profStatusPrim){
            if (profStatusPrim == 'I'){
                aa.print('Deactivate the LP');
                licScriptModel.setAuditStatus('I')
            } else {
                licScriptModel.setAuditStatus('I')
            }
        }
        
        var cmt = ''
        cmt += 'Full Name: ' + profFullName + '\n';
        cmt += 'Occupation Code: ' + occupationCode + '\n';
        cmt += 'County Code: ' + countyCode + '\n';
        cmt += 'Primary Status: ' + profStatusPrim + '\n';
        cmt += 'Secondary Status: ' + profStatusSec + '\n';
        cmt += 'Ref. LP Last Updated: ' + sysDateMMDDYYYY + '\n';

        licScriptModel.setComment(cmt)

        var updateLP = aa.licenseScript.editRefLicenseProf(licScriptModel);
        if (updateLP.getSuccess()){
            logDebug('Updated LP')
            return true
          } else {
            logDebug('Something went wrong: ' + updateLP.getErrorMessage())
            return false
          }

}

function dateFormatted(pMonth, pDay, pYear, pFormat)
//returns date string formatted as YYYY-MM-DD or MM/DD/YYYY (default)
{
	var mth = "";
	var day = "";
	var ret = "";
	if (pMonth > 9)
		mth = pMonth.toString();
	else
		mth = "0" + pMonth.toString();
	if (pDay > 9)
		day = pDay.toString();
	else
		day = "0" + pDay.toString();
	if (pFormat == "YYYY-MM-DD")
		ret = pYear.toString() + "-" + mth + "-" + day;
	else
		ret = "" + mth + "/" + day + "/" + pYear.toString();
	return ret;
} 

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
	if (!servProvCode)
	{
		servProvCode = aa.getServiceProviderCode();
	}

	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();

	try
	{
		if (useProductScripts)
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


function exploreObject(objExplore) {

    aa.print('<font color=red ><u><b>Properties:</b></u></font> ');
  
    var properties = [];
  
    for (var y in objExplore) {
      try {
        if (typeof objExplore[y] !== 'function') {
          properties.push(y);
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Properties: ' + err.Message);
      }
    }
  
    properties.sort();
    properties.forEach(function(property) {
      aa.print('  <b> ' + property + ': </b> ' + objExplore[property]);
    });
  
    aa.print('');
    aa.print('<font color=red ><u><b>Methods:</b></u></font> ');
  
    var methods = [];
  
    for (var x in objExplore) {
      try {
        if (typeof objExplore[x] === 'function') {
          methods.push(x);
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Functions: ' + err.Message);
      }
    }
  
    methods.sort();
    methods.forEach(function(method) {
      aa.print('<font color=blue><u><b>' + method + '</b></u></font> ');
      aa.print('   ' + objExplore[method] + '<br>');
    });
  
  
}
  
function logDebug(str){
    aa.print(str);
}


function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		// logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
}