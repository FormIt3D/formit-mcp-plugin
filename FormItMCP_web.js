console.log("FormItMCP_web.js module starting to load...");

window.FormItMCP = window.FormItMCP || {};

let statusDiv = document.createElement('div');
statusDiv.style.padding = '10px';

/*** web/UI code - runs natively in the plugin process ***/
/*** note that FormItMCP_web.js runs on the FormIt side ***/
FormItMCP.initializeUI = function()
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
    contentContainer.appendChild(new FormIt.PluginUI.Button('Force Reconnect', () => {
        FormItInterface.CallMethod("FormItMCP.initializeMCP", { })
    }).element);
    
    // create the footer
    document.body.appendChild(new FormIt.PluginUI.FooterModule().element);

    // add a listener for the current MCP server status
    FormItInterface.SubscribeMessage("FormIt.Message.kFormItJSONMsg", function(msg)
    {
        // update the UI when the status changes
        FormItMCP.updateUI(msg);
    });

    FormItInterface.CallMethod("FormItMCP.initializeMCP", { })
}

// update the status div
FormItMCP.updateUI = (currentStatus) => {
    switch (currentStatus) {
        case MCPPluginStatuses.connecting.id:
            statusDiv.innerHTML = MCPPluginStatuses.connecting.message;
            statusDiv.style.backgroundColor = MCPPluginStatuses.connecting.color;
            break;
        case MCPPluginStatuses.connected.id:
            statusDiv.innerHTML = MCPPluginStatuses.connected.message;
            statusDiv.style.backgroundColor = MCPPluginStatuses.connected.color;
            break;
        case MCPPluginStatuses.disconnected.id:
            statusDiv.innerHTML = MCPPluginStatuses.disconnected.message;
            statusDiv.style.backgroundColor = MCPPluginStatuses.disconnected.color;
            break;
        case MCPPluginStatuses.error.id:
            statusDiv.innerHTML = MCPPluginStatuses.error.message;
            statusDiv.style.backgroundColor = MCPPluginStatuses.error.color;
            break;
        default:
            statusDiv.innerHTML = MCPPluginStatuses.unknown.message;
            statusDiv.style.backgroundColor = MCPPluginStatuses.unknown.color;
    }
}