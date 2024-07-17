var batchJobName = 'BATCH_ABOUT_TO_EXP_COMPOST';
var servProvCode = 'SCMN'

//have to stop the job fist before killing via SQL
var result = selectBatchJob(batchJobName, servProvCode);

for (r in result){
  aa.print(r + " : " + result[r]["BATCH_JOB_NAME"] + " " + result[r]["INSTANCE_NO"]);
}
 
aa.print(updateBatchJob(batchJobName, servProvCode));

var cacheService = new com.accela.diagnostics.CacheService();
aa.print(cacheService.clearAllCaches());




function selectBatchJob(jobName, servProv) {
  var sql ="SELECT B.BATCH_JOB_NAME, B.BATCH_JOB_STATUS, B.INSTANCE_NO, B.BATCH_JOB_STATE FROM \n" +
            "BATCH_JOB B WHERE B.BATCH_JOB_NAME = ? AND B.SERV_PROV_CODE = ? ";

  // aa.print("sql: " + sql);

  var result = aa.db.select(sql,[jobName, servProv]);
  
  var rArray = [];


  aa.print(result.getOutput())
  if (result.getSuccess()) {
      var data = result.getOutput();
      aa.print("Count:" + data.size());
      for (var d = 0; d < data.size(); d++) {
          var recordObject = {
              "BATCH_JOB_NAME": data.get(d).get("BATCH_JOB_NAME"),
                       "INSTANCE_NO": data.get(d).get("INSTANCE_NO")
          };
          rArray.push(recordObject);
      }
  } else {
      aa.print(result.getErrorMessage())
  }

  return rArray;
}

function updateBatchJob(jobName, servProv)
{
  var sql = "UPDATE BATCH_JOB SET INSTANCE_NO = NULL, BATCH_JOB_STATE = NULL WHERE BATCH_JOB_NAME = ? AND SERV_PROV_CODE = ? ";
  var result = aa.db.update(sql, [jobName, servProv]);
    
  if (result.getSuccess())
  {
    aa.print(result.getOutput()); 
  
  }
  else
    aa.print(result.getErrorMessage());

      return result;
}