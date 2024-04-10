var cap = aa.cap.getCapID('23TOBA-0002').getOutput() //capIdModel
var updateCap = aa.cap.updateCapAltID(cap, '23TOBA-0001-1');
aa.print(updateCap.getSuccess())

// exploreObject(updateCap);

function exploreObject(objExplore) {
    aa.print("Methods:");
    for (var x in objExplore) {
        try {
            if (typeof (objExplore[x]) === "function") {
                aa.print("<font color=blue><u><b>" + x + "</b></u></font> ");
                aa.print("   " + objExplore[x] + "<br>");
            }
        } catch (err) {
            aa.print("exploreObject(): **ERROR** in Functions: " + err.Message);
        }
        var counter = objExplore.length;
    }
    aa.print("");
    aa.print("Properties:");
    for (var y in objExplore) {
        try {
            if (typeof (objExplore[y]) !== "function") {
                aa.print("  <b> " + y + ": </b> " + objExplore[y]);
            }
        } catch (err) {
            aa.print("exploreObject(): **ERROR** in Properties: " + err.Message);
        }
    }
}