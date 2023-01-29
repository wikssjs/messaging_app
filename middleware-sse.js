// Set of connections
let connections = new Set();

// Current message id
let currentId = 0;

export default function middlewareSse() {
  return (request, response, next) => {
    /**
     * Initialize the connection with the client
     */
    response.initStream = () => {
      // Return the stream to the client
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
      });

      // Add the connection to our set
      connections.add(response);

      // Keep the connection alive
      const keepAliveIntervalId = setInterval(() => {
        response.write(':keep-alive\n\n');
        response.flush();
      }, 0);

      // Stop the keep-alive loop if the client closes the connection
      response.on('close', () => {
        connections.delete(response);
        clearInterval(keepAliveIntervalId);
        response.end();
      });

      response.on('error', (error) => {
        connections.delete(response);
        clearInterval(keepAliveIntervalId);
        response.end();
        console.error(error);
      });
    };

    /**
     * Send JSON objects to all clients
     */
    response.pushJson = (data, eventName) => {
      // Build the data string
      let dataString =
        `id: ${currentId}\n` +
        `data: ${JSON.stringify(data)}\n` +
        (eventName ? `event: ${eventName}\n\n` : '\n');

      // Send the data to all connections
      for (let connection of connections) {
        connection.write(dataString);
        connection.flush();
      }

      currentId++;
    };

    // Move on to the next middleware
    next();
  };
}
