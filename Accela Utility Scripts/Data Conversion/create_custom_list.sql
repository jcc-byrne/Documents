IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AAA_COMMENTS_ASIT')
BEGIN
	DROP TABLE AAA_COMMENTS_ASIT
END
go

CREATE TABLE AAA_COMMENTS_ASIT (
PERMITNUM varchar(40)
,tt_record varchar(255)
,row_num numeric
,commentType varchar(255)
,commentDescription varchar(MAX)
)

INSERT INTO AAA_COMMENTS_ASIT
select 
PERMITNUM
,tt_record
,row_number() over(partition by PERMITNUM  order by PERMITNUM)
,commentType
,commentDescription

from AATABLE_PERMIT_COMMENT