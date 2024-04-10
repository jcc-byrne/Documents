
// addPermitProject('202300021R', 'fdesc test', 'Residential', '01/24/2025', 'comments test')
addPermitEntry('202300021R', 'TEMP')

function logDebug(str) {aa.print(str)}

var message = ''
var br = '<br>'

function addPermitProject(projectNo, projectFdesc, projectSdesc, rejectionDt, comments){
    aa.print('>>> BEGIN addPermitProject')
    var functionName = 'AddPermitProject'
    // var projectNo = '202400013C'; //Accela Permit Number
    // var projectFdesc = '200 Amps (2x), TEMP '; //full city description
    // var projectSdesc = 'Commercial'; //Residential or Commercial
    var releasedYN = 'F'; //Default "F"
    // var rejectionDt = '06/12/2024'; //Permit expiration date
    // var comments = '7747 BOCA CHICA BLVD'; //Address / Business Name
    
    var headers = aa.util.newHashMap();
    headers.put('Content-Type', 'text/xml');
    headers.put('Authorization', 'Basic Q09CX0FjY2VsYTptRjImOE42UD8hdTI=');
    
    var url = 'https://ebilltest.brownsville-pub.com/cayentaws/service/API';
    var xmlToPost = '<?xml version="1.0" encoding="utf-8"?>';
    xmlToPost += '<Request><'+functionName+'><Params>';
    xmlToPost += '<PROJECT_NO>'+projectNo+'</PROJECT_NO>';
    xmlToPost += '<PROJECT_NO_FDESC>'+projectFdesc+'</PROJECT_NO_FDESC>';
    xmlToPost += '<PROJECT_NO_SDESC>'+projectSdesc+'</PROJECT_NO_SDESC>';
    xmlToPost += '<RELEASED_YN>'+releasedYN+'</RELEASED_YN>';
    xmlToPost += '<REJECTION_DT>'+rejectionDt+'</REJECTION_DT>';
    xmlToPost += '<COMMENTS>'+comments+'</COMMENTS>';
    xmlToPost += '</Params></'+functionName+'></Request>';
    
    var res = aa.httpClient.post(url, headers, xmlToPost);

    aa.print('REQUEST BODY: ' + xmlToPost)
    
    if (res.getSuccess()){
        aa.print(res.getOutput())
        
        var response = res.getOutput();
        var resStatus = TagValue(response, 'STATUS')
        aa.print('Status: ' + resStatus)
        logDebug('Status: ' + resStatus)

        var statusDesc = TagValue(response, 'STATUS_DESC')
        aa.print('Status Desc: ' + statusDesc)
        logDebug('Status Desc: ' + statusDesc)

    
        if (resStatus == '-1'){
            aa.print('an error occured. Message: ' + statusDesc)
            logDebug('an error occured. Message: ' + statusDesc)

        } else {
            aa.print(statusDesc)
            logDebug(statusDesc)
            logMessage('Created BPUB Project: ' + projectNo + '<br>' + projectFdesc, "SUCCESS")
        }
    }

    aa.print('>>> END addPermitProject')

/**
 * Error Response
 * 
 * <Reply transNo="7253740" pid="52664">
 * <AddPermitProject version="1.1">
 * <Params>
 * <STATUS>-1</STATUS>
 * <STATUS_DESC>-7: Store error on table UM00600M. </STATUS_DESC>
 * </Params>
 * <STATUS>0</STATUS>
 * </AddPermitProject>
 * </Reply>
 */

/**
 * Success Response
 * 
 * <Reply transNo="7253783" pid="52664">
 * <AddPermitProject version="1.1">
 * <Params>
 * <STATUS>0</STATUS>
 * <STATUS_DESC>Project Number 2024-00008 successfully created.</STATUS_DESC>
 * </Params>
 * <STATUS>0</STATUS>
 * </AddPermitProject>
 * </Reply>
 */
}

function createCayentaPermits(prjNo){
    var meterInfoASIT = loadASITable('METERS', capId);
    if (meterInfoASIT){
        logDebug('Loop through Meter Information table and create permits')
        for (i in meterInfoASIT){
            row = meterInfoASIT[i];
            connectionTp = row['Connection Type'];
            quantity = row['Quantity'];

            var count;
            logDebug('Quantity: ' + quantity)
            if (quantity != null && quantity != 0 && quantity != undefined && quantity != ''){
                count = 0;

                while (count < quantity){
                    logDebug('Count: ' + count)
                    addPermitEntry(prjNo, String(connectionTp));
                    count++;
                }
            }
        }
        logDebug('Completed creating permits')
    }
}

