function removeContactsFromCap(recordCapId){
    var cons = aa.people.getCapContactByCapID(recordCapId).getOutput();
    for (x in cons) {
        conSeqNum = cons[x].getPeople().getContactSeqNumber();
        if (conSeqNum){
            aa.people.removeCapContact(recordCapId, conSeqNum);
        }
    }
}

function copyContactWithRemove(pFromCapId, pToCapId){
    if (pToCapId == null)
        var vToCapId = capId;
        else
            var vToCapId = pToCapId;

        removeContactsFromCap(pToCapId);

        var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
        var copied = 0;
        if (capContactResult.getSuccess()){
            var Contacts = capContactResult.getOutput();
            for (yy in Contacts){
                var newContact = Contacts[yy].getCapContactModel();
                var fullname = "";
                newContact.setCapID(vToCapId);
                if(newContact.getFirstName() != null){
                    fullname += newContact.getFirstName();
                    if(newContact.getLastName() != null){
                        fullname += " " + newContact.getLastName();
                    }

                } else if (newContact.getLastName() != null){
                    fullname = newContact.getLastName();
                }
                newContact.setFullName(fullname);
                aa.people.createCapContact(newContact);
                copied++;
                logDebug("Copied contact from " + pFromCapId.getCustomID() + " to " + vToCapId.getCustomID());
            }
        } else {
            logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
            return false;
        }
        return copied;
}