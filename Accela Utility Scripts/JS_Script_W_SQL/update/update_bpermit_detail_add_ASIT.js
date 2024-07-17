var agency = aa.getServiceProviderCode();

var update = "update bpermit_detail \n"+
"set B1_ASITABLEGROUP_CODE = 'UAP' \n"+
"FROM bpermit_detail b JOIN b1permit d on 1=1 and d.b1_per_id1 = b.b1_per_id1 and  d.b1_per_id2 = b.b1_per_id2 and d.b1_per_id3 = b.b1_per_id3 \n" +
"WHERE b.SERV_PROV_CODE = ? and b.B1_ASITABLEGROUP_CODE is null and d.b1_per_group = 'Planning' and d.b1_per_type = 'Utility Acceptance Package' and d.rec_status = 'A' and d.b1_alt_id not like '%tmp%' \n" 


var result = aa.db.update(update, [agency]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());