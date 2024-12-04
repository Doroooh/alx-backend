// Import the Redis client library
import redis from 'redis';

// Create a new Redis client instance
const client = redis.createClient();

// Event listener for successful connection to the Redis server
client.on('connect', function() {
    console.log('Redis client connected to the server'); // Log a message when the connection is successful
});

// Event listener for errors during the connection or operation with the Redis server
client.on('error', function(error) {
    console.error(`Redis client not connected to the server: ${error.message}`); // Log the error message if an issue occurs
});
