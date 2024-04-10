/**
 * After a module is created, existing users will not have access to the module unless manually updated via the user settings. This script allows for a batch update to the user group. 
 * 
 * update the variables with the appropriate module, serv prov code, and group sequence number.
 * 
 * Group sequence number can be found by querying dbo.PPROV_GROUP or checking the module under a users profile in classic admin. Sequence number found in the User Group, e.g. 578-CannabisPublicUser
 * 
 * 06/05/2023 - original development used for Fresno - JCC
 */

// CHANGE PARAMETERS BELOW HERE
var newModule = 'PropertyStnds'
var agencyServProvCode = 'EVANSTON'
// var userNameLike = 'PUBLICUSER10004' //USE A SPECIFIC USER IN THE SYSTEM FOR TESTING
var userNameLike = 'PUBLICUSER%'
var userGroupSeqNbr = '3661';


//DO NOT UPDATE THE CODE BELOW
var sql = "select distinct user_name from puser_group where user_name not in (select user_name from puser_group where module_name = ?) and serv_prov_code = ? and user_name like ? \n" 

var result = aa.db.select(sql, [newModule, agencyServProvCode, userNameLike]);
if (result.getSuccess()) {
    aa.print("Number of rows inserted:" + result.getOutput());
} else aa.print(result.getErrorMessage());
aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();

    aa.print("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        var userName = data.get(d).get('user_name');
        aa.print(userName);
        insertUser(userName);
    }
}

function insertUser(uName){
    var sql = "insert into puser_group (USER_NAME, SERV_PROV_CODE, GROUP_SEQ_NBR, MODULE_NAME, REC_DATE, REC_FUL_NAM, REC_STATUS) \n "+
"VALUES (?, ?, ?, ?, getdate(), 'ADMIN', 'A') \n" 
var result = aa.db.update(sql, [uName, agencyServProvCode, userGroupSeqNbr, newModule]);
if (result.getSuccess()) {
    aa.print("Number of rows inserted:" + result.getOutput());
} else aa.print(result.getErrorMessage());
aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
}
}