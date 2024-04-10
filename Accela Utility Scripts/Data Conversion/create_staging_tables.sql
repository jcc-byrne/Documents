/* HistoryStagingTables-MSSQL.sql */
/****************************************************************************
*Purpose: This file will create SQL Server tables for data migrations      
* Version     : 3.0  Date: 03/08/2006                                                          
* Modification History
* 01/27/2007 DQ	Added Permit_Status and Permit_AttachedTable
* 04/18/2007 AW	Added columns to permit_history and removed ones regarding the project 
*			valuation 
* 			modified fee table, permit_status (added the fname, mname and lname
* 			modified  permit_people, permit_workflow and permit_insp
* 09/02/2008 BEB	Added Trust_Account_Trans table
* 10/02/2008 AW	Added  4 fields to permit_history priority, total_job_cost closed by 
*			and closed_date
*  			Added tables of permit_costing_ams, permit_calcvaluatn 
* 12/04/2008 TKS	Increase various fields to 4000.
*			(Permit_AppSpecInfo.App_Spec_Value, Permit_TaskSpec_Info.Task_Spec_Value,
*			 and Permit_AttachedTable.Attribute_Value)
*			This code will be copied into Standard History mdbs
*			and into Data Mapper mst files so that all are in-synch.
* 12/05/2008 TKS	Made Permit_Workflow.LName 25 (was 15), to match ORA script.
*************Branched to AA67 Script*****************************************
02/23/2009 DQ Updated Permit_People Added additional columns
03/17/2009 DQ Updated Permit_history Added additional columns
	         Removed code_enforcement
04/20/2009 DQ Added Permit_PeopleLicTable to sync with oracle script
04/27/2009 Added additional fields to permit_parcel subdivision, Primary parcel flag, township, range and seciton
*   04/30/2009  Added the standard tables for Assets
05/04/2009 DQ Added last of items to permit_history
05/18/2009 AW added the permit_asset table  Relates an asset to the cap
05/26/2009 DQ removed not null from insp_number
06/ 12/2009 AW added the permit_part_ams table  - relates the parts to a work order (ams module only)
07/13/2009  - AW added the ams_asset_ca, ams_asset_ca_attr and ams_asset_ca_observ
11/02/2015  EricL updated to AA 733
12/02/2015  EricL Added the field TASK_ORDER_INDEX in table PERMIT_TASK_AMS for JIRA 1150
12/17/2015  EricL Added the field B1_INTERNAL_USER_FLAG,B1_INTERNAL_USER_ID in table permit_people for AA 800(JIRA ) 1460
03/16/2016  EricL Updated the field Short_notes to 255 of table permit_history
*/
/*
******  Branch to 7.0 version 03/02/2010   ******
Permit_History 
  Modified ap_name  increased to 130
  modified const_type_code increased to 4 characters      
  Added  valuation_multiplier, valuation_extra_amt, last_audit_date 
  Add app_status_date  
PERMIT_PEOPLE
 Modified  address1 2 and 3 in permit_people  Increased to 200
 Modified the state field increased to 30 characters
 Modified  lic_type set to 255
 Added fields of social security_number and federal_employer_id_num
    Lic_board and  contra_type_flag
     B1_id 
    
PERMIT_ASSET_AMS
    Added 4 fields woasset_order, woasset_complete, woasset_complete_date, woasset_short_notes

PERMIT_ADDRESS
   Added address1, address2,Situs_nbrhd
   Modified str_num_start , str_num_end, str_suffix and situs_state
           
           Permit_fee
             Modified gf_fee_schedule
             Modified the account code fields increased to 32 
             Added fee_schedule_version
             Added fee_key
             Modified  primary key  permitnum, fee_key     
Permit_feeallocation
   added field of  fee_key
   modified primary key removed gf_cod and fee period  
permit_total
   added index on permitnum and gf_fee_period
Trust_act_people
   Modified lic_state to be 30 characters lic_type increased to 255
   Modified the addr 1 , 2 and 3 to be 200 characters
   modified  the state field to be 30 characters  


permit_peopleLicTable  
  Modified lic_type increased to  be 255
  Removed  not null from column_num 
   removed column_num from PK   
permit_insp
   modified the insp_result_comm and insp_sched_comm fields.  made them a "text" field.
   Modified the insp_number.  made it not nullabel and must be unique 
   added field of insp_seq_nBR  -- value will come from the rinsptyp.insp_seq_nBR field during data mapping 
   Added index  on insp_number.
permit_guidesheet
   Added the fields  of guide_key, score
   Modified the primary key   added guide_key to it  
Permit_workflow  added asgn_date, due_date
  NEW TABLES
permit_exam
permit_education   
permit_cont_edu
permit_condition
Permit_activity
Permit_stru_esta
permit_address_type
permit_guidesheet_asi
permit_guidesheet_asitab

***************************************************************
04/12/2010 - DQ
		-Fixed Primary Key for permit_cont_edu, added permitnum to PK


****************************************************************************/

--permit_history 

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_history')
BEGIN
drop table permit_history
END
go

create table permit_history (
permitNum               varchar(30)     not null,
b1_per_group            varchar(30)     not null,
b1_per_type             varchar(30)     not null,
b1_per_sub_type         varchar(30)     not null,
b1_per_category         varchar(30)     not null,
CONTRACTOR_VALUATION    numeric(15,2)   null,
dateOpened              datetime        not null,
EXPIRATION_DATE         dateTime        null,
EXPIRATION_STATUS       varchar(30)     null,
app_status              varchar(30)     null,
Work_desc               varchar(4000)   null,
app_name                varchar(255)    null,
house_count             numeric(19)     null,       --8/18/2010  Change to 19
building_count          numeric(19)     null,		    --8/18/2010  Change to 19
public_owned            varchar(1)      null,
const_type_code         varchar(4)      null,
app_status_group_code   varchar(30)     null,
Short_notes             varchar(255)     null,  --Eric Updated 03/16/2016
asgn_dept               varchar(100)    null,
asgn_staff              varchar(50)     null,
asgn_date               datetime        null,
Completed_dept          varchar(100),
completed_by            varchar(50),
completed_date          datetime        null,
Scheduled_date          datetime        null,
priority                varchar(30)     null,
total_job_cost          numeric(15,2)   null,
closed_date             datetime, 
closed_by               varchar(50),
IVR_TRACKING_NUM        numeric(19),	--DQ Added 6.7    --8/18/2010 Increase to 19
CREATED_BY	            varchar(100),	--DQ Added 6.7
REPORTED_CHANNEL        varchar(30),	--DQ Added 6.7
CREATED_BY_DEPT         VARCHAR(100),	--DQ Added 6.7
FIRST_ISSUED_DATE        DATETIME,	    --DQ Added 6.7
ANONYMOUS_FLAG	VARCHAR(1),		--DQ ADD 05/04/2009
REFERENCE_TYPE	VARCHAR(30),	--DQ ADD 05/04/2009
APPEARANCE_DAYOFWEEK	VARCHAR(10),	--DQ ADD 05/04/2009
APPEARANCE_DATE	DATETIME,	--DQ ADD 05/04/2009
BOOKING_FLAG	VARCHAR(1),	--DQ ADD 05/04/2009
DEFENDANT_SIGNATURE_FLAG	VARCHAR(1),	--DQ ADD 05/04/2009
ENFORCE_OFFICER_ID	VARCHAR(12),	--DQ ADD 05/04/2009
ENFORCE_OFFICER_NAME	VARCHAR(70),	--DQ ADD 05/04/2009
INFRACTION_FLAG	VARCHAR(1),	--DQ ADD 05/04/2009
INSPECTOR_ID	VARCHAR(12),	--DQ ADD 05/04/2009
MISDEMEANOR_FLAG	VARCHAR(1),	--DQ ADD 05/04/2009
OFFENCE_WITNESSED_FLAG	VARCHAR(1),	--DQ ADD 05/04/2009
INSPECTOR_NAME	VARCHAR(70),	--DQ ADD 05/04/2009
ENFORCE_DEPT	VARCHAR(100),	--DQ ADD 05/04/2009
INSPECTOR_DEPT	VARCHAR(100) ,--DQ ADD 05/04/2009
VALUATION_MULTIPLIER NUMERIC(10,4) default 1.0000,   -- Added 3/3/2010 maps to bpermit_detail
VALUATION_EXTRA_AMT NUMERIC(15,4),  -- Added 3/3/2010 maps to bpermit_detail
LAST_AUDIT_DATE DATETIME,
APP_STATUS_DATE DATETIME,
DELEGATE_USER_ID		 VARCHAR(100),		  --Add by zeal on 05/16/2011
BALANCE				Numeric(15,2) default 0,
TOTAL_FEE			Numeric(15,2) default 0,
TOTAL_PAY			Numeric(15,2) default 0,
LAST_UPDATE_BY 		VARCHAR(70),
LAST_UPDATE_DATE	DATETIME
 )
go
alter table permit_history add constraint permit_history_pk
     primary key (permitnum)

Create index permit_history02 on permit_history(b1_per_group,b1_per_type, b1_per_sub_type, b1_per_category)
GO

GO

-- permit_projects 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_projects')
BEGIN
drop table permit_projects
END
go

create table permit_projects (
ParentActivityNum       varchar(30)     not null,
ChildActivityNum        varchar(30)     not null,
Relationship            varchar(30),
Status                  varchar(10)    
)
go
alter table permit_projects add constraint permit_projects_pk 
     Primary Key (parentActivityNum,ChildActivityNum)
go

go

--permit_people 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_people')
BEGIN
drop table permit_people
END
go 

-- table creation for permit_people
create table permit_people (
permitNum               varchar(30)     not null,
contact_type            varchar(255),   --8/18/2010  Increase to 255
contact_relationship    varchar(255),		--Change length to 255 from 30 by zeal on 05/16/2011
IsPrimary               varchar(1),
lic_num                 varchar(30),
lic_type                varchar(255),
name                    varchar(220),   
fname                   varchar(70),
mname                   varchar(70),
lname                   varchar(70),
bus_name                varchar(255),
addr1                   varchar(200),
addr2                   varchar(200),
addr3                   varchar(200),
city                    varchar(30),   --8/18/2010  Reduce to 30
state                   varchar(30),
zip                     varchar(10),
ph1                     varchar(40),
ph2                     varchar(40),
fax                     varchar(40),	--DQ Added 6.7
email                   varchar(80),		--Change length to 70 by zeal on 05/16/2011
comments                varchar(240),
TITLE	                VARCHAR(255),	--DQ ADD 2/23/2009 --Change length to 255 by zeal on 05/16/2011
PH3	                    VARCHAR(40),	--DQ ADD 2/23/2009 
COUNTRY_CODE	        VARCHAR(2),	    --DQ ADD 2/23/2009 
NOTIFY	                VARCHAR(1),	    --DQ ADD 2/23/2009 
NAME_SUFFIX	            VARCHAR(10),	--DQ ADD 2/23/2009 
BUS_LIC	                VARCHAR(15),	--DQ ADD 2/23/2009 
LIC_ORIGINAL_ISSUE_DATE	DATETIME,	    --DQ ADD 2/23/2009 
EXPIRATION_DATE	        DATETIME,	    --DQ ADD 2/23/2009 
RENEWAL_DATE	        DATETIME,	    --DQ ADD 2/23/2009 
MAIL_ADDR1	            VARCHAR(100),	--DQ ADD 2/23/2009 
MAIL_ADDR2	            VARCHAR(40),	--DQ ADD 2/23/2009 
MAIL_ADDR3	            VARCHAR(40),	--DQ ADD 2/23/2009 
MAIL_CITY	            VARCHAR(32),	--DQ ADD 2/23/2009 
MAIL_STATE	            VARCHAR(30),	    --DQ ADD 2/23/2009 
MAIL_ZIP	            VARCHAR(10),	--DQ ADD 2/23/2009 
MAIL_COUNTRY	        VARCHAR(30),	--DQ ADD 2/23/2009 
OWNER_TYPE	            VARCHAR(30),	--DQ ADD 2/23/2009 
GENDER		            VARCHAR(1),	    --DQ ADD 2/23/2009 
SALUTATION	            VARCHAR(255),	--DQ ADD 2/23/2009  -- Change length to 255 by zeal on 05/17/2011
PO_BOX	                VARCHAR(30),	--DQ ADD 2/23/2009 
BUS_NAME2	            VARCHAR(255),	--DQ ADD 2/23/2009 
BIRTH_DATE	            DATETIME,	    --DQ ADD 2/23/2009 
PH1_COUNTRY_CODE	    VARCHAR(3),	    --DQ ADD 2/23/2009 
PH2_COUNTRY_CODE	    VARCHAR(3),	    --DQ ADD 2/23/2009 
FAX_COUNTRY_CODE	    VARCHAR(3),	    --DQ ADD 2/23/2009 
PH3_COUNTRY_CODE	    VARCHAR(3),	    --DQ ADD 2/23/2009 
TRADE_NAME	            VARCHAR(255),	--DQ ADD 2/23/2009 
CONTACT_TYPE_FLAG VARCHAR(20),
SOCIAL_SECURITY_NUMBER VARCHAR(11),
FEDERAL_EMPLOYER_ID_NUM VARCHAR(16),
CONTRA_TYPE_FLAG VARCHAR(20),
LIC_BOARD VARCHAR(255),
b1_id varchar(15),
CONT_LIC_BUS_NAME		     VARCHAR(255),	 --Add by zeal on 05/16/2011
B1_ACCESS_LEVEL					 VARCHAR(20),		 --Add by zeal on 05/16/2011
B1_BIRTH_CITY            VARCHAR(30),    --Add by richie on 09/14/2012
B1_BIRTH_STATE           VARCHAR(30),    --Add by richie on 09/14/2012
B1_BIRTH_REGION          VARCHAR(30),    --Add by richie on 09/14/2012
B1_RACE                  VARCHAR(280),   --Add by richie on 09/14/2012
B1_DECEASED_DATE         DATETIME,       --Add by richie on 09/14/2012
B1_PASSPORT_NBR          VARCHAR(100),   --Add by richie on 09/14/2012
B1_DRIVER_LICENSE_NBR    VARCHAR(100),   --Add by richie on 09/14/2012
B1_DRIVER_LICENSE_STATE  VARCHAR(30),    --Add by richie on 09/14/2012
B1_STATE_ID_NBR          VARCHAR(100),   --Add by richie on 09/14/2012
B1_CONTACT_NBR           numeric(22) ,    --Add by richie on 09/14/2012
G1_CONTACT_NBR           numeric(22),     --Add by richie on 09/14/2012
B1_INTERNAL_USER_FLAG	 VARCHAR(1), 	--Add by Eric on 12/17/2015 For AA 800
B1_INTERNAL_USER_ID 	 VARCHAR(70),   --Add by Eric on 12/17/2015 For AA 800
LIC_STATE 				 VARCHAR(30)	--Add by Alaa on 06/16/2019
)
go
create index permit_people01 on permit_people(permitNum,contact_type,name,lic_type,lic_num)
GO
GRANT Select, Update, Insert ON permit_people  TO Public
GO

