function getDocumentFilesbyCategory(docCatArray,itemCap)

{
    // Returns an array of document paths if any
    // returns an empty array if no documents found
    var filesPathArray = new Array();
    var docListResult = aa.document.getCapDocumentList(itemCap,currentUserID);

    if(docListResult.getSuccess())
    {        
        var docListArray = docListResult.getOutput();
        var docModelArray = new Array();
        for(var dl in docListArray)
        {
            for(var dc in docCatArray)
            {
                if(docListArray[dl].getDocCategory() == docCatArray[dc])
                {
                    docModelArray.push(docListArray[dl]);
                }
            }
        }
        for(var dm in docModelArray)
        {
            var downloadResult = aa.document.downloadFile2Disk(docModelArray[dm], docModelArray[dm].getModuleName(), null, null, true);
            if (downloadResult.getSuccess())
            {
                filesPathArray.push(downloadResult.getOutput());
                aa.print("File " + dm + " path = " + downloadResult.getOutput());
            }
        }

 

        return filesPathArray;

    }

 

    return filesPathArray;

}