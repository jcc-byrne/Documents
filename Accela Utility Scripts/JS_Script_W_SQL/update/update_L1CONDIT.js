try {
  var agency = aa.getServiceProviderCode();

  var update = "update l1condit set rec_status = 'I' where l1_con_nbr = '15425731' and serv_prov_code = ? \n" 
   
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

