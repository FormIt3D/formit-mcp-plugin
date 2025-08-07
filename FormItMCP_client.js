if (typeof FormItMCP == 'undefined')
{
    FormItMCP = {};
}

FormItMCP.initializeMCP = function() {
    if (window.formitBridgeWS && window.formitBridgeWS.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected.");
        FormItMCP.updateUI(MCPStatuses.connected.id);
    } else {
        window.formitBridgeWS = new WebSocket("ws://localhost:8765");

        window.formitBridgeWS.onopen = function() {
            console.log("FormIt WebSocket bridge connected.");
            FormItMCP.updateUI(MCPStatuses.connected.id);
        };

        window.formitBridgeWS.onmessage = async function(event) {
            try {
                let code = event.data;
                console.log("DEBUGGING: event.data", event.data);
                // Evaluate the received JS code
                debugger;
                let result = eval(code);
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
            FormItMCP.updateUI(MCPStatuses.disconnected.id);
        };

        window.formitBridgeWS.onerror = function(e) {
            console.error("WebSocket error:", e);
            FormItMCP.updateUI(MCPStatuses.error.id);
        };
    }
}

FormItMCP.initializeMCP();