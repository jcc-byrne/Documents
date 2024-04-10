//Prevent from going forward if fees are not assessed   

if (wfTask == 'Check Licenses/Assess Fees' && wfStatus == 'Ready to Issue') 
{		
    var	blockAcceptance = false;
    var getFeeResult = aa.finance.getFeeItemByCapID(capId);
    if (getFeeResult.getSuccess())
    {
        var feeList = getFeeResult.getOutput();
        var feeFound=false;
         for (var feeNum in feeList)
        {
        if (feeList[feeNum].getFeeitemStatus().equals("NEW"))
            {
            blockAcceptance = true;
        }
    }
}

if((blockAcceptance))
{
    showMessage = true;
    cancel = true;
    aa.print("We should get stopped")
    comment("Fees must be assesed before advancing the workflow");                   
}
}