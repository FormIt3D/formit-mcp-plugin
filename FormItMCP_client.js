if (typeof FormItMCP == 'undefined')
{
    FormItMCP = {};
}

FormItMCP.initializeMCP = function() {
    if (window.formitBridgeWS && window.formitBridgeWS.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
        FormIt.Messaging.Broadcast("FormIt.Message.kFormItJSONMsg", MCPPluginStatuses.connected.id);
    } else {
        window.formitBridgeWS = new WebSocket("ws://localhost:8765");

        window.formitBridgeWS.onopen = function() {
            console.log("FormIt WebSocket bridge connected.");
            FormIt.Messaging.Broadcast("FormIt.Message.kFormItJSONMsg", MCPPluginStatuses.connected.id);
        };

        window.formitBridgeWS.onmessage = async function(event) {
            try {
                let code = event.data;
                // Evaluate the received JS code
                let result = eval(code);
                // Send the result back as JSON
                window.formitBridgeWS.send(JSON.stringify({ result }));
            } catch (err) {
                // Send error back as JSON
                window.formitBridgeWS.send(JSON.stringify({ error: err.toString() }));
            }
        };

        window.formitBridgeWS.onclose = function() {
            console.log("FormIt WebSocket bridge disconnected.");
            FormIt.Messaging.Broadcast("FormIt.Message.kFormItJSONMsg", MCPPluginStatuses.disconnected.id);
        };

        window.formitBridgeWS.onerror = function(e) {
            console.error("WebSocket error:", e);
            FormIt.Messaging.Broadcast("FormIt.Message.kFormItJSONMsg", MCPPluginStatuses.error.id);
        };
    }
}