-- Permit_PeopleAttrib 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'Permit_PeopleAttrib')
BEGIN
drop table Permit_PeopleAttrib
END
go
create table Permit_PeopleAttrib (
permitnum               varchar(30)    not null,
attrib_Key              varchar(10)    not null,
attrib_temp_name        varchar(30)    not null,
attrib_type             varchar(255)    not null,   --08/18/2010 Increase to 255
attrib_name             varchar(30)    not null,
name                    varchar(80)    not null,
attrib_value            varchar(200) not null
)
go
alter table permit_peopleattrib add constraint permit_peopleattrib_pk 
     primary key (permitnum,attrib_key,attrib_temp_name, attrib_type,attrib_name,name)

GRANT Select, Update, Insert ON permit_peopleAttrib  TO Public
go

-- permit_parcel (multiple parcels on a permit)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_parcel')
BEGIN
drop table permit_parcel
END
go

create table permit_parcel (
Permitnum              varchar(30)      not null,
ParcelNum              varchar(24)      not NULL,
Book                   varchar(8)       null,
Page                   varchar(8)       null,
Parcel                 varchar(9)       null,
Lot                    varchar(40)      null,
Block                  varchar(15)      null,
Tract                  varchar(80)      null,
Legal_desc             varchar(2000)    null,
Parcel_area            numeric(15,2)    null,
Plan_area              varchar(8)       null,
Census_tract           varchar(10)      null,
Council_district       varchar(10)      null,
Supervisor_district    varchar(10)      null,
Inspection_district    varchar(255)      null,
Land_value             numeric(15,2)    null,
Improved_value         numeric(15,2)    null,
Exempt_value           numeric(15,2)    null,
Map_reference          varchar(30),
Map_number             varchar(10),
Subdivision            varchar(240),    -- AW added 4/27
Primary_flag           varchar(1),      -- AW added 4/27
Township               varchar(10),     -- AW added 4/27
Range                  varchar(10),     -- AW added 4/27
Section                numeric(10),       -- AW added 4/27  -- 8/18/2010 Increase to 19
EXT_PARCEL_UID		   varchar(100)
)
go
alter table permit_parcel add constraint permit_parcel_pk
   primary key  (permitnum,parcelnum)
go

go
 
--table permit_address
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_address')
BEGIN
drop table permit_address
END
go
create table permit_address (
permitNum               varchar(30)    not null, 
IsPrimary               varchar(1)     null,
str_num_start           int     null,			--Change to int by zeal on 05/16/2011 
str_num_end             int     null,			--Change to int by zeal on 05/16/2011 
str_frac_start          varchar(20)     null,
str_frac_end            varchar(20)     null,
str_dir                 varchar(20)     null,
str_name                varchar(40)    null,
str_suffix              varchar(30)     null,
str_suffix_dir         	varchar(20)		null,
str_prefix	         	varchar(20)		null,
str_unit_start          varchar(10)    null,
str_unit_end            varchar(10)    null,
str_unit_type           varchar(20)     null,
situs_city              varchar(40)    null,
situs_state             varchar(30)     null,
situs_zip               varchar(10)    null,
situs_county            varchar(30),
situs_country           varchar(30),
situs_country_code      varchar(2),
x_coord                 numeric(20,8),
y_coord                 numeric(20,8),
addr_desc               varchar(255),
Full_Address            varchar(600)   null,
ADDRESS1 VARCHAR(200),
ADDRESS2 VARCHAR(200),
SITUS_NBRHD VARCHAR(30),
L1_ADDRESS_NBR 			  int,     --Add by zeal on 05/16/2011
EXT_ADDRESS_UID			  varchar(100),
STREET_NAME_START		varchar(200), -- Added by OMATKARI 8/19/18
STREET_NAME_END			varchar(200), -- Added by OMATKARI 8/19/18
CROSS_STREET_NAME_START	varchar(200), -- Added by OMATKARI 8/19/18
CROSS_STREET_NAME_END	varchar(200), -- Added by OMATKARI 8/19/18
HSE_NBR_ALPHA_START	varchar(20),	-- Added By ALTARAZI 04/09/19
HSE_NBR_ALPHA_END		varchar(20),	-- Added By ALTARAZI 04/09/19
LEVEL_PREFIX		varchar(20),	-- Added By ALTARAZI 04/09/19
LEVEL_NBR_START	varchar(20),	-- Added By ALTARAZI 04/09/19
LEVEL_NBR_END 	varchar(20)		-- Added By ALTARAZI 04/09/19
)
go
 create unique index permit_address01 on permit_address(permitnum,full_address)
go
grant select, update, insert on permit_address to public
go

--table permit_attrib
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_attrib')
BEGIN
drop table permit_attrib
END
go

create table permit_attrib (
permitNum               varchar(30)    not null,
attrib_type             varchar(30)    not null,
attrib_temp_name        varchar(30)    not null,
attrib_name             varchar(30)    not null,
attrib_value            varchar(200),
Attrib_Key              varchar(600) not null 
)
go
alter table permit_attrib add constraint permit_attrib_pk 
    primary key  (permitNum,attrib_type,attrib_temp_name,attrib_name,attrib_key)
go
GRANT Select, Update, Insert ON permit_attrib  TO Public
go

--table permit_comment
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_comment')
BEGIN
drop table permit_comment
END
go

create table permit_comment (
permitnum               varchar(30)     not null,
comments                varchar(MAX)            not null,
AddedBy                 varchar(70),
AddedDate               datetime
)
GO
create index permit_comment01 on permit_comment(permitNum)
GO
GRANT Select, Update, Insert ON permit_comment  TO Public
GO

--table permit_appspecinfo 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_appspecinfo')
BEGIN
drop table permit_appspecinfo
END
go

create table permit_appSpecInfo (
permitnum               varchar(30)    not null,
app_spec_code           varchar(12)    not null,
app_spec_type           varchar(30)    not null,
app_spec_name           varchar(100)   not null,
app_spec_value          varchar(4000) not null
)
GO
alter table permit_appspecinfo add constraint permit_appspecinfo_pk
    primary key (permitNum,app_spec_type, app_spec_name)
create index permit_appSpecInfo02 on permit_appSpecInfo(permitNum,app_spec_code,app_spec_type, app_spec_name)
GO
create index permit_appspecinfo_idx on permit_appspecinfo(app_spec_code, app_spec_type, app_spec_name)
GO
create index permit_appspecinfo_permitnum on permit_appspecinfo(permitnum)
GO
GRANT Select, Update, Insert ON permit_appspecInfo  TO Public
GO

--table permit_workflow
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_workflow')
BEGIN
drop table permit_workflow
END
go

create table permit_workflow (
permitnum               varchar(30)     not null,
task_desc               varchar(100)     not null,   --8/18/2010   Increase to 100
task_status             varchar(200)     not null,
taskUpdated             datetime        not null,
comments                varchar(4000),
Process_Code            varchar(70)     not null,
Asgn_date               datetime,
Due_date                datetime,
FNAME					varchar(70),
MNAME					varchar(70),
LNAME					varchar(70),
sd_hours_spent              numeric(5,2), 
sd_billable                 varchar(1),
sd_overtime                 varchar(1),
estimated_hours             numeric(5,2),
asgn_email_display_for_aca  varchar(1),
restrict_comment_for_aca    varchar(1),
restrict_role               varchar(10),
USER_ID			            varchar(50),
ID                          NUMERIC  DEFAULT 0,
TASK_UNIQUE_ID              VARCHAR(255)
)
GO
-- BEB removed primary key constraint from table 
-- alter table permit_workflow  add constraint permit_workflow_pk 
--      primary key (permitNum,process_code,Task_desc,task_status,taskupdated)

create index permit_workflow_permitnum on permit_workflow(permitnum)
create index permit_workflow_idx on permit_workflow(task_desc, process_code)
GO
GRANT Select, Update, Insert ON permit_workflow   TO Public
GO

-- permit_taskspecinfo
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_taskspecinfo')
BEGIN
drop table permit_taskspecinfo
END
GO

create table permit_TaskSpecInfo (
permitnum               varchar(30)     not null,
task_spec_code          varchar(12)     not null,
Task_spec_type          varchar(30)     not null,
task_spec_name          varchar(100)    not null,
task_spec_value         varchar(4000)   not null,
process_code            varchar(70)     not null,
task_desc               varchar(100)     not null
)
GO
alter table permit_taskspecinfo add constraint permit_taskspecinfo_pk
      primary key (permitNum,task_spec_type, Task_spec_name,process_code,task_desc)

GO
GRANT Select, Update, Insert ON permit_taskspecInfo  TO Public
GO

-- permit_insp
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_insp')
BEGIN
drop table permit_insp
END
GO

create table permit_insp (
permitnum               varchar(30)     not null,
Insp_code 			   	varchar(12),
insp_type               varchar(255)     not null,
inspDate                datetime,
inspStatus              varchar(70)     not null,
inspSchedDate           datetime,
inspReqDate             datetime,
Insp_result_group       varchar(70),
insp_number             numeric null, 
insp_required           varchar(1),
Phone_num               varchar(40),
latitude                numeric(13,10),
longitude               numeric(13,10),
insp_result_comm        varchar(MAX) ,
insp_sched_comm         varchar(MAX),
insp_seq_nbr            int null,
sd_overtime             varchar(1),      --Add by zeal on 05/16/2011
display_in_aca          varchar(1),      --Add by zeal on 05/16/2011
contact_nbr             varchar(100),     --Add by Richie on 03/07/2012
insp_result_type	   varchar(30),
user_id			varchar(50),
ORDER_BY 	NUMERIC   DEFAULT 1,
G6_ACT_T1 varchar(10),
G6_ACT_T2 varchar(10),
G6_ACT_END_T1 varchar(10),
G6_ACT_END_T2 varchar(10),
G6_ACT_TT numeric,
ESTIMATED_START_TIME varchar(10),
ESTIMATED_END_TIME varchar(10),
G6_DESI_DD datetime,
G6_DESI_TIME varchar(10),
G6_DESI_TIME2 varchar(10),
CONTACT_PHONE_NUM varchar(40),
CONTACT_PHONE_NUM_IDD varchar(3),
CONTACT_FNAME varchar(70),
CONTACT_MNAME varchar(70),
CONTACT_LNAME  varchar(70),
G6_REQ_PHONE_NUM_IDD  varchar(3),
G6_REQ_PHONE_NUM   varchar(40),
MAJOR_VIOLATION_COUNT numeric,
UNIT_NBR varchar(20),
GRADE varchar(30),
TOTAL_SCORE numeric,
VEHICLE_NUM varchar(30),
G6_MILE_T1 numeric,
G6_MILE_T2 numeric,
G6_MILE_TT numeric,
INSP_CANCELLED varchar(1) DEFAULT  'N',
INSP_PENDING varchar(1) DEFAULT 'N',
CLIENT_UNIQUE_ID VARCHAR(255)
 )

GO
create unique index permit_insp_inspnbr on  permit_insp(insp_number)
create index permit_insp_code_type on  permit_insp(insp_code, insp_type)
create index permit_insp_permitnum on  permit_insp(permitnum)
create index permit_insp_order_by on  permit_insp(order_by)
GO
GRANT Select, Update, Insert ON permit_insp   TO Public
GO

