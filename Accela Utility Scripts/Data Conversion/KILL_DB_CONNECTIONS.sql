/**
find active connections by DB
*/
SELECT 
    DB_NAME(dbid) as DBName, 
    loginame as LoginName
	
FROM
    sys.sysprocesses
WHERE 
    dbid > 0
GROUP BY 
    dbid, loginame
;

/**
use the following to kill connections to a specific DB
*/

/*
USE master;

DECLARE @kill varchar(8000) = '';  
SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), session_id) + ';'  
FROM sys.dm_exec_sessions
WHERE database_id  = db_id('PCR_SUPP')

EXEC(@kill);
*/