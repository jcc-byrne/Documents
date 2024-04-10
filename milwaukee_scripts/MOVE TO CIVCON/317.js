// MKEBL-187 - JCC Byrne Software

try {
    var businessContact = getContactsByType('Business Contact', capId);

    for (i in businessContact){
      var capPeople = businessContact[i].getPeople()
      var ccm = businessContact[i].getCapContactModel();
      logDebug('Reviewing: ' + ccm.getFullName())
  
      if (ccm.getRefContactNumber()){
        var refContactNbr = ccm.getRefContactNumber();
        var refPeopleModel = aa.people.getPeople(refContactNbr).getOutput()
        var syncContact = aa.people.syncCapContactToReference(ccm,refPeopleModel)
      }
    }
} catch (err){
    logDebug("API error: " + err.message);
}

// MKEBL-317 - JCC Byrne Software
try {
    var alderDist = getGISInfo2("MILWAUKEE","Parcel","CouncilDistrict");
    if(typeof alderDist != "undefined"){
        editAppSpecific("Aldermanic District", alderDist);
    }

      //If the parcel is in a Local Historic District AND a BID, then choose the BID
  var asiSidewalkDesignation = ''
  var histDist = getGISInfo2("MILWAUKEE","Historic parcels","HIST_CODE");
  if(typeof histDist != "undefined"){
    asiSidewalkDesignation = 'Local Historic Designation'
  }

  var specialDist = getGISInfo2("MILWAUKEE","Business Improvement Districts (BID)","BID name");

  if(typeof specialDist != "undefined"){
    if (specialDist == 'East North Avenue'){
      asiSidewalkDesignation = 'East North Avenue BID'
    } else if (specialDist == 'Historic Third Ward'){
      asiSidewalkDesignation = 'Historic Third Ward'
    }
  }

  if (asiSidewalkDesignation != ''){
    editAppSpecific('Sidewalk Designation', asiSidewalkDesignation, capId)
  }

  var foodDist = getGISInfo2("MILWAUKEE","MHD food inspection districts","DISTRICT");
  if(typeof foodDist != "undefined"){
    editAppSpecific('Food District', foodDist, capId)
  }

  //TODO update this once we have GIS refreshed for MPD
  var policeDist = getGISInfo2("MILWAUKEE","Police districts","");
  if(typeof policeDist != "undefined"){
    editAppSpecific('Police District', policeDist, capId)
  }


    
} catch (err){
    logDebug("API error: " + err.message);
}




function getContactsByType(conType,capId) {
    var contactArray = getPeople(capId);
    var retArray = []
  
    for(thisContact in contactArray) {
        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())
        // retArray.push(contactArray[thisContact].getPeople());
        retArray.push(contactArray[thisContact]);
  
    }
  
    if (retArray){
      return retArray
    } else {
      return false;
    }
  }