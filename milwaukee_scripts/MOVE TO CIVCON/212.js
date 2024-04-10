// TASK MKEBL-212
// 01/25/2024
// AUTHOR JACOB CLAY (BYRNE SOFTWARE) 
try {
    if (appMatch('Licenses/Amusement/Amusement Device/Application') || appMatch('Licenses/Amusement/Amusement Device/Renewal')  ){

        if (wfTask == 'Application Submittal' && wfStatus == 'Complete'){
            logDebug('>>>Start of 212')
    
            var businessInCity = true; 
    
            var capAddressResult = aa.address.getAddressByCapId(capId);
            if (capAddressResult.getSuccess())
                {
                Address = capAddressResult.getOutput();
                for (yy in Address)
                    {
                    newAddress = Address[yy];
    
                    if (newAddress.getCity().toUpperCase() != 'MILWAUKEE'){
                        businessInCity = false
                    }
                    }
                }
    
                if (!businessInCity){
                    deactivateTask('Neighborhood Services Review')
                } else {
                    logDebug('Address in City, keep Neighborhood Services Review')
                }
    
    
            logDebug('<<<End of 212')
        }  
      }
} catch (error) {
    logDebug("EMSE Error: " + error.message)
}