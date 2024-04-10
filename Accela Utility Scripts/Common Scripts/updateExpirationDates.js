var currentDate = new Date();

var expResult = aa.expiration.getLicensesByCapID(capId);
if (expResult.getSuccess()){
    var x = expResult.getOutput();
if (x.getB1Expiration() != null){
    var b1License = x.b1Expiration;
    b1License.setExpDate(currentDate);
    aa.expiration.editB1Expiration(x.getB1Expiration());

    editAppSpecific("Permit Expiration Date",formataddDate(dateAdd(null,180)), capId);
    licEditExpInfo(null, formataddDate(dateAdd(null,180)));

} else {
    editAppSpecific("Permit Expiration Date",formataddDate(dateAdd(null,180)), capId);
}
} else {
    logDebug('Expiration Date is null, cannot add days to expiration')

}