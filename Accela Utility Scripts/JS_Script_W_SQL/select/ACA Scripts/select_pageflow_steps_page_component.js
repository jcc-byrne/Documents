/*
FOR SSMS
select top 20 * from RPF_GROUP where PF_GROUP_CODE like 'LIC %'
select top 20 * from RPF_STEP 
select top 20 * from RPF_PAGE
select top 20 * from RPF_COMPONENT where PF_GROUP_CODE like 'LIC %' and COMPONENT_NAME = 'Applicant'
*/


/**
 * SELECT PAGEFLOW STEP
 * Contains details of STEP_NAME AND DISPLAY_ORDER
 * 
 */
var pfGroupCode = 'lic_%' 

var sql = "SELECT top 100 * FROM RPF_STEP d \n" +
"WHERE d.SERV_PROV_CODE = ? and UPPER(d.pf_group_code) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[aa.getServiceProviderCode(), pfGroupCode]);

if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
    }
} else {
    logDebug(result.getErrorMessage())
}

function logDebug(str) {aa.print(str);}


/**
 * SELECT PAGEFLOW PAGE
 * contains PAGE_NAME, display order, onload, before, and after script names, and page instructions
 * 
 */

var pfGroupCode = 'lic_%' 

var sql = "SELECT top 100 * FROM RPF_PAGE d \n" +
"WHERE d.SERV_PROV_CODE = ? and UPPER(d.pf_group_code) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[aa.getServiceProviderCode(), pfGroupCode]);

if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
    }
} else {
    logDebug(result.getErrorMessage())
}

function logDebug(str) {aa.print(str);}

/**
 * SELECT PAGEFLOW COMPONENT
 *  contains custom_heading, display order, component instructions, and portlet_range1 and portlet_range2 which are ASI/ASIT group and subgroup
 * 
 */
var pfGroupCode = 'LIC_Business_SidewalkDining_App%' 

var sql = "SELECT top 100 * FROM RPF_COMPONENT d \n" +
"WHERE d.SERV_PROV_CODE = ? and UPPER(d.pf_group_code) LIKE UPPER( ? ) " 
var result = aa.db.select(sql,[aa.getServiceProviderCode(), pfGroupCode]);

if (result.getSuccess()) {
    var data = result.getOutput();
    logDebug("Count:" + data.size());
    for (var d = 0; d < data.size(); d++) {
        logDebug("Row " + d + ": " + data.get(d));
    }
} else {
    logDebug(result.getErrorMessage())
}

function logDebug(str) {aa.print(str);}


