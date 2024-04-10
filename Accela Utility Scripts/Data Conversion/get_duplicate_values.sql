SELECT a.*
FROM AAA_TABLE_SS_HISt a
JOIN (SELECT accelaid
FROM AAA_TABLE_SS_HISt 
GROUP BY accelaid
HAVING count(accelaid) > 1 ) b
ON a.accelaid = b.accelaid
ORDER BY a.accelaid
