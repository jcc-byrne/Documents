
try {
    var newSeqNumber = Number(getLastSeqNum()) + 1

    updateXpolicy(newSeqNumber);


    var updateSeqNum = updateLastSeqNum(newSeqNumber);

} catch (error) {
    logDebug(error)
}

function logDebug (str){aa.print(str)};

function getLastSeqNum(){

    var agency = aa.getServiceProviderCode();
    var sql = "select last_number from AA_SYS_SEQ where SEQUENCE_NAME = 'XPOLICY_SEQ' ";
    var result = aa.db.select(sql, [])

    if (result.getSuccess()) {
        var data = result.getOutput();
        // logDebug("Count:" + data.size());

        for (var d = 0; d < data.size(); d++) {
            
            logDebug("Row " + d + ": " + data.get(d));
            // aa.print(data.get(d).get("last_number"))
            lastNum = data.get(d).get("last_number")
            return lastNum
        }
    } else {
        aa.print(result.getErrorMessage())
    }





}

function updateLastSeqNum(newNum){
    var sql = "UPDATE AA_SYS_SEQ SET LAST_NUMBER = ? WHERE SEQUENCE_NAME = 'XPOLICY_SEQ' ";

var result = aa.db.update(sql, [newNum]);
aa.print('Updated SEQ: ' + result.getSuccess());
// aa.print(result.getOutput());
}


//TODO if value exists in XPOLICY already update the existing record
function updateXpolicyIfExists(){
    if (1 == 1){
        //adapter exists, update settings
        return true;
    } else if (1 ==2){

        //adapter does not exist on XPOLICY, insert a new one
        updateXpolicy();
    }
}

function updateXpolicy(seqNbr){
    var servProv = 'PCR';
    var policy_seq = seqNbr;
    var policy_name = 'PaymentAdapterSec';
    var level_Type = 'Adapter';
    var LEVEL_DATA = 'VirtualMerchant_Live';
    var DATA1 = 'Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl';
    var RIGHT_GRANTED = 'F';
    var STATUS = 'A';
    var REC_FUL_NAM = 'ADMIN';
    var REC_STATUS = 'A';
    var MENUITEM_CODE = '';
    var DATA2 = 'VIRTUALMERCHANT_URL=https://www.myvirtualmerchant.com/VirtualMerchant/process.do;SSL_TEST_MODE=FALSE';
    var DATA3 = 'ssl_merchant_id=743486;ssl_user_id=CIVICLIFEAPI;ssl_pin=T3TRSPYGP4VZK0K5E4QUX35BD441QBU2RXR44ST3LUPP3K8MN8ZO4Q167YTJ0SJH';
    var DATA4 = 'CountryCode=US';
    var MENU_LEVEL = '';
    var DATA5 = '';
    var RES_ID = '';

    
    var sql = " INSERT INTO XPOLICY " +
    " (SERV_PROV_CODE, POLICY_SEQ, POLICY_NAME, LEVEL_TYPE, LEVEL_DATA, DATA1, RIGHT_GRANTED, " +
    " STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, MENUITEM_CODE, DATA2, DATA3, DATA4,  " +
    " MENU_LEVEL, DATA5, RES_ID) " +
    " VALUES " +
    " (?, ?, ?, ?, ?, ?, ?, " + 
    " ?, GETDATE(), ?, ?, ?, ?, ?, ?, " + 
    " ?, ?, ?) "  

var result = aa.db.update(sql, [servProv, policy_seq, policy_name, level_Type, LEVEL_DATA, DATA1, RIGHT_GRANTED, STATUS, REC_FUL_NAM, REC_STATUS, MENUITEM_CODE, DATA2, DATA3, DATA4, MENU_LEVEL, DATA5, RES_ID]);

if (result.getSuccess()) {
    aa.print("Number of rows inserted:" + result.getOutput());
} else aa.print(result.getErrorMessage());
aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();

}

}