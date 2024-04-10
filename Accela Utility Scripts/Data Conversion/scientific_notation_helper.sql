update c1 
set B1_CHECKLIST_COMMENT = trim(REPLACE(STR(d.dogMicroNumber, 20, 0), 'e+0', ''))
from BCHCKBOX c1 
join BCHCKBOX c2 
on 1=1
and c1.B1_PER_ID1 = c2.B1_PER_ID1
and c1.B1_PER_ID2 = c2.B1_PER_ID2
and c1.B1_PER_ID3 = c2.B1_PER_ID3
and c1.B1_CHECKBOX_DESC = 'mNbr'
and c2.B1_CHECKBOX_DESC = 'legacyTrakitID'
join SCMN_SOURCE.dbo.AAA_DOG_LIC_CUSTOM_FIELDS d
on 1=1
and d.legacyTrakitID = c2.B1_CHECKLIST_COMMENT