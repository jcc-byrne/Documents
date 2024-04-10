// JCC - Byrne - Task 78


var servProvCode=expression.getValue("$$servProvCode$$").value;
  var capID=expression.getValue("CAP::capID").value;
  var capType=expression.getValue("CAP::capType").value;
  var altID=expression.getValue("CAP::capModel*altID").value;

  var wfStatus=expression.getValue("WORKFLOW::taskItem*disposition");
  var wfTask=expression.getValue("WORKFLOW::dispTaskName");
  var wkForm=expression.getValue("WORKFLOW::FORM");



  var totalRowCount = expression.getTotalRowCount();
  if ( capType == 'Planning/Project/NA/NA' && wfTask.value == 'Routing'){

    var aa = expression.getScriptRoot();
    var sca = capID.split("-");
    var capId = aa.cap.getCapID(sca[0],sca[1],sca[2]).getOutput(); //CapIDModel
    var cap = aa.cap.getCap(capId).getOutput();

    var wkFlowHistory  = aa.workflow.getWorkflowHistory(capId, 'Routing',null)
    if (wkFlowHistory.getSuccess()){
        wkFlowHistory = wkFlowHistory.getOutput();
        var statusArr = []

        if (wkFlowHistory && wkFlowHistory.length > 0){
            for (i in wkFlowHistory){
                task = wkFlowHistory[i];
                taskStatus = task.getDisposition();

                if (taskStatus.toUpperCase() == 'CYCLE 1'){
                    statusArr.push('Cycle 1')
                }
                
                if (taskStatus.toUpperCase() == 'CYCLE 2'){
                    statusArr.push('Cycle 2')
                }

                if (taskStatus.toUpperCase() == 'CYCLE 3'){
                    statusArr.push('Cycle 3')
                }
            }


            if (statusArr.length >0){
                  var displayMsg = '<h4>Following Status(es) have been previously chosen: ' + statusArr.reverse().join(', ') +'</h4>'
                    wkForm.message=displayMsg;
                    expression.setReturn(wkForm);
            }

            if (exists(wfStatus.value, statusArr)){
                wkForm.blockSubmit=true;
                wkForm.message='<h4>This Status has been chosen already, select the next cycle</h4>';
                expression.setReturn(wkForm);
            } 
        } 


    }
  }

  
      function exploreObject(objExplore) {

        logDebug('<font color=red  ><u><b>Properties:</b></u></font> ');
      
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
      
      function logDebug(str){expression.addMessage('<font size=4px>'+str+'</font>')}


      function exists(eVal, eArray) {
        for (ii in eArray)
            if (eArray[ii] == eVal) return true;
        return false;
  }