/*
  table permit_inspdistricts
*/
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_inspDistricts')
BEGIN
drop table permit_inspDistricts 
END
GO
Create table permit_inspDistricts (
PermitNum               varchar(30)     not null,
dist_type               varchar(1)      not null,
Dist_key                varchar(600)    not null,
Insp_district           varchar(30)     not null
)

alter table  permit_inspDistricts add constraint permit_inspDistricts_pk
     Primary key (permitnum, dist_type, dist_key,insp_district)
go

-- permit_fee
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_fee')
BEGIN
drop table permit_fee
END
GO

create table permit_fee ( 
permitNum varchar(30) not null,
fee_key varchar(255) NOT NULL,
gf_cod                  varchar(15)     not null,
gf_fee_period           varchar(15)     not null,
Fee_item_amount         numeric(15,2)   not null,
gf_display              numeric         not null,
Account_Code1           varchar(200),
Account_Code2           varchar(200),
Account_Code3           varchar(200),
gf_fee_schedule         varchar(255),
rec_date                datetime		not null,
rec_ful_nam             varchar(70)     not null,
gf_des                  varchar(100)    not null,
gf_unit                 numeric(18,4),   --Modify by Richie on 03/07/2012
invoice                 varchar(1),
Fee_notes               varchar(4000),
FEE_SCHEDULE_VERSION    VARCHAR(255),
INVOICE_CUSTOMIZED_NBR  varchar(30),
gf_fee_allocation_type  varchar(30),
gf_l1_allocation        numeric(18,4),
gf_l2_allocation        numeric(18,4),
gf_l3_allocation        numeric(18,4),
VOID_FLAG				varchar(1)  default 'N',
GF_FEE_APPLY_DATE		datetime not null,
INV_DATE				datetime not null,
INV_REC_DATE			datetime not null,
INV_REC_FUL_NAM		VARCHAR(70) NOT NULL
)
GO
alter table permit_fee add constraint  permit_fee_pk 
     primary key  (permitnum,fee_key)


GO
GRANT Select, Update, Insert ON permit_fee TO Public
GO

/*-- permit_feeallocation */
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_feeAllocation')
BEGIN
drop table permit_feeAllocation
END
go

Create table permit_FeeAllocation (
PERMITNUM VARCHAR(30) NOT NULL,
FEE_KEY VARCHAR(255) NOT NULL,
PAY_KEY VARCHAR(255) NOT NULL,
FEE_ALLOCATION NUMERIC(15,2) NOT NULL
)

alter table permit_feeAllocation add constraint permit_feeallocation_pk 
 primary key (PERMITNUM, FEE_KEY, PAY_KEY)
GRANT Select, Update, Insert ON permit_feeallocation TO Public
GO

--permit_total - Customer will not populate-to be used by conversion
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_total')
BEGIN
drop table permit_total
END
GO

create table permit_total (
serv_prov_code          VARCHAR(15) NOT NULL,
b1_per_id1              VARCHAR(5)  NOT NULL,
b1_per_id2              VARCHAR(5)  NOT NULL,
b1_per_id3              VARCHAR(5)  NOT NULL,
invoice_nbr             numeric,
Invoice_due             numeric(15,2),
Amount_Paid             numeric(15,2),
Invoice_date            datetime,      
permitnum               VARCHAR(30),
invoice_customized_nbr  varchar(30) NOT NULL,
inv_rec_date			datetime not null,
inv_rec_ful_nam			VARCHAR(70) NOT NULL,
CONSTRAINT PERMIT_TOTAL_PK
PRIMARY KEY ( serv_prov_code, b1_per_id1, b1_per_id2, b1_per_id3,invoice_customized_nbr )
)
GO
create index permit_total01 on permit_total(invoice_nbr)
create index permit_total02 on permit_total(serv_prov_code, b1_per_id1, b1_per_id2, b1_per_id3)
create index permit_total03 on permit_total(PERMITNUM)
create index permit_total_idx on permit_total(PERMITNUM, invoice_customized_nbr)
go

GRANT Select, Update, Insert ON permit_total  TO Public
GO

--trust_accounts 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'trust_accounts')
BEGIN
drop table trust_accounts
END
go 

create table trust_accounts (
account_id              varchar(15)    not null,
account_balance         numeric(15,2),
ledger_accountnum       varchar(50),
acct_desc               varchar(30),
acct_status             varchar(10),
acct_overdraft          varchar(1),
acct_overdraftlimit     numeric(15,2),
threshold_amt					  numeric(15,2)		--Add by zeal on 05/16/2011
)
go
alter table trust_accounts add constraint trust_accounts_pk 
     primary key (account_id)  

GO
GRANT Select, Update, Insert ON trust_accounts  TO Public
GO

-- TRUST_ACCT_PEOPLE_LINKS
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'TRUST_ACCT_PEOPLE_LINKS')
BEGIN
drop table TRUST_ACCT_PEOPLE_LINKS
END
go 

create table TRUST_ACCT_PEOPLE_LINKS  (
account_id              varchar(15)    not null,
contact_nbr numeric(22) ,
lic_nbr varchar(30),
lic_type varchar(255),
lic_state varchar(30)
)
GO
create unique index trust_acct_people_links_uix on TRUST_ACCT_PEOPLE_LINKS(account_id, contact_nbr, lic_nbr, lic_type, lic_state)
GO

-- Trust_Account_Trans
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'trust_account_trans')
BEGIN
drop table trust_account_trans
END
go

Create table trust_account_trans (
Account_id              varchar(15)     not null,
Trans_type              varchar(70)     not null,
Trans_amount            numeric (15,2)  not null,
Trans_date              datetime        not null,
Trans_by                varchar(70),
Target_acct_id          varchar(15),
PermitNum               varchar(30)		not null,
PAY_KEY					varchar(255)    not null
)
go

alter table trust_account_trans add constraint trust_account_trans_pk
    primary key (account_id, permitnum, trans_type, trans_date, pay_key, trans_amount)
go

grant Select, Update, Insert ON trust_account_trans to public
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_guidesheet')
BEGIN
drop table permit_guidesheet
END
go
create table PERMIT_GUIDESHEET (
PermitNum               varchar(30)     not null,
insp_number             numeric         not null,
guide_key               varchar(100)     not null,
Item_status             varchar(30) not null,
Comments                varchar(2000),
Score                   numeric(30),
GUIDE_TYPE              varchar(200) not null,
GUIDE_ITEM_TEXT         varchar(255) not null,
TEAM_NAME			  VARCHAR(50),
FLOOR				  VARCHAR(50),
FLOOR_UNIT		  	  VARCHAR(50),
HISTORICAL_GUIDE_TEXT VARCHAR(2000),
HISTORICAL_GUIDE_ITEM_STATUS_GROUP VARCHAR(30),
GUIDE_ITEM_STATUS_GROUP VARCHAR(30) not null 
)
go

alter table permit_guidesheet add constraint permit_guidesheet_pk  
     primary key (permitnum,insp_number, guide_key, guide_type, guide_item_text)
create index PERMIT_GUIDESHEET01 on PERMIT_GUIDESHEET (GUIDE_TYPE, GUIDE_ITEM_TEXT)
create index PERMIT_GUIDESHEET02 on PERMIT_GUIDESHEET (GUIDE_ITEM_STATUS_GROUP, Item_status)
create nonclustered index PERMIT_GUIDESHEET03 ON PERMIT_GUIDESHEET (insp_number,guide_key,GUIDE_TYPE,GUIDE_ITEM_TEXT) INCLUDE (HISTORICAL_GUIDE_TEXT)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_STATUS')
BEGIN
DROP TABLE PERMIT_STATUS
END
GO
CREATE TABLE PERMIT_STATUS (
PERMITNUM               VARCHAR(30)     NOT NULL, 
STATUS                  VARCHAR(30)     NOT NULL, 
STATUS_DATE             DATETIME        NOT NULL, 
STATUS_COMMENT          VARCHAR(4000),
USER_ID			VARCHAR(50),
ORDER_BY		NUMERIC	DEFAULT 1
)
GO
CREATE INDEX PERMIT_STATUS_X01 ON PERMIT_STATUS (PERMITNUM)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_ATTACHEDTABLE')
BEGIN
DROP TABLE PERMIT_ATTACHEDTABLE
END
GO
CREATE TABLE PERMIT_ATTACHEDTABLE ( 
PERMITNUM               VARCHAR(30)     NOT NULL, 
GROUP_NAME              VARCHAR(12)     NOT NULL,
TABLE_NAME              VARCHAR(30)     NOT NULL,
COLUMN_NAME             VARCHAR(100)    NOT NULL,
ROW_NUM                 NUMERIC         NOT NULL, 
ATTRIBUTE_VALUE         VARCHAR(4000)    NOT NULL
)
GO
ALTER TABLE PERMIT_ATTACHEDTABLE ADD CONSTRAINT PERMIT_ATTACHEDTABLE_PK 
    PRIMARY KEY (PERMITNUM,GROUP_NAME,TABLE_NAME,COLUMN_NAME,ROW_NUM)
GO
CREATE INDEX PERMIT_ATTACHEDTABLE_X01 ON PERMIT_ATTACHEDTABLE(PERMITNUM,GROUP_NAME,TABLE_NAME,COLUMN_NAME)
GO
-- table permit_calcvaluatn 
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_calcValuatn')
BEGIN
drop table permit_calcValuatn
END
go

create table  permit_calcValuatn  (
permitNum               varchar(30)     not null,
Occ_type                varchar(60)     not null,   -- occupancy type
const_type              varchar(70)     not null,   -- construction type
Unit_Value              numeric(15,2)   not null,
AREA                    NUMERIC(19),              --  NUMBER OF  SQ ft in most cases    8/18/2010  Increase to 19
TotalValue              numeric(15,2)   not null,
Unit_type varchar(60),
Valuatn_version varchar(70)
)
go

create clustered index permit_CalcValuatn01 on permit_calcValuatn(permitnum,Occ_type,const_type)
go

--  ams specific related tables
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_COSTING_AMS')
BEGIN
DROP TABLE PERMIT_COSTING_AMS
END
GO

CREATE TABLE PERMIT_COSTING_AMS (
PERMITNUM               VARCHAR(30)     NOT NULL,
COST_NAME 		          VARCHAR(100)    NOT NULL, -- Leg db cost item key
COST_DATE               DATETIME        NOT NULL,
COST_TYPE               VARCHAR(70)     NOT NULL,      -- Change length to 70 by zeal on 05/16/2011
COST_ITEM               VARCHAR(100)    NOT NULL ,
COST_FIX                NUMERIC(17,4)   DEFAULT 0,
COST_FACTOR             NUMERIC(17,4)   DEFAULT 0,   --Standard Choice of 'COST_FACTOR'
COST_UNIT_COST          NUMERIC(17,4)   NOT NULL, 
COST_UNIT_TYPE          VARCHAR(10),    --Standard Choice of 'COST_UNIT_TYPE'
COST_QUANTITY           NUMERIC(17,4)   DEFAULT 0, 
cost_item_total         numeric(17,4)   null,
COST_COMMENTS           VARCHAR(2000)   NULL,
TASK_CODE 				VARCHAR(30)		NULL,
TASK_ORDER_INDEX 		NUMERIC(4) 		null,
Updated_by 						  varchar(70),		--Add by zeal on 05/17/2011
Updated_date 						DATETIME,				--Add by zeal on 05/17/2011
COST_STATUS							VARCHAR(15),	 --Add by zeal on 05/17/2011
START_TIME							VARCHAR(5),		 --Add by zeal on 05/17/2011
END_TIME								VARCHAR(5),		 --Add by zeal on 05/17/2011
RELATED_ASGN_NBR				bigint		 --Add by zeal on 05/17/2011
)
GO

CREATE CLUSTERED INDEX PERMIT_COSTING_AMS01 ON PERMIT_COSTING_AMS(PERMITNUM, COST_NAME, COST_TYPE, COST_ITEM)
/* ***** Translation Tables List ***** 

Cost Factor Translation Table / RBIZDOMAIN_VALUE / TT_COSTFACTOR 			-> 	COST_FACTOR
Cost Unit Type Translation Table / RBIZDOMAIN_VALUE / TT_COSTUNITTYPE 		-> COST_UNIT_TYPE
Cost Type Translation Table / RWO_COSTING / TT_COSTTYPE 	-> COST_TYPE/COST_ITEM 

*/
GO
/*   table for relating an asset to a work order  (cap)  */
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_asset_ams')
BEGIN
Drop table permit_asset_ams
END
GO

Create table permit_asset_ams (
permitnum varchar(30) not null,
asset_id varchar(65)  NOT NULL,
asset_group varchar(30) not null,
asset_type varchar(30) not null,
WOASSET_ORDER NUMERIC(10) ,   --08/18/2010  Increase to 10
WOASSET_COMPLETE VARCHAR(1),
WOASSET_COMPLETE_DATE DATETIME,
WOASSET_SHORT_NOTES VARCHAR(2000) 
)

Create unique clustered  index permit_asset_ams01 on permit_asset_ams(permitnum, asset_id, asset_group, asset_type)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_TASK_AMS')
BEGIN
DROP TABLE PERMIT_TASK_AMS
END
GO

