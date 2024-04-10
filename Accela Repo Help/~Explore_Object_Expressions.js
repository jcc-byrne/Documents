
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
  
  function logDebug(str){expression.addMessage(str)}