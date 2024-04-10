//ASA:BUILDING/RESIDENTIAL/*/*
//8-27-18 David, Fitz, Pam added Master Plan for Apartments Fees starting at line 260
//9-19-18 Pam corrected Model Home Complex Deposit fee item at line 245 from 603-001 to 600-001
//2-24-20 Pam and Fitz added solar to Master Plans at line 293; 10-11-22 removed space after addfee 
//3-17-21 Pam and Fitz corrected the Misc Non-Residential fee to mirror Residential Alteration New Storage fees. Also removed from these two and Patio Covers the 1102-11 for MEPs Add-on. 
//9.17.21 Pam and Fitz resol 2021-13 Garage/Det Garage/Storage by sf only; removed <= >= 400sf
//10.13.22 Pam and Fitz added solar inspection to Master Plans at line 360
//10.20.22 Pam created fee item 1102-25 bc dup caused 1sf tb added to inspec hm instead of 1 solar inspec.
//10.25.22 Pam added kw info to calc solar inspec fee.  
//10.25.22 Pam comment out Model Home Complex Deposit fee item 600-001 at line 237 as per fee schedule 7.1.22
//03.22.23 Pam and Fitz added solar to Master Plan Reversals at line 306
//08.18.23 Jacob Clay (Byrne Software) adding logic to asses fees on SolarApp+ records