CREATE TABLE PERMIT_TASK_AMS(
PERMITNUM			VARCHAR(30) NOT NULL,
TASK_CODE 			VARCHAR(30) NOT NULL, -- Refers to RWO_TASK.R1_TASK_CODE
TASK_DESCRIPTION  	VARCHAR(2000),
OPERATION_PROCEDURE	VARCHAR(2000),
ESTIMATE_EFFORT 	NUMERIC(15,2),
DURATION_UNIT 		VARCHAR(10), --Standard Choice of 'WO_TASK_DURATION_UNIT'
ACTUAL_EFFORT 		NUMERIC(15,2),
COMPLETE_DATE 		DATETIME,
COMPLETE_BY 		VARCHAR(70),
COMMENTS  			VARCHAR(2000),
TASK_ORDER 			NUMERIC(8) NOT NULL,
TASK_ORDER_INDEX  NUMERIC(4) NOT NULL --Eric ADD 12/05/2015
)
GO
/* ***** Translation Tables List ***** 

Duration Unit Translation Table / RBIZDOMAIN_VALUE / TT_DURATIONUNIT 	-> 	DURATION_UNIT
Task Code Translation Table / RWO_TASK / TT_AMSTASKCODE 	-> 	TASK_CODE

*/
CREATE UNIQUE INDEX PERMIT_TASK_AMS01 ON PERMIT_TASK_AMS(PERMITNUM, TASK_CODE, TASK_ORDER_INDEX)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_part_ams')
BEGIN
Drop table permit_part_ams
END
go

Create table permit_part_ams (
permitnum varchar(30) not null,
transaction_type varchar(30) not null, -- Valid values are ISSUE and VOID
transaction_date datetime not null ,
quantity numeric(17,4) not null,
Part_number varchar(50)  not null,
location_name varchar(100) not null, 
Part_bin varchar(30) , 
taxable varchar(1) ,
part_brand varchar(100),
part_description varchar(2000),
Part_type  varchar(50),
unit_of_measurement varchar(30),
unit_of_cost numeric(17,4),
comments varchar(2000) ,
last_updated_date  datetime,
last_updated_by varchar(70)
)

/* ***** Translation Tables List ***** 

Permit Transaction Type Translation Table / "ISSUE" and "VOID" / TT_PERMITTRANSACTIONTYPE 	-> 	transaction_type

*/
Create index permit_part_ams01 on permit_part_ams(permitnum)
Create index permit_part_ams02 on permit_part_ams(part_number)
Create index permit_part_ams03 on permit_part_ams(location_name)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_COST_DISTRIBUTION')
BEGIN
DROP TABLE PERMIT_COST_DISTRIBUTION
END
GO

CREATE TABLE PERMIT_COST_DISTRIBUTION (
PERMITNUM 	VARCHAR(30) NOT NULL,
ASSET_ID 	VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE   VARCHAR(100)    NOT NULL,   -- Historical Asset type
PART_NUMBER VARCHAR(50),
COST_NAME 		VARCHAR(100)
)
GO

CREATE INDEX PERMIT_COST_DISTRIBUTION01 ON PERMIT_COST_DISTRIBUTION(PERMITNUM, ASSET_ID, ASSET_HIST_TYPE)
GO


IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_peoplelictable')
BEGIN
drop table  permit_peoplelictable
END
go

Create table  permit_peopleLicTable  (
Permitnum               varchar(30)     not null,
Lic_num                 varchar(30)     not null,
Lic_type                varchar(255)     not null,
table_name              varchar(30)     not null,
Column_name             varchar(100)    not null,
row_num                 numeric(5)      not null,
Column_num              numeric(2)      ,
table_value             varchar(4000)    not null,
INFO_ID     numeric

)
go
ALTER TABLE permit_peopleLicTable ADD CONSTRAINT permit_peopleLicTable_PK 
    PRIMARY KEY (permitnum, lic_num, lic_type, table_name, column_name, row_num)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_EXAM')
BEGIN
Drop table PERMIT_EXAM
END
go
CREATE TABLE PERMIT_EXAM (
PERMITNUM VARCHAR(30) NOT NULL,
PROVIDER_NAME VARCHAR(255) NOT NULL,
EXAM_NAME VARCHAR(80) not null,
IS_REQUIRED VARCHAR(1),
EXAM_DATE DATETIME not null,
GRADING_STYLE VARCHAR(80),
FINAL_SCORE NUMERIC(15,2),
PASSING_SCORE NUMERIC(15,2),
EXAM_COMMENTS VARCHAR(2000),
ADDR1 VARCHAR(200),
ADDR2 VARCHAR(200),
ADDR3 VARCHAR(200),
CITY VARCHAR(30),
STATE VARCHAR(30),
ZIP VARCHAR(10),
PH1_COUNTRY_CODE VARCHAR(3),
PH1 VARCHAR(40),
PH2_COUNTRY_CODE VARCHAR(3),
PH2 VARCHAR(40),
FAX_COUNTRY_CODE VARCHAR(3),
FAX VARCHAR(40),
EMAIL VARCHAR(70),
B1_COUNTRY VARCHAR(30)
)
go
ALTER TABLE PERMIT_EXAM ADD CONSTRAINT PERMIT_EXAM_PK 
    PRIMARY KEY (PERMITNUM, PROVIDER_NAME, EXAM_NAME, EXAM_DATE)
GO

CREATE INDEX PERMIT_EXAM_PERNUM ON PERMIT_EXAM(PERMITNUM)
CREATE INDEX PERMIT_EXAM_PROVIDERNAME ON PERMIT_EXAM (PROVIDER_NAME)

GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_EDUCATION')
BEGIN
DROP TABLE PERMIT_EDUCATION
END
go
CREATE TABLE  PERMIT_EDUCATION (
PERMITNUM VARCHAR(30) NOT NULL,
PROVIDER_NAME VARCHAR(255) NOT NULL,
EDUCATION_NAME VARCHAR(80),
EDU_DEGREE VARCHAR(30),
YEAR_ATTENDED VARCHAR(60),
YEAR_GRADUATED VARCHAR(60),
EDU_COMMENTS VARCHAR(2000),   --8/18/2010   Increase to 2000
IS_REQUIRED VARCHAR(1),
ADDR1 VARCHAR(200),
ADDR2 VARCHAR(200),
ADDR3 VARCHAR(200),
CITY VARCHAR(30),
STATE VARCHAR(30),
ZIP VARCHAR(10),
PH1_COUNTRY_CODE VARCHAR(3),
PH1 VARCHAR(40),
PH2_COUNTRY_CODE VARCHAR(3),
PH2 VARCHAR(40),
FAX_COUNTRY_CODE VARCHAR(3),
FAX VARCHAR(40),
EMAIL VARCHAR(70),
B1_COUNTRY VARCHAR(30)
)
GO

