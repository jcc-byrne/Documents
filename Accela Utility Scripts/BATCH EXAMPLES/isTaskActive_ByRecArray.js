/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_ADD_PERM_WTR_MTR_INSPECTIONS.js   
| Trigger: Batch
| Client: Babcock
|
| Frequency: Once
|
| Desc: Babcock Ranch would like to add backflow certification inspections to all Permanent Water Meter records that have a water meter installed. 
|              
|   Note: it will take the current date when the batch started
|
|Parameters are:
|
/------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/--------------------------------------------------------------------------------------------------------*/
var VS = 1;
var debugText = "";
var showDebug = false;
var showMessage = false;
var message = "";
var emailText = "";
var br = "<br>";
/*-------------------------------------------------------------------------------------------------------/
 |
 | END: USER CONFIGURABLE PARAMETERS
 |
/--------------------------------------------------------------------------------------------------------*/
var sysDate = aa.date.getCurrentDate();
var batchJobResult = aa.batchJob.getJobID()
var batchJobName = "" + aa.env.getValue("BatchJobName");
var SA = "";
var SCRIPT_VERSION = 3.0;
var batchStartDate = new Date();
var batchStartTime = batchStartDate.getTime();
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;


function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

function getMasterScriptText(vScriptName) {
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
    return emseScript.getScriptText() + "";
}

var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

showDebug = true;
batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    aa.print("Batch Job " + batchJobName + " Job ID is " + batchJobID + br);
}
else {
    aa.print("Batch job ID not found " + batchJobResult.getErrorMessage() + br);
}
aa.print("=========================" + br);
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var runDate = new Date();
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var currentUserID = "ADMIN";
var procCount = 0;

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

