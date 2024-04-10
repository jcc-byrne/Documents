SET QUOTED_IDENTIFIER ON
go
update lic_prof set county_code = 'US'
;
merge rstate_lic t
using (select * from (select ROW_NUMBER() over(partition by serv_prov_code, lic_nbr, lic_type, lic_state order by lic_nbr) cnt,* 
from lic_prof) x where cnt = 1 and lic_type in 
(select bizdomain_value from rbizdomain_value where bizdomAin = 'LICENSED PROFESSIONAL TYPE')) as s
on (t.serv_prov_code = s.serv_prov_code and t.lic_nbr = s.lic_nbr and t.lic_type = s.lic_type and t.lic_state = s.lic_state )
when matched then update
	set t.rec_status = s.LIC_STATUS,
	    t.LIC_TYPE = s.LIC_TYPE,
		t.bus_name = s.bus_name,
		t.lic_expir_dd = s.lic_expir_dd,
		t.CAE_FNAME = s.CAE_FNAME,
		t.CAE_MNAME = s.CAE_MNAME,
		t.CAE_LNAME = s.CAE_LNAME,
		t.suffix_name = s.suffix_name,
		t.address1 = s.address1,
		t.address2 = s.address2,
		t.city = s.city,
		t.state = s.state,
		t.county_code = s.county_code,
		t.zip = s.zip,
		t.rec_ful_nam = isnull(s.rec_ful_nam,'AACONV'),
		t.phone1_country_code = s.phone1_country_code,
		t.phone2_country_code = s.phone2_country_code,
		t.phone3_country_code = s.phone3_country_code,
		t.phone1 = s.phone1,
		t.phone2 = s.phone2,
		t.phone3 = s.phone3,
		t.email = s.email,
		t.ins_co_name = s.ins_co_name,
		t.lic_comment = s.lic_comment,
		t.rec_date = getdate(),
		t.bus_lic = s.bus_lic,
		t.bus_lic_exp_dt = s.bus_lic_exp_dt,
		t.LIC_ORIG_ISS_DD = s.LIC_ORIG_ISS_DD,
		t.LAST_UPDATE_DD = s.LIC_ORIG_ISS_DD,
		t.wc_exp_dt = s.wc_exp_dt
		;
