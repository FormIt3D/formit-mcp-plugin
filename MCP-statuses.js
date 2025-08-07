const statusPrefix = 'MCP server status: ';
// add MCP statuses to the window object 
// for client and web side scripts to access
window.MCPPluginStatuses = {
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