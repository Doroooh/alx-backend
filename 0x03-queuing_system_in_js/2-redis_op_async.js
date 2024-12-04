// Import the Redis library to interact with a Redis database
import redis from 'redis';

// Destructure `promisify` from the `util` module to convert callback-based functions to promises
const { promisify } = require("util");

// Create a Redis client instance
const client = redis.createClient();

// Promisify the `get` method of the Redis client for use with `async/await`
const getAsync = promisify(client.get).bind(client);

// Event listener for successful connection to the Redis server
client.on('connect', function() {
    console.log('Redis client connected to the server'); // Log confirmation of connection
});

// Event listener to handle errors during connection or interaction with Redis
client.on('error', function(error) {
    console.error(`Redis client not connected to the server: ${error.message}`); // Log error details
});

// Function to set a key-value pair in Redis
function setNewSchool(schoolName, value) {  
    client.set(schoolName, value, redis.print); // Use Redis `set` command to store the value and print the status
}

// Async function to retrieve and display the value of a given key from Redis
async function displaySchoolValue(schoolName) {
    const foundValue = await getAsync(schoolName); // Use the promisified `get` method to fetch the value
    console.log(foundValue); // Log the retrieved value to the console
}

// Main self-executing function to demonstrate the functionality
(async function main() {
    await displaySchoolValue('Holberton'); // Attempt to retrieve and display the value for the key 'Holberton'
    setNewSchool('HolbertonSanFrancisco', '100'); // Set a new key-value pair in Redis
    await displaySchoolValue('HolbertonSanFrancisco'); // Retrieve and display the value for the new key
}());
