var myCapId = "BB-R24-00001";
var myUserId = 'ADMIN';

/* ASA  */ //var eventName = "ApplicationSubmitAfter";
/* WTUA */ //var eventName = "WorkflowTaskUpdateAfter"; wfTask = "Issuance"; wfStatus = "Issued"; wfHours = 10; wfDate = "01/27/2015"; wfComment = "Test Comment"; wfStaffUserID = 'Admin'
/* IRSA */ //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Pass"; inspResultComment = "Comment";  inspType = "Business License Inspection"; inspId = '11412'; inspComment = 'Comment'; var inspResultDate = "01/12/2023"; var inspGroup = "Building"; var inspSchedDate = "01/13/2023";
/* ISA  */ //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */ //var eventName = "PaymentReceiveAfter";
/* CTRCA  */ var eventName = "ConvertToRealCAPAfter";
/* IFA */ //var eventName = 'InvoiceFeeAfter' ; var InvoiceNbrArray = []
//var eventName = 'ApplicationSpecificInfoUpdateAfter';
//var eventName = 'WorkflowAssignTaskAfter'

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.

/* master script code don't touch */ aa.env.setValue('EventName', eventName);
var vEventName = eventName;
var controlString = eventName;
var tmpID = aa.cap.getCapID(myCapId).getOutput();
if (tmpID != null) {
  aa.env.setValue('PermitId1', tmpID.getID1());
  aa.env.setValue('PermitId2', tmpID.getID2());
  aa.env.setValue('PermitId3', tmpID.getID3());
}
aa.env.setValue('CurrentUserID', myUserId);
var preExecute = 'PreExecuteForAfterEvents';
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue(
  'MULTI_SERVICE_SETTINGS',
  'SUPER_AGENCY_FOR_EMSE'
);
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != 'I') {
  useSA = true;
  SA = bzr.getOutput().getDescription();
  bzr = aa.bizDomain.getBizDomainByValue(
    'MULTI_SERVICE_SETTINGS',
    'SUPER_AGENCY_INCLUDE_SCRIPT'
  );
  if (bzr.getSuccess()) {
    SAScript = bzr.getOutput().getDescription();
  }
}
if (SA) {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', SA, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', SA, useProductScript));
  /* force for script test*/ showDebug = true;
  eval(getScriptText(SAScript, SA, useProductScript));
} else {
  eval(getScriptText('INCLUDES_ACCELA_FUNCTIONS', null, useProductScript));
  eval(getScriptText('INCLUDES_ACCELA_GLOBALS', null, useProductScript));
}
eval(getScriptText('INCLUDES_CUSTOM', null, useProductScript));
if (documentOnly) {
  doStandardChoiceActions2(controlString, false, 0);
  aa.env.setValue('ScriptReturnCode', '0');
  aa.env.setValue(
    'ScriptReturnMessage',
    'Documentation Successful.  No actions executed.'
  );
  aa.abortScript();
}
var prefix = lookup('EMSE_VARIABLE_BRANCH_PREFIX', vEventName);
var controlFlagStdChoice = 'EMSE_EXECUTE_OPTIONS';
var doStdChoices = true;
var doScripts = false;
var bzr =
  aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
  var bvr1 = aa.bizDomain.getBizDomainByValue(
    controlFlagStdChoice,
    'STD_CHOICE'
  );
  doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
  var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, 'SCRIPT');
  doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != 'I';
}
function getScriptText(vScriptName, servProvCode, useProductScripts) {
  if (!servProvCode) servProvCode = aa.getServiceProviderCode();
  vScriptName = vScriptName.toUpperCase();
  var emseBiz = aa.proxyInvoker
    .newInstance('com.accela.aa.emse.emse.EMSEBusiness')
    .getOutput();
  try {
    if (useProductScripts) {
      var emseScript = emseBiz.getMasterScript(
        aa.getServiceProviderCode(),
        vScriptName
      );
    } else {
      var emseScript = emseBiz.getScriptByPK(
        aa.getServiceProviderCode(),
        vScriptName,
        'ADMIN'
      );
    }
    return emseScript.getScriptText() + '';
  } catch (err) {
    return '';
  }
}
logGlobals(AInfo);
if (runEvent && typeof doStandardChoiceActions == 'function' && doStdChoices)
  try {
    doStandardChoiceActions(controlString, true, 0);
  } catch (err) {
    logDebug(err.message);
  }
if (runEvent && typeof doScriptActions == 'function' && doScripts)
  doScriptActions();
var z = debug.replace(/<BR>/g, '\r');
aa.print(z);
doConfigurableScriptActions();

//
// User code goes here
//