declare @max bigint;
select @max = isnull(max(lic_seq_nbr), 0) + 15 from rstate_lic where serv_prov_code = 'COLA'
;
insert into rstate_lic(lic_seq_nbr, SERV_PROV_CODE,LIC_NBR,rec_status,LIC_STATE,LIC_TYPE,BUS_NAME,LIC_EXPIR_DD,CAE_FNAME,CAE_MNAME,CAE_LNAME,suffix_name,
ADDRESS1,ADDRESS2,CITY,STATE, county_code, ZIP, REC_FUL_NAM,PHONE1,PHONE2,PHONE3, ins_co_name, lic_comment, rec_date,phone1_country_code,phone2_country_code,phone3_country_code,email,
bus_lic,bus_lic_exp_dt, LIC_ORIG_ISS_DD, LAST_UPDATE_DD, wc_exp_dt)
select @max + ROW_NUMBER() OVER(PARTITION BY null order by lic_nbr) lic_seq_nbr, SERV_PROV_CODE,LIC_NBR,LIC_STATUS,LIC_STATE,LIC_TYPE,BUS_NAME,LIC_EXPIR_DD,CAE_FNAME,CAE_MNAME,CAE_LNAME,suffix_name,
ADDRESS1,ADDRESS2,CITY,STATE, county_code, ZIP, isnull(REC_FUL_NAM,'AACONV'),PHONE1,PHONE2,PHONE3,ins_co_name, lic_comment, getdate(),phone1_country_code,phone2_country_code,phone3_country_code,email,
bus_lic,bus_lic_exp_dt,LIC_ORIG_ISS_DD, LIC_ORIG_ISS_DD, wc_exp_dt
from lic_prof
where lic_type in (	select bizdomain_value from rbizdomain_value where bizdomAin = 'LICENSED PROFESSIONAL TYPE')
and lic_nbr in
(
select lic_nbr from lic_prof where serv_prov_code = 'COLA'
except
select lic_nbr from rstate_lic where serv_prov_code = 'COLA'
)
;
----- lic_attr
declare @cx1 int, @cx2 int
select @cx1 = count(1) from INFORMATION_SCHEMA.tables where table_name = 'lic_prof_attr' AND TABLE_TYPE = 'BASE TABLE'
if @cx1 = 0 set @cx2 = 0 else select @cx2 = count(1) from lic_prof_attr
if @cx2 = 0 print 'no data for lic_prof_attr'
else begin
	delete a from g3contact_attribute a
	where exists (select 1 From rstate_lic b, lic_prof_attr c 
	where a.serv_prov_code = b.serv_prov_code
	and b.serv_prov_code = c.serv_prov_code
	and a.g1_contact_nbr = b.lic_seq_nbr
	and a.g1_contact_type =  b.lic_type
	and c.serv_prov_code = b.serv_prov_code
	and  b.lic_nbr = c.lic_nbr
	and b.lic_type = c.lic_type
	and c.attrib_name = a.g1_attribute_name);
	insert into g3contact_attribute
	(serv_prov_code, g1_contact_nbr, g1_contact_type, g1_attribute_name, g1_attribute_value, g1_attribute_unit_type, g1_attribute_value_data_type,
	g1_attribute_value_req_flag, g1_display_order, g1_validation_script, rec_date, rec_ful_nam, rec_status, vch_disp_flag)
	select serv_prov_code, g1_contact_nbr, g1_contact_type, g1_attribute_name, g1_attribute_value, g1_attribute_unit_type, g1_attribute_value_data_type,
	g1_attribute_value_req_flag, g1_display_order, g1_validation_script, rec_date, rec_ful_nam, rec_status, vch_disp_flag from
	(select distinct a.serv_prov_code, c.lic_seq_nbr g1_contact_nbr, c.lic_type g1_contact_type, b.r1_attribute_name g1_attribute_name,
	a.attrib_value g1_attribute_value,b.r1_attribute_unit_type g1_attribute_unit_type, b.r1_attribute_value_data_type g1_attribute_value_data_type, 
	b.r1_attribute_value_req_flag g1_attribute_value_req_flag, b.r1_display_order g1_display_order, b.r1_validation_script g1_validation_script, 
	getdate() rec_date, 'AA CONV' rec_ful_nam, 'A' rec_status, b.vch_disp_flag vch_disp_flag
	,row_number() over(partition by a.serv_prov_code, c.lic_seq_nbr, c.lic_type, b.r1_attribute_name order by b.r1_display_order) cnt
	from lic_prof_attr a	inner join rcontact_attribute b 
	on a.serv_prov_code = b.serv_prov_code and a.attrib_temp_name = b.R1_ATTRIBUTE_TEMPLATE_NAME and a.attrib_name = b.r1_attribute_name
	inner join rstate_lic c on a.serv_prov_code = c.serv_prov_code and a.lic_nbr = c.lic_nbr and a.lic_type = c.lic_type) x where cnt = 1;
end
---- lic_prof_attach
select @cx1 = count(1) from INFORMATION_SCHEMA.tables where table_name = 'lic_prof_attach' AND TABLE_TYPE = 'BASE TABLE'
if @cx1 = 0 set @cx2 = 0 else select @cx2 = count(1) from lic_prof_attach
if @cx2 = 0 print 'no data for lic_prof_attach'
else begin
	delete from rinfo_table_value where exists 
	(select 1 from lic_prof_attach a INNER JOIN rstate_lic b 
	ON a.serv_prov_code=b.serv_prov_code 
	AND ltrim(rtrim(a.lic_nbr))=ltrim(rtrim(b.lic_nbr))
	AND a.lic_type=b.lic_type
	WHERE b.serv_prov_code=rinfo_table_value.serv_prov_code and b.lic_seq_nbr=rinfo_table_value.reference_id)
	;
	delete from rinfo_table where exists 
	(select 1 from lic_prof_attach a INNER JOIN rstate_lic b 
	ON a.serv_prov_code=b.serv_prov_code 
	AND ltrim(rtrim(a.lic_nbr))=ltrim(rtrim(b.lic_nbr))
	AND a.lic_type=b.lic_type
	WHERE b.serv_prov_code=rinfo_table.serv_prov_code and b.lic_seq_nbr=rinfo_table.reference_id)
	;
	------------------------------------------------ rinfo_table --------------------------------------
