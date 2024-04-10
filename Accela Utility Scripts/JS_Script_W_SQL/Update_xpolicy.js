var sql = "update xpolicy " +
    //    " set data2 = 'VIRTUALMERCHANT_URL=https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do;' " +
    //    " set data2 = 'VIRTUALMERCHANT_URL=https://api.convergepay.com/VirtualMerchant/processxml.do;' " + //live virtual merchant for PROD

    // " set data3 = 'ssl_merchant_id=0023151;ssl_user_id=apiuser;ssl_pin=UJ8JJVUJOJLDDYI7O3962KUTGAV1SU9YFAOA1P82L5U1F3JL9GSPK50AT3LBP3I3' " +
    " set data3 = 'ssl_merchant_id=0022465;ssl_user_id=EMCWEB;ssl_pin=Y3MZZUKNF1DDWR5D8CFQ8893ZY8WFMWME0C3UF1W61V3TEY35VPYBHKY2VVFHG9U' " + //for PROD

       " where level_data = 'VirtualMerchant_Test' " +
       "  and serv_prov_code = 'EMCITY' ";

var result = aa.db.update(sql, []);

 

aa.print(result.getSuccess());

 

aa.print(result.getOutput());

 

//SolidWasteMGRAPI
//44@Password

 


//SCMN_LODGIN_CHECKLIST3


    // " set data3 = 'ssl_merchant_id=0023151;
    //ssl_user_id=apiuser;
    //ssl_pin=UJ8JJVUJOJLDDYI7O3962KUTGAV1SU9YFAOA1P82L5U1F3JL9GSPK50AT3LBP3I3' " +
