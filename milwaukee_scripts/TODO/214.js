
var renewalId = 'CIG-R24-00004';
var licneseId = 'CIG-000010'

var renewalCapID = aa.cap.getCapID(renewalId).getOutput(); //CapIDModel
var renewalCSM = aa.cap.getCap(renewalCapID).getOutput(); //CapScriptModel
var renwalCapModel = renewalCSM.getCapModel() //CapModel

var licneseCapID = aa.cap.getCapID(licneseId).getOutput(); //CapIDModel
var licenseCSM = aa.cap.getCap(licneseCapID).getOutput();
var licenseCapModel = licenseCSM.getCapModel()

var differences = []


// Custom fields
var renewalASI = aa.appSpecificInfo.getByCapID(renewalCapID).getOutput();
var licenseASI = aa.appSpecificInfo.getByCapID(licneseCapID).getOutput();
checkASIDiff(differences, 'ASI', licenseASI, renewalASI);

// Custom Lists
// var renewalTable = loadASITablesLocal(renewalCapID)
// var licenseTable = loadASITablesLocal(licneseCapID)
// checkASIDiff(differences, 'ASIT', renewalTable, licenseTable);


// Contacts
var renewalContacts = aa.people.getCapContactByCapID(renewalCapID).getOutput();
var licenseContacts = aa.people.getCapContactByCapID(licneseCapID).getOutput();
checkASIDiff(differences, 'CONTACT', licenseContacts, renewalContacts);


aa.print('Total Differences: ' + differences.length)
for (i in differences){

    exploreObject(differences[i])
}



// exploreObject(renewalContacts, true, true)
// exploreObject(licenseContacts, true, false)

function checkASIDiff( diffArray, typeDiff, licArr, renArr){

    if (typeDiff == 'ASI'){
        // compareCustomFields(diffArray, licArr, renArr)
    } else if (typeDiff == 'ASIT'){
        // compareCustomLists(diffArray, licArr, renArr)

    } else if (typeDiff == 'CONTACT'){
        compareContacts(diffArray,licArr,renArr)
    }



    return diffArray
}

function compareContacts(compareArr, licArr, renArr){
    // exploreObject(licArr)
    // exploreObject(renArr)


    for (i in licArr){
        var licContactObj = new contactObjLocal(licArr[i]);

        aa.print('Reviewing License Contact: ' + licContactObj.getContactName(true, true, true))

        for (k in renArr){
            var renContactObj = new contactObjLocal(renArr[k])
            aa.print('Reviewing Renewal Contact: ' + renContactObj.getContactName(true, true, true))

    
            if (licContactObj.type == renContactObj.type){

                aa.print(licContactObj.equals(renContactObj))
                if (licContactObj.equals(renContactObj)){
                    aa.print('contact matches')
                }
    
            }



        }


        // exploreObject(licArr[i])
    }



    return compareArr
}

function compareCustomFields(compareArr, licArr, renArr) {

    // exploreObject(licArr[0])
    // First pass: Check for differences and missing fields in renArr
    for (var i in licArr) {
        var asiItem = licArr[i];
        var fieldGroup = asiItem.getCheckboxType();
        var fieldName = asiItem.getCheckboxDesc();
        var fieldValue = asiItem.getChecklistComment();

        if (fieldGroup == 'OVERRIDES') continue;

        if (asiItem.getAuditStatus() != 'A') continue;

        var fieldFound = false;

        for (var k in renArr) {
            var renAsiItem = renArr[k];
            var renFieldGroup = renAsiItem.getCheckboxType();
            var renFieldName = renAsiItem.getCheckboxDesc();
            var renFieldValue = renAsiItem.getChecklistComment();

            if (renFieldGroup != fieldGroup) continue;
            if (renAsiItem.getAuditStatus() != 'A') continue;

            if (renFieldName == fieldName) {
                fieldFound = true;
                if (renFieldValue != fieldValue) {
                    compareArr.push({type: 'ASI CHANGE', change: "ASI: '" + fieldName + "' changed FROM '" + fieldValue + "' TO '" + renFieldValue +"'"});
                }
                break;
            }
        }

        if (!fieldFound) {
            compareArr.push({type: 'ASI REMOVED', change: "ASI: '" + fieldName + "' is present on the License but not on the Renewal"});
        }
    }

    // Second pass: Check for fields in renArr that are not in licArr
    for (var k in renArr) {
        var renAsiItem = renArr[k];
        var renFieldGroup = renAsiItem.getCheckboxType();
        var renFieldName = renAsiItem.getCheckboxDesc();
        var renFieldValue = renAsiItem.getChecklistComment();

        if (renFieldGroup == 'OVERRIDES') continue;
        if (renAsiItem.getAuditStatus() != 'A') continue;

        var fieldFound = false;

        for (var i in licArr) {
            var asiItem = licArr[i];
            var fieldGroup = asiItem.getCheckboxType();
            var fieldName = asiItem.getCheckboxDesc();
            if (asiItem.getAuditStatus() != 'A') continue;

            if (fieldGroup != renFieldGroup) continue;

            if (fieldName == renFieldName) {
                fieldFound = true;
                break;
            }
        }

        if (!fieldFound) {
            // exploreObject(renAsiItem, true, false)
            compareArr.push({type: 'ASI ADDED', change: "ASI: '" + renFieldName + "' is present on the Renewal but not on the License"});
        }
    }

    return compareArr;
}