function addPermitEntry(projectNo, connectionTp){
    var functionName = 'AddPermitEntry'
    // var permitNo = ''; //Cayenta utilities generated
    var permitTp = 'ELECT'; //permit type, ELECT or TRANS
    var permitStat = 'ENTER'; //permit status, default to ENTER
    // var connectionTp = 'SERIN'; //connection type, CLEAR, PERM, RELOC, TEMP, SERIN, HOUSE
    //projectNo = '202400001R';

    //SVINC IS NOT VALID - MAYBE TRY SERIN
    //TEMP IS NOT WORKING
    
    var headers = aa.util.newHashMap();
    headers.put('Content-Type', 'text/xml');
    headers.put('Authorization', 'Basic Q09CX0FjY2VsYTptRjImOE42UD8hdTI=');
    
    var url = 'https://ebilltest.brownsville-pub.com/cayentaws/service/API';
    
    var xmlToPost = '<?xml version="1.0" encoding="utf-8"?><Request><AddPermitEntry><Params><PERMIT_TP>'+String(permitTp)+'</PERMIT_TP><PERMIT_STAT>'+String(permitStat)+'</PERMIT_STAT><CONNECTION_TP>'+String(connectionTp)+'</CONNECTION_TP><CONNECTION_LINE><PROJECT_NO>'+String(projectNo)+'</PROJECT_NO></CONNECTION_LINE></Params></AddPermitEntry></Request>';
    
    var res = aa.httpClient.post(url, headers, xmlToPost);
    aa.print('REQUEST BODY: ' + xmlToPost)
    
    if (res.getSuccess()){
        aa.print(res.getOutput())
        var response = res.getOutput();
        var resStatus = TagValue(response, 'STATUS')
        aa.print('Status: ' + resStatus)
        logDebug('Status: ' + resStatus)

        var statusDesc = TagValue(response, 'STATUS_DESC')
        aa.print('Status Desc: ' + statusDesc)
        logDebug('Status Desc: ' + statusDesc)

        var newRow = [];

        if (resStatus == '0'){
            logDebug('Permit Created')
            var extractPermNo = statusDesc.match(/Permit number (\d+)/)
            var permNo = extractPermNo ? extractPermNo[1] : null;
            // newRow['Permit Number'] = new asiTableValObj('Permit Number', permNo, 'N')
            logMessage('Created BPUB Permit: ' + permNo, "SUCCESS")

        } else {
            aa.print('an error occured')
            logDebug('Something went wrong attempting to create BPUB Permit')
            // Add row to ASIT with RESEND Permit Number
            // newRow['Permit Number'] = new asiTableValObj('Permit Number', 'RESEND', 'N')
            logDebug(statusDesc)
            logMessage('Failed to create permit, check BPUB Permits Data Table', "ERROR")
        }

        // newRow['Connection TP'] = new asiTableValObj('Connection TP', connectionTp, 'N')
        // newRow['Status'] = new asiTableValObj('Status', 'ENTER', 'N')
        // newRow['Response Status'] = new asiTableValObj('Response Status', statusDesc, 'Y')
        // addToASITable('BPUB',newRow, capId)
    }

    /**
     * ERROR RESPONSE
     * <Reply transNo="7253913" pid="44440">
     * <AddPermitEntry version="1.1">
     * <Params>
     * <STATUS>-100</STATUS>
     * <STATUS_DESC>PERMIT_TP tag is missing or is empty.</STATUS_DESC>
     * </Params>
     * <STATUS>0</STATUS>
     * </AddPermitEntry>
     * </Reply>
     */

    /**
     * SUCCESS RESPONSE
     * <Reply transNo="7323446" pid="59620">
     * <AddPermitEntry version="1.1">
     * <Params>
     * <STATUS>0</STATUS>
     * <STATUS_DESC>Permit number 30118 Project number 202400001R successfully created.</STATUS_DESC>
     * </Params>
     * <STATUS>0</STATUS>
     * </AddPermitEntry>
     * </Reply>
     */
}

