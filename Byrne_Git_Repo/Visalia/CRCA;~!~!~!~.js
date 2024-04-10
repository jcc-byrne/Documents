editConstType("649");

//ASA Business Tax Fees
showDebug = 3; showMessage = true; //comment("Hello tyler");
editConstType("649");
if(appMatch("BusinessTax/Business Tax Renewal/*/*")){
				var homeOcc = getAppSpecific("Home Occupancy");
				var chargeMax = getAppSpecific("Charge Max");
				var typeBT = getAppSpecific("Type");
				var shopArea = getAppSpecific("Shopping Area");
				var delTaxType = getAppSpecific("Delivery Vehicle Tax Type");
				var annGrossReceipts = getAppSpecific("Annual Gross Receipts");
				var numDaysTemp = getAppSpecific("Number of Days (Temporary)");
				var numMonthsTemp = getAppSpecific("Number of Months (Temporary)");
				var tempTaxType = getAppSpecific("Temporary Tax Type");
				var numVehicles = getAppSpecific("Number of Vehicles");
				var fullYearPay = getAppSpecific("Full Yr Pay");
				var numProf = getAppSpecific("Number of Professionals");

if(appMatch("BusinessTax/Business Tax Renewal/*/*") && AInfo["Home Occupancy"] != "CHECKED" && AInfo["Charge Max"] != "CHECKED"){
	
							//302-1
							if(AInfo["Type"] == "Professionals"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Professionals"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Professionals Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Professionals Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Professionals Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Professionals Max"));
									}
								addFee("302-1","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-2
							if(AInfo["Type"] == "Services"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Services"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Services Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Services Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Services Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Services Max"));
									}
								addFee("302-2","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-3
							if(AInfo["Type"] == "Retailers"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Retailers"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Retailers Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Retailers Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Retailers Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Retailers Max"));
									}
								addFee("302-3","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-4
							if(AInfo["Type"] == "Landlord"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Landlord"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Landlord Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Landlord Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Landlord Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Landlord Max"));
									}
								addFee("302-4","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-5
							if(AInfo["Type"] == "Manufacturers"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Manufacturers"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Manufacturers Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Manufacturers Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Manufacturers Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Manufacturers Max"));
									}
								addFee("302-5","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-6
							if(AInfo["Type"] == "Non-Mechanical Contractors"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Non-Mechanical Contractors"));
								var feeAmt = numProf * feeFactor;
								addFee("302-6","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-7
							if(AInfo["Type"] == "Mechanical Contractors"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Mechanical Contractors"));
								var feeAmt = numProf * feeFactor;
								addFee("302-7","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-8
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Daily"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary Daily"));
								var feeAmt = numDaysTemp * feeFactor;
								addFee("302-8","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-9
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Monthly"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary Monthly"));
								var feeAmt = numMonthsTemp * feeFactor;
								addFee("302-9","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-10
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Gross Receipts"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary GR"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
								addFee("302-10","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-11
							if(AInfo["Type"] == "Delivery Vehicle" && AInfo["Delivery Vehicle Tax Type"] == "Semi-Annual"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle 1st"));
								var feeFactor2 = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle Additional"));
									if(numVehicles == 1){
										var feeAmt = numVehicles * feeFactor;
									}
									if(numVehicles > 1){
										var numOfVehicles = numVehicles -1;
										var feeAmt = (numOfVehicles * feeFactor2) + feeFactor;
									}
								addFee("302-11","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-12
							if(AInfo["Type"] == "Delivery Vehicle" && AInfo["Delivery Vehicle Tax Type"] == "Gross Receipts"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle GR"));
								var feeAmt = ((annGrossReceipts / 1000) * feeFactor);
								addFee("302-12","BUS_TAX","FINAL",feeAmt,"Y");
							}
	
	if(appMatch("BusinessTax/Business Tax Application/*/*")){
		addFee("306","BUS_TAX","FINAL",1,"Y");
	}
	
	if(AInfo["Shopping Area"] == "DT"){
		addFee("301","BUS_TAX","FINAL",1,"Y");
	}
}	

if(appMatch("BusinessTax/Business Tax Renewal/*/*") && AInfo["Home Occupancy"] != "CHECKED" && AInfo["Charge Max"] == "CHECKED"){
	
							//302-1
							if(AInfo["Type"] == "Professionals"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Professionals"));
								var feeAmt = 99999999 * feeFactor;
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Professionals Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Professionals Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Professionals Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Professionals Max"));
									}
								addFee("302-1","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-2
							if(AInfo["Type"] == "Services"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Services"));
								var feeAmt = 99999999 * feeFactor;
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Services Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Services Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Services Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Services Max"));
									}
								addFee("302-2","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-3
							if(AInfo["Type"] == "Retailers"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Retailers"));
								var feeAmt = 99999999 * feeFactor;
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Retailers Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Retailers Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Retailers Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Retailers Max"));
									}
								addFee("302-3","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-4
							if(AInfo["Type"] == "Landlord"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Landlord"));
								var feeAmt = 99999999 * feeFactor;
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Landlord Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Landlord Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Landlord Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Landlord Max"));
									}
								addFee("302-4","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-5
							if(AInfo["Type"] == "Manufacturers"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Manufacturers"));
								var feeAmt = 99999999 * feeFactor;
									if(feeAmt < parseFloat(lookup("BUSTAX_FEES","Manufacturers Min"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Manufacturers Min"));
									}
									if(feeAmt > parseFloat(lookup("BUSTAX_FEES","Manufacturers Max"))){
										feeAmt = parseFloat(lookup("BUSTAX_FEES","Manufacturers Max"));
									}
								addFee("302-5","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-6
							if(AInfo["Type"] == "Non-Mechanical Contractors"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Non-Mechanical Contractors"));
								var feeAmt = numProf * feeFactor;
								addFee("302-6","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-7
							if(AInfo["Type"] == "Mechanical Contractors"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Mechanical Contractors"));
								var feeAmt = numProf * feeFactor;
								addFee("302-7","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-8
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Daily"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary Daily"));
								var feeAmt = numDaysTemp * feeFactor;
								addFee("302-8","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-9
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Monthly"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary Monthly"));
								var feeAmt = numMonthsTemp * feeFactor;
								addFee("302-9","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-10
							if(AInfo["Type"] == "Temporary" && AInfo["Temporary Tax Type"] == "Gross Receipts"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Temporary GR"));
								var feeAmt = 194.50 * feeFactor;
								addFee("302-10","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-11
							if(AInfo["Type"] == "Delivery Vehicle" && AInfo["Delivery Vehicle Tax Type"] == "Semi-Annual"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle 1st"));
								var feeFactor2 = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle Additional"));
									if(numVehicles == 1){
										var feeAmt = numVehicles * feeFactor;
									}
									if(numVehicles > 1){
										var numOfVehicles = numVehicles -1;
										var feeAmt = (numOfVehicles * feeFactor2) + feeFactor;
									}
								addFee("302-11","BUS_TAX","FINAL",feeAmt,"Y");
							}
							//302-12
							if(AInfo["Type"] == "Delivery Vehicle" && AInfo["Delivery Vehicle Tax Type"] == "Gross Receipts"){
								var feeFactor = parseFloat(lookup("BUSTAX_FEES","Delivery Vehicle GR"));
								var feeAmt = 194.50 * feeFactor;
								addFee("302-12","BUS_TAX","FINAL",feeAmt,"Y");
							}
	

	
	if(AInfo["Shopping Area"] == "DT"){
		addFee("301","BUS_TAX","FINAL",1,"Y");
	}
}	
}
//BusTax ASA

if(appMatch("BusinessTax/Business Tax Renewal/*/*")){


	if(AInfo["Annual Gross Receipts"] != null){
	var masterArray = new Array();
		//Pull the Full Year
        var cDate = new Date(); var theYear = cDate.getFullYear();
        var capAddResult = aa.address.getAddressByCapId(capId); var addArray = new Array();
		//Pull the Address
        var addArray = capAddResult.getOutput(); var hNum = addArray[0].getHouseNumberStart();
        var hDirection = addArray[0].getStreetDirection(); var hName = addArray[0].getStreetName();
        var hSuffix = addArray[0].getStreetSuffix(); var hZip = addArray[0].getZip();
        var capAddress = hNum +" "+ hName +" "+ hSuffix +", "+ hZip;
		//Pull the Business Owner 
		contactTypes = new Array("Business Owner");
		iCon = null; contactArray = new Array(); parameters = aa.util.newHashMap();
		contactArray = getContactArray();
			for (iCon in contactArray)
						
				if (exists(contactArray[iCon]["contactType"],contactTypes));{
					reportParams = null; newReport = null; tContact = contactArray[0];
					params = aa.util.newHashtable(); getRecordParams4Notification(params); 
					getPrimaryAddressLineParam4Notification(params); getPrimaryOwnerParams4Notification(params); getContactParams4Notification(params,tContact);
					reportParams = aa.util.newHashtable(); addParameter(reportParams,"RecordID",capIDString);
					var busOwner = tContact["fullName"];
					}
		//Pull the Lic Professional
        capLicenseResult = aa.licenseScript.getLicenseProf(capId);
        if (capLicenseResult.getSuccess())
		{ capLicenseArr = capLicenseResult.getOutput();  
          licProfScriptModel = capLicenseArr[0];
          var theLp = licProfScriptModel.getBusinessName();}
		//Pull the Owner
        capOwnerResult = aa.owner.getOwnerByCapId(capId);
        if (capOwnerResult.getSuccess())
		{ capOwnerArr = capOwnerResult.getOutput();  
          ownerModel = capOwnerArr[0];
          var theOwner = ownerModel.getOwnerFullName();
            }
	//Set the Array
	masterArray["Year"] = theYear.toString(); masterArray["Gross Receipts"] = AInfo["Annual Gross Receipts"]; masterArray["Business Address"] = capAddress.toString();
	masterArray["Business Owner"] = busOwner.toString();; masterArray["Professional"] = theLp.toString(); masterArray["Property Owner"] = theOwner.toString();
	//Add Value To Table
	addToASITable("GROSS RECEIPTS HISTORY",masterArray,capId);
	}
	else{
	var masterArray = new Array();
		//Pull the Full Year
        var cDate = new Date(); var theYear = cDate.getFullYear();
        var capAddResult = aa.address.getAddressByCapId(capId); var addArray = new Array();
		//Pull the Address
        var addArray = capAddResult.getOutput(); var hNum = addArray[0].getHouseNumberStart();
        var hDirection = addArray[0].getStreetDirection(); var hName = addArray[0].getStreetName();
        var hSuffix = addArray[0].getStreetSuffix(); var hZip = addArray[0].getZip();
        var capAddress = hNum +" "+ hName +" "+ hSuffix +", "+ hZip;
		//Pull the Business Owner 
		contactTypes = new Array("Business Owner");
		iCon = null; contactArray = new Array(); parameters = aa.util.newHashMap();
		contactArray = getContactArray();
			for (iCon in contactArray)
						
				if (exists(contactArray[iCon]["contactType"],contactTypes));{
					reportParams = null; newReport = null; tContact = contactArray[0];
					params = aa.util.newHashtable(); getRecordParams4Notification(params); 
					getPrimaryAddressLineParam4Notification(params); getPrimaryOwnerParams4Notification(params); getContactParams4Notification(params,tContact);
					reportParams = aa.util.newHashtable(); addParameter(reportParams,"RecordID",capIDString);
					var busOwner = tContact["fullName"];
					}
		//Pull the Lic Professional
        capLicenseResult = aa.licenseScript.getLicenseProf(capId);
        if (capLicenseResult.getSuccess())
		{ capLicenseArr = capLicenseResult.getOutput();  
          licProfScriptModel = capLicenseArr[0];
          var theLp = licProfScriptModel.getBusinessName();}
		//Pull the Owner
        capOwnerResult = aa.owner.getOwnerByCapId(capId);
        if (capOwnerResult.getSuccess())
		{ capOwnerArr = capOwnerResult.getOutput();  
          ownerModel = capOwnerArr[0];
          var theOwner = ownerModel.getOwnerFullName();
            }
	//Set the Array
	masterArray["Year"] = theYear.toString(); masterArray["Gross Receipts"] = "0"; masterArray["Business Address"] = capAddress.toString();
	masterArray["Business Owner"] = busOwner.toString();; masterArray["Professional"] = theLp.toString(); masterArray["Property Owner"] = theOwner.toString();
	//Add Value To Table
	addToASITable("GROSS RECEIPTS HISTORY",masterArray,capId);
	}
	


}

//email applicant on submittal
if(appMatch("Building/*/*/*") && publicUser){
contactTypes = new Array("Applicant");
iCon = null; contactArray = new Array(); parameters = aa.util.newHashMap();
contactArray = getContactArray();
for (iCon in contactArray)
						
if (exists(contactArray[iCon]["contactType"],contactTypes));{
reportParams = null; newReport = null; tContact = contactArray[iCon];
params = aa.util.newHashtable(); getRecordParams4Notification(params); 
getPrimaryAddressLineParam4Notification(params); getPrimaryOwnerParams4Notification(params); getContactParams4Notification(params,tContact);
reportParams = aa.util.newHashtable(); addParameter(reportParams,"RecordID",capIDString);
//    sendNotification("permits@visalia.city",tContact["email"],"","BUILDING_SUBMITTAL",params,null);

}
}


//if(wfProcess == "B_BPFE")
if(matches(appTypeString,"Building/Residential/Model Home Complex/NA","Building/Commercial/Alteration/NA","Building/Commercial/Building Move/NA","Building/Commercial/New Construction/Hotel Motel","Building/Commercial/New Construction/Misc",
"Building/Commercial/Racking/NA","Building/Commercial/New Construction/Shell","Building/Commercial/New Construction/Shell TI","Building/Commercial/Solar/NA","Building/Various Others/Fence/Commercial","Building/Residential/New Construction/Apartments",
"Building/Residential/New Construction/Custom","Building/Residential/New Construction/Duplex","Building/Residential/New Construction/Fourplex","Building/Residential/New Construction/Guest House","Building/Residential/House Move/NA",
"Building/Residential/New Construction/2nd Unit","Building/Residential/New Construction/Triplex","Building/Residential/Alteration/Additions and or Remodel","Building/Residential/Alteration/Misc Non-Residential Structure",
"Building/Residential/Alteration/Storage","Building/Various Others/Site Improvement/NA"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	editTaskSpecific("Application Submittal","Engineering Review","Yes");
	editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "B_BE")
if(matches(appTypeString,"Building/Various Others/Sewer Connection/NA"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	//editTaskSpecific("Application Submittal","Planning Review","Yes");
	editTaskSpecific("Application Submittal","Engineering Review","Yes");
	//editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "B_BP")
if(matches(appTypeString,"Building/Commercial/Sign/NA"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	//editTaskSpecific("Application Submittal","Engineering Review","Yes");
	//editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "B_BPE")
if(matches(appTypeString,"Building/Residential/Master Plan Production/MFD","Building/Various Others/Pool/Commercial","Building/Residential/Master Plan Production/Res","Building/Various Others/Well/Commercial","Building/Various Others/Well/Residential"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	editTaskSpecific("Application Submittal","Engineering Review","Yes");
	//editTaskSpecific("Application Submittal","Fire Review","Yes");

}
/*
//if(wfProcess == "B_BPF")
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	//editTaskSpecific("Application Submittal","Engineering Review","Yes");
	editTaskSpecific("Application Submittal","Fire Review","Yes");

}*/

//if(wfProcess == "B_F")
if(matches(appTypeString,"Building/Residential/Master Plan/MFD_Fire","Building/Various Others/Fire Suppression/New SFD MFD Sprinkler","Building/Various Others/Fire Suppression/Sprinkler","Building/Various Others/Fire Suppression/Sprinkler System Expansion",
"Building/Various Others/Fire Suppression/FireAlarm","Building/Various Others/Fire Suppression/FireMain","Building/Various Others/Fire Suppression/HoodSup"))
{
	//editTaskSpecific("Application Submittal","Building Review","Yes");
	//editTaskSpecific("Application Submittal","Planning Review","Yes");
	//editTaskSpecific("Application Submittal","Engineering Review","Yes");
	editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "B_MP")
if(matches(appTypeString,"Building/Residential/Master Plan/APTS","Building/Residential/Master Plan/RES_FIRE","Building/Residential/Master Plan/MFD","Building/Residential/Master Plan/RES","Building/Residential/Master Plan/MFD TRI FOUR PLEX",
"Building/Residential/Master Plan/MFD Tri Four Plex Fire"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	//editTaskSpecific("Application Submittal","Engineering Review","Yes");
	editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "B_OTC_B")
if(matches(appTypeString,"Building/Residential/Alteration/Patio Cover","Building/Residential/Solar/NA","Building/Residential/Alteration/Carport","Building/Various Others/Plumbing/Commercial","Building/Various Others/Plumbing/Com Solar",
"Building/Various Others/Plumbing/Landscape","Building/Various Others/Plumbing/Residential","Building/Various Others/Plumbing/Res Solar","Building/Various Others/Pool/Residential","Building/Various Others/Reroof/Commercial",
"Building/Various Others/Reroof/Com Solar","Building/Various Others/Reroof/MultiFamily","Building/Various Others/Reroof/MFD Solar","Building/Various Others/Reroof/Res Solar","Building/Various Others/Fence/Residential","Building/Various Others/Mechanical/Commercial",
"Building/Various Others/Demolition/Commercial","Building/Various Others/Demolition/Residential","Building/Various Others/Electrical/Commercial","Building/Various Others/Electrical/MultiFamily","Building/Various Others/Electrical/Residential"))
{
	editTaskSpecific("Application Submittal","Building Review","Yes");
	//editTaskSpecific("Application Submittal","Planning Review","Yes");
	//editTaskSpecific("Application Submittal","Engineering Review","Yes");
	//editTaskSpecific("Application Submittal","Fire Review","Yes");

}

//if(wfProcess == "P_ENT")
if(matches(appTypeString,"Planning/Enititlements/Ag Preserve/NA","Planning/Enititlements/Annexation/NA","Planning/Enititlements/Change of Zone/NA","Planning/Enititlements/Conditional Use/NA","Planning/Enititlements/Conditional Zoning Agreement/NA",
"Planning/Enititlements/Development Agreement/NA","Planning/Enititlements/Finding of Consistency/NA","Planning/Enititlements/General Plan Amendment/NA","Planning/Enititlements/Specific Plan/NA","Planning/Enititlements/Tentative Parcel Map/NA",
"Planning/Enititlements/Tentative Subdivision Map/NA","Planning/Enititlements/Text Amendment/NA","Planning/Enititlements/Time Extensions/NA","Planning/Enititlements//NA","Planning/Enititlements/Variance/NA"))
{
	editTaskSpecific("City Planner Assignment","Other Review","Yes");
	editTaskSpecific("City Planner Assignment","Planning Review","Yes");
	editTaskSpecific("City Planner Assignment","Engineering Review","Yes");
	editTaskSpecific("City Planner Assignment","CEQA Review","Yes");

}

//if(wfProcess == "P_MINOR")
if(matches(appTypeString,"Engineering/Minor Permits/Administrative Adjustment/NA","Engineering/Minor Permits/Adult Oriented Business/NA","Engineering/Minor Permits/Certificate of Compliance/NA","Engineering/Minor Permits/Historic Preservation/NA",
"Engineering/Minor Permits/Home Occupancy/NA","Engineering/Minor Permits/Lot Line Adjustment/NA","Engineering/Minor Permits/Mural Application/NA","Engineering/Minor Permits/Noise Variance/NA","Engineering/Minor Permits/Outdoor Dining/NA",
"Engineering/Minor Permits/Temp Conditional Use/NA"))
{
	editTaskSpecific("Intake Review","Other Review","Yes");
	editTaskSpecific("Intake Review","Planning Review","Yes");
	editTaskSpecific("Intake Review","Engineering Review","Yes");
	//editTaskSpecific("Intake Review","CEQA Review","Yes");

}

//if(wfProcess == "E_ENCR")
if(matches(appTypeString,"Engineering/Transportation Permit/NA/NA","Engineering/Encroachment/Capital Improv Projects/NA","Engineering/Encroachment/Commercial/NA","Engineering/Encroachment/COV Maintenance/NA","Engineering/Encroachment/Excavation/NA"
,"Engineering/Encroachment/Existing Residence/NA","Engineering/Encroachment/Sewer Lateral - New/NA","Engineering/Encroachment/Sewer Lateral - Replace/NA","Engineering/Encroachment/Subdivision/NA","Engineering/Encroachment/Trim or Remove Tree/NA",
"Engineering/Encroachment/Utility/NA"))
{
	editTaskSpecific("Routing","Building Review","Yes");
	editTaskSpecific("Routing","Planning Review","Yes");
	editTaskSpecific("Routing","Engineering Review","Yes");
	editTaskSpecific("Routing","Traffic Review","Yes");
	editTaskSpecific("Routing","Urban Forestry Review","Yes");
	editTaskSpecific("Routing","Solid Waste Review","Yes");

}

//if(wfProcess == "E_IMPPLNS")
if(matches(appTypeString,"Engineering/Improvement Plans/Miscellaneous/NA","Engineering/Improvement Plans/Parcel/NA","Engineering/Improvement Plans/Subdivision/NA"))
{
	editTaskSpecific("Routing","Planning Review","No");
	editTaskSpecific("Routing","Engineering Review","Yes");
	editTaskSpecific("Routing","Traffic Review","No");
	editTaskSpecific("Routing","Urban Forestry Review","No");
	editTaskSpecific("Routing","City Surveyor Review","No");

}

//if(wfProcess == "E_MAP")
if(matches(appTypeString,"Engineering/Map/Parcel/NA","Engineering/Map/Subdivision/NA"))
{
	editTaskSpecific("Application Submittal","Planning Review","Yes");
	editTaskSpecific("Application Submittal","Surveyor Review","Yes");

}

if(appMatch("Building/*/*/*") && publicUser){
updateAppStatus("Pending","Record Status Set by ASA script");

}

