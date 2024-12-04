// Import the Redis library to interact with the Redis server
import redis from 'redis';

// Create a Redis client instance for subscribing to channels
const subscriber = redis.createClient();

// Event listener for successful connection to the Redis server
subscriber.on('connect', function() {
    console.log('Successfully connected to the Redis server as a subscriber');
});

// Event listener for errors during Redis client operations
subscriber.on('error', function(error) {
    console.error(`Failed to connect to the Redis server: ${error.message}`);
});

// Subscribe to the "holberton school channel" to receive messages
subscriber.subscribe('holberton school channel');

// Event listener for incoming messages on subscribed channels
subscriber.on('message', function(channel, message) {
    console.log(`Received message: "${message}" from channel: "${channel}"`);

    // Check for the special message to terminate the subscription
    if (message === 'SHUT_DOWN_SERVER') {
        console.log(`Unsubscribing from channel: "${channel}" and shutting down subscriber.`);
        subscriber.unsubscribe(channel); // Unsubscribe from the channel
        subscriber.quit(); // Close the Redis connection
    }
});