aa.print("Start of Job" + br);
try {

    mainProcess();
}
catch (err) {
    aa.print("ERROR: " + err.message + br)
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
function mainProcess() {
    //Batch Variables
    try {
var recArray = new Array();

recArray.push('RLSP16-03880');
recArray.push('RLSP16-03883');
recArray.push('RLSP16-03887');
recArray.push('RLSP16-03891');
recArray.push('RLSP16-03959');
recArray.push('RLSP16-03960');
recArray.push('RLSP16-03961');
recArray.push('RLSP16-03962');
recArray.push('RLSP16-04016');
recArray.push('RLSP16-04017');
recArray.push('RLSP16-04018');
recArray.push('RLSP16-04041');
recArray.push('RLSP16-04055');
recArray.push('RLSP16-04058');
recArray.push('RLSP17-03879');
recArray.push('RLSP17-03901');
recArray.push('RLSP17-03924');
recArray.push('RLSP17-03945');
recArray.push('RLSP17-03946');
recArray.push('RLSP17-03947');
recArray.push('RLSP17-03948');
recArray.push('RLSP17-03949');
recArray.push('RLSP17-04008');
recArray.push('RLSP17-04010');
recArray.push('RLSP17-04011');
recArray.push('RLSP17-04023');
recArray.push('RLSP17-04024');
recArray.push('RLSP17-04025');
recArray.push('RLSP17-04026');
recArray.push('RLSP17-04028');
recArray.push('RLSP17-04042');
recArray.push('RLSP17-04054');
recArray.push('RLSP17-04056');
recArray.push('RLSP17-04057');
recArray.push('RLSP17-08167');
recArray.push('RLSP17-08168');
recArray.push('RLSP17-08175');
recArray.push('RLSP17-08176');
recArray.push('RLSP17-08177');
recArray.push('RLSP17-08178');
recArray.push('RLSP17-08179');
recArray.push('RLSP17-08180');
recArray.push('RLSP17-08181');
recArray.push('RLSP17-08182');
recArray.push('RLSP17-08183');
recArray.push('RLSP17-08184');
recArray.push('RLSP17-08185');
recArray.push('RLSP17-08186');
recArray.push('RLSP17-08199');
recArray.push('RLSP17-08200');
recArray.push('RLSP17-08202');
recArray.push('RLSP17-08204');
recArray.push('RLSP17-08205');
recArray.push('RLSP17-08206');
recArray.push('RLSP17-08207');
recArray.push('RLSP17-08208');
recArray.push('RLSP17-08209');
recArray.push('RLSP17-08211');
recArray.push('RLSP17-08212');
recArray.push('RLSP17-08213');
recArray.push('RLSP17-08214');
recArray.push('RLSP17-08215');
recArray.push('RLSP17-08216');
recArray.push('RLSP17-08217');
recArray.push('RLSP17-08218');
recArray.push('RLSP17-08219');
recArray.push('RLSP17-08220');
recArray.push('RLSP17-08226');
recArray.push('RLSP17-08231');
recArray.push('RLSP17-08232');
recArray.push('RLSP17-08233');
recArray.push('RLSP17-08234');
recArray.push('RLSP17-08235');
recArray.push('RLSP17-08236');
recArray.push('RLSP17-08237');
recArray.push('RLSP17-08241');
recArray.push('RLSP18-03832');
recArray.push('RLSP18-03838');
recArray.push('RLSP18-03844');
recArray.push('RLSP18-03845');
recArray.push('RLSP18-03875');
recArray.push('RLSP18-03878');
recArray.push('RLSP18-03886');
recArray.push('RLSP18-03888');
recArray.push('RLSP18-03890');
recArray.push('RLSP18-03893');
recArray.push('RLSP18-03897');
recArray.push('RLSP18-03898');
recArray.push('RLSP18-03899');
recArray.push('RLSP18-03900');
recArray.push('RLSP18-03902');
recArray.push('RLSP18-03904');
recArray.push('RLSP18-03905');
recArray.push('RLSP18-03907');
recArray.push('RLSP18-03913');
recArray.push('RLSP18-03958');
recArray.push('RLSP18-03978');
recArray.push('RLSP18-03996');
recArray.push('RLSP18-04006');
recArray.push('RLSP18-04029');
recArray.push('RLSP18-04051');
recArray.push('RLSP18-04059');
recArray.push('RLSP18-04164');
recArray.push('RLSP18-04165');
recArray.push('RLSP18-04166');
recArray.push('RLSP18-04167');
recArray.push('RLSP18-04168');
recArray.push('RLSP18-04169');
recArray.push('RLSP18-04170');
recArray.push('RLSP18-04171');
recArray.push('RLSP18-04172');
recArray.push('RLSP18-04173');
recArray.push('RLSP18-04174');
recArray.push('RLSP18-04180');
recArray.push('RLSP18-04181');
recArray.push('RLSP18-04182');
recArray.push('RLSP18-04183');
recArray.push('RLSP18-04184');
recArray.push('RLSP18-04185');
recArray.push('RLSP18-04186');
recArray.push('RLSP18-04187');
recArray.push('RLSP18-04190');
recArray.push('RLSP18-04218');
recArray.push('RLSP18-04219');
recArray.push('RLSP18-04220');
recArray.push('RLSP18-04227');
recArray.push('RLSP18-04228');
recArray.push('RLSP18-04229');
recArray.push('RLSP18-04235');
recArray.push('RLSP18-04237');
recArray.push('RLSP18-04238');
recArray.push('RLSP18-04250');
recArray.push('RLSP18-04253');
recArray.push('RLSP18-04254');
recArray.push('RLSP18-04255');
recArray.push('RLSP18-04256');
recArray.push('RLSP18-04257');
recArray.push('RLSP18-04258');
recArray.push('RLSP18-04259');
recArray.push('RLSP18-04260');
recArray.push('RLSP18-04261');
recArray.push('RLSP18-04262');
recArray.push('RLSP18-04263');
recArray.push('RLSP18-04265');
recArray.push('RLSP18-04266');
recArray.push('RLSP18-04268');
recArray.push('RLSP18-04277');
recArray.push('RLSP18-04278');
recArray.push('RLSP18-04279');
recArray.push('RLSP18-04280');
recArray.push('RLSP18-04282');
recArray.push('RLSP18-04283');
recArray.push('RLSP18-04284');
recArray.push('RLSP18-08169');
recArray.push('RLSP18-08170');
recArray.push('RLSP18-08171');
recArray.push('RLSP18-08172');
recArray.push('RLSP18-08173');
recArray.push('RLSP18-08174');
recArray.push('RLSP18-08187');
recArray.push('RLSP18-08188');
recArray.push('RLSP18-08191');
recArray.push('RLSP18-08192');
recArray.push('RLSP18-08193');
recArray.push('RLSP18-08194');
recArray.push('RLSP18-08195');
recArray.push('RLSP18-08196');
recArray.push('RLSP18-08197');
recArray.push('RLSP18-08198');
recArray.push('RLSP18-08201');
recArray.push('RLSP18-08203');
recArray.push('RLSP18-08221');
recArray.push('RLSP18-08222');
recArray.push('RLSP18-08223');
recArray.push('RLSP18-08224');
recArray.push('RLSP18-08225');
recArray.push('RLSP18-08227');
recArray.push('RLSP18-08228');
recArray.push('RLSP18-08229');
recArray.push('RLSP18-08230');
recArray.push('RLSP18-08238');
recArray.push('RLSP18-08239');
recArray.push('RLSP18-08240');
recArray.push('RLSP18-08242');
recArray.push('RLSP18-08243');
recArray.push('RLSP18-08244');
recArray.push('RLSP18-08245');
recArray.push('RLSP18-08246');
recArray.push('RLSP18-08247');
recArray.push('RLSP18-08248');
recArray.push('RLSP18-08249');
recArray.push('RLSP18-08250');
recArray.push('RLSP18-08251');
recArray.push('RLSP18-08252');
recArray.push('RLSP18-08253');
recArray.push('RLSP18-08254');
recArray.push('RLSP18-08255');
recArray.push('RLSP18-08256');
recArray.push('RLSP18-08257');
recArray.push('RLSP18-08258');
recArray.push('RLSP18-08259');
recArray.push('RLSP18-08260');
recArray.push('RLSP18-08261');
recArray.push('RLSP18-08262');
recArray.push('RLSP18-08263');
recArray.push('RLSP18-08264');
recArray.push('RLSP18-08265');
recArray.push('RLSP18-08266');
recArray.push('RLSP18-08267');
recArray.push('RLSP18-08268');
recArray.push('RLSP18-08269');
recArray.push('RLSP18-08270');
recArray.push('RLSP18-08271');
recArray.push('RLSP18-08272');
recArray.push('RLSP18-08273');
recArray.push('RLSP18-08274');
recArray.push('RLSP18-08275');
recArray.push('RLSP18-08276');
recArray.push('RLSP18-08277');
recArray.push('RLSP18-08278');
recArray.push('RLSP18-08279');
recArray.push('RLSP18-08280');
recArray.push('RLSP18-08281');
recArray.push('RLSP18-08282');
recArray.push('RLSP18-08283');
recArray.push('RLSP18-08284');
recArray.push('RLSP18-08285');
recArray.push('RLSP18-08286');
recArray.push('RLSP18-08287');
recArray.push('RLSP18-08288');
recArray.push('RLSP18-08289');
recArray.push('RLSP18-08290');
recArray.push('RLSP18-08291');
recArray.push('RLSP18-08292');
recArray.push('RLSP18-08293');
recArray.push('RLSP18-08294');
recArray.push('RLSP18-08295');
recArray.push('RLSP18-08296');
recArray.push('RLSP18-08297');
recArray.push('RLSP18-08298');
recArray.push('RLSP18-08299');
recArray.push('RLSP18-08300');
recArray.push('RLSP18-08303');
recArray.push('RLSP18-08304');
recArray.push('RLSP18-08305');
recArray.push('RLSP18-08306');
recArray.push('RLSP18-08307');
recArray.push('RLSP18-08308');
recArray.push('RLSP18-08309');
recArray.push('RLSP18-08310');
recArray.push('RLSP18-08311');
recArray.push('RLSP18-08312');
recArray.push('RLSP18-08313');
recArray.push('RLSP18-08314');
recArray.push('RLSP18-08315');
recArray.push('RLSP18-08316');
recArray.push('RLSP18-08317');
recArray.push('RLSP18-08318');
recArray.push('RLSP18-08319');
recArray.push('RLSP18-08320');
recArray.push('RLSP18-08321');
recArray.push('RLSP18-08322');
recArray.push('RLSP18-08323');
recArray.push('RLSP18-08324');
recArray.push('RLSP18-08325');
recArray.push('RLSP18-08326');
recArray.push('RLSP18-08327');
recArray.push('RLSP18-08328');
recArray.push('RLSP18-08329');
recArray.push('RLSP18-08330');
recArray.push('RLSP18-08331');
recArray.push('RLSP18-08332');
recArray.push('RLSP18-08333');
recArray.push('RLSP18-08334');
recArray.push('RLSP18-08335');
recArray.push('RLSP18-08336');
recArray.push('RLSP18-08337');
recArray.push('RLSP18-08338');
recArray.push('RLSP18-08339');
recArray.push('RLSP18-08340');
recArray.push('RLSP18-08341');
recArray.push('RLSP18-08342');
recArray.push('RLSP19-02827');
recArray.push('RLSP19-02828');
recArray.push('RLSP19-02829');
recArray.push('RLSP19-02833');
recArray.push('RLSP19-02844');
recArray.push('RLSP19-02846');
recArray.push('RLSP19-02847');
recArray.push('RLSP19-02848');
recArray.push('RLSP19-02849');
recArray.push('RLSP19-02870');
recArray.push('RLSP19-02871');
recArray.push('RLSP19-02872');
recArray.push('RLSP19-02873');
recArray.push('RLSP19-02876');
recArray.push('RLSP19-02877');
recArray.push('RLSP19-02878');
recArray.push('RLSP19-02879');
recArray.push('RLSP19-02880');
recArray.push('RLSP19-02881');
recArray.push('RLSP19-02882');
recArray.push('RLSP19-02883');
recArray.push('RLSP19-02884');
recArray.push('RLSP19-02885');
recArray.push('RLSP19-02886');
recArray.push('RLSP19-02887');
recArray.push('RLSP19-02888');
recArray.push('RLSP19-02889');
recArray.push('RLSP19-02890');
recArray.push('RLSP19-02932');
recArray.push('RLSP19-02933');
recArray.push('RLSP19-02934');
recArray.push('RLSP19-02935');
recArray.push('RLSP19-02936');
recArray.push('RLSP19-02937');
recArray.push('RLSP19-02939');
recArray.push('RLSP19-03389');
recArray.push('RLSP19-03390');
recArray.push('RLSP19-03391');
recArray.push('RLSP19-03556');
recArray.push('RLSP19-03561');
recArray.push('RLSP19-03592');
recArray.push('RLSP19-03593');
recArray.push('RLSP19-03594');
recArray.push('RLSP19-03597');
recArray.push('RLSP19-03598');
recArray.push('RLSP19-03599');
recArray.push('RLSP19-03600');
recArray.push('RLSP19-03601');
recArray.push('RLSP19-03602');
recArray.push('RLSP19-03603');
recArray.push('RLSP19-03604');
recArray.push('RLSP19-03606');
recArray.push('RLSP19-03610');
recArray.push('RLSP19-03612');
recArray.push('RLSP19-03613');
recArray.push('RLSP19-03615');
recArray.push('RLSP19-03616');
recArray.push('RLSP19-03617');
recArray.push('RLSP19-03618');
recArray.push('RLSP19-03619');
recArray.push('RLSP19-03620');
recArray.push('RLSP19-03621');
recArray.push('RLSP19-03625');
recArray.push('RLSP19-03637');
recArray.push('RLSP19-03638');
recArray.push('RLSP19-03639');
recArray.push('RLSP19-03641');
recArray.push('RLSP19-03647');
recArray.push('RLSP19-03648');
recArray.push('RLSP19-03650');
recArray.push('RLSP19-03651');
recArray.push('RLSP19-03657');
recArray.push('RLSP19-03658');
recArray.push('RLSP19-03659');
recArray.push('RLSP19-03660');
recArray.push('RLSP19-03667');
recArray.push('RLSP19-03675');
recArray.push('RLSP19-03676');
recArray.push('RLSP19-03677');
recArray.push('RLSP19-03678');
recArray.push('RLSP19-03679');
recArray.push('RLSP19-03680');
recArray.push('RLSP19-03681');
recArray.push('RLSP19-03682');
recArray.push('RLSP19-03683');
recArray.push('RLSP19-03717');
recArray.push('RLSP19-03718');
recArray.push('RLSP19-03719');
recArray.push('RLSP19-03720');
recArray.push('RLSP19-03721');
recArray.push('RLSP19-03722');
recArray.push('RLSP19-03747');
recArray.push('RLSP19-03748');
recArray.push('RLSP19-03749');
recArray.push('RLSP19-03750');
recArray.push('RLSP19-03751');
recArray.push('RLSP19-03752');
recArray.push('RLSP19-03753');
recArray.push('RLSP19-03754');
recArray.push('RLSP19-03755');
recArray.push('RLSP19-03758');
recArray.push('RLSP19-03759');
recArray.push('RLSP19-03760');
recArray.push('RLSP19-03761');
recArray.push('RLSP19-03762');
recArray.push('RLSP19-03763');
recArray.push('RLSP19-03764');
recArray.push('RLSP19-03765');
recArray.push('RLSP19-03769');
recArray.push('RLSP19-03770');
recArray.push('RLSP19-03771');
recArray.push('RLSP19-03772');
recArray.push('RLSP19-03773');
recArray.push('RLSP19-03774');
recArray.push('RLSP19-03776');
recArray.push('RLSP19-03777');
recArray.push('RLSP19-03787');
recArray.push('RLSP19-03793');
recArray.push('RLSP19-03796');
recArray.push('RLSP19-03834');
recArray.push('RLSP19-03835');
recArray.push('RLSP19-03846');
recArray.push('RLSP19-03851');
recArray.push('RLSP19-03852');
recArray.push('RLSP19-03853');
recArray.push('RLSP19-03854');
recArray.push('RLSP19-03855');
recArray.push('RLSP19-03859');
recArray.push('RLSP19-03860');
recArray.push('RLSP19-03861');
recArray.push('RLSP19-03862');
recArray.push('RLSP19-03863');
recArray.push('RLSP19-03864');
recArray.push('RLSP19-03865');
recArray.push('RLSP19-03876');
recArray.push('RLSP19-03877');
recArray.push('RLSP19-03882');
recArray.push('RLSP19-03894');
recArray.push('RLSP19-03896');
recArray.push('RLSP19-03903');
recArray.push('RLSP19-03906');
recArray.push('RLSP19-03908');
recArray.push('RLSP19-03912');
recArray.push('RLSP19-03914');
recArray.push('RLSP19-03915');
recArray.push('RLSP19-03916');
recArray.push('RLSP19-03917');
recArray.push('RLSP19-03920');
recArray.push('RLSP19-03922');
recArray.push('RLSP19-03925');
recArray.push('RLSP19-03926');
recArray.push('RLSP19-03927');
recArray.push('RLSP19-03928');
recArray.push('RLSP19-03929');
recArray.push('RLSP19-03931');
recArray.push('RLSP19-03933');
recArray.push('RLSP19-03934');
recArray.push('RLSP19-03935');
recArray.push('RLSP19-03936');
recArray.push('RLSP19-03937');
recArray.push('RLSP19-03940');
recArray.push('RLSP19-03942');
recArray.push('RLSP19-03943');
recArray.push('RLSP19-03944');
recArray.push('RLSP19-03950');
recArray.push('RLSP19-04001');
recArray.push('RLSP19-04004');
recArray.push('RLSP19-04005');
recArray.push('RLSP19-04007');
recArray.push('RLSP19-04019');
recArray.push('RLSP19-04020');
recArray.push('RLSP19-04021');
recArray.push('RLSP19-04022');
recArray.push('RLSP19-04046');
recArray.push('RLSP19-04047');
recArray.push('RLSP19-04048');
recArray.push('RLSP19-04049');
recArray.push('RLSP19-04050');
recArray.push('RLSP19-04175');
recArray.push('RLSP19-04176');
recArray.push('RLSP19-04188');
recArray.push('RLSP19-04189');
recArray.push('RLSP19-04191');
recArray.push('RLSP19-04195');
recArray.push('RLSP19-04197');
recArray.push('RLSP19-04198');
recArray.push('RLSP19-04199');
recArray.push('RLSP19-04200');
recArray.push('RLSP19-04201');
recArray.push('RLSP19-04202');
recArray.push('RLSP19-04203');
recArray.push('RLSP19-04204');
recArray.push('RLSP19-04205');
recArray.push('RLSP19-04207');
recArray.push('RLSP19-04208');
recArray.push('RLSP19-04210');
recArray.push('RLSP19-04211');
recArray.push('RLSP19-04212');
recArray.push('RLSP19-04213');
recArray.push('RLSP19-04214');
recArray.push('RLSP19-04215');
recArray.push('RLSP19-04216');
recArray.push('RLSP19-04217');
recArray.push('RLSP19-04249');
recArray.push('RLSP19-04267');
recArray.push('RLSP19-04272');
recArray.push('RLSP19-04275');
recArray.push('RLSP19-04281');
recArray.push('RLSP19-04285');
recArray.push('RLSP19-04286');
recArray.push('RLSP19-04287');
recArray.push('RLSP19-04288');
recArray.push('RLSP19-04289');
recArray.push('RLSP19-04290');
recArray.push('RLSP19-04292');
recArray.push('RLSP19-07548');
recArray.push('RLSP19-07549');
recArray.push('RLSP19-07550');
recArray.push('RLSP19-07551');
recArray.push('RLSP19-07552');
recArray.push('RLSP19-07553');
recArray.push('RLSP19-07554');
recArray.push('RLSP19-07555');
recArray.push('RLSP19-07556');
recArray.push('RLSP19-07557');
recArray.push('RLSP19-07558');
recArray.push('RLSP19-07559');
recArray.push('RLSP19-07560');
recArray.push('RLSP19-07561');
recArray.push('RLSP19-07562');
recArray.push('RLSP19-07563');
recArray.push('RLSP19-07564');
recArray.push('RLSP19-07565');
recArray.push('RLSP19-07566');
recArray.push('RLSP19-07567');
recArray.push('RLSP19-07568');
recArray.push('RLSP19-07569');
recArray.push('RLSP19-07571');
recArray.push('RLSP19-07572');
recArray.push('RLSP19-07573');
recArray.push('RLSP19-07575');
recArray.push('RLSP19-07576');
recArray.push('RLSP19-07577');
recArray.push('RLSP19-07578');
recArray.push('RLSP19-07579');
recArray.push('RLSP19-07580');
recArray.push('RLSP19-07581');
recArray.push('RLSP19-07582');
recArray.push('RLSP19-07583');
recArray.push('RLSP19-07619');
recArray.push('RLSP19-07620');
recArray.push('RLSP19-07621');
recArray.push('RLSP19-07622');
recArray.push('RLSP19-07623');
recArray.push('RLSP19-07624');
recArray.push('RLSP19-07625');
recArray.push('RLSP19-07626');
recArray.push('RLSP19-07627');
recArray.push('RLSP19-07628');
recArray.push('RLSP19-07629');
recArray.push('RLSP19-07630');
recArray.push('RLSP19-07631');
recArray.push('RLSP19-07632');
recArray.push('RLSP19-07633');
recArray.push('RLSP19-07634');
recArray.push('RLSP19-07635');
recArray.push('RLSP19-07636');
recArray.push('RLSP19-07637');
recArray.push('RLSP19-07638');
recArray.push('RLSP19-07639');
recArray.push('RLSP19-07640');
recArray.push('RLSP19-07641');
recArray.push('RLSP19-07642');
recArray.push('RLSP19-07643');
recArray.push('RLSP19-07644');
recArray.push('RLSP19-07645');
recArray.push('RLSP19-07646');
recArray.push('RLSP19-07647');
recArray.push('RLSP19-07648');
recArray.push('RLSP19-07649');
recArray.push('RLSP19-07650');
recArray.push('RLSP19-07651');
recArray.push('RLSP19-07652');
recArray.push('RLSP19-07675');
recArray.push('RLSP19-07676');
recArray.push('RLSP19-07681');
recArray.push('RLSP19-07682');
recArray.push('RLSP19-07687');
recArray.push('RLSP19-07691');
recArray.push('RLSP19-07692');
recArray.push('RLSP19-07693');
recArray.push('RLSP19-07694');
recArray.push('RLSP19-07695');
recArray.push('RLSP19-07696');
recArray.push('RLSP19-07697');
recArray.push('RLSP19-07698');
recArray.push('RLSP19-07699');
recArray.push('RLSP19-07700');
recArray.push('RLSP19-07701');
recArray.push('RLSP19-07702');
recArray.push('RLSP19-07703');
recArray.push('RLSP19-07704');
recArray.push('RLSP19-07705');
recArray.push('RLSP19-07706');
recArray.push('RLSP19-07707');
recArray.push('RLSP19-07708');
recArray.push('RLSP19-07709');
recArray.push('RLSP19-07710');
recArray.push('RLSP19-07711');
recArray.push('RLSP19-07712');
recArray.push('RLSP19-07713');
recArray.push('RLSP19-07714');
recArray.push('RLSP19-07717');
recArray.push('RLSP19-07718');
recArray.push('RLSP19-07719');
recArray.push('RLSP19-07720');
recArray.push('RLSP19-07721');
recArray.push('RLSP19-07722');
recArray.push('RLSP19-07725');
recArray.push('RLSP19-07726');
recArray.push('RLSP19-07728');
recArray.push('RLSP19-07729');
recArray.push('RLSP19-07730');
recArray.push('RLSP19-07731');
recArray.push('RLSP19-07732');
recArray.push('RLSP19-07733');
recArray.push('RLSP19-07734');
recArray.push('RLSP19-07735');
recArray.push('RLSP19-07736');
recArray.push('RLSP19-07737');
recArray.push('RLSP19-07738');
recArray.push('RLSP19-07739');
recArray.push('RLSP19-07740');
recArray.push('RLSP19-07741');
recArray.push('RLSP19-07742');
recArray.push('RLSP19-07743');
recArray.push('RLSP19-07744');
recArray.push('RLSP19-07745');
recArray.push('RLSP19-07747');
recArray.push('RLSP19-07748');
recArray.push('RLSP19-07749');
recArray.push('RLSP19-07750');
recArray.push('RLSP19-07751');
recArray.push('RLSP19-07752');
recArray.push('RLSP19-07753');
recArray.push('RLSP19-07754');
recArray.push('RLSP19-07755');
recArray.push('RLSP19-07756');
recArray.push('RLSP19-07757');
recArray.push('RLSP19-07758');
recArray.push('RLSP19-07759');
recArray.push('RLSP19-07760');
recArray.push('RLSP19-07761');
recArray.push('RLSP19-07762');
recArray.push('RLSP19-07763');
recArray.push('RLSP19-07764');
recArray.push('RLSP19-07765');
recArray.push('RLSP19-07766');
recArray.push('RLSP19-07767');
recArray.push('RLSP19-07768');
recArray.push('RLSP19-07769');
recArray.push('RLSP19-07770');
recArray.push('RLSP19-07771');
recArray.push('RLSP19-07772');
recArray.push('RLSP19-07773');
recArray.push('RLSP19-07774');
recArray.push('RLSP19-07775');
recArray.push('RLSP19-07776');
recArray.push('RLSP19-07777');
recArray.push('RLSP19-07778');
recArray.push('RLSP19-07779');
recArray.push('RLSP19-07780');
recArray.push('RLSP19-07781');
recArray.push('RLSP19-07782');
recArray.push('RLSP19-07783');
recArray.push('RLSP19-07784');
recArray.push('RLSP19-07785');
recArray.push('RLSP19-07786');
recArray.push('RLSP19-07787');
recArray.push('RLSP19-07788');
recArray.push('RLSP19-07789');
recArray.push('RLSP19-07790');
recArray.push('RLSP19-08190');
recArray.push('RLSP19-08301');
recArray.push('RLSP19-08302');
recArray.push('RLSP20-02830');
recArray.push('RLSP20-02831');
recArray.push('RLSP20-02832');
recArray.push('RLSP20-02834');
recArray.push('RLSP20-02835');
recArray.push('RLSP20-02836');
recArray.push('RLSP20-02837');
recArray.push('RLSP20-02838');
recArray.push('RLSP20-02839');
recArray.push('RLSP20-02840');
recArray.push('RLSP20-02841');
recArray.push('RLSP20-02842');
recArray.push('RLSP20-02843');
recArray.push('RLSP20-02845');
recArray.push('RLSP20-02850');
recArray.push('RLSP20-02851');
recArray.push('RLSP20-02852');
recArray.push('RLSP20-02853');
recArray.push('RLSP20-02854');
recArray.push('RLSP20-02855');
recArray.push('RLSP20-02856');
recArray.push('RLSP20-02858');
recArray.push('RLSP20-02859');
recArray.push('RLSP20-02860');
recArray.push('RLSP20-02861');
recArray.push('RLSP20-02862');
recArray.push('RLSP20-02863');
recArray.push('RLSP20-02864');
recArray.push('RLSP20-02865');
recArray.push('RLSP20-02866');
recArray.push('RLSP20-02867');
recArray.push('RLSP20-02868');
recArray.push('RLSP20-02869');
recArray.push('RLSP20-02874');
recArray.push('RLSP20-02891');
recArray.push('RLSP20-02892');
recArray.push('RLSP20-02893');
recArray.push('RLSP20-02894');
recArray.push('RLSP20-02895');
recArray.push('RLSP20-02896');
recArray.push('RLSP20-02897');
recArray.push('RLSP20-02898');
recArray.push('RLSP20-02905');
recArray.push('RLSP20-02910');
recArray.push('RLSP20-02914');
recArray.push('RLSP20-02921');
recArray.push('RLSP20-02922');
recArray.push('RLSP20-02923');
recArray.push('RLSP20-02924');
recArray.push('RLSP20-02925');
recArray.push('RLSP20-02926');
recArray.push('RLSP20-02927');
recArray.push('RLSP20-02928');
recArray.push('RLSP20-02929');
recArray.push('RLSP20-02930');
recArray.push('RLSP20-02931');
recArray.push('RLSP20-02942');
recArray.push('RLSP20-02943');
recArray.push('RLSP20-02944');
recArray.push('RLSP20-02945');
recArray.push('RLSP20-03395');
recArray.push('RLSP20-03396');
recArray.push('RLSP20-03399');
recArray.push('RLSP20-03402');
recArray.push('RLSP20-03406');
recArray.push('RLSP20-03411');
recArray.push('RLSP20-03414');
recArray.push('RLSP20-03415');
recArray.push('RLSP20-03416');
recArray.push('RLSP20-03417');
recArray.push('RLSP20-03418');
recArray.push('RLSP20-03422');
recArray.push('RLSP20-03444');
recArray.push('RLSP20-03445');
recArray.push('RLSP20-03447');
recArray.push('RLSP20-03453');
recArray.push('RLSP20-03457');
recArray.push('RLSP20-03479');
recArray.push('RLSP20-03481');
recArray.push('RLSP20-03483');
recArray.push('RLSP20-03484');
recArray.push('RLSP20-03485');
recArray.push('RLSP20-03487');
recArray.push('RLSP20-03489');
recArray.push('RLSP20-03490');
recArray.push('RLSP20-03491');
recArray.push('RLSP20-03492');
recArray.push('RLSP20-03493');
recArray.push('RLSP20-03494');
recArray.push('RLSP20-03495');
recArray.push('RLSP20-03496');
recArray.push('RLSP20-03497');
recArray.push('RLSP20-03498');
recArray.push('RLSP20-03499');
recArray.push('RLSP20-03500');
recArray.push('RLSP20-03501');
recArray.push('RLSP20-03502');
recArray.push('RLSP20-03505');
recArray.push('RLSP20-03506');
recArray.push('RLSP20-03507');
recArray.push('RLSP20-03508');
recArray.push('RLSP20-03509');
recArray.push('RLSP20-03510');
recArray.push('RLSP20-03511');
recArray.push('RLSP20-03512');
recArray.push('RLSP20-03513');
recArray.push('RLSP20-03514');
recArray.push('RLSP20-03515');
recArray.push('RLSP20-03516');
recArray.push('RLSP20-03517');
recArray.push('RLSP20-03518');
recArray.push('RLSP20-03519');
recArray.push('RLSP20-03520');
recArray.push('RLSP20-03521');
recArray.push('RLSP20-03522');
recArray.push('RLSP20-03531');
recArray.push('RLSP20-03532');
recArray.push('RLSP20-03534');
recArray.push('RLSP20-03585');
recArray.push('RLSP20-03587');
recArray.push('RLSP20-03588');
recArray.push('RLSP20-03589');
recArray.push('RLSP20-03590');
recArray.push('RLSP20-03591');
recArray.push('RLSP20-03595');
recArray.push('RLSP20-03596');
recArray.push('RLSP20-03605');
recArray.push('RLSP20-03608');
recArray.push('RLSP20-03609');
recArray.push('RLSP20-03611');
recArray.push('RLSP20-03614');
recArray.push('RLSP20-03622');
recArray.push('RLSP20-03623');
recArray.push('RLSP20-03624');
recArray.push('RLSP20-03626');
recArray.push('RLSP20-03627');
recArray.push('RLSP20-03628');
recArray.push('RLSP20-03630');
recArray.push('RLSP20-03631');
recArray.push('RLSP20-03632');
recArray.push('RLSP20-03633');
recArray.push('RLSP20-03634');
recArray.push('RLSP20-03635');
recArray.push('RLSP20-03636');
recArray.push('RLSP20-03640');
recArray.push('RLSP20-03642');
recArray.push('RLSP20-03643');
recArray.push('RLSP20-03644');
recArray.push('RLSP20-03645');
recArray.push('RLSP20-03646');
recArray.push('RLSP20-03649');
recArray.push('RLSP20-03652');
recArray.push('RLSP20-03653');
recArray.push('RLSP20-03654');
recArray.push('RLSP20-03656');
recArray.push('RLSP20-03661');
recArray.push('RLSP20-03662');
recArray.push('RLSP20-03663');
recArray.push('RLSP20-03664');
recArray.push('RLSP20-03665');
recArray.push('RLSP20-03666');
recArray.push('RLSP20-03668');
recArray.push('RLSP20-03670');
recArray.push('RLSP20-03671');
recArray.push('RLSP20-03672');
recArray.push('RLSP20-03673');
recArray.push('RLSP20-03685');
recArray.push('RLSP20-03686');
recArray.push('RLSP20-03689');
recArray.push('RLSP20-03690');
recArray.push('RLSP20-03691');
recArray.push('RLSP20-03692');
recArray.push('RLSP20-03698');
recArray.push('RLSP20-03699');
recArray.push('RLSP20-03700');
recArray.push('RLSP20-03701');
recArray.push('RLSP20-03702');
recArray.push('RLSP20-03703');
recArray.push('RLSP20-03709');
recArray.push('RLSP20-03710');
recArray.push('RLSP20-03711');
recArray.push('RLSP20-03712');
recArray.push('RLSP20-03713');
recArray.push('RLSP20-03723');
recArray.push('RLSP20-03724');
recArray.push('RLSP20-03725');
recArray.push('RLSP20-03726');
recArray.push('RLSP20-03728');
recArray.push('RLSP20-03729');
recArray.push('RLSP20-03730');
recArray.push('RLSP20-03731');
recArray.push('RLSP20-03732');
recArray.push('RLSP20-03733');
recArray.push('RLSP20-03734');
recArray.push('RLSP20-03735');
recArray.push('RLSP20-03736');
recArray.push('RLSP20-03737');
recArray.push('RLSP20-03739');
recArray.push('RLSP20-03745');
recArray.push('RLSP20-03746');
recArray.push('RLSP20-03756');
recArray.push('RLSP20-03757');
recArray.push('RLSP20-03778');
recArray.push('RLSP20-03780');
recArray.push('RLSP20-03781');
recArray.push('RLSP20-03789');
recArray.push('RLSP20-03790');
recArray.push('RLSP20-03791');
recArray.push('RLSP20-03831');
recArray.push('RLSP20-03836');
recArray.push('RLSP20-03837');
recArray.push('RLSP20-03847');
recArray.push('RLSP20-03850');
recArray.push('RLSP20-03857');
recArray.push('RLSP20-03881');
recArray.push('RLSP20-03909');
recArray.push('RLSP20-03910');
recArray.push('RLSP20-03911');
recArray.push('RLSP20-03918');
recArray.push('RLSP20-03919');
recArray.push('RLSP20-03921');
recArray.push('RLSP20-03923');
recArray.push('RLSP20-03930');
recArray.push('RLSP20-03932');
recArray.push('RLSP20-03938');
recArray.push('RLSP20-03941');
recArray.push('RLSP20-03963');
recArray.push('RLSP20-03964');
recArray.push('RLSP20-03965');
recArray.push('RLSP20-03966');
recArray.push('RLSP20-03967');
recArray.push('RLSP20-03968');
recArray.push('RLSP20-03969');
recArray.push('RLSP20-03970');
recArray.push('RLSP20-03983');
recArray.push('RLSP20-03984');
recArray.push('RLSP20-03985');
recArray.push('RLSP20-03986');
recArray.push('RLSP20-03987');
recArray.push('RLSP20-03997');
recArray.push('RLSP20-03998');
recArray.push('RLSP20-03999');
recArray.push('RLSP20-04000');
recArray.push('RLSP20-04002');
recArray.push('RLSP20-04003');
recArray.push('RLSP20-04012');
recArray.push('RLSP20-04014');
recArray.push('RLSP20-04027');
recArray.push('RLSP20-04043');
recArray.push('RLSP20-04133');
recArray.push('RLSP20-04134');
recArray.push('RLSP20-04138');
recArray.push('RLSP20-04139');
recArray.push('RLSP20-04140');
recArray.push('RLSP20-04141');
recArray.push('RLSP20-04142');
recArray.push('RLSP20-04143');
recArray.push('RLSP20-04144');
recArray.push('RLSP20-04148');
recArray.push('RLSP20-04149');
recArray.push('RLSP20-04154');
recArray.push('RLSP20-04177');
recArray.push('RLSP20-04179');
recArray.push('RLSP20-04192');
recArray.push('RLSP20-04193');
recArray.push('RLSP20-04194');
recArray.push('RLSP20-04196');
recArray.push('RLSP20-04206');
recArray.push('RLSP20-04209');
recArray.push('RLSP20-04242');
recArray.push('RLSP20-04248');
recArray.push('RLSP20-04269');
recArray.push('RLSP20-04270');
recArray.push('RLSP20-04271');
recArray.push('RLSP20-04273');
recArray.push('RLSP20-04274');
recArray.push('RLSP20-04276');
recArray.push('RLSP20-04291');
recArray.push('RLSP20-04293');
recArray.push('RLSP20-04294');
recArray.push('RLSP20-04295');
recArray.push('RLSP20-07570');
recArray.push('RLSP20-07584');
recArray.push('RLSP20-07585');
recArray.push('RLSP20-07586');
recArray.push('RLSP20-07587');
recArray.push('RLSP20-07588');
recArray.push('RLSP20-07589');
recArray.push('RLSP20-07590');
recArray.push('RLSP20-07591');
recArray.push('RLSP20-07592');
recArray.push('RLSP20-07593');
recArray.push('RLSP20-07594');
recArray.push('RLSP20-07595');
recArray.push('RLSP20-07596');
recArray.push('RLSP20-07597');
recArray.push('RLSP20-07598');
recArray.push('RLSP20-07599');
recArray.push('RLSP20-07600');
recArray.push('RLSP20-07601');
recArray.push('RLSP20-07602');
recArray.push('RLSP20-07603');
recArray.push('RLSP20-07604');
recArray.push('RLSP20-07605');
recArray.push('RLSP20-07606');
recArray.push('RLSP20-07607');
recArray.push('RLSP20-07608');
recArray.push('RLSP20-07609');
recArray.push('RLSP20-07610');
recArray.push('RLSP20-07611');
recArray.push('RLSP20-07612');
recArray.push('RLSP20-07613');
recArray.push('RLSP20-07614');
recArray.push('RLSP20-07615');
recArray.push('RLSP20-07616');
recArray.push('RLSP20-07617');
recArray.push('RLSP20-07618');
recArray.push('RLSP20-07653');
recArray.push('RLSP20-07654');
recArray.push('RLSP20-07655');
recArray.push('RLSP20-07656');
recArray.push('RLSP20-07657');
recArray.push('RLSP20-07658');
recArray.push('RLSP20-07659');
recArray.push('RLSP20-07660');
recArray.push('RLSP20-07661');
recArray.push('RLSP20-07662');
recArray.push('RLSP20-07663');
recArray.push('RLSP20-07664');
recArray.push('RLSP20-07665');
recArray.push('RLSP20-07666');
recArray.push('RLSP20-07667');
recArray.push('RLSP20-07668');
recArray.push('RLSP20-07669');
recArray.push('RLSP20-07670');
recArray.push('RLSP20-07671');
recArray.push('RLSP20-07672');
recArray.push('RLSP20-07673');
recArray.push('RLSP20-07674');
recArray.push('RLSP20-07677');
recArray.push('RLSP20-07678');
recArray.push('RLSP20-07679');
recArray.push('RLSP20-07680');
recArray.push('RLSP20-07683');
recArray.push('RLSP20-07684');
recArray.push('RLSP20-07685');
recArray.push('RLSP20-07686');
recArray.push('RLSP20-07688');
recArray.push('RLSP20-07689');
recArray.push('RLSP20-07690');
recArray.push('RLSP20-07715');
recArray.push('RLSP20-07794');
recArray.push('RLSP20-07795');
recArray.push('RLSP20-07796');
recArray.push('RLSP20-07797');
recArray.push('RLSP20-07798');
recArray.push('RLSP20-07799');
recArray.push('RLSP20-07800');
recArray.push('RLSP20-07801');
recArray.push('RLSP20-07802');
recArray.push('RLSP20-07803');
recArray.push('RLSP20-07804');
recArray.push('RLSP20-07805');
recArray.push('RLSP20-07806');
recArray.push('RLSP20-07814');
recArray.push('RLSP20-07815');
recArray.push('RLSP20-07816');
recArray.push('RLSP20-07817');
recArray.push('RLSP20-07819');
recArray.push('RLSP20-07820');
recArray.push('RLSP20-07821');
recArray.push('RLSP20-07822');
recArray.push('RLSP20-07823');
recArray.push('RLSP20-07824');
recArray.push('RLSP20-07825');
recArray.push('RLSP20-07826');
recArray.push('RLSP20-07827');
recArray.push('RLSP20-07828');
recArray.push('RLSP20-07829');
recArray.push('RLSP20-07830');
recArray.push('RLSP20-07831');
recArray.push('RLSP20-07832');
recArray.push('RLSP20-07833');
recArray.push('RLSP20-07834');
recArray.push('RLSP20-07835');
recArray.push('RLSP20-07836');
recArray.push('RLSP20-07895');
recArray.push('RLSP20-07896');
recArray.push('RLSP20-07897');
recArray.push('RLSP20-07898');
recArray.push('RLSP20-07899');
recArray.push('RLSP20-07900');
recArray.push('RLSP20-07901');
recArray.push('RLSP20-07902');
recArray.push('RLSP20-07903');
recArray.push('RLSP20-07904');
recArray.push('RLSP20-07905');
recArray.push('RLSP20-07906');
recArray.push('RLSP20-07909');
recArray.push('RLSP20-07910');
recArray.push('RLSP20-07911');
recArray.push('RLSP20-07912');
recArray.push('RLSP20-07913');
recArray.push('RLSP20-07914');
recArray.push('RLSP20-07974');
recArray.push('RLSP20-07975');
recArray.push('RLSP20-07976');
recArray.push('RLSP20-07977');
recArray.push('RLSP20-07978');



/*
recArray.push('RLSP21-02899');
recArray.push('RLSP21-02900');
recArray.push('RLSP21-02903');
recArray.push('RLSP21-02906');
recArray.push('RLSP21-02907');
recArray.push('RLSP21-02908');
recArray.push('RLSP21-02909');
recArray.push('RLSP21-02912');
recArray.push('RLSP21-02913');
recArray.push('RLSP21-02915');
recArray.push('RLSP21-02916');
recArray.push('RLSP21-02917');
recArray.push('RLSP21-02918');
recArray.push('RLSP21-02919');
recArray.push('RLSP21-02920');
recArray.push('RLSP21-02947');
recArray.push('RLSP21-02948');
recArray.push('RLSP21-02949');
recArray.push('RLSP21-02950');
recArray.push('RLSP21-02951');
recArray.push('RLSP21-02952');
recArray.push('RLSP21-02953');
recArray.push('RLSP21-02954');
recArray.push('RLSP21-02955');
recArray.push('RLSP21-02956');
recArray.push('RLSP21-02957');
recArray.push('RLSP21-02958');
recArray.push('RLSP21-02990');
recArray.push('RLSP21-02993');
recArray.push('RLSP21-02994');
recArray.push('RLSP21-03029');
recArray.push('RLSP21-03030');
recArray.push('RLSP21-03031');
recArray.push('RLSP21-03240');
recArray.push('RLSP21-03241');
recArray.push('RLSP21-03242');
recArray.push('RLSP21-03264');
recArray.push('RLSP21-03265');
recArray.push('RLSP21-03266');
recArray.push('RLSP21-03267');
recArray.push('RLSP21-03300');
recArray.push('RLSP21-03301');
recArray.push('RLSP21-03336');
recArray.push('RLSP21-03338');
recArray.push('RLSP21-03343');
recArray.push('RLSP21-03343');
recArray.push('RLSP21-03377');
recArray.push('RLSP21-03400');
recArray.push('RLSP21-03410');
recArray.push('RLSP21-03412');
recArray.push('RLSP21-03419');
recArray.push('RLSP21-03421');
recArray.push('RLSP21-03425');
recArray.push('RLSP21-03427');
recArray.push('RLSP21-03429');
recArray.push('RLSP21-03435');
recArray.push('RLSP21-03436');
recArray.push('RLSP21-03437');
recArray.push('RLSP21-03443');
recArray.push('RLSP21-03448');
recArray.push('RLSP21-03448');
recArray.push('RLSP21-03449');
recArray.push('RLSP21-03449');
recArray.push('RLSP21-03450');
recArray.push('RLSP21-03451');
recArray.push('RLSP21-03452');
recArray.push('RLSP21-03456');
recArray.push('RLSP21-03458');
recArray.push('RLSP21-03459');
recArray.push('RLSP21-03462');
recArray.push('RLSP21-03480');
recArray.push('RLSP21-03482');
recArray.push('RLSP21-03488');
recArray.push('RLSP21-03488');
recArray.push('RLSP21-03503');
recArray.push('RLSP21-03504');
recArray.push('RLSP21-03523');
recArray.push('RLSP21-03524');
recArray.push('RLSP21-03525');
recArray.push('RLSP21-03526');
recArray.push('RLSP21-03527');
recArray.push('RLSP21-03528');
recArray.push('RLSP21-03529');
recArray.push('RLSP21-03530');
recArray.push('RLSP21-03533');
recArray.push('RLSP21-03535');
recArray.push('RLSP21-03536');
recArray.push('RLSP21-03537');
recArray.push('RLSP21-03538');
recArray.push('RLSP21-03539');
recArray.push('RLSP21-03540');
recArray.push('RLSP21-03541');
recArray.push('RLSP21-03543');
recArray.push('RLSP21-03545');
recArray.push('RLSP21-03546');
recArray.push('RLSP21-03564');
recArray.push('RLSP21-03573');
recArray.push('RLSP21-03574');
recArray.push('RLSP21-03575');
recArray.push('RLSP21-03576');
recArray.push('RLSP21-03577');
recArray.push('RLSP21-03578');
recArray.push('RLSP21-03579');
recArray.push('RLSP21-03580');
recArray.push('RLSP21-03581');
recArray.push('RLSP21-03582');
recArray.push('RLSP21-03583');
recArray.push('RLSP21-03584');
recArray.push('RLSP21-03669');
recArray.push('RLSP21-03674');
recArray.push('RLSP21-03684');
recArray.push('RLSP21-03687');
recArray.push('RLSP21-03687');
recArray.push('RLSP21-03688');
recArray.push('RLSP21-03693');
recArray.push('RLSP21-03694');
recArray.push('RLSP21-03695');
recArray.push('RLSP21-03696');
recArray.push('RLSP21-03697');
recArray.push('RLSP21-03704');
recArray.push('RLSP21-03705');
recArray.push('RLSP21-03706');
recArray.push('RLSP21-03707');
recArray.push('RLSP21-03708');
recArray.push('RLSP21-03714');
recArray.push('RLSP21-03715');
recArray.push('RLSP21-03716');
recArray.push('RLSP21-03727');
recArray.push('RLSP21-03738');
recArray.push('RLSP21-03740');
recArray.push('RLSP21-03741');
recArray.push('RLSP21-03742');
recArray.push('RLSP21-03766');
recArray.push('RLSP21-03767');
recArray.push('RLSP21-03768');
recArray.push('RLSP21-03775');
recArray.push('RLSP21-03779');
recArray.push('RLSP21-03782');
recArray.push('RLSP21-03783');
recArray.push('RLSP21-03784');
recArray.push('RLSP21-03785');
recArray.push('RLSP21-03788');
recArray.push('RLSP21-03800');
recArray.push('RLSP21-03800');
recArray.push('RLSP21-03801');
recArray.push('RLSP21-03802');
recArray.push('RLSP21-03803');
recArray.push('RLSP21-03805');
recArray.push('RLSP21-03806');
recArray.push('RLSP21-03808');
recArray.push('RLSP21-03811');
recArray.push('RLSP21-03813');
recArray.push('RLSP21-03815');
recArray.push('RLSP21-03817');
recArray.push('RLSP21-03819');
recArray.push('RLSP21-03820');
recArray.push('RLSP21-03821');
recArray.push('RLSP21-03822');
recArray.push('RLSP21-03826');
recArray.push('RLSP21-03828');
recArray.push('RLSP21-03829');
recArray.push('RLSP21-03856');
recArray.push('RLSP21-03858');
recArray.push('RLSP21-03866');
recArray.push('RLSP21-03867');
recArray.push('RLSP21-03868');
recArray.push('RLSP21-03870');
recArray.push('RLSP21-03871');
recArray.push('RLSP21-03872');
recArray.push('RLSP21-03873');
recArray.push('RLSP21-03884');
recArray.push('RLSP21-03885');
recArray.push('RLSP21-03951');
recArray.push('RLSP21-03952');
recArray.push('RLSP21-03953');
recArray.push('RLSP21-03973');
recArray.push('RLSP21-03975');
recArray.push('RLSP21-03976');
recArray.push('RLSP21-03981');
recArray.push('RLSP21-03982');
recArray.push('RLSP21-03989');
recArray.push('RLSP21-04031');
recArray.push('RLSP21-04031');
recArray.push('RLSP21-04032');
recArray.push('RLSP21-04034');
recArray.push('RLSP21-04034');
recArray.push('RLSP21-04040');
recArray.push('RLSP21-04067');
recArray.push('RLSP21-04068');
recArray.push('RLSP21-04069');
recArray.push('RLSP21-04131');
recArray.push('RLSP21-04135');
recArray.push('RLSP21-04136');
recArray.push('RLSP21-04137');
recArray.push('RLSP21-04145');
recArray.push('RLSP21-04150');
recArray.push('RLSP21-04151');
recArray.push('RLSP21-04152');
recArray.push('RLSP21-04156');
recArray.push('RLSP21-04157');
recArray.push('RLSP21-04158');
recArray.push('RLSP21-04159');
recArray.push('RLSP21-07791');
recArray.push('RLSP21-07792');
recArray.push('RLSP21-07793');
recArray.push('RLSP21-07807');
recArray.push('RLSP21-07808');
recArray.push('RLSP21-07809');
recArray.push('RLSP21-07810');
recArray.push('RLSP21-07811');
recArray.push('RLSP21-07812');
recArray.push('RLSP21-07813');
recArray.push('RLSP21-07818');
recArray.push('RLSP21-07837');
recArray.push('RLSP21-07838');
recArray.push('RLSP21-07839');
recArray.push('RLSP21-07840');
recArray.push('RLSP21-07841');
recArray.push('RLSP21-07842');
recArray.push('RLSP21-07843');
recArray.push('RLSP21-07847');
recArray.push('RLSP21-07849');
recArray.push('RLSP21-07850');
recArray.push('RLSP21-07851');
recArray.push('RLSP21-07859');
recArray.push('RLSP21-07860');
recArray.push('RLSP21-07861');
recArray.push('RLSP21-07862');
recArray.push('RLSP21-07864');
recArray.push('RLSP21-07867');
recArray.push('RLSP21-07869');
recArray.push('RLSP21-07870');
recArray.push('RLSP21-07871');
recArray.push('RLSP21-07872');
recArray.push('RLSP21-07873');
recArray.push('RLSP21-07874');
recArray.push('RLSP21-07877');
recArray.push('RLSP21-07878');
recArray.push('RLSP21-07882');
recArray.push('RLSP21-07883');
recArray.push('RLSP21-07885');
recArray.push('RLSP21-07886');
recArray.push('RLSP21-07887');
recArray.push('RLSP21-07888');
recArray.push('RLSP21-07889');
recArray.push('RLSP21-07890');
recArray.push('RLSP21-07891');
recArray.push('RLSP21-07892');
recArray.push('RLSP21-07893');
recArray.push('RLSP21-07894');
recArray.push('RLSP21-07915');
recArray.push('RLSP21-07916');
recArray.push('RLSP21-07917');
recArray.push('RLSP21-07918');
recArray.push('RLSP21-07919');
recArray.push('RLSP21-07920');
recArray.push('RLSP21-07921');
recArray.push('RLSP21-07922');
recArray.push('RLSP21-07923');
recArray.push('RLSP21-07924');
recArray.push('RLSP21-07925');
recArray.push('RLSP21-07926');
recArray.push('RLSP21-07927');
recArray.push('RLSP21-07929');
recArray.push('RLSP21-07930');
recArray.push('RLSP21-07933');
recArray.push('RLSP21-07934');
recArray.push('RLSP21-07935');
recArray.push('RLSP21-07936');
recArray.push('RLSP21-07937');
recArray.push('RLSP21-07938');
recArray.push('RLSP21-07939');
recArray.push('RLSP21-07941');
recArray.push('RLSP21-07942');
recArray.push('RLSP21-07943');
recArray.push('RLSP21-07944');
recArray.push('RLSP21-07945');
recArray.push('RLSP21-07946');
recArray.push('RLSP21-07947');
recArray.push('RLSP21-07948');
recArray.push('RLSP21-07949');
recArray.push('RLSP21-07950');
recArray.push('RLSP21-07951');
recArray.push('RLSP21-07952');
recArray.push('RLSP21-07953');
recArray.push('RLSP21-07956');
recArray.push('RLSP21-07965');
recArray.push('RLSP21-07966');
recArray.push('RLSP21-07967');
recArray.push('RLSP21-07968');
recArray.push('RLSP21-07969');
recArray.push('RLSP21-07970');
recArray.push('RLSP21-07971');
recArray.push('RLSP21-07972');
recArray.push('RLSP21-07973');
recArray.push('RLSP21-07979');
recArray.push('RLSP21-07980');
recArray.push('RLSP22-03073');
recArray.push('RLSP22-03563');
recArray.push('RLSP22-03786');
recArray.push('RLSP22-03988');
recArray.push('RLSP22-04147');
*/


        aa.print("Array Length: " + recArray.length)
        var missingParent = 0;
        var numberAdded = 0;
        for (i in recArray){
            var altId = recArray[i];
            printDebug('>>>Processing ' + altId)
            var capId = aa.cap.getCapID(altId);
        
            if (capId.getSuccess()){
                capId = capId.getOutput();
              // aa.print(pCapId)
              if (isTaskActiveLocal('Inspections', capId)){
                printDebug('Task is active, disabling...');
                // closeTaskLocal('Inspections', 'Inspections Completed', 'Closed via ticket 315', '', capId);
                // deactivateActiveTasksLocal('', capId)
              } else {
                printDebug('Task is not active</font>')
                // deactivateActiveTasksLocal('', capId)

              }

            } else {
                aa.print('Could not process ' + altId + ' -- ' + capId.getErrorMessage())
            }

        aa.print('<br>')
        }
        aa.print('number of missing parents: ' + missingParent)
        aa.print('Number of records updated: ' + numberAdded)
        printDebug("--------------------------------------------------------------------------------------------" + br);
        //aa.print("--------------------------------------------------------------------------------------------" + br);   
        printDebug("Total run time: " + elapsed() + br);
        //aa.print("--------------------------------------------------------------------------------------------" + br);

    }
    catch (err) {
        showMessage = true;
        comment("Error on BATCH_ADD_PERM_WTR_MTR_INSPECTIONS. Please contact system administrator. Err: " + err);
		printDebug("Error on BATCH_ADD_PERM_WTR_MTR_INSPECTIONS. Please contact system administrator. Err: " + err);
    }

}
// aa.env.setValue("ScriptReturnCode", "1");
// aa.env.setValue("ScriptReturnMessage", debug)

//___________________________________________________________________________________________________________ 
function comment(cstr)
{
    if (showDebug) logDebug(cstr);
    if (showMessage) logMessage(cstr);
}
    

function elapsed(stTime) {

    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - stTime) / 1000)
}

