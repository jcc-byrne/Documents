function sbcoGetEnvironment()

{
   var vEventName = aa.env.getValue("EventName");
    var params = aa.env.paramValues;
    var keys = params.keys(); // class java.util.Hashtable$Enumerator ;
    var key = null;
    logDebug('***** Begin List Environment for the ' + vEventName + ' event *****');
    while (keys.hasMoreElements())
    {
        key = keys.nextElement();
        //logDebug("var " + key + " = aa.env.getValue( \"" + key + "\" ) ;");
        //logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
        logDebug('var ' + key + ' = ' + aa.env.getValue(key) + ' ;');
    }
    logDebug('***** End List Environment for the ' + vEventName + ' event *****');
}