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
  var variable0=expression.getValue("CAP::capType");
  var variable1=expression.getValue("ASI::BASIC BUSINESS INFORMATION::Temperature control");
  var variable2=expression.getValue("ASI::BASIC BUSINESS INFORMATION::Food Processing");
  var variable3=expression.getValue("ASI::FORM");
  
  
  var totalRowCount = expression.getTotalRowCount();
  
          if((variable0.value!=null && variable0.value.equals(String("Licenses/Business/Food Dealer/Application")) || variable0.value!=null && variable0.value.equals(String("Licenses/Business/Food Dealer/Renewal"))) && (variable1.value!=null && (variable1.value.equalsIgnoreCase('NO') || variable1.value.equalsIgnoreCase('N') || variable1.value.equalsIgnoreCase('UNCHECKED') || variable1.value.equalsIgnoreCase('UNSELECTED') || variable1.value.equalsIgnoreCase('FALSE') || variable1.value.equalsIgnoreCase('OFF'))) && (variable2.value!=null && (variable2.value.equalsIgnoreCase('NO') || variable2.value.equalsIgnoreCase('N') || variable2.value.equalsIgnoreCase('UNCHECKED') || variable2.value.equalsIgnoreCase('UNSELECTED') || variable2.value.equalsIgnoreCase('FALSE') || variable2.value.equalsIgnoreCase('OFF')))){
  
              variable3.blockSubmit=true;
          expression.setReturn(variable3);
  
              variable3.message="If there is no Food Processing and no need for temperature control you do not need a business license";
          expression.setReturn(variable3);
  
              variable2.message="If there is no Food Processing and no need for temperature control you do not need a business license 222";
          expression.setReturn(variable2);
      }