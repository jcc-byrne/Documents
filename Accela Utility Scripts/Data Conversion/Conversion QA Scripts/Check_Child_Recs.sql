select 
p.B1_ALT_ID as parentRec
,p.B1_APPL_STATUS as parentStatus
,b.B1_ALT_ID as childRec
,b.B1_APPL_STATUS as childStatus

from B1PERMIT p
join XAPP2REF x on 1=1
and p.B1_PER_ID1 = x.B1_MASTER_ID1
and p.B1_PER_ID2 = x.B1_MASTER_ID2
and p.B1_PER_ID3 = x.B1_MASTER_ID3

join B1PERMIT b on 1=1
and b.B1_PER_ID1 = x.B1_PER_ID1
and b.B1_PER_ID2 = x.B1_PER_ID2
and b.B1_PER_ID3 = x.B1_PER_ID3
where p.B1_ALT_ID = 'LIQ-LIC-01343'