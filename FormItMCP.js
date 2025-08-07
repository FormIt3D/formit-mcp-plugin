if (typeof FormItMCP == 'undefined')
{
    FormItMCP = {};
}

// different server statuses will show different messages and background colors
const statusPrefix = 'MCP server status: ';
const statuses = {
    connecting: {
        id: 'connecting',
        message: statusPrefix + 'Connecting...',
        color: 'rgb(255, 255, 191)'
    },
    connected: {
        id: 'connected',
        message: statusPrefix + 'Connected!',
        color: 'rgba(181, 255, 193, 1)'
    },
    disconnected: {
        id: 'disconnected',
        message: statusPrefix + 'Disconnected :(',
        color: 'rgb(255, 190, 155)'
    },
    error: {
        id: 'error',
        message: statusPrefix + 'Error',
        color: 'rgba(254, 160, 160, 1)'
    },
    unknown: {
        id: 'unknown',
        message: statusPrefix + 'Unknown',
        color: 'rgb(234, 234, 234)'
    }
}
let currentStatus = statuses.connecting.id;

let statusDiv = document.createElement('div');
statusDiv.style.padding = '10px';

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

    // status - updated in the update function
    contentContainer.appendChild(statusDiv);
    contentContainer.appendChild(document.createElement('p'));

    // basic body text (for now)
    const staticTextDiv = contentContainer.appendChild(document.createElement('div'));
    staticTextDiv.innerHTML = "This plugin will connect to a local MCP server automatically.<br><br>If needed, you can force a reconnect:";

    // create the button to set the LCS on the selected face
    contentContainer.appendChild(new FormIt.PluginUI.Button('Force Reconnect', FormItMCP.initializeMCP).element);
    
    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);
}

// update the status div
FormItMCP.updateUI = () => {
    switch (currentStatus) {
        case statuses.connecting.id:
            statusDiv.innerHTML = statuses.connecting.message;
            statusDiv.style.backgroundColor = statuses.connecting.color;
            break;
        case statuses.connected.id:
            statusDiv.innerHTML = statuses.connected.message;
            statusDiv.style.backgroundColor = statuses.connected.color;
            break;
        case statuses.disconnected.id:
            statusDiv.innerHTML = statuses.disconnected.message;
            statusDiv.style.backgroundColor = statuses.disconnected.color;
            break;
        case statuses.error.id:
            statusDiv.innerHTML = statuses.error.message;
            statusDiv.style.backgroundColor = statuses.error.color;
            break;
        default:
            statusDiv.innerHTML = statuses.unknown.message;
            statusDiv.style.backgroundColor = statuses.unknown.color;
    }
}

FormItMCP.initializeMCP = () => {
    if (window.formitBridgeWS && window.formitBridgeWS.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
        currentStatus = statuses.connected.id;
        FormItMCP.updateUI();
    } else {
        window.formitBridgeWS = new WebSocket("ws://localhost:8765");

        window.formitBridgeWS.onopen = function() {
            console.log("FormIt WebSocket bridge connected.");
            currentStatus = statuses.connected.id;
            FormItMCP.updateUI();
        };

        window.formitBridgeWS.onmessage = async function(event) {
            try {
                let code = event.data;4
                console.log("DEBUGGING: event.data", event.data);
                // Evaluate the received JS code
                let result = await eval(code);
                console.log("DEBUGGING: result", JSON.stringify(JSON.stringify({ result })));
                // Send the result back as JSON
                window.formitBridgeWS.send(JSON.stringify({ result }));
            } catch (err) {
                // Send error back as JSON
                window.formitBridgeWS.send(JSON.stringify({ error: err.toString() }));
            }
        };

        window.formitBridgeWS.onclose = function() {
            console.log("FormIt WebSocket bridge disconnected.");
            currentStatus = statuses.disconnected.id;
            FormItMCP.updateUI();
        };

        window.formitBridgeWS.onerror = function(e) {
            console.error("WebSocket error:", e);
            currentStatus = statuses.error.id;
            FormItMCP.updateUI();
        };
    }
}

/*** application code - runs asynchronously from plugin process to communicate with FormIt ***/