function resendPermitEntry(projectNo, connectionTp, rowIndex){
    var functionName = 'AddPermitEntry'
    // var permitNo = ''; //Cayenta utilities generated
    var permitTp = 'ELECT'; //permit type, ELECT or TRANS
    var permitStat = 'ENTER'; //permit status, default to ENTER
    // var connectionTp = 'SERIN'; //connection type, CLEAR, PERM, RELOC, TEMP, SERIN, HOUSE
    //projectNo = '202400001R';

    //SVINC IS NOT VALID - MAYBE TRY SERIN
    //TEMP IS NOT WORKING
    
    var headers = aa.util.newHashMap();
    headers.put('Content-Type', 'text/xml');
    headers.put('Authorization', 'Basic Q09CX0FjY2VsYTptRjImOE42UD8hdTI=');
    
    var url = 'https://ebilltest.brownsville-pub.com/cayentaws/service/API';
    
    var xmlToPost = '<?xml version="1.0" encoding="utf-8"?>';
    xmlToPost += '<Request><'+functionName+'><Params>';
    // xmlToPost += '<APPLY_DT>'+applyDt+'</APPLY_DT>'; //default to current date if not provided
    xmlToPost += '<PERMIT_TP>'+permitTp+'</PERMIT_TP>';
    xmlToPost += '<PERMIT_STAT>'+permitStat+'</PERMIT_STAT>';
    xmlToPost += '<CONNECTION_TP>'+connectionTp+'</CONNECTION_TP>';
    xmlToPost += '<CONNECTION_LINE><PROJECT_NO>'+projectNo+'</PROJECT_NO></CONNECTION_LINE>'
    xmlToPost += '</Params></'+functionName+'></Request>';
    
    var res = aa.httpClient.post(url, headers, xmlToPost);

    var xmlDebug = '&lt;?xml version="1.0" encoding="utf-8"?&gt;';
    xmlDebug += '&lt;Request&gt;&lt;'+functionName+'&gt;&lt;Params&gt;';
    // xmlDebug += '&lt;APPLY_DT&gt;'+applyDt+'&lt;/APPLY_DT&gt;'; //default to current date if not provided
    xmlDebug += '&lt;PERMIT_TP&gt;'+permitTp+'&lt;/PERMIT_TP&gt;';
    xmlDebug += '&lt;PERMIT_STAT&gt;'+permitStat+'&lt;/PERMIT_STAT&gt;';
    xmlDebug += '&lt;CONNECTION_TP&gt;'+connectionTp+'&lt;/CONNECTION_TP&gt;';
    xmlDebug += '&lt;CONNECTION_LINE&gt;&lt;PROJECT_NO&gt;'+projectNo+'&lt;/PROJECT_NO&gt;&lt;/CONNECTION_LINE&gt;'
    xmlDebug += '&lt;/Params&gt;&lt;/'+functionName+'&gt;&lt;/Request&gt;';
    
    aa.print('REQUEST BODY: ' + xmlDebug)
    
    if (res.getSuccess()){
        aa.print(res.getOutput())
        var response = res.getOutput();
        var resStatus = TagValue(response, 'STATUS')
        aa.print('Status: ' + resStatus)
        logDebug('Status: ' + resStatus)

        var statusDesc = TagValue(response, 'STATUS_DESC')
        aa.print('Status Desc: ' + statusDesc)
        logDebug('Status Desc: ' + statusDesc)

        var responseStatusComment = ''

        if (resStatus == '0'){
            logDebug('Permit Created')
            var extractPermNo = statusDesc.match(/Permit number (\d+)/)
            var permNo = extractPermNo ? extractPermNo[1] : null;
            updateAsitPermitNumber(permNo, rowIndex)
            responseStatusComment = 'CREATED PERMIT... Description: ' + statusDesc;
            updateASITpermitResStatus(rowIndex, responseStatusComment)

        } else {
            aa.print('an error occured')
            logDebug('Something went wrong attempting to create BPUB Permit')
            // Add row to ASIT with empty Permit Number
            responseStatusComment = 'ERROR... Description: ' + statusDesc;

            updateASITpermitResStatus(rowIndex, responseStatusComment)
            logDebug(statusDesc)
        }


    }

    /**
     * ERROR RESPONSE
     * <Reply transNo="7253913" pid="44440">
     * <AddPermitEntry version="1.1">
     * <Params>
     * <STATUS>-100</STATUS>
     * <STATUS_DESC>PERMIT_TP tag is missing or is empty.</STATUS_DESC>
     * </Params>
     * <STATUS>0</STATUS>
     * </AddPermitEntry>
     * </Reply>
     */

    /**
     * SUCCESS RESPONSE
     * <Reply transNo="7323446" pid="59620">
     * <AddPermitEntry version="1.1">
     * <Params>
     * <STATUS>0</STATUS>
     * <STATUS_DESC>Permit number 30118 Project number 202400001R successfully created.</STATUS_DESC>
     * </Params>
     * <STATUS>0</STATUS>
     * </AddPermitEntry>
     * </Reply>
     */
}