CREATE INDEX PERMIT_EDU_PERNUM ON PERMIT_EDUCATION(PERMITNUM)
CREATE INDEX PERMIT_EDUCATION_PROVIDERNAME ON PERMIT_EDUCATION (PROVIDER_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_CONT_EDU')
BEGIN
DROP TABLE PERMIT_CONT_EDU
END
GO


CREATE TABLE PERMIT_CONT_EDU (
PERMITNUM VARCHAR(30) NOT NULL,
PROVIDER_NAME VARCHAR(255) NOT NULL,
CONT_EDU_NAME VARCHAR(80) not null,
IS_REQUIRED VARCHAR(1),
EDU_CLASS VARCHAR(80) not null,
DATE_OF_CLASS DATETIME not null,
HOURS_COMPLETED NUMERIC(15,2),
GRADING_STYLE VARCHAR(80),
FINAL_SCORE NUMERIC(15,2),
PASSING_SCORE NUMERIC(15,2),
EDU_COMMENTS VARCHAR(2000),
ADDR1 VARCHAR(200),
ADDR2 VARCHAR(200),
ADDR3 VARCHAR(200),
CITY VARCHAR(30),
STATE VARCHAR(30),
ZIP VARCHAR(10),
PH1_COUNTRY_CODE VARCHAR(3),
PH1 VARCHAR(40),
PH2_COUNTRY_CODE VARCHAR(3),
PH2 VARCHAR(40),
FAX_COUNTRY_CODE VARCHAR(3),
FAX VARCHAR(40),
EMAIL VARCHAR(70),
B1_COUNTRY VARCHAR(30)
)
go
ALTER TABLE PERMIT_CONT_EDU ADD CONSTRAINT PERMIT_CONT_EDU_PK 
    PRIMARY KEY (PERMITNUM,PROVIDER_NAME, CONT_EDU_NAME, EDU_CLASS, DATE_OF_CLASS)
    
GO

CREATE INDEX PERMIT_CONT_EDU_PERMITNUM ON PERMIT_CONT_EDU(PERMITNUM)
CREATE INDEX PERMIT_CONT_EDU_PROVIDERNAME ON PERMIT_CONT_EDU (PROVIDER_NAME)

GO 

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_CONDITIONS')
BEGIN
DROP TABLE PERMIT_CONDITIONS
END
GO

CREATE TABLE PERMIT_CONDITIONS (
PERMITNUM VARCHAR(30) NOT NULL,
CON_COMMENTS VARCHAR(4000) NOT NULL,
CON_DES VARCHAR(255),
CON_IMPACT_CODE VARCHAR(8),
EFFECTIVE_DATE DATETIME,
EXPIR_DATE DATETIME,
ISS_DD DATETIME,
STAT_DD DATETIME,
CON_STATUS VARCHAR(30) NOT NULL,
CON_TYPE VARCHAR(255) NOT NULL,
DISPLAY_ORDER NUMERIC(5),
CON_INHERITABLE VARCHAR(1),
CON_GROUP       VARCHAR(255),
ISS_USER_ID	VARCHAR(50),
STAT_USER_ID	VARCHAR(50),
INC_CON_NAME VARCHAR(1),
INC_SHORT_DESC VARCHAR(1),
DIS_CON_NOTICE VARCHAR(1),
CON_STATUS_TYP VARCHAR(20),
LONG_COMMENTS VARCHAR(4000) -- Added By AALTARAZI 04/09/19
)
GO

CREATE INDEX PERMIT_CONDITIONS_PERMITNUM ON PERMIT_CONDITIONS(PERMITNUM)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_ACTIVITY')
BEGIN
DROP TABLE PERMIT_ACTIVITY
END
GO

CREATE TABLE PERMIT_ACTIVITY (
PERMITNUM VARCHAR(30) NOT NULL,
ACT_NAME VARCHAR(30) not null,
ACT_DES VARCHAR(4000),
ACT_TYPE VARCHAR(255) NOT NULL,  -- VALID VALUES ARE IN STANDARD CHOICE 'ACTIVITY_TYPES' MUST VALIDATE AGAINST
ACT_DATE DATETIME NOT NULL,
ACT_DEPT VARCHAR(100),
ACT_STAF VARCHAR(50),
REC_DATE DATETIME,
REC_FUL_NAM VARCHAR(70),
INTERNAL_USE_ONLY VARCHAR(1) NOT NULL,
ACT_DUE_DATE DATETIME,
ACT_STATUS   VARCHAR(30) default 'Completed',
ACT_PRIORITY VARCHAR(30),
act_unique_id numeric  not null
)
CREATE INDEX PERMIT_ACTIVITY_PERMITNUM ON PERMIT_ACTIVITY(PERMITNUM)
GO
ALTER TABLE PERMIT_ACTIVITY ADD CONSTRAINT permitAct_PK PRIMARY KEY (PERMITNUM,act_unique_id)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_ACTIVITY_ASI')
BEGIN
DROP TABLE PERMIT_ACTIVITY_ASI
END
GO
create table PERMIT_ACTIVITY_ASI
(
PERMITNUM VARCHAR(30) NOT NULL,
act_unique_id numeric not null,
asi_group_code varchar(12) not null ,
asi_sub_group  varchar(30) not null,
asi_field_label varchar(100) not null,
asi_field_value varchar(200) not null,
)
go
ALTER TABLE PERMIT_ACTIVITY_ASI ADD CONSTRAINT permitActAsi_PK PRIMARY KEY (PERMITNUM,act_unique_id, asi_sub_group , asi_field_label)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_STRU_ESTA')
BEGIN
DROP TABLE PERMIT_STRU_ESTA
END
GO

CREATE  TABLE PERMIT_STRU_ESTA (
PERMITNUM VARCHAR(30) NOT NULL,
L1_NUMBER  VARCHAR(30) NOT NULL,
L1_GROUP VARCHAR(30) NOT NULL,
L1_TYPE  VARCHAR(30) NOT NULL
)
GO


CREATE UNIQUE INDEX PERMIT_STRU_ESTA_UIX ON PERMIT_STRU_ESTA(PERMITNUM, L1_NUMBER, L1_GROUP, L1_TYPE) 

go
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_ADDRESS_TYPE')
BEGIN
DROP TABLE PERMIT_ADDRESS_TYPE
END
GO

CREATE TABLE PERMIT_ADDRESS_TYPE (
PERMITNUM VARCHAR(30) NOT NULL,
FULL_ADDRESS VARCHAR(600),
ADDRESS_TYPE VARCHAR(30) NOT NULL
)
GO
CREATE UNIQUE INDEX PERMIT_ADDRESS_TYPE_UIX ON PERMIT_ADDRESS_TYPE(PERMITNUM, FULL_ADDRESS, ADDRESS_TYPE)
GO


IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_GUIDESHEET_ASI')
BEGIN
DROP TABLE PERMIT_GUIDESHEET_ASI
END
go


CREATE TABLE PERMIT_GUIDESHEET_ASI (
PERMITNUM			VARCHAR(30) NOT NULL,
INSP_NUMBER			NUMERIC NOT NULL,
GUIDE_KEY			VARCHAR(100) NOT NULL,
ASI_GROUP_CODE		VARCHAR(12) NOT NULL,
ASI_SUB_GROUP_CODE	VARCHAR(30) NOT NULL,
ASI_NAME			VARCHAR(100) NOT NULL,
ASI_VALUE			VARCHAR(4000) NOT NULL,
GUIDE_TYPE			VARCHAR(200) not null,
GUIDE_ITEM_TEXT		VARCHAR(255) not null
)
GO

CREATE UNIQUE INDEX PERMIT_GUIDESHEET_ASI_UIX ON PERMIT_GUIDESHEET_ASI(PERMITNUM, GUIDE_TYPE,GUIDE_ITEM_TEXT, INSP_NUMBER, GUIDE_KEY, ASI_SUB_GROUP_CODE,ASI_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_GUIDESHEET_ASITAB')
BEGIN
DROP TABLE PERMIT_GUIDESHEET_ASITAB
END
GO

CREATE TABLE PERMIT_GUIDESHEET_ASITAB  (
PERMITNUM				VARCHAR(30) NOT NULL,
INSP_NUMBER				NUMERIC NOT NULL,
GUIDE_KEY				VARCHAR(100) NOT NULL,
ASITAB_GROUP_CODE		VARCHAR(12) NOT NULL,
ASITAB_SUB_GROUP_NAME	VARCHAR(30) NOT NULL,
ASITAB_NAME				VARCHAR(100) NOT NULL,
ASITAB_ROW_INDEX		NUMERIC NOT NULL,
ASITAB_VALUE			VARCHAR(4000) NOT NULL,
GUIDE_TYPE              VARCHAR(200) not null,
GUIDE_ITEM_TEXT         VARCHAR(255) not null
)
GO
CREATE UNIQUE INDEX PERMIT_GUIDESHEET_ASITAB_UIX ON PERMIT_GUIDESHEET_ASITAB(PERMITNUM, INSP_NUMBER, GUIDE_KEY,ASITAB_SUB_GROUP_NAME, ASITAB_NAME, ASITAB_ROW_INDEX,GUIDE_TYPE,GUIDE_ITEM_TEXT ) 
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_AUDIT_SETS')
BEGIN
DROP TABLE PERMIT_AUDIT_SETS
END
GO

CREATE TABLE PERMIT_AUDIT_SETS (
PERMITNUM       VARCHAR(30) NOT NULL,
SET_ID          VARCHAR(100) NOT NULL
)
GO

ALTER TABLE PERMIT_AUDIT_SETS ADD CONSTRAINT PERMIT_AUDIT_SETS_PK PRIMARY KEY (PERMITNUM, SET_ID)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'PERMIT_TRUST')
BEGIN
DROP TABLE PERMIT_TRUST
END
GO

CREATE TABLE PERMIT_TRUST (
PERMITNUM            VARCHAR(30) NOT NULL,
TRUST_ACCOUNT_ID     VARCHAR(15) NOT NULL
)
GO

ALTER TABLE PERMIT_TRUST ADD CONSTRAINT PERMIT_TRUST_PK PRIMARY KEY (PERMITNUM, TRUST_ACCOUNT_ID)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_time_accounting')
BEGIN
Drop Table permit_time_accounting
END
GO

Create table permit_time_accounting (
    permitnum        varchar(30) not null,
    time_group_name  varchar(70) not null,
    time_type_name   varchar(70) not null,
    billable_flag    varchar(1)  not null,
    log_date         DATETIME    not null,
    time_start       DATETIME,
    time_end         DATETIME,
    time_elapsed     DATETIME not null,
    total_minutes    NUMERIC  not null,
    materials_desc   varchar(64),
    materials_cost   NUMERIC(17,4),
    Mileage_start    NUMERIC(17,4),
    Mileage_end      NUMERIC(17,4),
    Milage_total     NUMERIC(17,4),
    vehicle_id       varchar(250),
    entry_rate       NUMERIC(17,4) not null,
    entry_pct        NUMERIC(12,4) not null,
    entry_cost       NUMERIC(17,4) not null,
    created_date     DATETIME not null,
    created_by       varchar(70) not null,
    notation         varchar(250),
    group_seq_nbr    NUMERIC not null,
    entity_id        varchar(50),
    entity_type      varchar(20) constraint chk_entity_type check (entity_type in ('INSPECTION','WORKFLOW', 'N/A','RECORD')), 
    user_name        varchar(50) not null,
    Unique_Id        varchar(100),
	TIME_LOG_STATUS  VARCHAR(1) NOT NULL constraint chk_time_log_status check (TIME_LOG_STATUS in ('U','L')),
	RECORD_TYPE		 VARCHAR(3) not null constraint chk_record_type check (RECORD_TYPE in ('CAP','N/A'))
    )
GO

CREATE INDEX PERMIT_TIME_ACCOUNTING_IX ON PERMIT_TIME_ACCOUNTING(PERMITNUM, TIME_GROUP_NAME, TIME_TYPE_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_workflowAdHoc')
BEGIN
Drop Table permit_workflowAdHoc
END
GO

Create table permit_workflowAdHoc (
  permitnum              varchar(30)    not null,
  task_desc              varchar(100)   not null,
  task_status            varchar(200)    not null,
  taskUpdated            DATETIME       not null,
  Fname                  varchar(70),
  Mname                  varchar(70),
  Lname                  varchar(70),
  comments               varchar(4000),
  Process_Code           varchar(70),
  check_level1           varchar(1)     not null,
  check_level2           varchar(1)     not null, 
  G6_ASGN_DD             DATETIME,
  B1_DUE_DD              DATETIME,
  SD_DUE_DAY             NUMERIC(22),
  SD_NOTE                varchar(2000),
  sd_stp_num             NUMERIC,
  ASGN_AGENCY_CODE       varchar(8),
  ASGN_BUREAU_CODE       varchar(8),
  ASGN_DIVISION_CODE     varchar(8),
  ASGN_GROUP_CODE        varchar(8),
  ASGN_SECTION_CODE      varchar(8),
  ASGN_OFFICE_CODE       varchar(8),
  ASGN_FNAME             varchar(70),
  ASGN_MNAME             varchar(70),
  ASGN_LNAME             varchar(70)
)
GO

CREATE INDEX PERMIT_WORKFLOWADHOC_IX ON PERMIT_WORKFLOWADHOC(PERMITNUM, TASK_DESC, TASKUPDATED, SD_STP_NUM)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'permit_TaskSpecInfoAdHoc')
BEGIN
Drop Table permit_TaskSpecInfoAdHoc
END
GO

create table permit_TaskSpecInfoAdHoc (
permitnum              varchar(30)    not null,
task_spec_code         varchar(12)    not null,
Task_spec_type         varchar(30)    not null,
task_spec_name         varchar(100)   not null,
task_spec_value        varchar(240)   not null,
process_code           varchar(70)    not null,
task_desc              varchar(70)    not null,
sd_stp_num             NUMERIC
)
GO

CREATE UNIQUE INDEX  PERMIT_TASKSPECINFOADHOC01 ON PERMIT_TASKSPECINFOADHOC(TASK_SPEC_TYPE, TASK_SPEC_NAME, PROCESS_CODE, TASK_DESC, SD_STP_NUM)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'pos_transaction')
BEGIN
drop table pos_transaction
END
go

create table pos_transaction 
( 
	tran_key       int         not null, -- Loaded it to f4pos_transaction.batch_transaction_nbr
	module_name    varchar(15) not null,
	pos_trans_type varchar(30) not null
)
go

alter table pos_transaction add constraint pos_transaction_pk primary key (tran_key)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'pos_trans_fee')
BEGIN
drop table pos_trans_fee
END
go

create table pos_trans_fee ( 
	tran_key                int            not null, 
	fee_key                 varchar(255)   not null,
	gf_cod                  varchar(15)    not null,
	gf_des                  varchar(100)   not null,
	gf_unit                 numeric(18,4),
	gf_fee                  numeric(15,2),
	gf_fee_apply_date       datetime,
	gf_sub_group            varchar(40),
	gf_fee_schedule         varchar(255),
	gf_fee_schedule_version varchar(255),
	fee_notes               varchar(4000)
)

alter table pos_trans_fee add constraint pos_trans_fee_pk primary key (tran_key, fee_key)
go

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'pos_trans_pay')
BEGIN
drop table pos_trans_pay
END
go

create table pos_trans_pay (
	tran_key                int            not null,
	pay_key                 varchar(255)   not null,
	payment_status          varchar(30)    not null,
	payment_amount          numeric(15,2)  not null,
	payment_date            datetime       not null,
	cashier_id              varchar(70)    not null,
	payment_method          varchar(30),
	payment_ref_nbr         varchar(70),
	payee                   varchar(600),
	payee_address           varchar(240),
	payee_phone             varchar(240),
	cc_auth_code            varchar(30),
	payment_comment         varchar(2000),
	HIST_RECEIPT_NBR        VARCHAR(75)    NOT NULL,
	register_nbr            varchar(8),
	VOID_DATE               DATETIME,
	VOID_BY                 VARCHAR(70) 
)
go

alter table pos_trans_pay add constraint pos_trans_pay_pk primary key (tran_key, pay_key)
go

/*--refer_people*/
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'REFER_PEOPLE')
BEGIN
DROP TABLE REFER_PEOPLE
END
GO

CREATE TABLE REFER_PEOPLE  
(CONTACT_NBR            numeric(22)  NOT NULL,
CONTACT_TYPE            VARCHAR(255) NOT NULL,
TITLE                   VARCHAR(255),
FNAME                   VARCHAR(70),
MNAME                   VARCHAR(70),
LNAME                   VARCHAR(70),
NAME_SUFFIX	            VARCHAR(10),
FULL_NAME               VARCHAR(220),	
BUS_NAME                VARCHAR(255),
ADDR1                   VARCHAR(200),
ADDR2                   VARCHAR(200),
ADDR3                   VARCHAR(200),
CITY                    VARCHAR(30),
STATE                   VARCHAR(30),
ZIP                     VARCHAR(10),
COUNTRY                 VARCHAR(30),
PH1                     VARCHAR(40),
PH2                     VARCHAR(40),
FAX                     VARCHAR(40),
EMAIL                   VARCHAR(80),
G1_ID                   VARCHAR(15),
G1_FLAG                 VARCHAR(1),
COMMENTS                VARCHAR(240),
RELATION                VARCHAR(255),
G1_PREFERRED_CHANNEL    numeric(2),
COUNTRY_CODE	          VARCHAR(2),
GA_IVR_PIN              numeric(10),
PH3	                    VARCHAR(40),	
SALUTATION              VARCHAR(255),
GENDER                  VARCHAR(1),	
POST_OFFICE_BOX         VARCHAR(30),	
BIRTH_DATE              datetime,	
PH1_COUNTRY_CODE        VARCHAR(3),	
PH2_COUNTRY_CODE        VARCHAR(3),	
PH3_COUNTRY_CODE        VARCHAR(3),	
FAX_COUNTRY_CODE	      VARCHAR(3),
SOCIAL_SECURITY_number  VARCHAR(11),
FEDERAL_EMPLOYER_ID_NUM VARCHAR(16),
TRADE_NAME	            VARCHAR(255),	
CONTACT_TYPE_FLAG       VARCHAR(20),
BUSINESS_NAME2          VARCHAR(255),
BIRTH_CITY              VARCHAR(30),
BIRTH_STATE             VARCHAR(30),
BIRTH_REGION            VARCHAR(30),
G1_RACE                 VARCHAR(280),
DECEASED_DATE           datetime,
PASSPORT_NBR            VARCHAR(100),
DRIVER_LICENSE_NBR      VARCHAR(100),
DRIVER_LICENSE_STATE	  VARCHAR(30),
STATE_ID_NBR            VARCHAR(100)
)
GO

create unique index refer_people_pk on refer_people(contact_nbr,contact_type)
GO 

CREATE INDEX REFER_PEOPLE02 ON REFER_PEOPLE(CONTACT_NBR,CONTACT_TYPE,FULL_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'REFER_PEOPLECONDIT')
BEGIN
DROP TABLE REFER_PEOPLECONDIT
END
GO

