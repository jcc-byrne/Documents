function getGISInfoByParcel(pParcelNo, svc, layer, attributename) {
    try {
        var distanceType = "feet";
        var retString;
        //get layer
        var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
        if (bufferTargetResult.getSuccess()) {
            var buf = bufferTargetResult.getOutput();
            buf.addAttributeName(attributename);
        }
        else { logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()); return false }
        //get parcel GIS object
        //aa.print("Looking at parcel " + pParcelNo);
        var gisObjResult = aa.gis.getParcelGISObjects(pParcelNo); // get gis objects on the parcel number
        if (gisObjResult.getSuccess()) {
            var fGisObj = gisObjResult.getOutput();
        }
        else {
            logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); return false
        }
        for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
        {
            var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], "0", distanceType, buf);
            if (bufchk.getSuccess())
                var proxArr = bufchk.getOutput();
            else { logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()); return false }
            for (a2 in proxArr) {
                var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
                for (z1 in proxObj) {
                    var v = proxObj[z1].getAttributeValues()
                    retString = v[0];
                }
            }
        }
        return retString;
    }
    catch (err) {
        //logDebug("A JavaScript Error occurred in custom function getGISInfoByParcel(): " + err.message);
        aa.print("A JavaScript Error occurred in custom function getGISInfoByParcel(): " + err.message);
    }
}