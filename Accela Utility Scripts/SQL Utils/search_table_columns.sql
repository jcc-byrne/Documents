SELECT      c.name  AS 'ColumnName'
            ,t.name AS 'TableName'
FROM        sys.columns c
JOIN        sys.tables  t   ON c.object_id = t.object_id
WHERE       c.name LIKE '%ColumnNameToSearchFor%'
ORDER BY    TableName, ColumnName;

/* 

//For JavaScript

var sql = "c.name AS 'ColumnName', t.name AS 'TableName' \n" +
"FROM sys.columns c \n" + 
"JOIN sys.tables t ON c.object_id = t.object_id \n" +
"WHERE c.name LIKE '%ColumnNameToSearchFor%' \n" +
"ORDER BY TableName, ColumnName";
var result = aa.db.select(sql,[]);


aa.print('Getting sql');
aa.print(result.getOutput())
if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
        if (data.get(d).get("USER_NAME") == "ADMIN") logDebug("^^^^ this is admin user");
    }
}

function logDebug(str){
    aa.print(str);
}









*/