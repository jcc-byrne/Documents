
var agency = aa.getServiceProviderCode();

var update = "update BPERMIT_DETAIL \n" +
"set BALANCE = 0 \n" + 
"from BPERMIT_DETAIL d \n" +
"join (select B1_PER_ID1, B1_PER_ID2, B1_PER_ID3, \n" +
"sum(PAYMENT_AMOUNT) as field2sum from F4PAYMENT \n"+
"group by B1_PER_ID1, B1_PER_ID2, B1_PER_ID3) as t2 \n"+
"on d.B1_PER_ID1 = t2.B1_PER_ID1 and d.B1_PER_ID2 = t2.B1_PER_ID2 and d.B1_PER_ID3 = t2.B1_PER_ID3 \n"+
"join b1permit b on 1=1 and d.B1_PER_ID1 = b.B1_PER_ID1 and d.B1_PER_ID2 = b.B1_PER_ID2 and d.B1_PER_ID3 = b.B1_PER_ID3 \n"+
"where t2.field2sum > 0 and d.serv_prov_code = ? \n" + 
"and b.b1_alt_id = 'RNW-2022-00000332' " 


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());