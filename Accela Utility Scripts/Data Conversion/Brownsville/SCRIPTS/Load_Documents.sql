
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AAA_PERMIT_DOCUMENTS')
BEGIN
	DROP TABLE AAA_PERMIT_DOCUMENTS
END
go

CREATE TABLE AAA_PERMIT_DOCUMENTS (
	PERMIT_ID varchar(255),
	HIST_PERMITNUM varchar(255),
	NEW_PERMITNUM varchar(255),
	PERMIT_TYPE varchar(255),
	PERMIT_TYPE_DESC varchar(255),
	DOCUMENT_ID varchar(255),
	FILE_EXT varchar(255),
	FILE_DESC varchar(255),
	CREATE_DATE varchar(255),
	FILE_PATH varchar(255)
	);

INSERT INTO AAA_PERMIT_DOCUMENTS (
	PERMIT_ID ,
	HIST_PERMITNUM,
	NEW_PERMITNUM ,
	PERMIT_TYPE ,
	PERMIT_TYPE_DESC ,
	DOCUMENT_ID ,
	FILE_EXT ,
	FILE_DESC ,
	CREATE_DATE,
	FILE_PATH
)
SELECT 
		pd.PermitID
		,pd.permitNumber
		,pn.PERMITNUM
		,pn.PermitTypeCode
		,pn.PermitTypeDescription
		,pd.DocumentID
		,pd.fileExtension
		,pd.Description
		,pd.CreateTime
		,null 

FROM [dbo].[AAA_PermitNum] pn
JOIN [dbo].[Permit_Documents] pd on 1=1
and pd.permitid = pn.PermitID

GO


