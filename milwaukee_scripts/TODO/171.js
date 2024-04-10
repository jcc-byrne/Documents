/*------------------------------------------------------------------------------------------------------/
| Program  : WTUA;LICENSES!BUSINESS!TEMPORARY PUBLIC ENT. PREMISES!APPLICATION.js
| Event    : WTUA;LICENSES!BUSINESS!TEMPORARY PUBLIC ENT. PREMISES!APPLICATION.js
|
| Client   : MILWAUKEE
| Author   : JACOB CLAY (BYRNE SOFTWARE)
| Date	   : 08/07/2023
|
| Notes    : 08/07/2023 - Develop MKEBL-171
/------------------------------------------------------------------------------------------------------*/


logDebug('>>>Begin ticket MKEBL-171')
if (wfTask == 'Application Submittal' && wfStatus == 'Complete') {
    var asiPlaceEnt = getAppSpecific('Place of Entertainment');
    var asiTempConst = getAppSpecific('Temporary Construction');
    var asiLargeTent = getAppSpecific('Larger Tents');
    if (matches(asiPlaceEnt, 'Both Indoors & Outdoors', 'Indoors') || asiTempConst == 'CHECKED' || asiLargeTent == 'Yes'){
        var eParams = aa.util.newHashtable();
        getRecordParams4Notification(eParams);
        addParameter(eParams, '$$asiPlace$$', asiPlaceEnt);
        addParameter(eParams, '$$asiConst$$', asiTempConst);
        addParameter(eParams, '$$asiTent$$', asiLargeTent);


        sendNotification('noreply@accela.com', '', '', 'LICENSES_TPEP_DNS_NOTICE', eParams, new Array());
    } else {
        deactivateTask('Neighborhood Services Review' )
    }
} 
logDebug('<<<End ticket MKEBL-171')