function doSQL(sql) {

    try {
        var valuesArr = [];
        var conn = aa.db.getConnection();
        var sStmt = aa.db.prepareStatement(conn, sql);

        if (sql.toUpperCase().indexOf("SELECT") == 0) {
            var rSet = sStmt.executeQuery();
            while (rSet.next()) {
                var obj = {};
                var md = rSet.getMetaData();
                var columns = md.getColumnCount();
                for (i = 1; i <= columns; i++) {
                    obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
                }
                obj.count = rSet.getRow();
                valuesArr.push(obj);
            }
            rSet.close();
            sStmt.close();
            conn.close();
            return valuesArr;
        }
    } catch (err) {
        printDebug(err.message);
        aa.print4Batch(err.message);
    }
}

function createChildLocal(grp,typ,stype,cat,desc) // optional parent capId
{
	//
	// creates the new application and returns the capID object
	//
	var itemCap = capId
	if (arguments.length > 5) itemCap = arguments[5]; // use cap ID specified in args
	
	var appCreateResult = aa.cap.createApp(grp,typ,stype,cat,desc);
	printDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
	if (appCreateResult.getSuccess())
		{
		var newId = appCreateResult.getOutput();
        printDebug('New cap: ' + newId.getCustomID())
		printDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");
		
		// create Detail Record
		capModel = aa.cap.newCapScriptModel().getOutput();
		capDetailModel = capModel.getCapModel().getCapDetailModel();
		capDetailModel.setCapID(newId);
		aa.cap.createCapDetail(capDetailModel);
		var newObj = aa.cap.getCap(newId).getOutput();	//Cap object
		var result = aa.cap.createAppHierarchy(itemCap, newId); 
		if (result.getSuccess())
			printDebug("Child application successfully linked");
		else
			printDebug("Could not link applications");
		// Copy Parcels
		var capParcelResult = aa.parcel.getParcelandAttribute(itemCap,null);
		if (capParcelResult.getSuccess())
			{
			var Parcels = capParcelResult.getOutput().toArray();
			for (zz in Parcels)
				{
				printDebug("adding parcel #" + zz + " = " + Parcels[zz].getParcelNumber());
				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
				newCapParcel.setParcelModel(Parcels[zz]);
				newCapParcel.setCapIDModel(newId);
				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
				aa.parcel.createCapParcel(newCapParcel);
				}
			}
		// Copy Contacts
		capContactResult = aa.people.getCapContactByCapID(itemCap);
		if (capContactResult.getSuccess())
			{
			Contacts = capContactResult.getOutput();
			for (yy in Contacts)
				{
				var newContact = Contacts[yy].getCapContactModel();
				newContact.setCapID(newId);
				aa.people.createCapContact(newContact);
				printDebug("added contact");
				}
			}	
		// Copy Addresses
		capAddressResult = aa.address.getAddressByCapId(itemCap);
		if (capAddressResult.getSuccess())
			{
			Address = capAddressResult.getOutput();
			for (yy in Address)
				{
				newAddress = Address[yy];
				newAddress.setCapID(newId);
				aa.address.createAddress(newAddress);
				printDebug("added address");
				}
			}
		
		return newId;
		}
	else
		{
		printDebug( "**ERROR: adding child App: " + appCreateResult.getErrorMessage());
		}
}