CREATE TABLE REFER_PEOPLECONDIT
(
  ENTITY_TYPE               VARCHAR(50) NOT NULL,
  ENTITY_ID                 VARCHAR(30) NOT NULL,
  L1_CON_NBR                NUMERIC(22) NOT NULL,
  CON_COMMENT               VARCHAR(4000),
  CON_DES                   VARCHAR(255),
  CON_EFF_DD1               datetime,
  CON_EXPIR_DD              datetime,
  CON_IMPACT_CODE           VARCHAR(8),
  CON_REF_NUM1              VARCHAR(20),
  CON_REF_NUM2              VARCHAR(20),
  CON_STATUS                VARCHAR(30),
  CON_TYP                   VARCHAR(255),
  CON_LONG_COMMENT          VARCHAR(4000),
  CON_DIS_CON_NOTICE        VARCHAR(1),
  CON_INC_CON_NAME          VARCHAR(1),
  CON_INC_SHORT_DESC        VARCHAR(1),
  CON_INHERITABLE           VARCHAR(1),
  CON_STATUS_TYP            VARCHAR(20),
  CON_GROUP                 VARCHAR(255),
  CON_DIS_NOTICE_ACA        VARCHAR(1),
  CON_DIS_NOTICE_ACA_FEE    VARCHAR(1),
  R3_CON_RESOLUTION_ACTION  VARCHAR(4000),     --maps to rcoa_detail
  R3_CON_PUBLIC_DIS_MESSAGE VARCHAR(2000),     --maps to rcoa_detail
  PRIORITY                  NUMERIC(5),        --maps to rcoa_detail
  ADDITIONAL_INFORMATION    varchar(MAX)               --maps to rcoa_detail
)
GO

CREATE INDEX REFER_PEOPLECONDIT_IX ON REFER_PEOPLECONDIT (ENTITY_TYPE, ENTITY_ID,L1_CON_NBR)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'REFER_PEOPLEADDR')
BEGIN
DROP TABLE REFER_PEOPLEADDR
END
GO

CREATE TABLE REFER_PEOPLEADDR
( 
  ENTITY_TYPE        VARCHAR(15) NOT NULL,
  ENTITY_ID          numeric(22) NOT NULL,
  ADDRESS_TYPE       VARCHAR(255),
  EFF_DATE           datetime,
  EXPR_DATE          datetime,
  RECIPIENT          VARCHAR(220),
  FULL_ADDRESS       VARCHAR(1024),
  ADDRESS1           VARCHAR(200),
  ADDRESS2           VARCHAR(200),
  ADDRESS3           VARCHAR(200),
  HSE_NBR_START      numeric(9),
  HSE_NBR_END        numeric(9),
  STR_DIR            VARCHAR(20),
  STR_PREFIX         VARCHAR(20),
  STR_NAME           VARCHAR(40),
  STR_SUFFIX         VARCHAR(30),
  UNIT_TYPE          VARCHAR(20),
  UNIT_START         VARCHAR(10),
  UNIT_END           VARCHAR(10),
  STR_SUFFIX_DIR     VARCHAR(20),
  COUNTRY_CODE       VARCHAR(2),
  CITY               VARCHAR(32),
  STATE              VARCHAR(30),
  ZIP                VARCHAR(10),
  PHONE              VARCHAR(40),
  PHONE_COUNTRY_CODE VARCHAR(3),
  FAX                VARCHAR(40),
  FAX_COUNTRY_CODE   VARCHAR(3),
HSE_NBR_ALPHA_START     VARCHAR(20),
HSE_NBR_ALPHA_END       VARCHAR(20),
LEVEL_PREFIX            VARCHAR(20),
LEVEL_NBR_START         VARCHAR(20),
LEVEL_NBR_END           VARCHAR(20),
VALIDATE_ADDR_FLAG      VARCHAR(1),
PRIMARY_ADDR_FLAG		VARCHAR(1)
)
GO

CREATE INDEX REFER_PEOPLEADDR_IX ON REFER_PEOPLEADDR (ENTITY_TYPE, ENTITY_ID)
GO


/**** Standard tables for Assets  *****/
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_MASTER')
BEGIN
DROP TABLE AMS_MASTER
END
GO

CREATE TABLE AMS_MASTER (
ASSET_ID                VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
ASSET_GROUP             VARCHAR(30) NOT NULL, -- Refers to RASSET_TYPE.R1_ASSET_GROUP
ASSET_TYPE              VARCHAR(30) NOT NULL, -- Refers to RASSET_TYPE.R1_ASSET_TYPE
CLASS_TYPE							VARCHAR(30) NOT NULL, -- Refers to RASSET_TYPE.R1_CLASS_TYPE
ASSET_DESC              VARCHAR(255),
ASSET_STATUS            VARCHAR(30) DEFAULT  'Active', -- Standard Choice of 'ASSET_STATUS'
ASSET_STATUS_DATE       DATETIME,
ASSET_COMMENTS          VARCHAR(2000),
START_VALUE             NUMERIC(17,4), -- INITIAL VALUE OF ASSET
DATE_OF_SERVICE         DATETIME,
USEFUL_LIFE             NUMERIC(15,2),
SALVAGE_VALUE           NUMERIC(17,4),
CURRENT_VALUE           NUMERIC(17,4),
DEPRECIATION_START_DATE DATETIME,
DEPRECIATION_END_DATE   DATETIME,
DEPRECIATION_AMOUNT     NUMERIC(17,4),
DEPRECIATION_VALUE      NUMERIC(17,4),
ASSET_START_ID          VARCHAR(30),
ASSET_END_ID            VARCHAR(30),
DEPENDENCIES_FLAG       VARCHAR(1),
ASSET_SIZE              NUMERIC(15,2),
ASSET_SIZE_UNIT         VARCHAR(30),  -- Standard Choice of 'ASSET_SIZE_UNIT'    %%%%%%%%%%%%%%%
RES_ID					NUMERIC,
G1_ASSET_NAME			VARCHAR(50)
) 
GO


/* ***** Translation Tables List ***** 

ASSET Status Translation Table
ASSET Type Translation Table
Asset Size Unit Translation Table

*/
--ALTER TABLE AMS_MASTER ADD CONSTRAINT AMS_MASTER_PK PRIMARY KEY (ASSET_ID, ASSET_HIST_TYPE, ASSET_GROUP, ASSET_TYPE)
ALTER TABLE AMS_MASTER ADD CONSTRAINT AMS_MASTER_PK PRIMARY KEY (ASSET_ID,  ASSET_GROUP, ASSET_TYPE)
CREATE UNIQUE INDEX AMS_MASTER_TABLE_UIX ON AMS_MASTER(ASSET_ID, ASSET_HIST_TYPE)

GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ATTRIBUTE')
BEGIN
DROP TABLE AMS_ATTRIBUTE
END
GO

CREATE TABLE AMS_ATTRIBUTE(
ASSET_ID                VARCHAR(65)     NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
ASSET_ATTRIB_TEMP_NAME  VARCHAR(30)     NOT NULL,
ASSET_ATTRIB_NAME       VARCHAR(30)     NOT NULL,
ASSET_ATTRIB_VALUE      VARCHAR(2000),
IS_HIDDEN				VARCHAR(1)
)
GO

/* ***** Translation Tables List ***** 
Asset Attribute Translation Table
*/

ALTER TABLE AMS_ATTRIBUTE ADD CONSTRAINT AMS_ATTRIBUTE_PK PRIMARY KEY (ASSET_ID, ASSET_HIST_TYPE, ASSET_ATTRIB_NAME)
CREATE UNIQUE INDEX AMS_ATTRIBUTE_TABLE_UIX ON AMS_ATTRIBUTE(asset_id, asset_hist_type)

GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ATTRIBUTE_TABLE')
BEGIN
DROP TABLE AMS_ATTRIBUTE_TABLE
END
GO

CREATE TABLE AMS_ATTRIBUTE_TABLE(
ASSET_ID                VARCHAR(65)   NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)  NOT NULL,   -- Historical Asset type
ASSET_ATTRIB_TAB_NAME 	VARCHAR(30)   NOT NULL,
ASSET_ATTRIB_NAME       VARCHAR(30)   NOT NULL,
ATTRIB_ROW_INDEX		    NUMERIC(5)    NOT NULL, 
ASSET_ATTRIB_VALUE      VARCHAR(2000)
)
GO

/* ***** Translation Tables List ***** 

Asset Attribute Table Translation Table

*/
CREATE UNIQUE INDEX AMS_ATTRIBUTE_TABLE_UIX ON AMS_ATTRIBUTE_TABLE(ASSET_ID, ASSET_HIST_TYPE ,ASSET_ATTRIB_TAB_NAME, ASSET_ATTRIB_NAME, ATTRIB_ROW_INDEX)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_LOCATION')
BEGIN
DROP TABLE AMS_ASSET_LOCATION
END
GO

CREATE TABLE AMS_ASSET_LOCATION (
ASSET_ID 		 VARCHAR(65) NOT NULL, 
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
ISPRIMARY 	 VARCHAR(1),
STR_NUM_START 	NUMERIC(22),
STR_NUM_END 	NUMERIC(22),
STR_FRAC_START 	VARCHAR(4),
STR_FRAC_END 	VARCHAR(3),
STR_DIR 		VARCHAR(2),
STR_NAME 		VARCHAR(40) NOT NULL,
STR_SUFFIX 		VARCHAR(30),
STR_PREFIX 		VARCHAR(6),
STR_SUFFIX_DIR 	VARCHAR(5),
STR_UNIT_START 	VARCHAR(10),
STR_UNIT_END 	VARCHAR(10),
STR_UNIT_TYPE 	VARCHAR(6),
SITUS_CITY 		VARCHAR(32),
SITUS_STATE 	VARCHAR(30),
SITUS_ZIP 		VARCHAR(10),
ADDRESS1 		VARCHAR(200),
ADDRESS2 		VARCHAR(200),
EXT_UID   		VARCHAR(100)
)
GO

CREATE INDEX AMS_ASSET_LOCATION_01 ON AMS_ASSET_LOCATION (ASSET_ID,ASSET_HIST_TYPE)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_PART')
BEGIN
DROP TABLE AMS_ASSET_PART
END
GO

CREATE TABLE AMS_ASSET_PART (
ASSET_ID     VARCHAR(65)    NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
PART_NUMBER  VARCHAR(50)    NOT NULL,
QUANTITY     NUMERIC(15,2),
COMMENTS     VARCHAR(4000)
)
GO

CREATE UNIQUE INDEX AMS_ASSET_PART01 ON AMS_ASSET_PART(ASSET_ID,ASSET_HIST_TYPE, PART_NUMBER)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_CONDITION')
BEGIN
DROP TABLE AMS_ASSET_CONDITION
END
GO

CREATE TABLE AMS_ASSET_CONDITION(
ASSET_ID  			VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
CON_COMMENTS 		VARCHAR(4000),   --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 4000
CON_DES 			VARCHAR(255),
CON_IMPACT_CODE 	VARCHAR(8),
EFFECTIVE_DATE 		DATETIME,
EXPIR_DATE 			DATETIME,
ISS_AGENCY_CODE 	VARCHAR(8),
ISS_BUREAU_CODE 	VARCHAR(8),
ISS_DIVISION_CODE 	VARCHAR(8),
ISS_SECTION_CODE 	VARCHAR(8),
ISS_GROUP_CODE 		VARCHAR(8),
ISS_OFFICE_CODE 	VARCHAR(8),
ISS_DD 				DATETIME,
ISS_FNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
ISS_MNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
ISS_LNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
STAT_AGENCY_CODE 	VARCHAR(8),
STAT_BUREAU_CODE 	VARCHAR(8),
STAT_DIVISION_CODE 	VARCHAR(8),
STAT_SECTION_CODE 	VARCHAR(8),
STAT_GROUP_CODE 	VARCHAR(8),
STAT_OFFICE_CODE 	VARCHAR(8),
STAT_DD 			DATETIME,
STAT_FNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
STAT_MNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
STAT_LNAME 			VARCHAR(70),  --IIRA 1151. Updated By Eric Liu to support 733, 11/27/2015 extend to 70
CON_STATUS 			VARCHAR(30) NOT NULL,
CON_TYPE 			VARCHAR(255) NOT NULL,
CON_INHERITABLE 	VARCHAR(1)
)
GO
/* ***** Translation Tables List ***** 

Asset Condition Type Translation Table / RBIZDOMAIN_VALUE / TT_ASSETCONDTYPE 	-> 	CON_TYPE -- Standard Choice of 'CONDITION TYPE'
Asset Condition Status Translation Table / RBIZDOMAIN_VALUE / TT_ASSETCONDSTATUS 	-> 	CON_STATUS  -- Standard Choice of 'CONDITION STATUS'
Asset Condition Severity Translation Table / Options: Required/Notice/Lock/Hold / TT_ASSETCONDSEVERITY 	-> 	CON_IMPACT_CODE

*/
CREATE INDEX AMS_ASSET_CONDITION01 ON AMS_ASSET_CONDITION(ASSET_ID,ASSET_HIST_TYPE)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_XASSET_CONTACT')
BEGIN
DROP TABLE AMS_XASSET_CONTACT
END
GO

