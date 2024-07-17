var agency = aa.getServiceProviderCode();

var update = "update bappspectable_value \n"+
"set attribute_value = 'See Comments' where len(attribute_value) = 4000 and b1_per_id1 like '%HIS%' \n" +
"  and serv_prov_code = ? " 

var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());