//after inspection is complete, release the permit
function updatePermitEntry(permitNo, connectionTp, rowIndex){
    // var permitNo = '30118'; //from Cayenta
    var permitStat = 'REV'; //permit status, default to ENTER
    // var connectionTp = 'SERIN'; //connection type, CLEAR, PERM, RELOC, TEMP, SERIN, HSE

    
    var headers = aa.util.newHashMap();
    headers.put('Content-Type', 'text/xml');
    headers.put('Authorization', 'Basic Q09CX0FjY2VsYTptRjImOE42UD8hdTI=');
    var url = 'https://ebilltest.brownsville-pub.com/cayentaws/service/API';
    
   var xmlToPost = '<Request><UpdatePermitEntry><Params><PERMIT_NO>'+permitNo+'</PERMIT_NO><PERMIT_STAT>'+permitStat+'</PERMIT_STAT><CONNECTION_TP>'+connectionTp+'</CONNECTION_TP></Params></UpdatePermitEntry></Request>'
    var res = aa.httpClient.post(url, headers, xmlToPost);
    aa.print('REQUEST BODY: ' + xmlToPost)
    
    if (res.getSuccess()){
      aa.print(res.getOutput())
      var response = res.getOutput();
      var resStatus = TagValue(response, 'STATUS')
      aa.print('Status: ' + resStatus)
      logDebug('Status: ' + resStatus)

      var statusDesc = TagValue(response, 'STATUS_DESC')
      aa.print('Status Desc: ' + statusDesc)
      logDebug('Status Desc: ' + statusDesc)

      var responseStatusComment = ''

      if (resStatus == '0'){
          logDebug('Permit Updated to Released')
          updateASITpermitStatus(rowIndex)
          responseStatusComment = 'RELEASED VIA SCRIPT... Description: ' + statusDesc
          updateASITpermitResStatus(rowIndex, responseStatusComment)
      } else {
          aa.print('an error occured')
          logDebug('Something went wrong attempting to update BPUB Permit')
          logDebug(statusDesc)
          responseStatusComment = 'ERROR... Description: ' + statusDesc
          updateASITpermitResStatus(rowIndex, responseStatusComment)

      }
    }
    



    /**
     * 500 ERROR RESPONSE
     * 
     * <Reply><STATUS>-1</STATUS><STATUS_DESC><Response>
     * 500 Internal Server Error
     * <Explanation>
     * Check log files for further information.
     * </Explanation>
     * </Response>
     * </STATUS_DESC><httpResponseCode>500</httpResponseCode></Reply>
     * Status: -1
     * Status Desc: <Response>
     * 500 Internal Server Error
     * <Explanation>
     * Check log files for further information.
     * </Explanation>
     * </Response>
     * an error occured
     *      
     *
     * */

    /**
     * SUCCESS 
     * <Reply transNo="7323476" pid="60944">
     * <UpdatePermitEntry version="1.1">
     * <Params>
     * <STATUS>0</STATUS>
     * <STATUS_DESC>Permit number 30117 successfully updated.</STATUS_DESC>
     * </Params>
     * <STATUS>0</STATUS>
     * </UpdatePermitEntry>
     * </Reply>
     */
}

