function Log(container) {
    
    // Create an overlay to print things to.
    var logUI = $("<div id='game-log'></div>").appendTo(container);
    
    return {
        log: function (msg) {
            // Print to browser console.
            var output = "";
            for (var i in arguments) {
                output += arguments[i];
            }
            console.log(output);
            
            // Also print to UI.
            logUI.append("<div class='log-message'>" + output + "</div>");
            logUI.scrollTop(logUI[0].scrollHeight);
        }
    }
}