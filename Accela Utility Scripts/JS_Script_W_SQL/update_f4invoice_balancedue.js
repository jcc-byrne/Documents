
var agency = aa.getServiceProviderCode();

var update = "update F4INVOICE set BALANCE_DUE = s.balance - ii.BALANCE_DUE \n"+
"from (select sum(a.tran_amount) as balance, a.INVOICE_NBR as inv_nbr from ACCOUNTING_AUDIT_TRAIL a \n"+
"join F4INVOICE i on a.INVOICE_NBR = i.INVOICE_NBR and a.ACTION = 'Payment Applied' group by a.INVOICE_NBR) s \n"+
"join F4INVOICE ii on s.inv_nbr = ii.INVOICE_NBR where ii.INVOICE_NBR not in ('512200','512202','512808','525330','531587','546315', \n"+
"'554595','554619','557502','558274','576242','640662','640835') \n" +
"and ii.AUDIT_MOD_DATE < '12-12-2022' and ii.AUDIT_MOD_BY = 'AACONV' and ii.AUDIT_INIT_DATE < '12-12-2022' and ii.AUDIT_INIT_BY = 'AACONV' \n"+
"and ii.BALANCE_DUE > 0 and ii.serv_prov_code = ? "

var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); 
}
else
  aa.print(result.getErrorMessage());