//Setup Project Number, Accela Permit Number without the '-' and a R or C at the end for residential or commercial
function getBPUBProjectNo() {
var commOrRes = '';
if (appTypeArray[1] == 'Residential'){
  commOrRes = 'R';
} else if (appTypeArray[1] == 'Commercial'){
  commOrRes = 'C';
}


var projectNumber = capId.getCustomID().replace('-', '') + commOrRes; 
logDebug('Cayenta Project Number: ' + projectNumber) 
    return projectNumber;
}

function getBPUBProjectFDesc() {
    var fDesc = '';

    var meterInfoASIT = loadASITable('METERS');

    for (i in meterInfoASIT){
        row = meterInfoASIT[i];
        amps = row['Amperage Per Meter']; 
        //logDebug('Amps: ' + amps)
        connectionTp = row['Connection Type']
        quantity = row['Quantity'];
        if (amps != null && amps != ''){
            fDesc+= amps + ' AMPS ' + connectionTp + ' (X' + quantity + ') '
        } else {
            fDesc+= ' ' + connectionTp + ' (X' + quantity + ') '
        }
    }
    logDebug('Cayenta Project Full Description: ' + fDesc)
        return fDesc;
    }

function getBPUBProjectSDesc() {
var projectType = '';
if (appTypeArray[1] == 'Residential'){
  projectType = 'Residential';
} else if (appTypeArray[1] == 'Commercial'){
  projectType = 'Commercial';
}
    logDebug('Cayenta Project Type: ' + projectType)
    return projectType
}

function getBPUBExpDate(){
    //Not using record expiration dates. Just add 12 months to today's date
    var expDD = dateAddMonths(null, 12);
    // var b1ExpModel = aa.expiration.getLicensesByCapID(capId).getOutput();
    // var expDD = b1ExpModel.getExpDate();
    // var expDD = expDD.getMonth() + "/" + expDD.getDayOfMonth() + "/" + expDD.getYear();
    logDebug('Expiration Date: ' + expDD)
    return expDD
}

function getBPUBProjectComments(){
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
    var asiLotSuiteUnit = getAppSpecific('Lot, Suite, or Unit #');
    projectComment += ' / ' + asiLotSuiteUnit

    var asiBusinessName = getAppSpecific('Business Name');
    projectComment += ' / ' + asiBusinessName;

    logDebug('Project Comment: ' + projectComment)
    return projectComment
}




function TagValue(string, tag) {
    var beginTag = '<' + tag + '>';
    var endTag = '</' + tag + '>';
    var tagLen = beginTag.length;

    var startIdx = string.indexOf(beginTag);
    if (startIdx == -1) {
        return "";
    }

    var endIdx = string.indexOf(endTag, startIdx);
    var tagVal = string.slice(startIdx + tagLen, endIdx);

    return tagVal;
}

