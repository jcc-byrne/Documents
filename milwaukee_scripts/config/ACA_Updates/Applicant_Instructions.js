var statement = '<div><font size="2"><br></font></div><div><font size="2"><b>If filing as a Sole Proprietor&nbsp;</b></font></div><div><ol><li><font size="2">Add yourself as the Business Entity with Contact Information for your Business&nbsp;</font></li><ul><li><font size="2"> Select sole proprietor</font></li></ul><ul><li><font size="2">Select Occupancy Type from the list</font></li></ul><li><font size="2">Add yourself as the Agent-Sole Proprietor-1st Partner with Contact Information</font></li></ol></div>'

statement += '<div><font size="2"><br></font></div><div><font size="2"><b>If filing as a Partnership&nbsp;</b></font></div><div><ol><li><font size="2">Add yourself and all partners with contact information as the Business Entity&nbsp;</font></li><li><font size="2">provide name/contact information for the first partner as Agent-Sole Proprietor-1st Partner&nbsp;</font></li><li><font size="2">provide name/contact information for additional partner-shareholders&nbsp;</font></li><li><font size="2">Occupancy Permit Status: Select appropriate item from the list.&nbsp; All partners must sign.&nbsp;</font></li></ol></div>'

statement += '<div><font size="2"><br></font></div><div><font size="2"><b>If filing as a Corporation or Limited Liability Company&nbsp;</b></font></div><div><ol><li><font size="2">Select LLC or Corporation, the legal entity name is the LLC or Corporation, provide business name and contact information as the Business Entity&nbsp;</font></li><li><font size="2">provide name and contact information for the agent (also include percent of ownership interest if agent is also a shareholder)&nbsp;</font></li><li><font size="2">provide the name and contact information for all Business shareholders that own 20% or more ownership interest&nbsp;</font></li><li><font size="2">Occupancy Permit Status: Select appropriate item from the list. Two 20% or more shareholders must sign. If there are no 20% or more shareholders, a corporate officer must print their name and title and sign.&nbsp;</font></li></ol></div>'


var update = "update RPF_COMPONENT \n"+
// "set display_order = '3' \n"+
"set COMPONENT_INSTRUCTION = '" + statement + "' \n" +
"FROM RPF_COMPONENT c \n" +
"WHERE c.SERV_PROV_CODE = ?  and c.component_name = 'Applicant' \n" +
"and (PF_GROUP_CODE like 'Lic_Bus%' OR PF_GROUP_CODE like 'LIC Transportation%') and PF_GROUP_CODE not like '%Sup%' and PF_GROUP_CODE <> 'LIC Business Renewal with address' "
 
var result = aa.db.update(update, [aa.getServiceProviderCode()]);

if (result.getSuccess())
{
  aa.print(result.getOutput()); // 48634 parcels fixed out of 54633 total
}
else
  aa.print(result.getErrorMessage());