//Residential New Construction Custom - Fees
if(appMatch("Building/Residential/New Construction/Custom")){
	if(!publicUser){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Custom- VUSD Fee
if(appMatch("Building/Residential/New Construction/Custom") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction 2nd Unit - Fees
if(appMatch("Building/Residential/New Construction/2nd Unit")){
	if(!publicUser){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction 2nd Unit- VUSD Fee
if(appMatch("Building/Residential/New Construction/2nd Unit") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}
//Residential New Construction Duplex - Fees
if(appMatch("Building/Residential/New Construction/Duplex")){
	if(!publicUser){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Duplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Duplex") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Triplex - Fees
if(appMatch("Building/Residential/New Construction/Triplex")){
	if(!publicUser){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Triplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Triplex") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Fourplex - Fees
if(appMatch("Building/Residential/New Construction/Fourplex")){
	if(!publicUser){
	updateFee("1102-9","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-010","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
	updateFee("3-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Fourplex- VUSD Fee
if(appMatch("Building/Residential/New Construction/Fourplex") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Guest House - Fees
if(appMatch("Building/Residential/New Construction/Guest House")){
	if(!publicUser){
	updateFee("1102-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("3-002","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1109-2","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-003","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Guest House- VUSD Fee
if(appMatch("Building/Residential/New Construction/Guest House") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential New Construction Apartments - Fees
if(appMatch("Building/Residential/New Construction/Apartments")){
	if(!publicUser){
	updateFee("1102-10","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("4616-2","BLD_BASE","FINAL",1,"N");
	updateFee("3-004","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Living Sq Ft"],"N");
	}
	updateFee("1-011","BLD_RES","FINAL",AInfo["Living Sq Ft"],"Y");
}

//Residential New Construction Apartments- VUSD Fee
if(appMatch("Building/Residential/New Construction/Apartments") && AInfo["Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Living Sq Ft"],"N");
}

//Residential Solar - Fees
if(appMatch("Building/Residential/Solar/*")){
	if(!publicUser){
	updateFee("1102-1","BLD_SOLAR","FINAL",AInfo["DC KW"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	}
	updateFee("1-01","BLD_SOLAR","FINAL",1,"Y");
	
	if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] >= 400 && !publicUser){
		updateFee("1102-4","BLD_SOLAR","FINAL",1,"N");
	}
	
	if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] < 400 && !publicUser){
		updateFee("1102-3","BLD_SOLAR","FINAL",1,"N");
	}
}

//Residential Solar Permit - SolarApp - Jacob Clay - Byrne Software
if(appMatch("Building/Residential/SolarPV/SolarApp")){
	if(!feeExists("1102-1")){
        updateFee("1102-1","BLD_SOLAR","FINAL",AInfo["DC KW"],"Y");
    }
    if(!feeExists("1110")){
        updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"Y");
    }
    if(!feeExists("1103-1")){
        updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"Y");
    }
    if(!feeExists("1-03")){
        updateFee("1-03","BLD_SOLAR","FINAL",1,"Y");
    }

    if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] < 400){
        if(!feeExists("1102-3")){
		updateFee("1102-3","BLD_SOLAR","FINAL",1,"Y");
        }
	}

	if(AInfo["Panel Upgrade"] == "Yes" && AInfo["Amps"] >= 400){
        if(!feeExists("1102-4")){
		updateFee("1102-4","BLD_SOLAR","FINAL",1,"Y");
        }
	}

    if(AInfo["Battery Storage"] == "Yes"){
        if(!feeExists("1102-5")){
		updateFee("1102-5","BLD_SOLAR","FINAL",AInfo["No. of Batteries"],"Y");
        }
	}
	
    //add convenience fee
    if (publicUser){
        var newBalance = feeAmountExcept(capId);

        if(!feeExists("2023-01")){
            updateFee("2023-01","ADMIN","FINAL",newBalance * 0.028,"Y");
            }
    }   
    
}

//Residential Alteration Addition - Fees
if(appMatch("Building/Residential/Alteration/Additions and or Remodel")){
	if(!publicUser){
	updateFee("1102-3","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-5","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	updateFee("1-004","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
}

//Residential Alteration Addition- VUSD Fee
if(appMatch("Building/Residential/Alteration/Additions and or Remodel") && AInfo["Additional Living Sq Ft"] != null && AInfo["Additional Living Sq Ft"] >= 500 && !publicUser){
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Additional Living Sq Ft"],"N");
}

//Residential Alteration Remodel - Fees
if(appMatch("Building/Residential/Alteration/Remodel")){
	if(!publicUser){
	updateFee("1102-3","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-5","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	updateFee("1-004","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
}

//Residential Alteration Patio Covers - Fees
if(appMatch("Building/Residential/Alteration/Patio Cover")){
	if(!publicUser){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1102-6","BLD_RES","FINAL",1,"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	updateFee("1-007","BLD_RES","FINAL",1,"Y");
}

//Residential Alteration Car Ports - Fees
if(appMatch("Building/Residential/Alteration/Carport")){
	if(!publicUser){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1102-6","BLD_RES","FINAL",1,"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	updateFee("1-007","BLD_RES","FINAL",1,"Y");
}

//Residential Alteration Garage or Det Bldg or Storage - Fees
if(appMatch("Building/Residential/Alteration/Storage")){
	if(!publicUser){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1102-04","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	updateFee("1-005","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
	}
}


//Residential Model Home Complex - Fees
if(appMatch("Building/Residential/Model Home Complex/*")){
	updateFee("1-012","BLD_MODEL","FINAL",AInfo["Total Sq Ft"],"Y");
	if(!publicUser){
	updateFee("1102-1","BLD_MODEL","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("1535","BLD_SITE","FINAL",AInfo["Total Sq Ft"],"N");
	//updateFee("1510","P_ENT","FINAL",1,"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	//updateFee("600-001","BLD_MODEL","FINAL",AInfo["Number of Features"],"N");
	}
}

//Residential Alteration Misc Non-Residential - Fees
if(appMatch("Building/Residential/Alteration/Misc Non-Residential Structure")){
	if(!publicUser){
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1109-6","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	
	if(AInfo["Total Project Sq Ft"] <= 400){
	if(!publicUser){
	updateFee("1102-04","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"N");
	}
	updateFee("1-005","BLD_RES","FINAL",AInfo["Total Project Sq Ft"],"Y");
	}
	
	if(AInfo["Total Project Sq Ft"] > 400){
	if(!publicUser){
	updateFee("1102-5","BLD_RES","FINAL",1,"N");
	}
	updateFee("1-006","BLD_RES","FINAL",1,"Y");
	}
}

//Residential Master Plan - Fees
if(appMatch("Building/Residential/Master Plan/*") && !matches(appTypeString,"Building/Residential/Master Plan/MFD_Fire","Building/Residential/Master Plan/RES_FIRE","Building/Residential/Master Plan/MFD Tri Four Plex Fire","Building/Residential/Master Plan/APTS Fire")){
	livingSqFtBase = 0;
	livingSqFtOptions = 0;
	baseTable = loadASITable("BASE HOME INFO");
	optionsTable = loadASITable("OPTIONS INFO");
	
	typeof(BASEHOMEINFO) == "object";
	for(eachrow in BASEHOMEINFO)
	{
		if(BASEHOMEINFO[eachrow]["Living Sq Ft"] != null)
		{
		livingSqFtBase = livingSqFtBase + parseFloat(BASEHOMEINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	
	typeof(OPTIONSINFO) == "object";
	for(eachrow in OPTIONSINFO)
	{
		if(OPTIONSINFO[eachrow]["Living Sq Ft"] != null)
		{
		livingSqFtOptions = livingSqFtOptions + parseFloat(OPTIONSINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	var totLivingSqFt = livingSqFtBase + livingSqFtOptions;
	editAppSpecific("Total Living Sq Ft",totLivingSqFt);
	
//Master Plan Fees for All except Master Apartments
if(AInfo["Reversed Plans"] != "Yes" && !feeExists("1-001") && !feeExists("3-001") && !feeExists("1-01") && !matches(appTypeString,"Building/Residential/Master Plan/APTS") ){
	addFee("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
	addFee("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
	addFee("1-01","BLD_SOLAR","FINAL",1,"Y");
        }
	
	if(AInfo["Reversed Plans"] == "Yes" && !feeExists("1-001") && !feeExists("3-001") && !matches(appTypeString,"Building/Residential/Master Plan/APTS")){
		addFeeWithExtraData("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
		addFeeWithExtraData("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
	        addFee("1-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	        addFee("3-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
			addFee("1-01","BLD_SOLAR","FINAL",1,"N");
                invoiceAllFeesTps();
	}
	
//Master Plan Fees for ONLY Master Apartments
if(AInfo["Reversed Plans"] != "Yes" && !feeExists("1-001") && !feeExists("3-001") && matches(appTypeString,"Building/Residential/Master Plan/APTS") ){
	addFee("1-012","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
	addFee("3-005","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
        }
	
	if(AInfo["Reversed Plans"] == "Yes" && !feeExists("1-001") && !feeExists("3-001") && matches(appTypeString,"Building/Residential/Master Plan/APTS")){
		addFeeWithExtraData("1-012","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
		addFeeWithExtraData("3-005","BLD_RES","FINAL",AInfo["Total Living Sq Ft"]/2,"N",capId,"Reversed Plans",null,null);
	        addFee("1-012","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	        addFee("3-005","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
                invoiceAllFeesTps();
	}
}

//ASA:BUILDING/RESIDENTIAL/MASTER PLAN PRODUCTION/*

//Master Plan Production Fees 
if(appMatch("Building/Residential/Master Plan Production/Res")){
	
	livingSqFtBase = 0;
	livingSqFtOptions = 0;
	baseTable = loadASITable("BASE HOME INFO");
	optionsTable = loadASITable("OPTIONS INFO");
	
	typeof(BASEHOMEINFO) == "object";
	for(eachrow in BASEHOMEINFO)
	{
		if(BASEHOMEINFO[eachrow]["Living Sq Ft"] != null)
		{
		livingSqFtBase = livingSqFtBase + parseFloat(BASEHOMEINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	
	typeof(OPTIONSINFO) == "object";
	for(eachrow in OPTIONSINFO)
	{
		if(OPTIONSINFO[eachrow]["Living Sq Ft"] != null && OPTIONSINFO[eachrow]["Selected"] == "CHECKED")
		{
		livingSqFtOptions = livingSqFtOptions + parseFloat(OPTIONSINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	var totLivingSqFt = livingSqFtBase + livingSqFtOptions;
	editAppSpecific("Total Living Sq Ft",totLivingSqFt);	
	
	if(!publicUser){		
		
	updateFee("1102-1","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-1","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	updateFee("1102-25","BLD_SOLAR","FINAL",AInfo["DC KW"],"N");
	}
	updateFee("2-001","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
}

//Master Plan Production Fees 
if(appMatch("Building/Residential/Master Plan Production/MFD")){
	
	livingSqFtBase = 0;
	livingSqFtOptions = 0;
	baseTable = loadASITable("BASE HOME INFO");
	optionsTable = loadASITable("OPTIONS INFO");
	
	typeof(BASEHOMEINFO) == "object";
	for(eachrow in BASEHOMEINFO)
	{
		if(BASEHOMEINFO[eachrow]["Living Sq Ft"] != null)
		{
		livingSqFtBase = livingSqFtBase + parseFloat(BASEHOMEINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	
	typeof(OPTIONSINFO) == "object";
	for(eachrow in OPTIONSINFO)
	{
		if(OPTIONSINFO[eachrow]["Living Sq Ft"] != null && OPTIONSINFO[eachrow]["Selected"] == "CHECKED")
		{
		livingSqFtOptions = livingSqFtOptions + parseFloat(OPTIONSINFO[eachrow]["Living Sq Ft"]);	
		}
	}
	var totLivingSqFt = livingSqFtBase + livingSqFtOptions;
	editAppSpecific("Total Living Sq Ft",totLivingSqFt);	
	
	if(!publicUser){
	updateFee("1102-8","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1110","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1103-1","BLD_BASE","FINAL",AInfo["Job Value"],"N");
	updateFee("1105-1","BLD_BASE","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("1537-1","BLD_BASE","FINAL",1,"N");
	updateFee("4616-1","BLD_BASE","FINAL",1,"N");
	updateFee("1109-3","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"N");
	updateFee("4533","E_ENCR","FINAL",1,"N");
	}
	updateFee("1-009","BLD_RES","FINAL",AInfo["Total Living Sq Ft"],"Y");
}

//Residential House Move - Fees
if(appMatch("Building/Residential/House Move/NA")){
	if(!publicUser){
	updateFee("1-01","BLD_MOVE","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("3-01","BLD_MOVE","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("1102-2","BLD_MOVE","FINAL",AInfo["Total Sq Ft"],"N");
	updateFee("600-1","DEPOSIT","FINAL",2000,"N");
	}
	updateFee("1102-1","BLD_MOVE","FINAL",1,"Y");
}