function getASITpermitNumbers(connectionTp) {
    var resultArray = []

    var agency = aa.getServiceProviderCode();
    var sql = "SELECT p.b1_alt_id, t.row_index, t.ATTRIBUTE_VALUE as connectionTp, t2.ATTRIBUTE_VALUE as permitnum, t3.ATTRIBUTE_VALUE as permStatus \n" +
    "FROM b1permit p join bappspectable_value t on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 \n" +
    "JOIN bappspectable_value t2 on t.b1_per_id1 = t2.b1_per_id1 and t.b1_per_id2 = t2.b1_per_id2 and t.b1_per_id3 = t2.b1_per_id3 and t.row_index = t2.row_index and t2.column_name = 'Permit Number' and t2.table_name = 'BPUB' \n"+
    "JOIN bappspectable_value t3 on t.b1_per_id1 = t3.b1_per_id1 and t.b1_per_id2 = t3.b1_per_id2 and t.b1_per_id3 = t3.b1_per_id3 and t.row_index = t3.row_index and t3.column_name = 'Status' and t3.ATTRIBUTE_VALUE in ('ENTER', 'Entered') and t3.table_name = 'BPUB' \n"+
    "WHERE p.SERV_PROV_CODE = ? \n" +
    "AND  p.b1_alt_id = ? and t.ATTRIBUTE_VALUE = ?\n" 
    var result = aa.db.select(sql,[agency, capId.getCustomID(), connectionTp]);

    // aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    aa.print("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        // aa.print("Row " + d + ": " + data.get(d));
        aa.print(data.get(d).get("row_index"))
        aa.print(data.get(d).get("permitnum"))
        rowIndex = data.get(d).get("row_index")
        permitnum = data.get(d).get("permitnum")
        logDebug('Permit Number: ' + permitnum + ' and Row Index: ' + rowIndex)
        resultArray.push([rowIndex, permitnum])
    }
    
}
return resultArray
    
    }

    function getAllASITPermitNumbers() {
        var resultArray = []
    
        var agency = aa.getServiceProviderCode();
        var sql = "SELECT p.b1_alt_id, t.row_index, t.ATTRIBUTE_VALUE as connectionTp, t2.ATTRIBUTE_VALUE as permitnum, t3.ATTRIBUTE_VALUE as permStatus \n" +
        "FROM b1permit p join bappspectable_value t on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 \n" +
        "JOIN bappspectable_value t2 on t.b1_per_id1 = t2.b1_per_id1 and t.b1_per_id2 = t2.b1_per_id2 and t.b1_per_id3 = t2.b1_per_id3 and t.row_index = t2.row_index and t2.column_name = 'Permit Number' and t2.table_name = 'BPUB' \n"+
        "JOIN bappspectable_value t3 on t.b1_per_id1 = t3.b1_per_id1 and t.b1_per_id2 = t3.b1_per_id2 and t.b1_per_id3 = t3.b1_per_id3 and t.row_index = t3.row_index and t3.column_name = 'Status' and t3.ATTRIBUTE_VALUE in ('ENTER', 'Entered') and t3.table_name = 'BPUB' \n"+
        "WHERE p.SERV_PROV_CODE = ? \n" +
        "AND  p.b1_alt_id = ?\n" 
        var result = aa.db.select(sql,[agency, capId.getCustomID()]);
    
        // aa.print(result.getOutput())
    if (result.getSuccess()) {
        var data = result.getOutput();
        aa.print("Count:" + data.size());
        for (var d = 0; d < data.size(); d++) {
            // aa.print("Row " + d + ": " + data.get(d));
            aa.print(data.get(d).get("row_index"))
            aa.print(data.get(d).get("permitnum"))
            rowIndex = data.get(d).get("row_index")
            permitnum = data.get(d).get("permitnum")
            connectionTp = data.get(d).get("connectionTp")
            permStatus = data.get(d).get("permStatus")
            logDebug('Permit Number: ' + permitnum + ' and Row Index: ' + rowIndex)
            resultArray.push([rowIndex, permitnum, connectionTp, permStatus])
        }
        
    }
    return resultArray
        
        }

    function getFailedASITrows() {
        var resultArray = []
    
        var agency = aa.getServiceProviderCode();
        var sql = "SELECT p.b1_alt_id, t.row_index, t2.ATTRIBUTE_VALUE as connectionTp \n" +
        "FROM b1permit p join bappspectable_value t on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 and t.column_name = 'Permit Number' and t.attribute_value = 'RESEND' \n" +
        "JOIN bappspectable_value t2 on t.b1_per_id1 = t2.b1_per_id1 and t.b1_per_id2 = t2.b1_per_id2 and t.b1_per_id3 = t2.b1_per_id3 and t.row_index = t2.row_index and t2.column_name = 'Connection TP' and t2.table_name = 'BPUB' \n"+
        "WHERE p.SERV_PROV_CODE = ? \n" +
        "AND  p.b1_alt_id = ? \n" 
        var result = aa.db.select(sql,[agency, capId.getCustomID()]);
    
        // aa.print(result.getOutput())
    if (result.getSuccess()) {
        var data = result.getOutput();
        aa.print("Count:" + data.size());
        for (var d = 0; d < data.size(); d++) {
            // aa.print("Row " + d + ": " + data.get(d));
            aa.print(data.get(d).get("row_index"))
            aa.print(data.get(d).get("connectionTp"))
            rowIndex = data.get(d).get("row_index")
            connectionTp = data.get(d).get("connectionTp")
            logDebug('Connection Type: ' + connectionTp + ' and Row Index: ' + rowIndex)
            resultArray.push([rowIndex, connectionTp])
        }
        
    }
    return resultArray
        
        }