try {
  logDebug('>>>>>>>> Start of script test');

  showDebug = true;
  publicUser = true;

  debug = ''



  try {
    if (appMatch('Licenses/Business/*/Renewal') || appMatch('Licenses/Mobile Vendor/*/Renewal') || appMatch('Licenses/Parking/*/Renewal') || appMatch('Licenses/Transportation/*/Renewal') || appMatch('ABC/*/*/Renewal')) {
      var pCapLic = getParentCapID4Renewal();

      if (pCapLic) {
        var licensePeople = getPeople(pCapLic);
        var renewalPeople = getPeople(capId); //Array of CapContactScriptModel

        var contactChange = new Array()


        var conditionMessage = '';
        var addCondition = false;


        //LOOK AT RENEWAL CONTACTS TO CHECK IF THERE ARE ADDITIONS OR CHANGES
        renewalPeople.forEach(function (renewalPerson) {
          var found = false;
          // var renewalPerson = renewalPeople[i]; // CapContractScriptModel
          var renewalPersonObject = new contactObjLocal(renewalPerson);

          var renContactType = renewalPersonObject.type;

          for (k in licensePeople) {
            var licensePerson = licensePeople[k];
            var licensePersonObject = new contactObjLocal(licensePerson);
            var licContactType = licensePersonObject.type;
            if (renContactType != licContactType) continue;

            logDebug('Comparing Renewal ' + renContactType + ': ' + renewalPersonObject.getContactName() + ' to LICENSE ' + licContactType + ': ' + licensePersonObject.getContactName())

            // REVIEW/COMPARE BUSINESS SHAREHOLDER
            if (licContactType == 'Business Shareholder' && renContactType == 'Business Shareholder') {

              var peopMatch = renewalPersonObject.equals(licensePersonObject);
              if (peopMatch) {
                found = true;

                //check if ownership has changed
                logDebug('Found matching Shareholders')
                var licOwnerPerc = licensePersonObject.getCustomField('Percentage of Ownership')
                var renOwnerPerc = renewalPersonObject.getCustomField('Percentage of Ownership')
                if (+licOwnerPerc != +renOwnerPerc) {
                  logDebug('Shareholder % for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerPerc + ' to ' + renOwnerPerc)

                  contactChange.push({ type: 'change', message: 'Shareholder % for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerPerc + ' to ' + renOwnerPerc })
                }
                break
              }
            }

            // REVIEW/COMPARE Agent-Sole Proprietor-1st Partner
            if (licContactType == 'Agent-Sole Proprietor-1st Partner' && renContactType == 'Agent-Sole Proprietor-1st Partner') {

              var peopMatch = renewalPersonObject.equals(licensePersonObject);
              if (peopMatch) {
                found = true;

                //check if ownership has changed
                logDebug('Found matching Agents')
                var licOwnerPerc = licensePersonObject.getCustomField('Percentage of Ownership')
                var renOwnerPerc = renewalPersonObject.getCustomField('Percentage of Ownership')
                if (+licOwnerPerc != +renOwnerPerc) {
                  logDebug('Shareholder % for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerPerc + ' to ' + renOwnerPerc)

                  contactChange.push({ type: 'change', message: 'Shareholder % for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerPerc + ' to ' + renOwnerPerc })
                }

                var licOwnerTitle = licensePersonObject.getCustomField('Business Owner Title')
                var renOwnerTitle = renewalPersonObject.getCustomField('Business Owner Title')
                if (licOwnerTitle != renOwnerTitle) {
                  logDebug('Owner Title for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerTitle + ' to ' + renOwnerTitle)

                  contactChange.push({ type: 'change', message: 'Owner Title for ' + renewalPersonObject.getContactName() + ' changed from ' + licOwnerTitle + ' to ' + renOwnerTitle })
                }
                break
              }
            }

            // REVIEW/COMPARE Business Entity
            if (licContactType == 'Business Entity' && renContactType == 'Business Entity') {

              if (renewalPerson.people.getBusinessName() == licensePerson.people.getBusinessName() || renewalPerson.people.getBusinessName2() == licensePerson.people.getBusinessName2()) {
                //Business Name matches, at least one of them

                if (renewalPerson.people.getBusinessName() != licensePerson.people.getBusinessName()) {
                  contactChange.push({ type: 'change', message: 'Business Entity Legal Name changed from ' + licensePerson.people.getBusinessName() + ' to ' + renewalPerson.people.getBusinessName() })

                }

                if (renewalPerson.people.getBusinessName2() != licensePerson.people.getBusinessName2()) {
                  contactChange.push({ type: 'change', message: 'Business Entity DBA changed from ' + licensePerson.people.getBusinessName2() + ' to ' + renewalPerson.people.getBusinessName2() })

                }

                if (renewalPersonObject.getCustomField('Type of Ownership') != licensePersonObject.getCustomField('Type of Ownership')) {
                  contactChange.push({ type: 'change', message: 'Business Entity Business Type changed from ' + licensePersonObject.getCustomField('Type of Ownership') + ' to ' + renewalPersonObject.getCustomField('Type of Ownership') })
                }

                found = true;
                break
              }

            }
          }
          if (!found) {
            logDebug(renContactType + ': ' + renewalPersonObject.getContactName() + '  was not found on license')
            contactChange.push({ type: 'new', message: 'Addition of: ' + renContactType + ' - ' + renewalPersonObject.getContactName() })
          }
        })



        //LOOK AT LICENSE CONTACTS TO MAKE SURE THEY APPEAR ON THE RENEWAL, MARK ANY REMOVALS
        licensePeople.forEach(function (licensePerson) {
          var found = false;

          var licensePersonObject = new contactObjLocal(licensePerson);
          var licContactType = licensePersonObject.type;

          for (k in renewalPeople) {
            var renewalPerson = renewalPeople[k];
            var renewalPersonObject = new contactObjLocal(renewalPerson)
            var renContactType = renewalPersonObject.type;

            if (renContactType != licContactType) continue;
            logDebug('Comparing Renewal ' + renContactType + ': ' + renewalPersonObject.getContactName() + ' to LICENSE ' + licContactType + ': ' + licensePersonObject.getContactName())
            
            // REVIEW/COMPARE BUSINESS SHAREHOLDER
            if (licContactType == 'Business Shareholder' && renContactType == 'Business Shareholder') {

              var peopMatch = renewalPersonObject.equals(licensePersonObject);
              if (peopMatch) {
                found = true;
                break
              }
            }

             // REVIEW/COMPARE Agent-Sole Proprietor-1st Partner
             if (licContactType == 'Agent-Sole Proprietor-1st Partner' && renContactType == 'Agent-Sole Proprietor-1st Partner') {

              var peopMatch = renewalPersonObject.equals(licensePersonObject);
              if (peopMatch) {
                found = true;
                break
              }
            }

              // REVIEW/COMPARE Business Entity
              if (licContactType == 'Business Entity' && renContactType == 'Business Entity') {
                if (renewalPerson.people.getBusinessName() == licensePerson.people.getBusinessName() || renewalPerson.people.getBusinessName2() == licensePerson.people.getBusinessName2()) {
                  //Business Name matches, at least one of them  
                  found = true;
                  break
                }
              }
          }

          if (!found) {
            logDebug(renContactType + ': ' + renewalPersonObject.getContactName() + '  was not found on license')
            contactChange.push({ type: 'removed', message: 'Removal of: ' + licContactType + ' - ' + licensePersonObject.getContactName() })
          }
        })


        if (contactChange && contactChange.length > 0) {


          contactChange.forEach(function (change) {
            exploreObject(change)
          })


        }









        // if (addCondition && conditionMessage != ''){
        //   // logDebug('Message: ' + conditionMessage)

        //   addAppCondition('Changes', 'Applied', 'Change to Contacts', conditionMessage, 'Notice')

        //   var capConditions = aa.capCondition.getCapConditions(capId, 'Changes');
        //   if (capConditions.getSuccess()){

        //     capConditions = capConditions.getOutput();
        //     for (i in capConditions){
        //       condit = capConditions[i];
        //       condit.setDisplayConditionNotice('Y');
        //       condit.setIncludeInConditionName('Y');
        //       var updateCondit = aa.capCondition.editCapCondition(condit);
        //     }

        //   }

        // }
      }
    }
  } catch (err) {
    logDebug(err.message);
    logDebug(err.stack);
  };


} catch (err) {
  logDebug('A JavaScript Error occured: ' + err.message);
}
// end user code
aa.env.setValue('ScriptReturnCode', '1');
aa.env.setValue('ScriptReturnMessage', debug);
// END SCRIPT TESTER




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
  properties.forEach(function (property) {
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
  methods.forEach(function (method) {
    logDebug('<font color=blue><u><b>' + method + '</b></u></font> ');
    logDebug('   ' + objExplore[method] + '<br>');
  });


}

// function logDebug(str){aa.print(str)}


function isMatchPeopleLocal(capContactScriptModel, capContactScriptModel2) {
  if (capContactScriptModel == null || capContactScriptModel2 == null) {
    return false;
  }
  var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
  var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
  var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
  var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
  var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
  var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
  var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
  var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();
  if ((contactType1 == null && contactType2 != null)
    || (contactType1 != null && contactType2 == null)) {
    return false;
  }
  if (contactType1 != null && !contactType1.equals(contactType2)) {
    return false;
  }
  if ((firstName1 == null && firstName2 != null)
    || (firstName1 != null && firstName2 == null)) {
    return false;
  }
  if (firstName1 != null && !firstName1.equals(firstName2)) {
    return false;
  }
  if ((lastName1 == null && lastName2 != null)
    || (lastName1 != null && lastName2 == null)) {
    return false;
  }
  if (lastName1 != null && !lastName1.equals(lastName2)) {
    return false;
  }
  if ((fullName1 == null && fullName2 != null)
    || (fullName1 != null && fullName2 == null)) {
    return false;
  }
  if (fullName1 != null && !fullName1.equals(fullName2)) {
    return false;
  }
  return true;
}

function findMatchingPeople(targetCapId) {
  var pCapLicense = getParentCapID4Renewal()
  // var pCap = aa.cap.getCap(pCapRenewal).getOutput()
  // var pCapModel = pCap.getCapModel();

  //1. Get people with source CAPID.
  var capPeoples = getPeople(capId);
  if (capPeoples == null || capPeoples.length == 0) {
    return;
  }
  //2. Get people with target CAPID.
  var targetPeople = getPeople(pCapLicense);
  //3. Check to see which people is matched in both source and target.
  exploreObject(capPeoples)
  exploreObject(targetPeople)



  for (var loopk in capPeoples) {
    sourcePeopleModel = capPeoples[loopk];
    //3.1 Set target CAPID to source people.
    sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
    targetPeopleModel = null;
    //3.2 Check to see if sourcePeople exist.
    if (targetPeople != null && targetPeople.length > 0) {
      for (var loop2 in targetPeople) {

        logDebug(isMatchPeopleLocal(sourcePeopleModel, targetPeople[loop2]))
        if (isMatchPeopleLocal(sourcePeopleModel, targetPeople[loop2])) {
          targetPeopleModel = targetPeople[loop2];
          break;
        } else {
          logDebug('something did not work')
        }
      }
    }
    //3.3 It is a matched people model.
    if (targetPeopleModel != null) {
      //3.3.1 Copy information from source to target.
      aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
      //3.3.2 Edit People with source People information. 
      aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
    }
    //3.4 It is new People model.
    else {
      //3.4.1 Create new people.
      aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
    }
  }
}

/*

  {
        standardCondition = standardConditions[i];
        addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), standardCondition.getConditionOfApproval());
      }

      */



function contactObjLocal(ccsm) {
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
  if (ccsm) {
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
      if (tm) {
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
    //this.primary = this.capContact.getPrimaryFlag().equals("Y");
    this.relation = this.people.relation;
    this.seqNumber = this.people.contactSeqNumber;
    this.type = this.people.getContactType();
    this.capId = this.capContactScript.getCapID();
    var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
    if (contactAddressrs.getSuccess()) {
      this.addresses = contactAddressrs.getOutput();
      var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
      this.people.setContactAddressList(contactAddressModelArr);
    }
    else {
      pmcal = this.people.getContactAddressList();
      if (pmcal) {
        this.addresses = pmcal.toArray();
      }
    }
  }
  this.toString = function () { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary; }

  this.getContactName = function (includeContactName, includeBusinessName, includeTradeName) {
    var vContactName = "";
    var bFLName = false;
    // Set Defualts
    var vIncludeContactName = true;
    var vIncludeBusinessName = true;
    var vIncludeTradeName = false;
    if (!matches(includeContactName, null, undefined, "")) { vIncludeContactName = true }
    if (!matches(includeBusinessName, null, undefined, "")) { vIncludeBusinessName = true }
    if (!matches(includeTradeName, null, undefined, "")) { vIncludeTradeName = true }
    if (vIncludeContactName && this.people.getLastName() != null && this.people.getFirstName() != null) {
      vContactName = this.people.getFirstName() + " " + this.people.getLastName()
      bFLName = true;
    }
    if (vIncludeContactName && vIncludeBusinessName && this.people.getBusinessName() != null && bFLName) {
      vContactName = this.people.getBusinessName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
    }
    if (!vIncludeContactName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null) {
      vContactName = this.people.getBusinessName();
    }
    if (!bFLName && vIncludeBusinessName && !vIncludeTradeName && this.people.getBusinessName() != null) {
      // If there is no First or Last Name use the Business Name
      vContactName = this.people.getBusinessName();
    }
    if (!vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null) {
      vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName();
    }
    if (!vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null) {
      vContactName = this.people.getTradeName();
    }
    if (vIncludeContactName && !vIncludeBusinessName && vIncludeTradeName && this.people.getTradeName() != null && bFLName) {
      vContactName = this.people.getTradeName() + " - " + this.people.getFirstName() + " " + this.people.getLastName();
    }
    if (vIncludeContactName && vIncludeBusinessName && vIncludeTradeName && this.people.getBusinessName() != null && bFLName) {
      vContactName = this.people.getBusinessName() + " - " + this.people.getTradeName() + " : " + this.people.getFirstName() + " " + this.people.getLastName();
    }
    return vContactName;
  }

  this.equals = function (t, msgReason) {

    var addtMsg = '';
    if (t == null) return false;

    if (!String(this.people.type).equals(String(t.people.type))) {
      logDebug('Types do not match')
      return false;
    }

    if (this.type == 'Business Entity') {
      // COMPARE Business Name, Trade Name, and Ownership Type

      //STEP 1 Compare Business Name
      if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) {
        addtMsg += 'Legal Entity Name Changed from ' + t.people.getBusinessName() + ' TO ' + this.people.getBusinessName() + '\n'
      }

      //STEP 2 Compare Trade Name
      if (!String(this.people.getBusinessName2()).equals(String(t.people.getBusinessName2()))) {
        addtMsg += 'Doing Business As Changed from ' + t.people.getBusinessName2() + ' TO ' + this.people.getBusinessName2() + '\n'
      }

      if (!String(this.people.getTradeName()).equals(String(t.people.getTradeName()))) {
        addtMsg += 'Doing Business As Changed from ' + t.people.getTradeName() + ' TO ' + this.people.getTradeName() + '\n'
      }

      //STEP 3 Type of Ownership ASI
      if (!String(this.getCustomField('Type of Ownership')).equals(String(t.getCustomField('Type of Ownership')))) {
        addtMsg += 'Type of Ownership Changed from ' + t.getCustomField('Type of Ownership') + ' TO ' + this.getCustomField('Type of Ownership') + '\n'
      }


      if (addtMsg) {
        msgReason += addtMsg;

        logDebug('msgReason: ' + addtMsg);
        return false;
      }

    } else {
      if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) {
        logDebug('name no match')
        return false;
      }
      if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) {
        logDebug('last name no match')

        return false;
      }

    }



    logDebug('Contact Matches: ' + this.type)
    return true;
  }

  //get method for Attributes
  this.getAttribute = function (vAttributeName) {
    var retVal = null;
    if (this.validAttrs) {
      var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
      if (tmpVal != null)
        retVal = tmpVal.getAttributeValue();
    }
    return retVal;
  }

  //Set method for Attributes
  this.setAttribute = function (vAttributeName, vAttributeValue) {
    var retVal = false;
    if (this.validAttrs) {
      var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
      if (tmpVal != null) {
        tmpVal.setAttributeValue(vAttributeValue);
        retVal = true;
      }
    }
    return retVal;
  }

  //get method for Custom Template Fields
  this.getCustomField = function (vFieldName) {
    var retVal = null;
    if (this.validCustomFields) {
      var tmpVal = this.customFields[vFieldName.toString()];
      if (!matches(tmpVal, undefined, null, "")) {
        retVal = tmpVal;
      }
    }
    return retVal;
  }


  this.getCaps = function () { // option record type filter
    var resultArray = new Array();

    if (this.refSeqNumber) {
      aa.print("ref seq : " + this.refSeqNumber);
      var capTypes = "*/*/*/*";

      if (arguments.length == 1) capTypes = arguments[0];
      var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
      var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
      pm.setServiceProviderCode(aa.getServiceProviderCode());
      pm.setContactSeqNumber(this.refSeqNumber);
      var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

      for (var j in cList) {
        var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
        if (appMatch(capTypes, thisCapId)) {
          resultArray.push(thisCapId)
        }
      }
    }

    return resultArray;
  }
  this.getRelatedContactObjs = function () { // option record type filter

    if (this.refSeqNumber) {
      var capTypes = null;
      var resultArray = new Array();
      if (arguments.length == 1) capTypes = arguments[0];
      var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
      var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
      pm.setServiceProviderCode(aa.getServiceProviderCode());
      pm.setContactSeqNumber(this.refSeqNumber);
      var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

      for (var j in cList) {
        var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
        if (capTypes && appMatch(capTypes, thisCapId)) {
          var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
          var newContactObj = new contactObj(ccsm);
          resultArray.push(newContactObj)
        }
      }
    }

    return resultArray;
  }

}