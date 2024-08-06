var debug = ''
var showDebug = true;
var altId = 'BB-R24-00001'
var capId = aa.cap.getCapID(altId); //CapIDModel
var csm;
var capModel;

if (capId.getSuccess()){
  capId = capId.getOutput();
  csm = aa.cap.getCap(capId).getOutput(); //CapScriptModel
  capModel = aa.cap.getCap(capId).getOutput().getCapModel(); //CapModel
} else {
  logDebug('Error finding altId, reason: ' + capId.getErrorMessage())
}

/**
 * START EXPLORATION
 */

var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(capId, 'RENEWAL CHANGES');

	if (!tssmResult.getSuccess()) {
		logDebug("EMSE API Error: addASITable - error retrieving app specific table RENEWAL CHANGES" + tssmResult.getErrorMessage());
	}



exploreObject(capId)



/**
 * END EXPLORATION
 */

if (showDebug){
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
}


function exploreObject(objExplore) {

    logDebug('<font color=red ><u><b>Properties:</b></u></font> ');
  
    var properties = [];
  
    for (var y in objExplore) {
      try {
        if (typeof objExplore[y] !== 'function') {
          properties.push(y);
        }
      } catch (err) {
        logDebug('exploreObject(): **ERROR** in Properties: ' + err.Message);
      }
    }
  
    properties.sort();
    properties.forEach(function(property) {
      logDebug('  <b> ' + property + ': </b> ' + objExplore[property]);
    });
  
    logDebug('');
    logDebug('<font color=red ><u><b>Methods:</b></u></font> ');
  
    var methods = [];
  
    for (var x in objExplore) {
      try {
        if (typeof objExplore[x] === 'function') {
          methods.push(x);
        }
      } catch (err) {
        logDebug('exploreObject(): **ERROR** in Functions: ' + err.Message);
      }
    }
  
    methods.sort();
    methods.forEach(function(method) {
      logDebug('<font color=blue><u><b>' + method + '</b></u></font> ');
      logDebug('   ' + objExplore[method] + '<br>');
    });
  
  
  }
  
  function logDebug(str){
    debug += str + '<br>'; 
    aa.print(str)
  }

