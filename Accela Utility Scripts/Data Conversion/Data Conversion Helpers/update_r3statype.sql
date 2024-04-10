begin transaction
update sprocess
set sd_pro_des = 'County Engineering Review'
where R1_PROCESS_CODE = 'PLNG_SUBDIV_MINOR_PLAT'
and sd_pro_des like 'County Engineering%'
;
commit;

begin transaction
update R3STATYP
set r3_act_type_des = 'County Engineering Review'
where R3_PROCESS_CODE = 'PLNG_SUBDIV_MINOR_PLAT'
and r3_act_type_des like 'County Engineering%'
;