function updateASITpermitStatus(rowIndex){
        logDebug('>>>Begin updateASITpermitStatus')
//     EXAMPLE USAGE
//     var arr = [['0', '30133'], ['2', '30135']]
// var altId = '2024-00014'

// for (i in arr){
//     row = arr[i]
//     rowIndex = row[0]
//     permitNum = row[1]
//     aa.print('Updating Permit Number: ' + permitNum);
//     updateASITpermitStatus(rowIndex)
// }

        var agency = aa.getServiceProviderCode();
    
        var update = "update bappspectable_value \n"+
        "set ATTRIBUTE_VALUE = 'Released' \n"+
        "FROM bappspectable_value t join b1permit p on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 \n" +
        "WHERE p.SERV_PROV_CODE = ? \n" +
        "AND  p.b1_alt_id = ? and t.ROW_INDEX = ? and t.COLUMN_NAME = 'Status' \n" 
        
        var result = aa.db.update(update, [agency, capId.getCustomID(), rowIndex]);
        aa.print(result.getOutput())
        if (result.getSuccess()) {
            var data = result.getOutput();
            logDebug('Successfully updated status on ASIT')
        } else {
            aa.print(result.getErrorMessage())
            logDebug('ERROR: ' + result.getErrorMessage())
        }
        logDebug('<<<End updateASITpermitStatus')

    }

function updateASITpermitResStatus(rowIndex, statusRes){
        logDebug('>>>Begin updateASITpermitResStatus')
//     EXAMPLE USAGE
//     var arr = [['0', '30133'], ['2', '30135']]
// var altId = '2024-00014'

// for (i in arr){
//     row = arr[i]
//     rowIndex = row[0]
//     permitNum = row[1]
//     aa.print('Updating Permit Number: ' + permitNum);
//     updateASITpermitStatus(rowIndex)
// }

        var agency = aa.getServiceProviderCode();
    
        var update = "update bappspectable_value \n"+
        "set ATTRIBUTE_VALUE = ? \n"+
        "FROM bappspectable_value t join b1permit p on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 \n" +
        "WHERE p.SERV_PROV_CODE = ? \n" +
        "AND  p.b1_alt_id = ? and t.ROW_INDEX = ? and t.COLUMN_NAME = 'Response Status' \n" 
        
        var result = aa.db.update(update, [statusRes,agency, capId.getCustomID(), rowIndex]);
        aa.print(result.getOutput())
        if (result.getSuccess()) {
            var data = result.getOutput();
            logDebug('Successfully updated response status on ASIT')
        } else {
            aa.print(result.getErrorMessage())
            logDebug('ERROR: ' + result.getErrorMessage())
        }
        logDebug('<<<End updateASITpermitResStatus')

    }

    function updateAsitPermitNumber(permitNumber, rowIndex){
        logDebug('>>>Begin updateAsitPermitNumber')
//     EXAMPLE USAGE
//     var arr = [['0', '30133'], ['2', '30135']]
// var altId = '2024-00014'

// for (i in arr){
//     row = arr[i]
//     rowIndex = row[0]
//     permitNum = row[1]
//     aa.print('Updating Permit Number: ' + permitNum);
//     updateASITpermitStatus(rowIndex)
// }

        var agency = aa.getServiceProviderCode();
    
        var update = "update bappspectable_value \n"+
        "set ATTRIBUTE_VALUE = ? \n"+
        "FROM bappspectable_value t join b1permit p on t.b1_per_id1 = p.b1_per_id1 and t.b1_per_id2 = p.b1_per_id2 and t.b1_per_id3 = p.b1_per_id3 \n" +
        "WHERE p.SERV_PROV_CODE = ? \n" +
        "AND  p.b1_alt_id = ? and t.ROW_INDEX = ? and t.COLUMN_NAME = 'Permit Number' \n" 
        
        var result = aa.db.update(update, [permitNumber,agency, capId.getCustomID(), rowIndex]);
        aa.print(result.getOutput())
        if (result.getSuccess()) {
            var data = result.getOutput();
            logDebug('Successfully updated response status on ASIT')
        } else {
            aa.print(result.getErrorMessage())
            logDebug('ERROR: ' + result.getErrorMessage())
        }
        logDebug('<<<End updateAsitPermitNumber')

    }







    /** 
 * INCLUDES_LOGGING contains enhanced logMessage and logDebug functions for formatting popup windows.
 * @namespace INCLUDES_LOGGING
 * @example Add an eval to INCLUDES_CUSTOM to get INCLUDES_LOGGING
    //Get INCLUDES_LOGGING for formatting message windows.
    eval(getScriptText("INCLUDES_LOGGING", null, false));
*/