function compareCustomLists(compareArr, licArr, renArr){

    for ( i in licArr){
        var licRow = licArr[i]
        var licenseTblName = licRow["TBLNAME"]


        if (licenseTblName)

        exploreObject(licArr[i])




    }
// exploreObject(licArr[0], true, false)


return compareArr

}

function loadASITablesLocal(itemCap) {
    //
    // Loads App Specific tables into their own array of arrays.  Creates global array objects
   //
   // Optional parameter, cap ID to load from
   //
   var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
   var ta = gm.getTablesArray()
   var tai = ta.iterator();
   var tempArray = new Array();
//    exploreObject(ta.toArray()[0].columns.toArray()[0])

   while (tai.hasNext())
     {
     var tsm = tai.next();
     var tempObject = new Array();
     var tn = tsm.getTableName();
      var numrows = 0;
     tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

     if (tn == 'EFFECTIVEANDEXPIREDATES' || tn == 'ASSOCIATEDRECORDS') continue;

     if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number
     if (!tsm.rowIndex.isEmpty())
         {
           var tsmfldi = tsm.getTableField().iterator();
         var tsmcoli = tsm.getColumns().iterator();


         var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
         var numrows = 1;
         while (tsmfldi.hasNext())  // cycle through fields
           {
           if (!tsmcoli.hasNext())  // cycle through columns
               {
               var tsmcoli = tsm.getColumns().iterator();
               tempArray.push(tempObject);  // end of record
               var tempObject = new Array();  // clear the temp obj
               numrows++;
               }
           var tcol = tsmcoli.next();
               var displayOrder = tcol.displayOrder

           var tval = tsmfldi.next();
        //    exploreObject(tcol)
           var readOnly = 'N';
           if (readOnlyi.hasNext()) {
               readOnly = readOnlyi.next();
               }
           var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);

           tempObject[tcol.getColumnName()] = fieldInfo;
           //tempObject[tcol.getColumnName()] = tval;
           }

         tempObject['TBLNAME'] = tsm.getTableName()
           tempArray.push(tempObject);  // end of record
       }
     var copyStr = "" + tn + " = tempArray";
     logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
    //  eval(copyStr);  // move to table name
     }

     return tempArray
   }


   function asiTableValObj(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;
	this.hasValue = Boolean(fieldValue != null & fieldValue != "");
	asiTableValObj.prototype.toString=function(){ return this.hasValue ? String(this.fieldValue) : String(""); }
}; 
function exploreObject(objExplore, showProps, showMethods) {

    if (showProps || showProps == null){
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
}

if (showMethods || showMethods == null){
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
  
  }
  
  function logDebug(str){aa.print(str)}


  function contactObjLocal(ccsm)  {
    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
	this.customFieldsObj = null;
	this.customFields = new Array();
	this.customTablesObj = null;
	this.customTables = new Array();
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses
    this.validAttrs = false;
	this.validCustomFields = false;
	this.validCustomTables = false;
        
    this.capContactScript = ccsm;
    if (ccsm)  {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
            }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();
			// contact ASI
			var tm = this.people.getTemplate();
			if (tm)	{
				var templateGroups = tm.getTemplateForms();
				var gArray = new Array();
				if (!(templateGroups == null || templateGroups.size() == 0)) {
                    var subGroups = templateGroups.get(0).getSubgroups();
                    if (subGroups != null) {
                        for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
                            var subGroup = subGroups.get(subGroupIndex);
                            var fields = subGroup.getFields();
                            for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
                                var field = fields.get(fieldIndex);
                                this.asi[field.getDisplayFieldName()] = field.getDefaultValue();
                            }
                        }
                    }
				}
			}
			// contact attributes
			// Load People Template Fields
            if (this.people.getAttributes() != null) {
                this.asiObj = this.people.getAttributes().toArray();
                if (this.asiObj != null) {
                    for (var xx1 in this.asiObj) this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
                    this.validAttrs = true; 
                }   
            }
			// Load Custom Template Fields
			if (this.capContact.getTemplate() != null && this.capContact.getTemplate().getTemplateForms() != null) {
				var customTemplate = this.capContact.getTemplate();
				this.customFieldsObj = customTemplate.getTemplateForms();
				
				for (var i = 0; i < this.customFieldsObj.size(); i++) {
					var eachForm = this.customFieldsObj.get(i);
					//Sub Group
					var subGroup = eachForm.subgroups;
					if (subGroup == null) {
						continue;
					}
					for (var j = 0; j < subGroup.size(); j++) {
						var eachSubGroup = subGroup.get(j);
						if (eachSubGroup == null || eachSubGroup.fields == null) {
							continue;
						}
						var allFields = eachSubGroup.fields;
						for (var k = 0; k < allFields.size(); k++) {
							var eachField = allFields.get(k);
							this.customFields[eachField.displayFieldName] = eachField.defaultValue;
							// logDebug("(contactObj) {" + eachField.displayFieldName + "} = " +  eachField.defaultValue);
							this.validCustomFields = true;
						}
					}
				}
			}
        }  
        // this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
        var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);

        }
        


        
       
        this.equals = function(t) {
            if (t == null) return false;
            if (!String(this.people.type).equals(String(t.people.type))) { return false; }
            if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) { return false; }
            if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) { return false; }



            
            if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) { return false; }
            if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) { return false; }
            return  true;
        }
        
        //get method for Attributes
        this.getAttribute = function (vAttributeName){
            var retVal = null;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null)
                    retVal = tmpVal.getAttributeValue();
            }
            return retVal;
        }
        

		//get method for Custom Template Fields
        this.getCustomField = function(vFieldName){
            var retVal = null;
            if(this.validCustomFields){
                var tmpVal = this.customFields[vFieldName.toString()];
                if(!matches(tmpVal,undefined,null,"")){
                    retVal = tmpVal;
				}
            }
            return retVal;
        }
		
	
       
        this.getCaps = function() { // option record type filter
			var resultArray = new Array();
        
            if (this.refSeqNumber) {
                aa.print("ref seq : " + this.refSeqNumber);
                var capTypes = "*/*/*/*";
                
                if (arguments.length == 1) capTypes = arguments[0];
                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 
                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (appMatch(capTypes,thisCapId)) {
                        resultArray.push(thisCapId)
                        }
                    }
				} 
            
        return resultArray;
        }
        this.getRelatedContactObjs = function() { // option record type filter
        
            if (this.refSeqNumber) {
                var capTypes = null;
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];
                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 
                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (capTypes && appMatch(capTypes,thisCapId)) {
                        var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
                        var newContactObj = new contactObj(ccsm);
                        resultArray.push(newContactObj)
                        }
                    }
            }
            
        return resultArray;
        }

        this.getContactName = function(includeContactName, includeBusinessName, includeTradeName){
            var vContactName = "";
            var bFLName = false;
            // Set Defualts
            var vIncludeContactName = true;
            var vIncludeBusinessName = true;
            var vIncludeTradeName = false;
            if(!matches(includeContactName,null,undefined,"")) { vIncludeContactName = true }
            if(!matches(includeBusinessName,null,undefined,"")){ vIncludeBusinessName = true }
            if(!matches(includeTradeName,null,undefined,"")) { vIncludeTradeName = true }
			if (vIncludeContactName && this.people.getLastName() != null && this.people.getFirstName() != null){
                vContactName = this.people.getFirstName() + " " + this.people.getLastName()
                bFLName = true;
			}
			if(vIncludeContactName && vIncludeBusinessName && this.people.getBusinessName() != null && bFLName){
				vContactName = this.people.getBusinessName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
			}
			if(!vIncludeContactName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null){
				vContactName = this.people.getBusinessName();
            }
            if(!bFLName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null){
                // If there is no First or Last Name use the Business Name
				vContactName = this.people.getBusinessName();
            }
            if(!vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null){
				vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName();
			}
			if(!vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null){
				vContactName = this.people.getTradeName();
            }
            if(vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null && bFLName){
				vContactName = this.people.getTradeName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
			}
            if(vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null && bFLName){
				vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName() + " : " + this.people.getFirstName() + " " + this.people.getLastName();
			}
			return vContactName;
		}
    }

    function matches(eVal, argList) {
        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i] == eVal) {
                return true;
            }
        }
        return false;
    } 