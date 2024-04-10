var tempArray = new Array();

tempArray.push('Administrative Determination / Exception / Waiver')
tempArray.push('Administrative Hearing')
tempArray.push('Amendment - Annexation w/ City Services Plan')
tempArray.push('Amendment - Annexation w/ Municipal Services Review')
tempArray.push('Amendment - Development Agreeement - Major')
tempArray.push('Amendment - Development Agreeement - Minor')
tempArray.push('Amendment - Development Code (SMC)')
tempArray.push('Amendment - General Plan')
tempArray.push('Amendment - Master Development Plan - Major')
tempArray.push('Amendment - Master Development Plan - Minor')
tempArray.push('Amendment - Precise Road Plan - Major')
tempArray.push('Amendment - Precise Road Plan - Minor')
tempArray.push('Amendment - Specific Plan - Major')
tempArray.push('Amendment - Specific Plan - Minor')
tempArray.push('Amendment - Tentative Map - Major')
tempArray.push('Amendment - Tentative Map - Minor')
tempArray.push('Amendment - Use Permit - Major')
tempArray.push('Amendment - Use Permit - Minor')
tempArray.push('Annexation - Over 100 acres w/City Services Plan')
tempArray.push('Annexation - 20-100 acres w/City Services Plan')
tempArray.push('Annexation - Under 20 acres w/City Services Plan')
tempArray.push('Appeal of CD Director or Administrative Hearing Officer Decision')
tempArray.push('Billboard Cap and Replace Review')
tempArray.push('Condominium Conversion')
tempArray.push('Design Review')
tempArray.push('Design Review - Minor')
tempArray.push('Development Agreement')
tempArray.push('Environmental Review - Addendum to EIR/EIS')
tempArray.push('Environmental Review - EIR Administration')
tempArray.push('Environmental Review - Initial Study / Negative Declaration')
tempArray.push('Environmental Review - Expanded Initial Study / Neg Dec')
tempArray.push('Historic Preservation - Certificate of Appropriateness')
tempArray.push('Historic Preservation - Demolition or Relocation Permit')
tempArray.push('Historic Preservation - District Designation Change')
tempArray.push('Historic Preservation - Establish Design Overlay / Historic District')
tempArray.push('Historic Preservation - Landmark or Site Designation')
tempArray.push('Historic Preservation - Structure of Merit')
tempArray.push('Master Development Plan')
tempArray.push('Permits - Administrative Use Permit')
tempArray.push('Permits - Commission Use Permit')
tempArray.push('Permits - Land Development')
tempArray.push('Permits - Site Plan Review')
tempArray.push('Permits - Temporary Activity')
tempArray.push('Planned Development Permit')
tempArray.push('Precise Road Plan')
tempArray.push('Public Convenience/Necessity Determination')
tempArray.push('Rezoning / Prezoning')
tempArray.push('Specific Plan')

tempArray.push('Street Name Change')

tempArray.push('Tentative Subdivision Map')

tempArray.push('Tentative Parcel Map')
tempArray.push('Tentative Parcel Map SB9')
tempArray.push('Variance')
tempArray.push('Zoning Verification Letter')




for (i in tempArray){

    // logDebug(tempArray[i][0])
    // logDebug(tempArray[i][1])

    addLookup('SDL_P_PlnApps_V2', tempArray[i], tempArray[i] )

}

function addLookup(stdChoice,stdValue,stdDesc) 
	{
	//check if stdChoice and stdValue already exist; if they do, don't add
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	if (bizDomScriptResult.getSuccess())
		{
		logDebug("Standard Choices Item "+stdChoice+" and Value "+stdValue+" already exist.  Lookup is not added or updated.");
		return false;
		}
	//Proceed to add
	var strControl;
	
	if (stdChoice != null && stdChoice.length && stdValue != null && stdValue.length && stdDesc != null && stdDesc.length)
		{
		var bizDomScriptResult = aa.bizDomain.createBizDomain(stdChoice, stdValue, "A", stdDesc)
		if (bizDomScriptResult.getSuccess())
			//check if new Std Choice actually created

			logDebug("Successfully created Std Choice(" + stdChoice + "," + stdValue + ") = " + stdDesc);
		else
			logDebug("**ERROR creating Std Choice " + bizDomScriptResult.getErrorMessage());
		}
	else
		logDebug("Could not create std choice, one or more null values");
	}

    function logDebug(str){
        aa.print(str);
    }