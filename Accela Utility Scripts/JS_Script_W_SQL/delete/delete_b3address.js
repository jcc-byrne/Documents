  /**
   * OWNER CLEAR
   */

var agency = aa.getServiceProviderCode();

var update = "delete b3owners where b1_per_id1 like '%HIS%' and serv_prov_code = ? \n" 

var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total

}
else
  aa.print(result.getErrorMessage());

  /**
   * ADDRESS CLEAR
   */
  
var agency = aa.getServiceProviderCode();

var update = "delete b3addres where b1_per_id1 like '%HIS%' and serv_prov_code = ? \n" 


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total

}
else
  aa.print(result.getErrorMessage());




  
var agency = aa.getServiceProviderCode();

var update = "select top 100 * from b3owners where serv_prov_code = ? and b1_per_id1 like '%HIS%' \n" 

var result = aa.db.select(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); 
}
else
  aa.print(result.getErrorMessage());


  