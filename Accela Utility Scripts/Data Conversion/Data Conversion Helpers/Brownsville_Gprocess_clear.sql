/* 	AMT_Agency_Delete_PartialTransactions-Sarasota_SSMS.sql
	2022.10.18 MKH - Copied from AMT_Agency_Delete_PartialTransactions-MULTI.sql and modified to execute under SSMS.  Edit declare statements for your agency.
	2022.10.18 MKH - Added section at bottom for removal of RACCOUNT and F4ACCT_TRANSACTION data for Sarasota.  Adjust or remove for your agency.
 */
USE BROWNSVILLE_SUPP;													-- Enter target database for this remove script
SET QUOTED_IDENTIFIER ON;

DECLARE @SPC VARCHAR(30) = 'BROWNSVILLE';								-- Agency SERV_PROV_CODE
DECLARE @PREDICATE varchar(max) = 'SERV_PROV_CODE = ''BROWNSVILLE'''; 	-- Agency WHERE clause logic
PRINT @PREDICATE;

--SET @PREDICATE = CAST(CAST(N'' AS XML).value('xs:base64Binary(sql:variable("@PREDICATE"))','varbinary(max)') AS nvarchar(max));
DECLARE @sql nvarchar(max)

DROP TABLE IF EXISTS #REMOVE_PER_LIST;
DROP TABLE IF EXISTS #REMOVE_PER_LIST_INVOICE;
DROP TABLE IF EXISTS #REMOVE_PER_LIST_RECEIPT;

SELECT SERV_PROV_CODE,B1_PER_ID1,B1_PER_ID2,B1_PER_ID3,B1_ALT_ID INTO #REMOVE_PER_LIST FROM B1PERMIT WHERE 1=2;
SET @sql = N'INSERT INTO #REMOVE_PER_LIST(SERV_PROV_CODE,B1_PER_ID1,B1_PER_ID2,B1_PER_ID3,B1_ALT_ID) SELECT SERV_PROV_CODE,B1_PER_ID1,B1_PER_ID2,B1_PER_ID3,B1_ALT_ID FROM B1PERMIT WHERE ' + @PREDICATE;
PRINT @SQL;

EXEC sp_executesql @sql
 
PRINT 'DELETE FROM GPROCESS_RPT';
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_RPT
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_RPT.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_RPT.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_RPT.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_RPT.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted';
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_PROXIMITY_ALERTS';
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_PROXIMITY_ALERTS
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_PROXIMITY_ALERTS.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_PROXIMITY_ALERTS.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_PROXIMITY_ALERTS.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_PROXIMITY_ALERTS.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted';
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_PROXIMITY_ALERTS_AUT';
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_PROXIMITY_ALERTS_AUT
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_PROXIMITY_ALERTS_AUT.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_PROXIMITY_ALERTS_AUT.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_PROXIMITY_ALERTS_AUT.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_PROXIMITY_ALERTS_AUT.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_NOTE'
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_NOTE
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_NOTE.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_NOTE.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_NOTE.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_NOTE.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_VALIDATION'
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_VALIDATION
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_VALIDATION.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_VALIDATION.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_VALIDATION.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_VALIDATION.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_HISTORY'
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_HISTORY
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_HISTORY.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_HISTORY.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_HISTORY.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_HISTORY.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_GROUP'
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_GROUP
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_GROUP.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_GROUP.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_GROUP.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_GROUP.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT '-----------------------------------------';
PRINT 'DELETE FROM GPROCESS'
DELETE FROM GPROCESS
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';

PRINT 'DELETE FROM GPROCESS_SPEC_INFO'
PRINT '-----------------------------------------';
DELETE FROM GPROCESS_SPEC_INFO
WHERE EXISTS
( SELECT 1 FROM #REMOVE_PER_LIST B
  WHERE GPROCESS_SPEC_INFO.SERV_PROV_CODE = B.SERV_PROV_CODE
    AND GPROCESS_SPEC_INFO.B1_PER_ID1 = B.B1_PER_ID1
    AND GPROCESS_SPEC_INFO.B1_PER_ID2 = B.B1_PER_ID2
    AND GPROCESS_SPEC_INFO.B1_PER_ID3 = B.B1_PER_ID3
);
PRINT FORMAT(@@ROWCOUNT,'N0') + ' row(s) deleted'
PRINT '-----------------------------------------';