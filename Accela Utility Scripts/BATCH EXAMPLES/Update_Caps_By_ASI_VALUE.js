var arr = [['HDOG16-02977','OA133D354D'],
['HDOG16-03249','985-121-007-967-189'],
['HDOG16-03250','985-112-006-260-379'],
['HDOG22-0068','985 113 004 992 493'],
['HDOG20-0554','985 113 003 224 262'],
['HDOG21-0185','982 28059748876'],
['HDOG21-0713','9810200373216237'],
['HDOG17-0337','981020017844166 981'],
['HDOG16-02705','98102001165014'],
['HDOG16-03215','98102001159014'],
['HDOG16-02759','95600000859014'],
['HDOG16-03028','4C176E620C'],
['HDOG16-03528','4A7F6C756A'],
['HDOG16-02844','0A137E2408'],
['HDOG16-01071','0A137C7170'],
['HDOG16-00165','0A13742504'],
['HDOG16-01771','0A13636A22'],
['HDOG16-02394','0A1355620E'],
['HDOG16-01897','0A134A5E74'],
['HDOG22-0447','0A1279742E'],
['HDOG23-0229','0A12720A12'],
['HDOG16-01989','0a12453e7b'],
['HDOG16-01610','0A122A3E60'],
['HDOG16-02635','0A121A762E'],
['HDOG16-02391','0A02051242'],
['HDOG20-0640','0A01676526'],
['HDOG22-0354','991001001970422'],
['HDOG17-0892','990000001376697'],
['HDOG23-0410','985141006557187'],
['HDOG23-0409','985141006290758'],
['HDOG22-0445','985141005929433'],
['HDOG16-01061','985141003798329'],
['HDOG20-0465','985141003153472'],
['HDOG17-0873','985121007810735'],
['HDOG19-0430','985113005523414'],
['HDOG22-0458','985113005168372'],
['HDOG21-0363','985113004888282'],
['HDOG22-0081','985113004862276'],
['HDOG18-0525','985113004139145'],
['HDOG19-0544','985113003447587'],
['HDOG19-0324','985113003393742'],
['HDOG18-0779','985113002869476'],
['HDOG19-0066','985113002242907'],
['HDOG19-0053','985113002094463'],
['HDOG16-00293','985113001049800'],
['HDOG18-0534','985113000970392'],
['HDOG17-0409','985113000454925'],
['HDOG21-0474','985112012225358'],
['HDOG16-00430','985112012109528'],
['HDOG21-0070','985112011906444'],
['HDOG22-0417','985112011074809'],
['HDOG16-4004','985112008425120'],
['HDOG16-02059','985112008056230'],
['HDOG17-1101','985112006112659'],
['HDOG19-0232','985112005005322'],
['HDOG18-0180','985112005003450'],
['HDOG16-4003','985112003093322'],
['HDOG16-03278','985112002585728'],
['HDOG16-03541','982126060081203'],
['HDOG20-0542','982126060067861'],
['HDOG21-0219','982126060058355'],
['HDOG22-0732','982126058407644'],
['HDOG19-0764','982126055820786'],
['HDOG23-0356','982091072308986'],
['HDOG23-0083','982091068116976'],
['HDOG21-0468','982091061489807'],
['HDOG16-02465','982000365042534'],
['HDOG23-0289','981020051561066'],
['HDOG22-0184','981020043106108'],
['HDOG21-0392','981020039658096'],
['HDOG21-0526','981020039346421'],
['HDOG18-0538','981020035724503'],
['HDOG20-0110','981020027718771'],
['HDOG18-0231','981020021927178'],
['HDOG16-3857','981020019447092'],
['HDOG18-0815','981020003669430'],
['HDOG23-0559','981003911133289'],
['HDOG22-0299','956000014098039'],
['HDOG22-0296','956000014095282'],
['HDOG21-0700','956000013807508'],
['HDOG23-0123','956000012451710'],
['HDOG18-0153','956000009984979'],
['HDOG20-0421','956000008515900'],
['HDOG21-0043','956000003870160'],
['HDOG19-0557','956000003216152'],
['HDOG20-0219','933000120158305'],
['HDOG16-3982','911002001414401'],
['HDOG16-4005','9716199']
]



for (i in arr){
    item = arr[i];
    legacyNo = item[0]
    microNbr = item[1]

    var cap = aa.cap.getCapIDsByAppSpecificInfoField('legacyTrakitID',legacyNo).getOutput(); //capIdScriptModel
    var capId = cap[0].getCapID()
    // exploreObject(capId)
    editAppSpecific('mNbr', microNbr, capId);

}


function editAppSpecific(itemName,itemValue, capId)  // optional: itemCap
{
	var itemCap = capId;
	var itemGroup = null;
   	
	var asiFieldResult = aa.appSpecificInfo.getByList(itemCap, itemName);
	if(asiFieldResult.getSuccess()){
		var asiFieldArray = asiFieldResult.getOutput();
		if(asiFieldArray.length > 0){
			var asiField = asiFieldArray[0];
			if(asiField){
				var origAsiValue = asiField.getChecklistComment();
				asiField.setChecklistComment(itemValue);
	
				var updateFieldResult = aa.appSpecificInfo.editAppSpecInfoValue(asiField);
				if(updateFieldResult.getSuccess()){
					aa.print("Successfully updated custom field: " + itemName + " with value: " + itemValue);
					if(arguments.length < 3) //If no capId passed update the ASI Array
					AInfo[itemName] = itemValue; 
				}
				else
				{ aa.print( "WARNING: (editAppSpecific) " + itemName + " was not updated."); }	
			}
			else
			{ aa.print( "WARNING: (editAppSpecific) " + itemName + " was not updated."); }
		}
	}
	else {
		aa.print("ERROR: (editAppSpecific) " + asiFieldResult.getErrorMessage());
	}
} 


function exploreObject(objExplore) {
    aa.print('Properties:');
    for (var y in objExplore) {
      try {
        if (typeof objExplore[y] !== 'function') {
          aa.print('  <b> ' + y + ': </b> ' + objExplore[y]);
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Properties: ' + err.Message);
      }
    }
    aa.print('');
  
    aa.print('Methods:');
    for (var x in objExplore) {
      try {
        if (typeof objExplore[x] === 'function') {
          aa.print('<font color=blue><u><b>' + x + '</b></u></font> ');
          aa.print('   ' + objExplore[x] + '<br>');
        }
      } catch (err) {
        aa.print('exploreObject(): **ERROR** in Functions: ' + err.Message);
      }
      var counter = objExplore.length;
    }
  }
  