CREATE TABLE AMS_XASSET_CONTACT (
ASSET_ID                VARCHAR(65)  NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
CONTACT_TYPE            VARCHAR(255) NOT NULL, -- Standard Choice of 'CONTACT TYPE'
PRIMARY_CONTACT_FLG     VARCHAR(1), -- Valid Entries are "Y", "N"
TITLE                   VARCHAR(10),
FNAME                   VARCHAR(15),
MNAME                   VARCHAR(15),
LNAME                   VARCHAR(35),
NAME_SUFFIX             VARCHAR(10),
FULL_NAME               VARCHAR(80),
BUSINESS_NAME           VARCHAR(65),
ADDRESS1                VARCHAR(200),
ADDRESS2                VARCHAR(200),
ADDRESS3                VARCHAR(200),
CITY                    VARCHAR(30),
STATE                   VARCHAR(30), 
ZIP                     VARCHAR(10),
COUNTRY                 VARCHAR(30),
PHONE1                  VARCHAR(40),
PHONE2                  VARCHAR(40),
FAX                     VARCHAR(40),
EMAIL                   VARCHAR(80)
)
GO
/* ***** Translation Tables List ***** 

Asset Contact Type Translation Table / RBIZDOMAIN_VALUE / TT_ASSETCONTACTTYPE 	-> 	CONTACT_TYPE -- Standard Choice of 'CONTACT TYPE'

*/
CREATE INDEX AMS_XASSET_CONTACT_01 ON AMS_XASSET_CONTACT(ASSET_ID, ASSET_HIST_TYPE , CONTACT_TYPE)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_ASSET')
BEGIN
DROP TABLE AMS_ASSET_ASSET
END
GO

CREATE TABLE AMS_ASSET_ASSET(
PARENT_ASSET_ID         VARCHAR(65)     NOT NULL,
PARENT_ASSET_HIST_TYPE  VARCHAR(100)    NOT NULL,   -- Historical Asset type
CHILD_ASSET_ID          VARCHAR(65)     NOT NULL,
CHILD_ASSET_HIST_TYPE   VARCHAR(100)    NOT NULL   -- Historical Asset type
)
GO

ALTER TABLE AMS_ASSET_ASSET ADD CONSTRAINT AMS_ASSET_ASSET_PK  PRIMARY KEY (PARENT_ASSET_ID, PARENT_ASSET_HIST_TYPE, CHILD_ASSET_ID, CHILD_ASSET_HIST_TYPE )
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_USAGE')
BEGIN
DROP TABLE AMS_ASSET_USAGE
END
GO

CREATE TABLE AMS_ASSET_USAGE(
ASSET_ID 		VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
PERMITNUM 		VARCHAR(30) NOT NULL,
READ_ORDER 		NUMERIC, -- Use to calculate reading difference
USAGE_READING 	NUMERIC(17,4) NOT NULL,
UNIT_TYPE 		VARCHAR(30) NOT NULL,      --Refers to RASSET_UNIT_TYPE.R1_UNIT_TYPE_NAME
READING_DATE 	DATETIME,
AGENCY_CODE 	VARCHAR(8),
BUREAU_CODE 	VARCHAR(8),
DIVISION_CODE 	VARCHAR(8),
GROUP_CODE 		VARCHAR(8),
SECTION_CODE 	VARCHAR(8),
OFFICE_CODE 	VARCHAR(8),
READER_FNAME 	VARCHAR(70),-- JIRA 1151 Updated By Eric Liu to support 733, 11/27/2015 extend to 70
READER_MNAME 	VARCHAR(70),--JIRA 1151 Updated By Eric Liu to support 733, 11/27/2015 extend to 70
READER_LNAME 	VARCHAR(70),--JIRA 1151 Updated By Eric Liu to support 733, 11/27/2015 extend to 70
COMMENTS 		VARCHAR(2000)
)
GO
/* ***** Translation Tables List ***** 
Asset Usage Unit Type Translation Table / RASSET_UNIT_TYPE / TT_USAGEUNITTYPE 			-> 	UNIT_TYPE
*/
CREATE INDEX AMS_ASSET_USAGE01 ON AMS_ASSET_USAGE(ASSET_ID, ASSET_HIST_TYPE, PERMITNUM) 
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_RATING')
BEGIN
DROP TABLE AMS_ASSET_RATING
END
GO

CREATE TABLE AMS_ASSET_RATING (
CA_ID				VARCHAR(50),  -- When Null for Asset, else for Asset CA 
ASSET_ID			VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
RATING_TYPE			VARCHAR(60) NOT NULL, -- Refers to RRATING_TYPE.RATING_TYPE
RATING_VALUE		NUMERIC(7,2) NOT NULL,
RATING_CALC_TYPE	VARCHAR(30) NOT NULL, -- Valid entries are 'Manual','Calc'
INSP_FNAME			VARCHAR(70),  -- JIRA 1151.Updated By Eric Liu to support 733, 11/27/2015 extend to 70
INSP_MNAME			VARCHAR(70),--JIRA 1151.Updated By Eric Liu to support 733, 11/27/2015 extend to 70
INSP_LNAME			VARCHAR(70),--JIRA 1151.Updated By Eric Liu to support 733, 11/27/2015 extend to 70
AGENCY_CODE			VARCHAR(8),
BUREAU_CODE			VARCHAR(8),
DIVISION_CODE		VARCHAR(8),
SECTION_CODE		VARCHAR(8),
GROUP_CODE			VARCHAR(8),
OFFICE_CODE			VARCHAR(8),
RATING_DATE			DATETIME
)
GO
/* ***** Translation Tables List ***** 
Asset Rating Type Translation Table / RRATING_TYPE / TT_RATINGTYPE 			-> 	RATING_TYPE
*/
CREATE INDEX AMS_ASSET_RATING01 ON AMS_ASSET_RATING(CA_ID, ASSET_ID,ASSET_HIST_TYPE , RATING_TYPE)
GO


/* ***** STANDARD TABLES FOR PARTS ***** */
     -- Master table for parts  AA table is rpart_inventory
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_PART_INVENTORY')
BEGIN
DROP TABLE AMS_PART_INVENTORY
END
GO

CREATE TABLE AMS_PART_INVENTORY ( 
PART_NUMBER             VARCHAR(50)     NOT NULL,
PART_TYPE               VARCHAR(50), -- Standard Choice of 'PART_TYPE'
PART_BRAND              VARCHAR(30), 
PART_DESCRIPTION        VARCHAR(2000),
PART_STATUS             VARCHAR(15)     DEFAULT 'Active', -- Standard Choice of 'PART_STATUS'
COMMENTS                VARCHAR(2000),
CALCULATE_TYPE          VARCHAR(30)     DEFAULT 'Simple', -- Standard Choice of 'PART_CALCULATE_TYPE'
MAX_QTY                 NUMERIC(17,4)   DEFAULT 0, 
MIN_QTY                 NUMERIC(17,4)   DEFAULT 0, 
REORDER_DUE             VARCHAR(1)      DEFAULT 'N',
REORDER_QTY             NUMERIC(17,4)   DEFAULT 0, 
TAXABLE                 VARCHAR(1)      DEFAULT 'N', -- Valid entries are 'Y' OR 'N'
TOTAL_SUPPLY            NUMERIC(17,4)   DEFAULT 0, 
UNIT_OF_COST            NUMERIC(17,4),
UNIT_OF_MEASUREMENT     VARCHAR(30)     DEFAULT 'Each',-- Standard Choice of 'PART_UNIT_OF_MEASURE'
ACCOUNT_NAME			VARCHAR(280),   --IIRA 1151. added By Eric Liu to support 733, 11/27/2015 
ACCOUNT_NUMBER			VARCHAR(1024)   --IIRA 1151. added By Eric Liu to support 733, 11/27/2015 
)

GO
/* ***** Translation Tables List ***** 

Part Type Translation Table / RBIZDOMAIN_VALUE / TT_PARTTYPE 		 
	-> 	PART_TYPE
Part Status Translation Table / RBIZDOMAIN_VALUE / TT_PARTSTATUS 		-> PART_STATUS
Part Calc Type Translation Table / RBIZDOMAIN_VALUE / TT_PARTCALCTYPE 		->	CALCULATE_TYPE
Part Unit of Measurement Translation Table / RBIZDOMAIN_VALUE / TT_PARTUOFM 		->	UNIT_OF_MEASUREMENT

*/
CREATE UNIQUE INDEX AMS_PART_INVENTORY01 ON AMS_PART_INVENTORY(PART_NUMBER)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_PART_TRANSACTION')
BEGIN
DROP TABLE AMS_PART_TRANSACTION
END
GO

CREATE TABLE AMS_PART_TRANSACTION(
TRANSACTION_TYPE	VARCHAR(30) NOT NULL, -- Valid entries are: "ISSUE","RECEIVE","TRANSFER","ADJUST","RESERVE" 
TRANSACTION_DATE	DATETIME NOT NULL ,
QUANTITY 			NUMERIC(17,4) NOT NULL,
PART_NUMBER 		VARCHAR(50) NOT NULL, -- Refers to RPART_INVENTORY.PART_NUMBER
LOCATION_NAME 		VARCHAR(100) NOT NULL, -- For transfer tansaction, refers to RPART_LOCATION.LOCATION_NAME
TO_LOCATION_NAME	VARCHAR(100), -- Refers to RPART_LOCATION.LOCATION_NAME, required for "TRANSFER"
UNIT_COST 			NUMERIC(17,4),
PART_BIN 			VARCHAR(30), 
COMMENTS 			VARCHAR(2000),
HARD_RESERV_FLAG	VARCHAR(1), -- Valid entries are "Y", "N"
last_updated_date  datetime,
last_updated_by varchar(70)
)
GO
/* ***** Translation Tables List ***** 

Ams Transaction Type Translation Table / "ISSUE","RECEIVE","TRANSFER","ADJUST","RESERVE"  / TT_AMSTRANSACTIONTYPE 			-> 	TRANSACTION_TYPE

*/
CREATE INDEX AMS_PART_TRANSACTION01 ON AMS_PART_TRANSACTION(PART_NUMBER)
CREATE INDEX AMS_PART_TRANSACTION02 ON AMS_PART_TRANSACTION(LOCATION_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_XPART_CONTACT')
BEGIN
DROP TABLE AMS_XPART_CONTACT
END
GO

CREATE TABLE AMS_XPART_CONTACT(
PART_NUMBER       VARCHAR(20) NOT NULL, -- Refers to RPART_INVENTORY.PART_NUMBER
BUSINESS_NAME     VARCHAR(80) NOT NULL, -- Refers to RPART_CONTACT.BUSINESS_NAME 
CONTACT_FLAG      VARCHAR(30) NOT NULL, -- Refers to RPART_CONTACT.CONTACT_FLAG
ORIGINAL_PART_ID  VARCHAR(30),
PRIMARY_FLAG      VARCHAR(1) NOT NULL,
COMMENTS          VARCHAR(2000)
)
GO
/* ***** Translation Tables List ***** 

Part Contact Flag Translation Table / Null / TT_PARTCONTACTFLAG(Options: "Vendor", "Manufacturer") 	-> 	CONTACT_FLAG

*/
CREATE UNIQUE INDEX AMS_XPART_CONTACT01 ON AMS_XPART_CONTACT(PART_NUMBER,BUSINESS_NAME,CONTACT_FLAG)
GO

 
/* ***** Standard Tables for Gasset_ca  ***** */
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_CA')
BEGIN
DROP TABLE AMS_ASSET_CA
END
GO

CREATE TABLE AMS_ASSET_CA (
CA_ID					VARCHAR(50) NOT NULL, 
ASSET_ID				VARCHAR(65) NOT NULL,
ASSET_HIST_TYPE         VARCHAR(100)    NOT NULL,   -- Historical Asset type
CONDITION_ASSESSMENT	VARCHAR(30) NOT NULL, -- refers to RASSET_CA.R1_CONDITION_ASSESSMENT
INSP_SCHED_DATE			DATETIME,
INSP_SCHED_TIME			VARCHAR(10),
INSP_DATE				DATETIME,
INSP_TIME				VARCHAR(10),
INSP_FNAME				VARCHAR(15),
INSP_MNAME				VARCHAR(15),
INSP_LNAME				VARCHAR(25),
AGENCY_CODE				VARCHAR(8),
BUREAU_CODE				VARCHAR(8),
DIVISION_CODE			VARCHAR(8),
SECTION_CODE			VARCHAR(8),
GROUP_CODE				VARCHAR(8),
OFFICE_CODE				VARCHAR(8),
TIME_SPENT				NUMERIC(7,2),
CA_STATUS				VARCHAR(30),  -- Standard Choice of 'ASSET_CONDITION_ASSESSMENT_STATUS'
COMMENTS				VARCHAR(2000)
)
GO
/* ***** Translation Tables List ***** 

Asset Ca Condition Assessment Translation Table / RASSET_CA / TT_CONDITIONASSESSMENT 	-> 	CONDITION_ASSESSMENT
Asset Ca Status Translation Table / RBIZDOMAIN_VALUE / TT_CASTATUS 	-> 	CA_STATUS

*/
CREATE UNIQUE INDEX AMS_ASSET_CA01 ON AMS_ASSET_CA(CA_ID)
CREATE INDEX AMS_ASSET_CA02 ON AMS_ASSET_CA(ASSET_ID, ASSET_HIST_TYPE)
GO

/* ***** Gasset_ca_attr ***** */
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_CA_ATTR')
BEGIN
DROP TABLE AMS_ASSET_CA_ATTR
END
GO

CREATE TABLE AMS_ASSET_CA_ATTR(
CA_ID 					VARCHAR(50) NOT NULL,
CONDITION_ASSESSMENT	VARCHAR(30) NOT NULL,
ATTRIBUTE_NAME 	VARCHAR(30) NOT NULL,   -- Refer to rasset_ca_attr.R1_ATTRIBUTE_NAME
ATTRIBUTE_VALUE VARCHAR(2000)
)
GO
/* ***** Translation Tables List ***** 

Asset CA Attribute Translation Table / RASSET_CA_ATTR / TT_ASSETCAATTRIB	-> 	ATTRIBUTE_NAME

*/
CREATE UNIQUE INDEX AMS_ASSET_CA_ATTR01 ON AMS_ASSET_CA_ATTR(CA_ID, CONDITION_ASSESSMENT, ATTRIBUTE_NAME)
GO



/* ***** Gasset_ca_observ ***** */
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_ASSET_CA_OBSERV')
BEGIN
DROP TABLE AMS_ASSET_CA_OBSERV
END
GO

CREATE TABLE AMS_ASSET_CA_OBSERV (
CA_ID 			VARCHAR(50) NOT NULL,
CONDITION_ASSESSMENT	VARCHAR(30) NOT NULL,
ROW_INDEX 		NUMERIC(8)  NOT NULL, 
ATTRIBUTE_NAME 	VARCHAR(30) NOT NULL,  -- Refer to RASSET_CA_OBSERV_ATTR.R1_ATTRIBUTE_NAME
ATTRIBUTE_VALUE VARCHAR(2000)
)
GO
/* ***** Translation Tables List ***** 

Asset CA Observ Table Translation Table

*/
CREATE UNIQUE INDEX AMS_ASSET_CA_OBSERV01 ON AMS_ASSET_CA_OBSERV (CA_ID, CONDITION_ASSESSMENT, ROW_INDEX, ATTRIBUTE_NAME)
GO

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'AMS_XASSET_CA_WO')
BEGIN
DROP TABLE AMS_XASSET_CA_WO
END
GO

