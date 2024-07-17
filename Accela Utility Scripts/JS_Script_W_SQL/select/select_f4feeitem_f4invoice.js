

var sql = "SELECT A.SERV_PROV_CODE, A.B1_ALT_ID,I.INVOICE_NBR,I.INVOICE_CUSTOMIZED_NBR,i.BALANCE_DUE,I.INVOICE_AMOUNT,B.GF_UNIT,B.GF_FEE,b.feeitem_seq_nbr \n"+
 " FROM     dbo.B1PERMIT AS A INNER JOIN \n"+
  "dbo.F4FEEITEM AS B ON A.SERV_PROV_CODE = B.SERV_PROV_CODE AND A.B1_PER_ID1 = B.B1_PER_ID1 AND A.B1_PER_ID2 = B.B1_PER_ID2 AND A.B1_PER_ID3 = B.B1_PER_ID3 LEFT OUTER JOIN \n"+
 "dbo.X4FEEITEM_INVOICE AS X ON B.SERV_PROV_CODE = X.SERV_PROV_CODE AND B.B1_PER_ID1 = X.B1_PER_ID1 AND B.B1_PER_ID2 = X.B1_PER_ID2 AND B.B1_PER_ID3 = X.B1_PER_ID3 AND  \n"+
 " B.FEEITEM_SEQ_NBR = X.FEEITEM_SEQ_NBR  \n"+
  "LEFT OUTER JOIN dbo.F4INVOICE AS I ON X.SERV_PROV_CODE = I.SERV_PROV_CODE AND X.INVOICE_NBR = I.INVOICE_NBR  \n"+
"WHERE  a.B1_ALT_ID ='24-026318-000-00-HO' and a.serv_prov_code = ? \n"

try {
    var agency = aa.getServiceProviderCode();
    // var sql = 'select top 100 * from bpermit_detail where serv_prov_code = ? and balance < 0';
    var result = aa.db.select(sql, [agency])

    if (result.getSuccess()) {
        var data = result.getOutput();
        logDebug("Count:" + data.size());
        for (var d = 0; d < data.size(); d++) {
            logDebug("Row " + d + ": " + data.get(d));
        }
    } else {
        aa.print(result.getErrorMessage())
    }



} catch (error) {
    logDebug(error)
}

function logDebug (str){aa.print(str)};