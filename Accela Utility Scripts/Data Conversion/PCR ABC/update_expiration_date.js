
var agency = aa.getServiceProviderCode();

var update = "update b1_expiration \n" +
"set expiration_date = null \n" + 
"from b1_expiration  \n" +
" where expiration_date > '01/01/2099' and expiration_status = 'Active' and serv_prov_code = ? \n" 
var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());