CREATE TABLE AMS_XASSET_CA_WO (
CA_ID 		VARCHAR(50) NOT NULL,
PERMITNUM 	VARCHAR(30) NOT NULL
)
GO

CREATE UNIQUE INDEX AMS_XASSET_CA_WO01 ON AMS_XASSET_CA_WO (CA_ID, PERMITNUM)
GO


IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'REFER_PEOPLE_LINKS')
BEGIN
DROP TABLE REFER_PEOPLE_LINKS
END
GO

CREATE TABLE REFER_PEOPLE_LINKS (
	CONTACT_NBR NUMERIC(22) NOT NULL,
	ENT_TYPE VARCHAR(50),
	ENT_ID1 VARCHAR(100),
	ENT_ID2 VARCHAR(255) ,
	ENT_ID3 VARCHAR(255),
	PRIMARY_FLAG varchar(10),
	comments varchar(2000),
	START_DATE DATETIME,
	END_DATE DATETIME
)
GO

Create unique index refer_people_links_uix on refer_people_links (contact_nbr, ent_type, ent_id1, ent_id2, ent_id3);
GO

IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'LIC_PROF' )
BEGIN
     DROP  Table  Lic_prof
END

CREATE TABLE Lic_prof (
serv_prov_code          varchar(15)  not null,
lic_nbr                 varchar(30)  not null,
lic_status              varchar(1)   not null,
lic_state               varchar(2)   not null,
lic_type                varchar(255) not null,
bus_name                varchar(255) not null,
lic_orig_iss_dd         datetime,
last_renewal_dd         datetime,
lic_expir_dd            datetime,
cae_fname               varchar(70), 
cae_mname               varchar(70),
cae_lname               varchar(70),
address1                varchar(200),
address2                varchar(200),
city                    varchar(32),
state                   varchar(2),
zip			                varchar(10),
phone1			            varchar(40),
phone2			            varchar(40),
fax			                varchar(40),
email			              varchar(70),
lic_comment		          varchar(2000),
ins_co_name		          varchar(65),
ins_amount		          numeric(12,2),
ins_policy_no		        varchar(30),
ins_exp_dt		          datetime,
bus_lic			            varchar(15),
bus_lic_exp_dt		      datetime,
last_update_dd		      datetime,			-- not used at this time
lic_seq_nbr		          numeric,
rec_date		            datetime ,
rec_ful_nam		          varchar(70),
rec_flag		            varchar(1),
lic_board 	            varchar(255),
address3                varchar(200),
wc_exempt               varchar(1),
wc_policy_no            varchar(30),
wc_eff_dt               datetime,
wc_exp_dt               datetime,
wc_canc_dt              datetime,
suffix_name             varchar(10),
country                 varchar(30),
county_code             varchar(2),   
wc_ins_co_code          varchar(3),   
contr_lic_no            numeric,
cont_lic_bus_name       varchar(255),
ga_ivr_pin              numeric,
l1_salutation	          varchar(255),		
l1_gender	              varchar(1),		
l1_post_office_box      varchar(30),		
bus_name2               varchar(255),		
l1_birth_date           datetime,
phone1_country_code     varchar(3),
phone2_country_code     varchar(3),
fax_country_code        varchar(3),	
lic_type_flag                 varchar(20),
lic_social_security_nbr       varchar(11),	
lic_federal_employer_id_nbr   varchar(16),	
phone3                        varchar(40),	
phone3_country_code           varchar(3),	
aca_permission                varchar(1),		
l1_title                      varchar(255),		
past_days                     numeric
 );
go

  Create unique clustered index lic_prof01 on lic_prof (Serv_prov_code,Lic_nbr,lic_type)
go
-- licensed professional attributes staging table

      IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'LIC_PROF_ATTR' )
	  BEGIN
            DROP  Table  Lic_prof_attr
	  END
go

Create table lic_prof_attr(
serv_prov_code          varchar(15) not null,
lic_nbr                 varchar(30) not null,
lic_type                varchar(255) not null,
attrib_temp_name        varchar(30) not null,
attrib_name             varchar(30) not null,
attrib_value            varchar(200) not null
 );
go

 create unique clustered index lic_prof_attr01 on lic_prof_attr(serv_prov_code, lic_nbr, lic_type, attrib_name)
go

-- TABLE LICENSED PROFESSIONAL ATTACHED TABLES
-- (all fields required for input to be processed)

      IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'LIC_PROF_ATTACH' )
	  BEGIN
            DROP  Table  Lic_prof_attach
	  END
go

Create table lic_prof_attach(
serv_prov_code		    varchar(15) not null,	--serv_prov_code to be processed
lic_nbr			        varchar(30) not null,	--license number
lic_type		        varchar(255) not null,
group_name		        varchar(12) not null,	--validated against r2chckbox.r1_checkbox_code
table_name		        varchar(30) not null,	--validated against r2chckbox.r1_checkbox_type
column_name		        varchar(100) not null,	--validated against r2chckbox.r1_checkbox_desc
row_num			        numeric not null,	--row number which provided field belongs to in the mapped attached table
attach_value		    varchar(240) not null	--input data value, must match expected data type or error will occur in app
 );
go

 create unique clustered index lic_prof_attach01 on lic_prof_attach(serv_prov_code, lic_nbr, lic_type, table_name, row_num, column_name)
go

-- TEMPLATE_ASI
IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'TEMPLATE_ASI' )
BEGIN
DROP  Table  TEMPLATE_ASI
END
go

create table TEMPLATE_ASI  
( 
    ENTITY_TYPE numeric NOT NULL ,
    ENTITY_ID numeric NOT NULL, 
    GROUP_CODE VARCHAR(12) NOT NULL ,
    ASI_SUB_GROUP_CODE  VARCHAR(30) NOT NULL,
    FIELD_NAME VARCHAR(100) NOT NULL,
    FIELD_VALUE VARCHAR(4000) NOT NULL 
);

CREATE unique clustered INDEX TEMP_ASI_UIX ON TEMPLATE_ASI(ENTITY_TYPE, ENTITY_ID,GROUP_CODE, ASI_SUB_GROUP_CODE, FIELD_NAME)

-- TEMPLATE_ASIT
IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'TEMPLATE_ASIT' )
BEGIN
DROP  Table TEMPLATE_ASIT
END
go

create table TEMPLATE_ASIT  
( 
    ENTITY_TYPE numeric NOT NULL ,
    ENTITY_ID numeric NOT NULL, 
    GROUP_CODE VARCHAR(12) NOT NULL ,
    ASI_SUB_GROUP_CODE  VARCHAR(30) NOT NULL,
    FIELD_NAME VARCHAR(100) NOT NULL,
    FIELD_VALUE VARCHAR(4000) NOT NULL,
    ROW_INDEX numeric not null 
);

CREATE UNIQUE clustered INDEX TEMP_ASIT_UIX ON TEMPLATE_ASIT(ENTITY_TYPE, ENTITY_ID,GROUP_CODE, ASI_SUB_GROUP_CODE, FIELD_NAME,ROW_INDEX) ;

-- PERMIT_PAYMENTS
IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'PERMIT_PAYMENTS' )
BEGIN
	DROP  Table  PERMIT_PAYMENTS
END
go

CREATE TABLE PERMIT_PAYMENTS (
PERMITNUM VARCHAR(30) NOT NULL,
PAY_KEY  VARCHAR(255) NOT NULL ,
PAYMENT_METHOD                                     VARCHAR(30) not null ,
PAYMENT_REF_NBR                                    VARCHAR(70 ),
CC_TYPE                                            VARCHAR(30 ),
PAYEE                                              VARCHAR(600 ),
PAYMENT_DATE                                       DATE  not null ,
PAYMENT_AMOUNT                                     NUMERIC(15,2) not null ,
TRANSACTION_CODE                                   VARCHAR(50 ),
TRANSACTION_NBR                                    VARCHAR(30 ),
PAYMENT_COMMENT                                    VARCHAR(2000 ),
CASHIER_ID                                         VARCHAR(70) default 'AA CONV'   ,
REGISTER_NBR                                       VARCHAR(8),
REC_DATE                                           DATE NOT NULL,
REC_FUL_NAM                                        VARCHAR(70 ) NOT NULL,
ACCT_ID                                            VARCHAR(15 ),
PAYEE_ADDRESS                                      VARCHAR(700 ),
PAYEE_PHONE                                        VARCHAR(240 ),
CC_AUTH_CODE                                       VARCHAR(30 ),
PAYEE_PHONE_IDD                                    VARCHAR(3 ),
PAYMENT_RECEIVED_CHANNEL                           VARCHAR(30 ),
CHECK_NUMBER                                       VARCHAR(30 ),
CHECK_TYPE                                         VARCHAR(100 ),
DRIVER_LICENSE                                     VARCHAR(100 ),
CHECK_HOLDER_NAME                                  VARCHAR(255 ),
CHECK_HOLDER_EMAIL                                 VARCHAR(80 ),
PHONE_NUMBER                                       VARCHAR(40 ),
COUNTRY                                            VARCHAR(30 ),
STATE                                              VARCHAR(30 ),
CITY                                               VARCHAR(30 ),
STREET                                             VARCHAR(240 ),
ZIP                                                VARCHAR(10 ),
REASON                                             VARCHAR(300 ),
PAYEE_TYPE                                         VARCHAR(255),
HIST_RECEIPT_NBR                                   VARCHAR(30), 
VOID_BY                                            VARCHAR(70),
VOID_DATE                                          DATE,
payment_pay_key                                    VARCHAR(255)
) ;
go

ALTER TABLE PERMIT_PAYMENTS ADD CONSTRAINT PERMIT_PAYMENTS_PK PRIMARY KEY  (PERMITNUM, PAY_KEY) ;
go

CREATE INDEX PERMIT_PAYMENTS_idx01 ON PERMIT_PAYMENTS(HIST_RECEIPT_NBR)
GO

-- PERMIT_RECEIPTS
IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'PERMIT_RECEIPTS' )
BEGIN
	DROP  Table  PERMIT_RECEIPTS
END
go

CREATE TABLE  PERMIT_RECEIPTS (
HIST_RECEIPT_NBR  VARCHAR(30) not null ,
RECEIPT_DATE                              DATE NOT NULL ,
CASHIER_ID                                VARCHAR(70 ) NOT NULL ,
REGISTER_NBR                              VARCHAR(8 ),
RECEIPT_AMOUNT                            NUMERIC(15,2) not null ,
RECEIPT_COMMENT                           VARCHAR(800 ),
RECEIPT_STATUS                            VARCHAR(30 ),
TRANSACTION_CODE                          VARCHAR(50 ),
TRANSACTION_NBR                           VARCHAR(30 ),
REC_DATE                                   DATE NOT NULL ,
REC_FUL_NAM                                VARCHAR(70 ) NOT NULL,
TTERMINAL_ID                               VARCHAR(10 ),
WORKSTATION_ID                             VARCHAR(70 )
) ;
 create unique index PERMIT_RECEIPTS_idx1 on PERMIT_RECEIPTS(HIST_RECEIPT_NBR);
go

IF EXISTS (SELECT name  FROM sysobjects WHERE type = 'U' AND name = 'STDMAP_STATISTICS' )
BEGIN
	DROP  Table  STDMAP_STATISTICS
END
go
CREATE TABLE STDMAP_STATISTICS(
MAP_TABLE_NAME VARCHAR(200),
MAP_NUM_OF_ROWS integer,
HIST_TABLE_NAME VARCHAR(200),
HIST_NUM_OF_ROWS integer,
MAP_REC_DATE datetime,
HIST_REC_DATE datetime
);
go