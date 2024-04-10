/* -------------------------------------------------------------------------------------------------
| Program  : BATCH_CREATE_GIS_ADDRESS_OWNER_FROM_PARCEL
| Trigger  : Batch
| Client   : Babcock Ranch
| Script ID: 
| Frequency: Daily
| 
| Desc: Send report once a day of any documents uploaded from ACA and include any custom fields on documents.Send to group TCU email address.
|
| Batch Requirements :
| - None
| Batch Options:
| - None
|
|
| ------------------------------------------------------------------------------------------------------ */
var SCRIPT_VERSION = 3.0;

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

var batchJobName = "TEST"
var batchStartDate = new Date();
var batchStartTime = batchStartDate.getTime();
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

// var appGroup = getJobParam("appGroup"); // Planning
// var appTypeType = getJobParam("appTypeType"); // Residential or Commercial
// var appSubtype = getJobParam("appSubtype"); //  "Lot Site Review";
// var appCategory = getJobParam("appCategory"); //   NA
var skipAppStatusArray = "Void,Withdrawn,Inactive"; //   Skip records with one of these application statuses
var capId = null;
//var workflowStatus = "Status" // email to send report
//var assignedDepartment = "HCFL/COUNTY/DSD/BCSD/COMPLIAN/NA/NA";
var emailAddress = "mag@byrnesoftware.com";
//var NumOfDaysSinceACR = getJobParam("NumOfDaysSinceACR");

/*var appGroup = getParam(appGroup); //   app Group to process {Licenses}
var appType = getParam(appTypeType); //   app type to process {Rental License}
var appSubType = getParam(appSubtype);; //   app subtype to process {NA}
var appCategory = getParam(appCategory);; //   app category to process {NA}
var skipAppStatusArray = getParam(skipAppStatusArray); //   Skip records with one of these application statuses
var workflowStatus = getParam(workflowStatus);// email to send report
var assignedDepartment = getParam(assignedDepartment);
var emailAddress = getParam(emailAddress);*/
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();



/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

aa.print("Start of Job");

try {
    mainProcess();
} catch (err) {
    aa.print("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
    aa.print("Stack: " + err.stack);
}

//aa.print("End of Job: Elapsed Time : " + elapsed() + " Seconds");

//if (emailAddress.length)
//    aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
    

// var sql = "select b.B1_ALT_ID from b1permit b \n" +
// "join b3parcel p on b.b1_per_id1 = p.b1_per_id1 and b.b1_per_id2 = p.b1_per_id2 \n"+
// "and p.b1_per_id3 = b.b1_per_id3 \n"+
// "where b.B1_PER_GROUP ='Licenses' \n"+
// "and b.B1_PER_CATEGORY in ('NA','License') and b.b1_per_id1 like '%HIS%' and b.serv_prov_code ='SCMN' \n" +
// "and LEN(b1_parcel_nbr) < 10 and p.b1_parcel_nbr like '85%'  \n"

//        var conn = aa.db.getConnection();
//         var sStmt = aa.db.prepareStatement(conn, sql);
// 		var rSet = sStmt.executeQuery();

// while (rSet.next()) {
// aa.print(	rSet.getString("B1_ALT_ID"));

	//   var capIdRes = aa.cap.getCapID(rSet.getString("B1_ALT_ID"));
	  var capIdRes = aa.cap.getCapID("BC-2024-12");

	  var capId = capIdRes.getOutput();
	  aa.print("capId="+capId);

	var capPrclArr = aa.parcel.getParcelDailyByCapID(capId, null).getOutput();
    var parcelNbr = String(capPrclArr[0].getParcelNumber())
    aa.print('Original Parcel: ' + parcelNbr)
    // var parcelNbr = '854017920'

    // var oldParcelNo = '854017920' //doesn't return a match from aa.parcel.getParcelListForAdmin()
    // var newParcelNo = '85004017920' //returns a match
    // var modifiedParcelNbr = parcelNbr.split('');    
    // modifiedParcelNbr.splice(2, 0, '00');
    // modifiedParcelNbr = modifiedParcelNbr.join('');
    // aa.print('New Parcel: ' + modifiedParcelNbr)


    // TODO update parcel on CAP
    addCapParcel("262720000000024050", capId)


    // TODO remove gis object from CAP
    removeGisObjects(capId)

    // TODO add new GIS Object to CAP
    addGisObjects(capId);
    
    //
    updateRefParcelToCap_Local(capId)



}
// }

