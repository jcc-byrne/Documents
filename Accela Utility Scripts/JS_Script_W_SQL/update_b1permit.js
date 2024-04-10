try {
  var agency = aa.getServiceProviderCode();

  var update = "update b1permit set b1_file_dd = '2024-01-01' where b1_alt_id in ('HRNT24-0002', 'HRNT24-0004') and serv_prov_code = ? \n" 
   
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

