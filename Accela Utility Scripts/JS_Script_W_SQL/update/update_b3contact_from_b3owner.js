
var update = "update c \n"+
"set c.b1_fname = o.b1_owner_fname \n"+
",c.b1_lname = o.b1_owner_lname \n"+
",c.b1_full_name = o.b1_owner_full_name \n"+
",c.b1_address1 = o.B1_MAIL_ADDRESS1 \n"+
",c.b1_address2 = o.B1_MAIL_ADDRESS2 \n"+
",c.B1_CITY =  o.B1_MAIL_CITY \n"+
",c.B1_STATE =  o.B1_MAIL_STATE \n"+
",c.B1_ZIP =  o.B1_MAIL_ZIP \n"+
"from B3CONTACT c \n"+
"join B3OWNERS o \n"+
"on 1=1  \n"+
"and c.B1_PER_ID1 = o.B1_PER_ID1 \n"+
"and c.B1_PER_ID2 = o.B1_PER_ID2 \n"+
"and c.B1_PER_ID3 = o.B1_PER_ID3 \n"+
"and c.B1_CONTACT_TYPE = 'Business Owner' \n"+
"and c.B1_FNAME is null \n"+
"and o.B1_OWNER_FNAME is not null \n"+
"where c.SERV_PROV_CODE = 'SCMN' \n"+
"and c.B1_PER_ID1 like '%HIS' \n"
 
var result = aa.db.update(update, []);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());