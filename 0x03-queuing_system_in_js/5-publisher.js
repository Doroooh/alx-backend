// Import the Redis library to interact with the Redis server
import redis from 'redis';

// Create a Redis client instance for publishing messages
const publisher = redis.createClient();

// Event listener for successful connection to the Redis server
publisher.on('connect', function() {
    console.log('Redis client successfully connected to the server');
});

// Event listener for errors during Redis client operations
publisher.on('error', function(error) {
    console.error(`Failed to connect to Redis server: ${error.message}`);
});

/**
 * Publishes a message to the specified Redis channel after a delay.
 * 
 * @param {string} message - The message to be published.
 * @param {number} time - Delay in milliseconds before the message is published.
 */
function publishMessage(message, time) {
    setTimeout(() => {
        console.log(`Preparing to send message: "${message}"`);
        // Publish the message to the "holberton school channel"
        publisher.publish('holberton school channel', message);
    }, time);
}

// Publish various messages with different delays
publishMessage("Student #1 has joined the Holberton course", 100);
publishMessage("Student #2 has joined the Holberton course", 200);
publishMessage("SHUT_DOWN_SERVER", 300); // A special message for server shutdown
publishMessage("Student #3 has joined the Holberton course", 400);
