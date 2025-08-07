console.log("FormItMCP_web.js module starting to load...");

if (typeof FormItMCP == 'undefined')
{
    FormItMCP = {};
}

let statusDiv = document.createElement('div');
statusDiv.style.padding = '10px';

/*** web/UI code - runs natively in the plugin process ***/
/*** note that FormItMCP_web.js runs on the FormIt side ***/
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
FormItMCP.updateUI = (currentStatus) => {
    // switch (currentStatus) {
    //     case MCPStatuses.connecting.id:
    //         statusDiv.innerHTML = MCPStatuses.connecting.message;
    //         statusDiv.style.backgroundColor = MCPStatuses.connecting.color;
    //         break;
    //     case MCPStatuses.connected.id:
    //         statusDiv.innerHTML = MCPStatuses.connected.message;
    //         statusDiv.style.backgroundColor = MCPStatuses.connected.color;
    //         break;
    //     case MCPStatuses.disconnected.id:
    //         statusDiv.innerHTML = MCPStatuses.disconnected.message;
    //         statusDiv.style.backgroundColor = MCPStatuses.disconnected.color;
    //         break;
    //     case MCPStatuses.error.id:
    //         statusDiv.innerHTML = MCPStatuses.error.message;
    //         statusDiv.style.backgroundColor = MCPStatuses.error.color;
    //         break;
    //     default:
    //         statusDiv.innerHTML = MCPStatuses.unknown.message;
    //         statusDiv.style.backgroundColor = MCPStatuses.unknown.color;
    // }
}