function addCapParcel(prclNo, itemCap) {

    //get the reference parcel class = ParcelInfoModel
    var prclObj = aa.parcel.getParceListForAdmin(prclNo, null, null, null, null, null, null, null, null, null); //reference parcel
    if (prclObj.getSuccess()){

				var prclArr = prclObj.getOutput(); //class = ParcelInfoModel

                if (prclArr.length) {
                deleteExistingAPO(itemCap, false, 'P')

                    aa.print('Total Parcels: ' + prclArr.length)
					var prcl = prclArr[0].getParcelModel(); //class = ParcelModel
					var refParcelNumber = prcl.getParcelNumber();
					var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, prcl);
                    if (capPrclObj.getSuccess()) {
						var capPrcl = capPrclObj.getOutput(); //class = CapParcelModel
                        var prclModel = capPrcl.getParcelModel(); //class = ParcelModel


                        // exploreObject(capPrcl.getParcelModel())

                        // exploreObject(capPrcl)
		                var createPMResult = aa.parcel.createCapParcel(capPrcl);

                        // var capScript = aa.cap.getCap(itemCap).getOutput()
                        // var capModel = capScript.getCapModel();
                        // // exploreObject(capModel.getParcelModel())
                        // // exploreObject(createPMResult)


                        // var updateCapParcel = capModel.setParcelModel(capPrcl)
                        // var editCap = aa.cap.editCapByPK(capModel);

                        // // exploreObject(editCap)

                        // if (editCap.getSuccess()){
                        //     aa.print('Update Parcel on cap: ' + itemCap.getCustomID())
                        // } else {
                        //     aa.print(' Error: ' + editCap.getErrorMessage())
                        // }




                        // var capPrcl = capPrclObj.getOutput();
						// capPrcl.setL1ParcelNo(refParcelNumber);
                        // aa.print(refParcelNumber)
                        // exploreObject(aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl))
						// aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						// pb.updateParcelDistrictWithRef(aa.getServiceProviderCode(), capPrcl, "ADMIN")
						// aa.print("Updated Parcel " + capPrclArr[0].getParcelNumber() + " with Reference Data");
					} else
						aa.print("Failed to Wrap Parcel Model for " + prclNo);
				} else
					aa.print("No matching reference Parcels found for " + prclNo);

    } else {
        aa.print('Error finding parcel: ' + prclNo)
    }
}



function updateRefParcelToCap_Local(itemCap) //Takes Optional CapId
{

	var capPrclArr = aa.parcel.getParcelDailyByCapID(itemCap, null).getOutput();
	if (capPrclArr != null) {
		var pb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
		
		for (x in capPrclArr) {
			var prclObj = aa.parcel.getParceListForAdmin(capPrclArr[x].getParcelNumber(), null, null, null, null, null, null, null, null, null);
			if (prclObj.getSuccess()) {
				
				var prclArr = prclObj.getOutput();
				if (prclArr.length) {
					var prcl = prclArr[0].getParcelModel();
					var refParcelNumber = prcl.getParcelNumber();
					var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap, prcl);
					if (capPrclObj.getSuccess()) {
						
						var capPrcl = capPrclObj.getOutput();
						capPrcl.setL1ParcelNo(refParcelNumber);
						aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						pb.updateParcelDistrictWithRef(aa.getServiceProviderCode(), capPrcl, "ADMIN")
						aa.print("Updated Parcel " + capPrclArr[x].getParcelNumber() + " with Reference Data");
					} else
						aa.print("Failed to Wrap Parcel Model for " + capPrclArr[x].getParcelNumber());
				} else
					aa.print("No matching reference Parcels found for " + capPrclArr[x].getParcelNumber());
			} else
				aa.print("Failed to get reference Parcel for " + capPrclArr[x].getParcelNumber())
		}
	}
}  

function removeGisObjects(itemCap){
    var removeGisObj = aa.gis.removeAllCapGISObjects(itemCap);

    if (removeGisObj.getSuccess()){
        aa.print('Removed GIS Object')
    } else {
        aa.print('Error removing GIS Object: '+ removeGisObj.getErrorMessage())
    }

}

