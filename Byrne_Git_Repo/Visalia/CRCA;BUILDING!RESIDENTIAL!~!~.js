//ASA:BUILDING/RESIDENTIAL/*/* 
// 9-19-18 Pam corrected Model Hm Deposit fee item from 603 to 600
// 08.18.23 Jacob Clay (Byrn Software) add logic for SolarApp+ record, auto issuance

//Residential New Construction Custom - Fees
if(appMatch("Building/Residential/New Construction/Custom")){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	//updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Custom- VUSD Fee
if(appMatch("Building/Residential/New Construction/Custom") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction 2nd Unit - Fees
if(appMatch("Building/Residential/New Construction/2nd Unit")){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	//updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction 2nd Unit- VUSD Fee
if(appMatch("Building/Residential/New Construction/2nd Unit") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}
//Residential New Construction Duplex - Fees
if(appMatch("Building/Residential/New Construction/Duplex")){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	//updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Duplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Duplex") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Triplex - Fees
if(appMatch("Building/Residential/New Construction/Triplex")){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	//updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Triplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Triplex") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Fourplex - Fees
if(appMatch("Building/Residential/New Construction/Fourplex")){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	//updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Fourplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Fourplex") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Guest House - Fees
if(appMatch("Building/Residential/New Construction/Guest House")){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Guest House- VUSD Fee
if(appMatch("Building/Residential/New Construction/Guest House") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Apartments - Fees
if(appMatch("Building/Residential/New Construction/Apartments")){
	updateFee("1102-10","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("4616-2","BLD_BASE","FINAL",1,"N");
	updateFee("3-004","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	//updateFee("1-011","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Apartments- VUSD Fee
if(appMatch("Building/Residential/New Construction/Apartments") && AInfo["Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential Solar - Fees
if(appMatch("Building/Residential/Solar/*")){
	updateFee("1102-1","BLD_SOLAR","FINAL",AInfo["DC KW"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1-01","BLD_SOLAR","FINAL",1,"Y");
	
	if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] >= 400){
		updateFee("1102-4","BLD_SOLAR","FINAL",1,"N");
	}
	
	if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] < 400){
		updateFee("1102-3","BLD_SOLAR","FINAL",1,"N");
	}
}

//Residential Alteration Addition - Fees
if(appMatch("Building/Residential/Alteration/Additions and or Remodel")){
	updateFee("1102-3","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-5","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1-004","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
}

//Residential Alteration Addition- VUSD Fee
if(appMatch("Building/Residential/Alteration/Additions and or Remodel") && AInfo["Additional Living Sq Ft"] != null && AInfo["Additional Living Sq Ft"] >= 500){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Additional Living Sq Ft"],"N");
}

//Residential Alteration Remodel - Fees
if(appMatch("Building/Residential/Alteration/Remodel")){
	updateFee("1102-3","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-5","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1-004","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
}

//Residential Alteration Patio Covers - Fees
if(appMatch("Building/Residential/Alteration/Patio Cover")){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1102-6","BLD_RES","FINAL",1,"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1102-11","BLD_RES","FINAL",1,"N");
	//updateFee("1-007","BLD_RES","FINAL",1,"Y");
}

//Residential Alteration Car Ports - Fees
if(appMatch("Building/Residential/Alteration/Carport")){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1102-6","BLD_RES","FINAL",1,"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1-007","BLD_RES","FINAL",1,"Y");
}

//Residential Alteration New Storage - Fees
if(appMatch("Building/Residential/Alteration/Storage")){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1102-11","BLD_RES","FINAL",1,"N");
	
	if(AInfo["Total Project Sq Ft"] <= 400){
	updateFee("1102-04","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1-005","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
	}
	
	if(AInfo["Total Project Sq Ft"] > 400){
	updateFee("1102-5","BLD_RES","FINAL",1,"N");
	//updateFee("1-006","BLD_RES","FINAL",1,"Y");
	}
}


//Residential Model Home Complex - Fees
if(appMatch("Building/Residential/Model Home Complex/*")){
	//updateFee("1-012","BLD_MODEL","FINAL",AInfo["Total Sq Ft"],"Y");
	updateFee("1102-1","BLD_MODEL","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("1535","BLD_SITE","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("1510","P_ENT","FINAL",1,"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("600-001","BLD_MODEL","FINAL",AInfo["Number of Features"],"N");
}

//Residential Alteration Misc Non-Residential - Fees
if(appMatch("Building/Residential/Alteration/Misc Non-Residential Structure")){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1102-5","BLD_RES","FINAL",1,"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	//updateFee("1-006","BLD_RES","FINAL",1,"Y");
}

//Residential Master Plan - Fees
if(appMatch("Building/Residential/Master Plan/*")){
if(AInfo["Reversed Plans"] != "Yes"){
	//addFee("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
	//addFee("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
        }
	
	if(AInfo["Reversed Plans"] == "Yes"){
		addFeeWithExtraData("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
		addFeeWithExtraData("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
	        addFee("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	        addFee("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
                invoiceAllFeesTps();
	}
}

//ASA:BUILDING/RESIDENTIAL/MASTER PLAN PRODUCTION/*

//Master Plan Production Fees 
if(appMatch("Building/Residential/Master Plan Production/Res")){
        aa.print("This is from CRCA");
	updateFee("1102-1","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-1","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	//updateFee("2-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
}

//Master Plan Production Fees 
if(appMatch("Building/Residential/Master Plan Production/MFD")){
	updateFee("1102-8","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	//updateFee("1-009","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
}



