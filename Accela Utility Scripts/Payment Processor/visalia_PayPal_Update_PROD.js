var selectResult = sbcoSelectSingleRecord("REC18","00000","00004"); // REC18-00000-00025
aa.print(selectResult);
function sbcoSelectSingleRecord(pId1, pId2, pId3)
{
    var vReturnValue = false;        
    //ORACLE
    /*cSql =  "DECLARE HAVE_ADAPTER_REC NUMBER; " +
            " SEQ NUMBER; " +
            " AGENCY_ID VARCHAR2(200); " +
            " ADAPTER_NAME VARCHAR2(50); " +
            " ADAPTER_CONF VARCHAR2(1000); " + 
            " PROXY_CONF VARCHAR2(1000); " +
            " GATEWAY_CONF VARCHAR2(1000); " +
            " MERCHANT_CONF VARCHAR2(1000); " +
            " PAYMENT_CONF VARCHAR2(1000); " +
            " BEGIN AGENCY_ID :='BREA'; " +
            " MERCHANT_CONF :='PARTNER=PayPal; VENDOR=Brea123; USER_NAME=cityofbrea; PASSWORD=May232001; CHECKPARTNER=; CHECKVENDOR=; CHECKUSER_NAME=; CHECKPASSWORD='; " + 
            " PROXY_CONF :='PROXYADDRESS=;PROXYPORT=;PROXYLOGON=;PROXYPASSWORD='; " + 
            " PAYMENT_CONF :='CountryCode=US'; " + 
            " ADAPTER_NAME :='PayPal43_Test'; " + 
            " ADAPTER_CONF :='Adapter=EPayments3; " + 
            " AdapterURL=${av.biz.url}/av-epayments3-adapters/PayPalPayflowPro43?wsdl'; " +
            " GATEWAY_CONF :='HOSTADDRESS=pilot-payflowpro.paypal.com;HOSTPORT=443;TIMEOUT=100;'; " + 
            " HAVE_ADAPTER_REC :=0; SELECT count(*) into HAVE_ADAPTER_REC FROM XPOLICY WHERE SERV_PROV_CODE = AGENCY_ID AND POLICY_NAME = 'PaymentAdapterSec' AND LEVEL_TYPE = 'Adapter' AND LEVEL_DATA = ADAPTER_NAME; IF (HAVE_ADAPTER_REC <= 0) THEN  SELECT T.LAST_NUMBER INTO SEQ FROM AA_SYS_SEQ T WHERE T.SEQUENCE_NAME = 'XPOLICY_SEQ'; SEQ := SEQ + 1; INSERT INTO XPOLICY (SERV_PROV_CODE, POLICY_SEQ, POLICY_NAME, LEVEL_TYPE, LEVEL_DATA, DATA1, RIGHT_GRANTED, STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, MENUITEM_CODE, DATA2, DATA3, DATA4, MENU_LEVEL, DATA5, RES_ID) VALUES (AGENCY_ID, SEQ, 'PaymentAdapterSec', 'Adapter', ADAPTER_NAME, ADAPTER_CONF, 'F', 'A', SYSDATE, 'ADMIN', 'A', '', GATEWAY_CONF , MERCHANT_CONF, PAYMENT_CONF, '', '', ''); UPDATE AA_SYS_SEQ SET LAST_NUMBER = SEQ WHERE SEQUENCE_NAME = 'XPOLICY_SEQ'; END IF; UPDATE XPOLICY SET DATA1=ADAPTER_CONF, DATA2=GATEWAY_CONF , DATA3=MERCHANT_CONF, DATA4=PAYMENT_CONF, REC_DATE=SYSDATE, REC_FUL_NAM='ADMIN' WHERE SERV_PROV_CODE = AGENCY_ID AND POLICY_NAME = 'PaymentAdapterSec' AND LEVEL_TYPE = 'Adapter' AND LEVEL_DATA = ADAPTER_NAME; COMMIT; END;"
    */        
    //cSql = "UPDATE AGIS_SERVICE SET GIS_SERVICE_ID = 'Accela/Accela_Basemap' where  Agency = '443' and GIS_SERVICE_ID = 'Accela/Accela_Basemap2'";
    
    //cSql = "update XPOLICY "

    //SSRS
    cSql = " BEGIN " +
            " DECLARE @HAVE_ADAPTER_REC    BIGINT " +
            " DECLARE @SEQ BIGINT " +
            " DECLARE @AGENCY_ID VARCHAR(200) " +
            " DECLARE @ADAPTER_NAME VARCHAR(50) " +
            " DECLARE @ADAPTER_CONF VARCHAR(1000) " +
            " DECLARE @GATEWAY_CONF VARCHAR(1000) " +
            " DECLARE @PROXY_CONF   VARCHAR(1000) " +
            " DECLARE @MERCHANT_CONF VARCHAR(1000) " +
            " DECLARE @PAYMENT_CONF VARCHAR(1000) " +
            " set @AGENCY_ID  ='VISALIA' " +    
            " set @PROXY_CONF ='PROXYADDRESS=;PROXYPORT=;PROXYLOGON=;PROXYPASSWORD=' " +
            " set @MERCHANT_CONF  ='PARTNER=verisign;VENDOR=cityofvisalia;USER_NAME=APIAccelaAutomation;PASSWORD=lujiWB%*F4ZC8V66; CHECKPARTNER=verisign;CHECKVENDOR=cityofvisalia;CHECKUSER_NAME=APIAccelaAutomation;CHECKPASSWORD=lujiWB%*F4ZC8V66' " +
            " set @PAYMENT_CONF   ='CountryCode=US' " +
            " set @ADAPTER_NAME   ='PayPal43' " +
            " set @ADAPTER_CONF   ='Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/PayPalPayflowPro43?wsdl' " +
            " set @GATEWAY_CONF   ='HOSTADDRESS=payflowpro.paypal.com;HOSTPORT=443;TIMEOUT=100;' " +

            " set @HAVE_ADAPTER_REC =0 " +
            " SELECT @HAVE_ADAPTER_REC = count(*) " +
            " FROM XPOLICY " +
            " WHERE SERV_PROV_CODE = @AGENCY_ID " +
            " AND POLICY_NAME = 'PaymentAdapterSec' " +
            " AND LEVEL_TYPE = 'Adapter' " +
            " AND LEVEL_DATA = @ADAPTER_NAME " +
            " IF (@HAVE_ADAPTER_REC <= 0) " +
            " BEGIN " +
        
            " SELECT @SEQ=T.LAST_NUMBER " +     
            " FROM AA_SYS_SEQ T " +
            " WHERE T.SEQUENCE_NAME = 'XPOLICY_SEQ' " +

            " SET @SEQ = @SEQ + 1 " +

            " INSERT INTO XPOLICY " +
            " (SERV_PROV_CODE, POLICY_SEQ, POLICY_NAME, LEVEL_TYPE, LEVEL_DATA, DATA1, RIGHT_GRANTED, " +
            " STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, MENUITEM_CODE, DATA2, DATA3, DATA4, MENU_LEVEL, " +
            " DATA5, RES_ID) " +
            " VALUES " +
            " (@AGENCY_ID, @SEQ, 'PaymentAdapterSec', 'Adapter', @ADAPTER_NAME, @ADAPTER_CONF, 'F', " +
            " 'A', GETDATE(), 'ADMIN', 'A', '', @GATEWAY_CONF + @PROXY_CONF, @MERCHANT_CONF, @PAYMENT_CONF, " +
            " '', '', '') " +

            " UPDATE AA_SYS_SEQ SET LAST_NUMBER = @SEQ WHERE SEQUENCE_NAME = 'XPOLICY_SEQ' " +
            " END " +

            " UPDATE XPOLICY " +
            " SET " +
            " DATA1=@ADAPTER_CONF, " +
            " DATA2=@GATEWAY_CONF + @PROXY_CONF, " +
            " DATA3=@MERCHANT_CONF, " +
            " DATA4=@PAYMENT_CONF, " +
            " REC_DATE=GETDATE(), " +
            " REC_FUL_NAM='ADMIN' " +
            " WHERE SERV_PROV_CODE = @AGENCY_ID " +
            " AND POLICY_NAME = 'PaymentAdapterSec' " +
            " AND LEVEL_TYPE = 'Adapter' " +
            " AND LEVEL_DATA = @ADAPTER_NAME " +
            " END ";
        //" GO ";

    

    try
    {
        var vInitialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();  // javax.naming Class javax.naming.InitialContext 
        var vDs = vInitialContext.lookup("java:/AA"); //javax.sql Interface DataSource
        var vConn = vDs.getConnection(); // java.sql Interface Connection
        var vQuery = vConn.createStatement(java.sql.ResultSet.TYPE_FORWARD_ONLY,
                        java.sql.ResultSet.CONCUR_READ_ONLY); // java.sql Interface Statement
        vReturnValue = vQuery.executeUpdate(cSql); 
                              
        if (!vReturnValue)
        {
            aa.print("*****Info: No rows were found.");
        }
        else
        {
            aa.print("*****Info: Rows were found.");
        }
    
    }
    catch (err)
    {
        aa.print("*****Error: " + err.message + " In line " + err.lineNumber);
        aa.print("Stack: " + err.stack);
    }
    finally
    {
        aa.print("Closing resources");
    
        if (vQuery != null)
        {
            vQuery.close();
        }
        
        if (vConn != null)
        {
            vConn.close();
        }
        
        if (vInitialContext != null)
        {
            vInitialContext.close();
        }
        
        return vReturnValue;
    }
}