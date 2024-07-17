

var agency = aa.getServiceProviderCode();

var sql = "select RPT_CATEGORY_ID, CATEGORY_NAME from RPT_CATEGORY where SERV_PROV_CODE = ? AND CATEGORY_NAME = ? \n" 

var result = aa.db.select(sql,[agency, 'For Mobile']);

//return all the report ID

var rptCategoryID = ''


var sql = "select REPORT_ID, REPORT_NAME from RPT_DETAIL where CATEGORY_ID = ? order by REPORT_NAME  \n" 

var result = aa.db.select(sql,[agency, rptCategoryID]);

var reportIdArray = [];

for (i in reportIdArray){
    rptID = reportIdArray[i]



}



var agency = aa.getServiceProviderCode();
var sql = "select REPORT_ID, REPORT_NAME from RPT_DETAIL where CATEGORY_ID = ? order by REPORT_NAME  \n" 

var result = aa.db.select(sql,[agency, 39]);




var update = "alter table XRPT_PORTLET  nocheck  constraint all  \n"+
"update XRPT_PORTLET \n" +
"set REPORT_ID = 867  \n" + 
"where REPORT_ID = 827 and SERV_PROV_CODE = ? \n" +
"alter table XRPT_PORTLET with check check constraint all "

 
var result = aa.db.update(update, [aa.getServiceProviderCode(),]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); 
}
else
  aa.print(result.getErrorMessage());


