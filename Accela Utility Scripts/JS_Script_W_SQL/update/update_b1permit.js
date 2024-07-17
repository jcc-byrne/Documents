try {
  var agency = aa.getServiceProviderCode();

  var update = "update b1permit set B1_ACCESS_BY_ACA = 'Y' where b1_alt_id in ('C-23-002-2') and serv_prov_code = ? \n" 
   
  var result = aa.db.update(update, [agency]);
  
  if (result.getSuccess())
  {
    aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
  }
  else
    aa.print(result.getErrorMessage());
} catch(err){
aa.print(err)
}

