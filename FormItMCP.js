if (typeof FormItMCP == 'undefined')
{
    FormItMCP = {};
}

/*** web/UI code - runs natively in the plugin process ***/
FormItMCP.initializeUI = async function()
{
    // create an overall container for all objects that comprise the "content" of the plugin
    // everything except the footer
    let contentContainer = document.createElement('div');
    contentContainer.id = 'contentContainer';
    contentContainer.className = 'contentContainer'
    window.document.body.appendChild(contentContainer);

    // create the header
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('FormIt MCP', 'Enable FormIt to be controlled by an MCP server').element);

    // separator and space
    contentContainer.appendChild(document.createElement('p'));
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // basic body text (for now)
    const staticTextDiv = contentContainer.appendChild(document.createElement('div'));
    staticTextDiv.innerHTML = "This plugin will automatically run the requisite code for an MCP server.<br><br>If needed, you can force reinitialize below.";

    // separator and space
    contentContainer.appendChild(document.createElement('p'));
    contentContainer.appendChild(document.createElement('hr'));
    contentContainer.appendChild(document.createElement('p'));

    // create the subsection force-reinitializing the MCP server
    contentContainer.appendChild(new FormIt.PluginUI.HeaderModule('Force Reinitialize', 'Re-run the code to initialize the MCP server connection').element);

    // create the button to set the LCS on the selected face
    contentContainer.appendChild(new FormIt.PluginUI.Button('Force Reinitialize', FormItMCP.initializeMCP).element);
    
    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

FormItMCP.initializeMCP = () => {
    // FormIt WebSocket bridge client (run in FormIt JS console)
    if (window.formitBridgeWS && window.formitBridgeWS.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
    } else {
        window.formitBridgeWS = new WebSocket("ws://localhost:8765");

        window.formitBridgeWS.onopen = function() {
            console.log("FormIt WebSocket bridge connected.");
        };

        window.formitBridgeWS.onmessage = async function(event) {
            try {
                let code = event.data;
                // Evaluate the received JS code
                let result = await eval(code);
                // Send the result back as JSON
                window.formitBridgeWS.send(JSON.stringify({ result }));
            } catch (err) {
                // Send error back as JSON
                window.formitBridgeWS.send(JSON.stringify({ error: err.toString() }));
            }
        };

        window.formitBridgeWS.onclose = function() {
            console.log("FormIt WebSocket bridge disconnected.");
        };

        window.formitBridgeWS.onerror = function(e) {
            console.error("WebSocket error:", e);
        };
    }
}

/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/
