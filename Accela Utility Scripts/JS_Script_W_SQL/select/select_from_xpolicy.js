//var sql = "select top 10 * from b3parcel where serv_prov_code = 'SCMN' order by rec_date desc";
//var sql = "select top 10 * from l1condit where serv_prov_code = 'SOUTHBENDIN' and l1_parcel_nbr = '71-08-10-428-017.000-026' and l1_con_des = 'Continuous Enforcement' and l1_con_status = 'Applied' order by rec_date desc";
var sql = "select * from xpolicy where SERV_PROV_CODE = 'PARTNER19' and LEVEL_DATA LIKE '%Pay%'";
//var sql = "select * from l1condit where serv_prov_code = 'Pittsburg' and l1_parcel_nbr = '71-03-14-403-002.000-004'";
var result = aa.db.select(sql,[]);
if (result.getSuccess()){
    var data = result.getOutput();
    for (var d = 0; d < data.size(); d++)
    {
        aa.print(data.size())
        aa.print(data.get(d));
    }
}
else{
    aa.print(result.getErrorMessage());
}

 

//{SERV_PROV_CODE=EMCITY, POLICY_SEQ=338247, POLICY_NAME=PaymentAdapterSec, LEVEL_TYPE=Adapter, LEVEL_DATA=VirtualMerchant_Test, DATA1=Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl, RIGHT_GRANTED=F, STATUS=A, DATA2=VIRTUALMERCHANT_URL=https://www.myvirtualmerchant.com/VirtualMerchant/process.do;SSL_TEST_MODE=TRUE, DATA3=ssl_merchant_id=2184372;ssl_user_id=EMCWEB;ssl_pin=ULBR3LW1AB4NGUVUV60EK97R78LISQC5I9HQK8GHLJF6IKYHLILWND12TXAVB96T, DATA4=CountryCode=US, MENU_LEVEL=, REC_DATE=2021-04-19 15:27:28.813, REC_FUL_NAM=ADMIN, REC_STATUS=A, MENUITEM_CODE=, DATA5=, RES_ID=0}

//02/13/2023 result
//{SERV_PROV_CODE=EMCITY, POLICY_SEQ=338580, POLICY_NAME=PaymentAdapterSec, LEVEL_TYPE=Adapter, LEVEL_DATA=VirtualMerchant_Test, DATA1=Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl, RIGHT_GRANTED=F, STATUS=A, DATA2=VIRTUALMERCHANT_URL=https://www.myvirtualmerchant.com/VirtualMerchant/process.do;SSL_TEST_MODE=TRUE, DATA3=ssl_merchant_id=2184372;ssl_user_id=EMCWEB;ssl_pin=ULBR3LW1AB4NGUVUV60EK97R78LISQC5I9HQK8GHLJF6IKYHLILWND12TXAVB96T, DATA4=CountryCode=US, MENU_LEVEL=, REC_DATE=2021-04-19 15:27:28.813, REC_FUL_NAM=ADMIN, REC_STATUS=A, MENUITEM_CODE=, DATA5=, RES_ID=0}

//02/13/2023 set PROD credentials
//{SERV_PROV_CODE=EMCITY, POLICY_SEQ=338580, POLICY_NAME=PaymentAdapterSec, LEVEL_TYPE=Adapter, LEVEL_DATA=VirtualMerchant_Test, DATA1=Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl, RIGHT_GRANTED=F, STATUS=A, DATA2=VIRTUALMERCHANT_URL=https://api.convergepay.com/VirtualMerchant/processxml.do;, DATA3=ssl_merchant_id=0022465;ssl_user_id=apiuser;ssl_pin=Y3MZZUKNF1DDWR5D8CFQ8893ZY8WFMWME0C3UF1W61V3TEY35VPYBHKY2VVFHG9U, DATA4=CountryCode=US, MENU_LEVEL=, REC_DATE=2021-04-19 15:27:28.813, REC_FUL_NAM=ADMIN, REC_STATUS=A, MENUITEM_CODE=, DATA5=, RES_ID=0}


//1
//{leveltype=Adapter, level_data=VirtualMerchant_Test, data1=Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl, data2=VIRTUALMERCHANT_URL=https://demo.myvirtualmerchant.com/VirtualMerchantDemo/process.do;SSL_TEST_MODE=FALSE, data3=ssl_merchant_id=2197368;ssl_user_id=CITYweb;ssl_pin=S8DL4ERT23EFG4AXSJAXBTQLTY28ALEMWCJJOFAYCBANCLT8PJXWIWXL7GUFZ5GY, data4=CountryCode=US}

{SERV_PROV_CODE=VISALIA, POLICY_SEQ=2484, POLICY_NAME=PaymentAdapterSec, LEVEL_TYPE=Adapter, LEVEL_DATA=PayPal43_Test, DATA1=Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/PayPalPayflowPro43?wsdl, RIGHT_GRANTED=F, STATUS=A, DATA2=HOSTADDRESS=pilot-payflowpro.paypal.com;HOSTPORT=443;TIMEOUT=100;PROXYADDRESS=;PROXYPORT=;PROXYLOGON=;PROXYPASSWORD=, DATA3=PARTNER=VeriSign;VENDOR=cityofvisalia;USER_NAME=APIAccelaAutomation;PASSWORD=qYpVH4JEZj7j87Vx;CHECKPARTNER=VeriSign;CHECKVENDOR=cityofvisalia;CHECKUSER_NAME=APIAccelaAutomation;CHECKPASSWORD=qYpVH4JEZj7j87Vx, DATA4=CountryCode=US; TotalAmountFormula=1,1,0,1,999999,999999; ConvenienceFeeFormula=0.03,1,0,0,9999999,999999, MENU_LEVEL=, REC_DATE=2018-01-10 09:38:03.827, REC_FUL_NAM=ADMIN, REC_STATUS=A, MENUITEM_CODE=, DATA5=, RES_ID=0}