function addGisObjects(itemCap) 
	{
        var capParcelResult = aa.parcel.getParcelandAttribute(itemCap,null);
	if (capParcelResult.getSuccess())
		{
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels)
			{
			var ParcelValidatedNumber = Parcels[zz].getParcelNumber();
			aa.print("Looking at parcel " + ParcelValidatedNumber);
			var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
			if (gisObjResult.getSuccess()) 	
				var fGisObj = gisObjResult.getOutput();
			else
				{ aa.print("**WARNING: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
			for (a1 in fGisObj) // for each GIS object on the Cap
				{
				var gisTypeScriptModel = fGisObj[a1];
                                var gisObjArray = gisTypeScriptModel.getGISObjects()
                                for (b1 in gisObjArray)
                                	{
  					var gisObjScriptModel = gisObjArray[b1];
  					var gisObjModel = gisObjScriptModel.getGisObjectModel() ;
					var retval = aa.gis.addCapGISObject(itemCap,gisObjModel.getServiceID(),gisObjModel.getLayerId(),gisObjModel.getGisId());
					if (retval.getSuccess())
						{ aa.print("Successfully added Cap GIS object: " + gisObjModel.getGisId())}
					else
						{ aa.print("**WARNING: Could not add Cap GIS Object.  Reason is: " + retval.getErrorType() + ":" + retval.getErrorMessage()) ; return false }	
					}
				}
			}
		}	
	else
		{ aa.print("**ERROR: Getting Parcels from Cap.  Reason is: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage()) ; return false }
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
  
  
  

  /**Receiving following error
   * 
   * b1_parcel is a varchar(9)... b1_parcel_nbr is a varchar(20)
   * 
   *   <b> errorMessage: </b> update B3PARCEL set serv_prov_code=?, b1_per_id1=?, b1_per_id2=?, b1_per_id3=?, b1_parcel_nbr=?, b1_gis_seq_nbr=?, b1_parcel_status=?, b1_book=?, b1_page=?, b1_parcel=?, b1_map_ref=?, b1_map_nbr=?, b1_lot=?, b1_subdivision=?, b1_block=?, b1_tract=?, b1_legal_desc=?, b1_parcel_area=?, b1_plan_area=?, b1_census_tract=?, b1_council_district=?, b1_supervisor_district=?, b1_inspection_district=?, b1_land_value=?, b1_improved_value=?, b1_exempt_value=?, b1_udf1=?, b1_udf2=?, b1_udf3=?, b1_udf4=?, rec_date=?, rec_ful_nam=?, rec_status=?, l1_parcel_nbr=?, ext_parcel_uid=?, B1_PRIMARY_PAR_FLG=?, B1_TOWNSHIP=?, B1_RANGE=?, B1_SECTION=?  WHERE SERV_PROV_CODE = ?	AND B1_PER_ID1 = ?	AND	B1_PER_ID2 =? AND B1_PER_ID3 =? AND B1_PARCEL_NBR=? String or binary data would be truncated in table 'SCMN.dbo.B3PARCEL', column 'B1_PARCEL'. Truncated value: '850040179'.

   */


  /**
 * Deletes selected component from deleteFromCapId if keepExisting is true,<br/>flag 'keepExisting' is passed and checked in case it's coming from a settings source
 * @param deleteFromCapId capId to delete related APO from
 * @param keepExisting boolean, check if delete required
 * @param whichAPO which component to delete A: address P: Parcel O:Owner
 */
function deleteExistingAPO(deleteFromCapId, keepExisting, whichAPO) {
    if (keepExisting || whichAPO == null || whichAPO == "") {
        return;
    }

    if (whichAPO.equalsIgnoreCase("A")) {
        var addresses = aa.address.getAddressByCapId(deleteFromCapId, null);
        if (addresses.getSuccess()) {
            addresses = addresses.getOutput();
            for (a in addresses) {
                aa.address.removeAddress(deleteFromCapId, addresses[a].getAddressId());
            }
        }
    } else if (whichAPO.equalsIgnoreCase("P")) {
        var pbzns = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
        var capModelDeleteFrom = aa.cap.getCap(deleteFromCapId);
        if (capModelDeleteFrom.getSuccess()) {
            capModelDeleteFrom = capModelDeleteFrom.getOutput();
            capModelDeleteFrom = capModelDeleteFrom.getCapModel();
            pbzns.removeParcel(capModelDeleteFrom);
            aa.print('parcels removed')
        }
    } else if (whichAPO.equalsIgnoreCase("O")) {
        var owners = null;
        owners = aa.owner.getOwnerByCapId(deleteFromCapId);
        if (owners.getSuccess()) {
            owners = owners.getOutput();
            for (o in owners) {
                aa.owner.removeCapOwnerModel(owners[o]);
            }
        }
    }
}