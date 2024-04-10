/**
* Add the parcel and owner to the record from the reference addresss.
* @param {bool} addPrcl  - Add parcel if set to true
* @param {bool} addOwner - Add owner if set to true
* @returns bool
*/
function addPrclAndOwnerFromRefAddress(addPrcl, addOwner) // optional capID
{
     var itemCap = capId
     if (arguments.length > 2)
         itemCap = arguments[2]; // use cap ID specified in args

     //get the record address.
     var capAddrRes = aa.address.getAddressByCapId(itemCap);
     if (capAddrRes.getSuccess()){
         var addresses = capAddrRes.getOutput();
         var refAddr = null;
         for (zz in addresses){
             var anAddr = addresses[zz];
             //exploreObject(anAddr);
             refAddr = anAddr.getUID(); 
             break;
         }

         //
         if(addPrcl){
             if(refAddr != null){
                 // first add the primary parcel
                 //
                 var primaryParcelResult = aa.parcel.getPrimaryParcelByRefAddressID(refAddr, "Y");
                 if (primaryParcelResult.getSuccess())
                     var primaryParcel = primaryParcelResult.getOutput();
                 else {
                     logDebug("ERROR: Failed to get primary parcel for ref Address " + refAddr + " , " + primaryParcelResult.getErrorMessage());
                     return false;
                 }
             
                 var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, primaryParcel).getOutput()
             
                 var createPMResult = aa.parcel.createCapParcel(capParModel);
                 if (createPMResult.getSuccess())
                 {
                     logDebug("created CAP Parcel");
                 }
                 else {
                     logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
                 }
             }
         }

         if(addOwner){
             // Now the owners
             //
         
             var parcelListResult = aa.parcel.getParcelDailyByCapID(itemCap, null);
             if (parcelListResult.getSuccess())
                 var parcelList = parcelListResult.getOutput();
             else {
                 logDebug("**ERROR: Failed to get Parcel List " + parcelListResult.getErrorMessage());
                 return false;
             }
         
             for (var thisP in parcelList) {
                 var ownerListResult = aa.owner.getOwnersByParcel(parcelList[thisP]);
                 if (ownerListResult.getSuccess())
                     var ownerList = ownerListResult.getOutput();
                 else {
                     logDebug("**ERROR: Failed to get Owner List " + ownerListResult.getErrorMessage());
                     return false;
                 }
         
                 for (var thisO in ownerList) {
                     ownerList[thisO].setCapID(itemCap);
                     createOResult = aa.owner.createCapOwnerWithAPOAttribute(ownerList[thisO]);
         
                     if (createOResult.getSuccess())
                         logDebug("Created CAP Owner");
                     else {
                         logDebug("**WARNING: Failed to create CAP Owner " + createOResult.getErrorMessage());
                     }
                 }
             }
         }
     }
     else{
         logDebug("ERROR - Unable to get address from cap: " + capAddrRes.getErrorMessage());
         return false;
     }

     return true;
}