function logMessage(dstr)
{
  var vLevel = "info";
  if (arguments.length == 2) {
    vLevel = arguments[1];
  }
  var levelCSS="infoMsg";
  if(vLevel.toUpperCase()=="INFO") levelCSS="alert-info";
  if(vLevel.toUpperCase()=="SUCCESS") levelCSS="alert-success";
  if(vLevel.toUpperCase()=="WARNING") levelCSS="alert-warning";
  if(vLevel.toUpperCase()=="ERROR") levelCSS="alert-danger";
  
  msgFormatted = "<div class=\"" + "alert " + levelCSS + "\">" + dstr + "</div>";
  message += msgFormatted + br;
}

function getMessageStyle(){
  var css = "<style>" + 
  ".overEventWindow { "     +
  "    float: left; " +
  "    clear: both; "     +
  "    position: absolute; "     +
  "    top: 0px; "     +
  "    left: 0px; "     +
  "    padding: 10px; " +
  "    background-color: white; "     +
  "    width: 100%; "     +
  "    height: 100%;  "     +
  "}"   +
  ".overEventWindow i { "   +
  "    display: none; "    +
  "}" +
  " .alert {  "     +
  "    padding: 10px; "     +
  "    border: 1px solid transparent; "     +
  "    border-radius: 4px; "     +
  "}  "     +
  ".alert-success {  "     +
  "    color: #3c763d; "     +
  "    background-color: #dff0d8; "     +
  "    border-color: #d6e9c6; "     +
  "}  "     +
  ".alert-warning { "     +
  "    color: #8a6d3b; "     +
  "    background-color: #fcf8e3; "     +
  "    border-color: #faebcc; "     +
  "} "     +
  ".alert-info { "     +
  "    color: #31708f; "     +
  "    background-color: #d9edf7; "     +
  "    border-color: #bce8f1; "     +
  "} "     +
  ".alert-danger { "     +
  "    color: #a94442; "     +
  "    background-color: #f2dede; "     +
  "    border-color: #ebccd1; "     +
  "} "     +
  ".alert-dismissable, .alert-dismissible {  "     +
  "    padding-right: 35px; "     +
  "}  "     +
  "</style>";
  return css; 
}

var messageCSS = getMessageStyle();
var messageDiv = "<div class='overEventWindow'>";
message += messageCSS;
message += messageDiv;

var timer = "<div>This message will close in <span id=\"time\">15</span> seconds..</div>";
var timerJs = "function startTimer(duration,display){ "+
"console.log('Hello'); " +
"var timer=duration; " +
"var seconds = 15; " +

"setInterval(function(){ seconds=parseInt(timer%60,10); " +
"seconds=seconds<10?'0'+seconds:seconds;if(seconds==0){ " +
"display.textContent='Closing'; " +
"window.close(); " + 
"return true} " +
"display.textContent=seconds; " +
" if(--timer<0){timer=duration}},1000)} " +
"var fiveSeconds=15; " +
"var display=document.querySelector('#time'); " +
"startTimer(fiveSeconds,display);";

var jsImg = "<img style=\"display:none; margin:10px; \" onLoad=\"" + timerJs + "\" src=\"https://www.accela.com/wp-content/uploads/2022/08/accela-nav-icons_cannabis.svg\"></img>"
message += timer + jsImg;
// message +=  jsImg;


/**
 * Example Usage
 * 
if (matches(appTypeString, 'Health/Food Establishment/NA/NA', 'Health/Food Establishment/NA/Renewal')  && wfTask == 'Final Review' && wfStatus == 'Ready to Issue'){
    eval(getScriptText("INCLUDES_LOGGING_CUSTOM", null, false));
   
    var feesArr = loadFees(capId);

    for (var i in feesArr) {
        if (feesArr[i].status == "NEW") {
                showMessage = true;
                showDebug = false;
                logMessage('There are fees assessed, but not invoiced. Invoice fees to continue', 'WARNING');
                cancel = true; 
            break;
        }
    }
}

 */