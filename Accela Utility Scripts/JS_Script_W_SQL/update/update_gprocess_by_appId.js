var agency = aa.getServiceProviderCode();

var update = "update gprocess \n"+
"set SD_CHK_LV1 = 'Y', SD_CHK_LV2 = 'N' \n"+
"from gprocess h join B1PERMIT p on p.B1_PER_ID1 = h.B1_PER_ID1 and p.B1_PER_ID2 = h.B1_PER_ID2 and p.B1_PER_ID3 = h.B1_PER_ID3 where p.serv_prov_code = ? and p.b1_alt_id in ('TMP-2023-00012', 'TMP-2023-00011') ";
 
var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());