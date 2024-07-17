var agency = aa.getServiceProviderCode();

var update = "update b3addres \n"+
"set b1_hse_nbr_start = b1_hse_nbr_alpha_start where serv_prov_code = ? and ISNUMERIC(b1_hse_nbr_alpha_start) = 1 \n" 
 
var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());