function printDebug(dstr){
    aa.print(dstr + br);
}
                
function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        printDebug("************* " + obj.getClass() + " *************");
    }

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                printDebug(idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            printDebug(idx + ":  " + obj[idx]);
        }
    }
}

function logDebug(dstr){
    if(showDebug){
        printDebug(dstr)
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
        aa.eventLog.createEventLog("DEBUG", "Batch Process", batchJobName, aa.date.getCurrentDate(), aa.date.getCurrentDate(),"", dstr,batchJobID);
    }
}

function formattedDate(date) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [month, day, year].join('/');
}

function isTaskActiveLocal(wfstr, itemCap) // optional process name
{
	var useProcess = false;
	var processName = "";
	// if (arguments.length == 2) {
	// 	processName = arguments[1]; // subprocess
	// 	useProcess = true;
	// }
	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			if (fTask.getActiveFlag().equals("Y"))
				return true;
			else
				return false;
	}
}

function closeTaskLocal(wfstr,wfstat,wfcomment,wfnote, itemCap) // optional process name
	{
	var useProcess = false;
	var processName = "";
	// if (arguments.length == 5) 
	// 	{
	// 	processName = arguments[4]; // subprocess
	// 	useProcess = true;
	// 	}
	var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
	
	if (!wfstat) wfstat = "NA";
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
			{
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			if (useProcess)
				aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			else
				aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
			
			logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat);
			}			
		}
	}

    function deactivateActiveTasksLocal(processName, itemCap) {

        var workflowResult = aa.workflow.getTasks(itemCap);
         if (workflowResult.getSuccess())
               wfObj = workflowResult.getOutput();
          else
    
                { logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()); return false; }
    
        
        for (i in wfObj)
            {
               fTask = wfObj[i];
            if (fTask.getProcessCode().equals(processName))
                if (fTask.getActiveFlag().equals("Y")){
                    deactivateTask(fTask.getTaskDescription());
                    logDebug('Deactivating task: ' + fTask.getTaskDescription())
                }
            }
    
    }