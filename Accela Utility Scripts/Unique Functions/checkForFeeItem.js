function checkForFee(myCapId, feeItem) {
	var feeResult = aa.fee.getFeeItems(myCapId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}
	for (ff in feeObjArr) {
		if (feeObjArr[ff].getFeeDescription() == feeItem) {
			var paymentFeeArray = aa.finance.getPaymentFeeItems(myCapId, null);
			if (paymentFeeArray.getSuccess()) {
				paymentFeeArray = paymentFeeArray.getOutput();
				for (ij in paymentFeeArray)
					if (feeObjArr[ff].getFeeSeqNbr() == paymentFeeArray[ij].getFeeSeqNbr()) {
						var payResultArray = aa.finance.getPaymentByCapID(myCapId, null);
						if (payResultArray.getSuccess()) {
							payResultArray = payResultArray.getOutput();
							for (pr in payResultArray) {
								if (payResultArray[pr].getPaymentSeqNbr() == paymentFeeArray[ij].getPaymentSeqNbr()) {
									var dateDifference = dateDiff(sysDate, payResultArray[pr].getPaymentDate())
									var receiptNumber = payResultArray[pr].getReceiptNbr();
									if (dateDifference == 0) {
										logDebug(feeItem +' Fee Exists, Receipt Nbr: ' + receiptNumber);
										sendReceiptForFire(myCapId);
									} else {
										logDebug(feeItem +' Fee Exists, but was paid prior to today. Receipt Nbr: ' + receiptNumber);

									}
								}
							}
						}
					}
			}
		}
	}
}