-- level 1
drop table if exists #info_table_level1
select (SELECT convert(bigint,0.5 * ((a+b)+ABS(a-b))) from(select * from (select last_number a from AA_SYS_SEQ where SEQUENCE_DESC = 'RINFO_TABLE.INFO_ID') a, 
(select isnull(max(info_id),0) b from rinfo_table b) x) y) + ROW_NUMBER() over(order by a.lic_nbr) as level1_id, a.*
into #info_table_level1 
from (select distinct r.SERV_PROV_CODE, p.lic_nbr, p.lic_type, R.R1_TABLE_GROUP_NAME AS GROUPCODE_NAME,l.LIC_SEQ_NBR
from lic_prof_attach p inner join r2chckbox r on R.R1_CHECKBOX_GROUP='LICENSEINFOTABLE'
AND R.R1_TABLE_GROUP_NAME = P.group_name AND R.SERV_PROV_CODE = 'COLA'
inner join RSTATE_LIC l on p.lic_nbr = l.LIC_NBR and p.lic_type = l.LIC_TYPE and r.SERV_PROV_CODE = l.SERV_PROV_CODE) a
create index info_level1 on #info_table_level1(lic_nbr, lic_type, GROUPCODE_NAME,LIC_SEQ_NBR)
-- level 2
drop table if exists #info_table_level2
select (select isnull(max(level1_id),0) from #info_table_level1) + ROW_NUMBER() over(partition by null order by a.lic_nbr) as level2_id, a.*
into #info_table_level2
from (select distinct r.SERV_PROV_CODE, p.lic_nbr, p.lic_type, r.R1_TABLE_GROUP_NAME as GROUPCODE_NAME, R.R1_CHECKBOX_TYPE as info_name, l.LIC_SEQ_NBR,l1.level1_id as parent_id
from lic_prof_attach p inner join r2chckbox r on R.R1_CHECKBOX_GROUP='LICENSEINFOTABLE'
AND R.R1_TABLE_GROUP_NAME = P.group_name and r.R1_CHECKBOX_TYPE = p.table_name AND R.SERV_PROV_CODE = 'COLA'
inner join RSTATE_LIC l on p.lic_nbr = l.LIC_NBR and p.lic_type = l.LIC_TYPE and r.SERV_PROV_CODE = l.SERV_PROV_CODE
inner join #info_table_level1 l1 on l.LIC_SEQ_NBR = l1.LIC_SEQ_NBR and r.R1_TABLE_GROUP_NAME = l1.GROUPCODE_NAME
)a
create index info_level2 on #info_table_level2(lic_nbr, lic_type, GROUPCODE_NAME,LIC_SEQ_NBR)
-- level 3
drop table if exists #info_table_level3
select (select isnull(max(level2_id),0) from #info_table_level2) + ROW_NUMBER() over(partition by null order by a.lic_nbr) as level3_id, a.*
into #info_table_level3
from (select distinct r.SERV_PROV_CODE, p.lic_nbr, p.lic_type, r.R1_TABLE_GROUP_NAME as GROUPCODE_NAME, R.R1_CHECKBOX_DESC as info_name,
l.LIC_SEQ_NBR,l2.level2_id as parent_id,r.R1_CHECKBOX_TYPE as table_name,R1_DISPLAY_ORDER as display_order,R1_CHECKBOX_IND COLUMN_TYPE,
null DEFAULT_VALUE,r.MAX_LENGTH,DISPLAY_LENGTH,r.R1_ATTRIBUTE_VALUE_REQ_FLAG REQUIRED_FLAG,r.R1_DISPLAY_LIC_VERIF_ACA R1_DISPLAY_LIC_VERIF_ACA
from lic_prof_attach p inner join r2chckbox r on R.R1_CHECKBOX_GROUP='LICENSEINFOTABLE'
AND R.R1_TABLE_GROUP_NAME = P.group_name and r.R1_CHECKBOX_TYPE = p.table_name AND R.SERV_PROV_CODE = 'COLA'
inner join RSTATE_LIC l on p.lic_nbr = l.LIC_NBR and p.lic_type = l.LIC_TYPE and r.SERV_PROV_CODE = l.SERV_PROV_CODE
inner join #info_table_level2 l2 on l.LIC_SEQ_NBR = l2.LIC_SEQ_NBR and r.R1_CHECKBOX_TYPE = l2.info_name
)a
create index info_level3 on #info_table_level3(lic_nbr, lic_type, GROUPCODE_NAME,info_name)
-----------------------------------------
insert into RINFO_TABLE 
	(SERV_PROV_CODE,INFO_ID,REF_CATEGORY,REFERENCE_ID,GROUP_CODE,PARENT_ID,LEVEL_NBR,INFO_NAME,DISPLAY_ORDER,COLUMN_TYPE,DEFAULT_VALUE,MAX_LENGTH,
	DISPLAY_LENGTH,REQUIRED_FLAG,REC_DATE,REC_FUL_NAM,REC_STATUS,R1_DISPLAY_LIC_VERIF_ACA)
	select SERV_PROV_CODE, l1.level1_id,1 AS REF_CATEGORY,l1.LIC_SEQ_NBR, l1.GROUPCODE_NAME, 0 as PARENT_ID,1 as level_nbr,upper(l1.lic_type),null DISPLAY_ORDER,
	NULL COLUMN_TYPE, null as DEFAULT_VALUE,null MAX_LENGTH,null as DISPLAY_LENGTH,null as REQUIRED_FLAG,getdate() as REC_DATE,
	'AA CONV' as REC_FUL_NAM,'A' as REC_STATUS,NULL R1_DISPLAY_LIC_VERIF_ACA from #info_table_level1 l1
--
insert into RINFO_TABLE 
	(SERV_PROV_CODE,INFO_ID,REF_CATEGORY,REFERENCE_ID,GROUP_CODE,PARENT_ID,LEVEL_NBR,INFO_NAME,DISPLAY_ORDER,COLUMN_TYPE,DEFAULT_VALUE,MAX_LENGTH,
	DISPLAY_LENGTH,REQUIRED_FLAG,REC_DATE,REC_FUL_NAM,REC_STATUS,R1_DISPLAY_LIC_VERIF_ACA)
	select SERV_PROV_CODE, l2.level2_id,1 AS REF_CATEGORY,l2.LIC_SEQ_NBR, l2.GROUPCODE_NAME, L2.parent_id,2 as level_nbr,L2.info_name,null DISPLAY_ORDER,
	NULL COLUMN_TYPE, null as DEFAULT_VALUE,null MAX_LENGTH,null as DISPLAY_LENGTH,null as REQUIRED_FLAG,getdate() as REC_DATE,
	'AA CONV' as REC_FUL_NAM,'A' as REC_STATUS,NULL R1_DISPLAY_LIC_VERIF_ACA from #info_table_level2 l2
--
insert into RINFO_TABLE 
	(SERV_PROV_CODE,INFO_ID,REF_CATEGORY,REFERENCE_ID,GROUP_CODE,PARENT_ID,LEVEL_NBR,INFO_NAME,DISPLAY_ORDER,COLUMN_TYPE,DEFAULT_VALUE,MAX_LENGTH,
	DISPLAY_LENGTH,REQUIRED_FLAG,REC_DATE,REC_FUL_NAM,REC_STATUS,R1_DISPLAY_LIC_VERIF_ACA)
	select l3.SERV_PROV_CODE, l3.level3_id INFO_ID,1 AS REF_CATEGORY, l3.LIC_SEQ_NBR, l3.GROUPCODE_NAME,
	l3.parent_id,3 as level_nbr,l3.info_name, DISPLAY_ORDER,COLUMN_TYPE,DEFAULT_VALUE,MAX_LENGTH,DISPLAY_LENGTH,REQUIRED_FLAG,
	getdate() as REC_DATE, 'AA CONV' as REC_FUL_NAM,'A' as REC_STATUS, R1_DISPLAY_LIC_VERIF_ACA from #info_table_level3 l3
--------------------------------------------------------- rinfo_table_value --------------------------------------------------
--use COLA_SUPP
drop index if exists DBO.lic_prof_attach.lic_prof_attach_xxx
create index lic_prof_attach_xxx on DBO.lic_prof_attach(lic_nbr,lic_type,group_name,table_name,row_num) 
insert into rinfo_table_value
	(SERV_PROV_CODE,INFO_VALUE_ID,INFO_ID,REF_CATEGORY,REFERENCE_ID,GROUPCODE_NAME,SUBGROUP_NAME,COLUMN_NAME,ROW_NUM,COLUMN_NUM,TABLE_VALUE,
	REC_DATE,REC_FUL_NAM,REC_STATUS)
	select b.SERV_PROV_CODE as serv_prov_code, 
	(SELECT convert(bigint,0.5 * ((a+b)+ABS(a-b))) from(select * from (select last_number a from AA_SYS_SEQ where SEQUENCE_DESC = 'RINFO_TABLE_VALUE.INFO_VALUE_ID') a, 
(select isnull(max(info_value_id),0) b from rinfo_table_value b) x) y) + row_number() over(order by b.SERV_PROV_CODE) as INFO_VALUE_ID,
	b.level3_id as info_id, 1 as ref_category, b.LIC_SEQ_NBR as reference_id, b.GROUPCODE_NAME, b.table_name as SUBGROUP_NAME, 
	dense_rank() over (partition by b.lic_seq_nbr order by display_order) - 1 as COLUMN_NAME,b.row_num as ROW_NUM,
	dense_rank() over (partition by b.LIC_SEQ_NBR order by display_order) - 1 as COLUMN_NUM,
	a.attach_value as TABLE_VALUE, getdate() as REC_DATE, 'AA CONV' as REC_FUL_NAM, 'A' as REC_STATUS 
	from lic_prof_attach a right join (select a.*,b.row_num from #info_table_level3 a inner join 
(select distinct lic_nbr,lic_type,group_name, table_name,row_num from lic_prof_attach) b
on a.lic_nbr = b.lic_nbr and a.lic_type = b.lic_type and a.GROUPCODE_NAME = b.group_name and a.table_name = b.table_name
) b on a.lic_nbr = b.LIC_NBR and a.lic_type = b.lic_type and a.group_name = b.GROUPCODE_NAME and a.table_name = b.table_name
and a.column_name = b.info_name and a.row_num = b.row_num
;
--------------------------------------------------
end
update aa_sys_seq 
set  last_number = (select ISNULL(max(lic_seq_nbr), 0)  from rstate_lic where serv_prov_code = 'COLA') + CACHE_SIZE 
WHERE LAST_NUMBER < (select max(lic_seq_nbr) from rstate_lic where serv_prov_code = 'COLA')
And sequence_name = 'RSTATE_LIC_SEQ'
;
UPDATE AA_SYS_SEQ SET LAST_NUMBER=(SELECT isnull(MAX(INFO_ID),0) FROM RINFO_TABLE where serv_prov_code = 'COLA') + CACHE_SIZE 
WHERE LAST_NUMBER < (select max(INFO_ID) from RINFO_TABLE where serv_prov_code = 'COLA')
and SEQUENCE_NAME='RINFO_TABLE_SEQ'
;
UPDATE AA_SYS_SEQ SET LAST_NUMBER=(SELECT isnull(MAX(INFO_VALUE_ID),0) FROM RINFO_TABLE_VALUE where serv_prov_code = 'COLA') + CACHE_SIZE
WHERE LAST_NUMBER < (select max(INFO_VALUE_ID) from RINFO_TABLE_VALUE where serv_prov_code = 'COLA')
and SEQUENCE_NAME='RINFO_TABLE_VALUE_SEQ'
;
go