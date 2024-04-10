var agency = aa.getServiceProviderCode(); aa.print(agency)
var sql = "SELECT top 100 d.* \n" +
"FROM XRECORD_CONTACT_ENTITY d \n" +
"WHERE d.SERV_PROV_CODE = ?  \n" 
var result = aa.db.select(sql,[agency]);


aa.print('Getting sql');
// exploreObject(result)
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
} else {
    aa.print(result.getErrorMessage())
}

function logDebug(str){
    aa.print(str);
}


function exploreObject(objExplore) {
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
    logDebug('');
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
  }