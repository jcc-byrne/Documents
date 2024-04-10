var toPrecision=function(value){
    var multiplier=10000;
    return Math.round(value*multiplier)/multiplier;
  }
  function addDate(iDate, nDays){ 
      if(isNaN(nDays)){
          throw("Day is a invalid number!");
      }
      return expression.addDate(iDate,parseInt(nDays));
  }
  
  function diffDate(iDate1,iDate2){
      return expression.diffDate(iDate1,iDate2);
  }
  
  function parseDate(dateString){
      return expression.parseDate(dateString);
  }
  
  function formatDate(dateString,pattern){ 
      if(dateString==null||dateString==''){
          return '';
      }
      return expression.formatDate(dateString,pattern);
  }
  
  var servProvCode=expression.getValue("$$servProvCode$$").value;
  var variable0=expression.getValue("ASIT::HOURS OF OPERATION::Open Time (include am or pm)");
  var variable1=expression.getValue("ASIT::HOURS OF OPERATION::FORM");
  
  
  var totalRowCount = expression.getTotalRowCount();
  for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
  
          variable1=expression.getValue(rowIndex, "ASIT::HOURS OF OPERATION::FORM");
          variable0=expression.getValue(rowIndex, "ASIT::HOURS OF OPERATION::Open Time (include am or pm)");

            if(variable0.value!=null && variable0.value.match(/(?:[0-9].*[ap][[m\.]*)/i)){

              variable1.blockSubmit=false;
              variable1.message="";
          expression.setReturn(rowIndex,variable1);
      } else {
        variable1.blockSubmit=true;
            variable1.message="Open Time and Close Time require am or pm for the hours";
        expression.setReturn(rowIndex,variable1);
      }

      variable3=expression.getValue(rowIndex, "ASIT::HOURS OF OPERATION::Close Time (include am or pm)");

          if(variable3.value!=null && variable3.value.match(/(?:[0-9].*[ap][[m\.]*)/i)){

            variable1.blockSubmit=false;
            variable1.message="";
        expression.setReturn(rowIndex,variable1);
    } else {
      variable1.blockSubmit=true;
          variable1.message="am, a.m., pm, or p.m. is required to submit the row ";
      expression.setReturn(rowIndex,variable1);
    }
  }
    


    
