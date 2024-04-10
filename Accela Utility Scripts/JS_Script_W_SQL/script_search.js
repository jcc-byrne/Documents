var agency = aa.getServiceProviderCode();

//search scripts

var sql = "select top 1 * from b1permit where b1_alt_id = 'BFOOD-A23-00016' "




var result = aa.db.select(sql,[]);

if (result.getSuccess())

{

  var data = result.getOutput();

  logDebug("Count: " + data.size());

  for (var d = 0; d < data.size(); d++)

  {

    logDebug("Row " + d + ": " + data.get(d));

    if (data.get(d).get("USER_NAME") == "ADMIN")

      logDebug("^^^^^^^^^^^^ this is admin user");

  }

}




 




function logDebug(str) {aa.print(str);}