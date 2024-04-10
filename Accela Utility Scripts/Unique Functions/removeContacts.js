/**
 * remove all contacts from a record, usually used on license renewals
 * @param {*} itemCap the capId to remove contacts from
 */

function removeAllContacts(itemCap) {
	var contactArray = aa.people.getCapContactByCapID(itemCap);
	if (contactArray.getSuccess()){
		contactArray = contactArray.getOutput()

		for (i in contactArray){
			var contact = contactArray[i];
			var contactPeople = contact.getPeople();
			var contSeqNum = contactPeople.getContactSeqNumber();
			var removePeopleResult = aa.people.removeCapContact(itemCap, contSeqNum);

			if (removePeopleResult.getSuccess()){
				logDebug('Contact Nbr Removed: ' + contSeqNum)
			} else {
				logDebug('Error removing contact')
				removePeopleResult.getErrorMessage();
			}
		}
	}
}