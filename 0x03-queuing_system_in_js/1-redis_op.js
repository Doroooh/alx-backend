// Import the Redis library to interact with the Redis database
import redis from 'redis';

// Create a Redis client instance to connect to the Redis server
const client = redis.createClient();

// Event listener triggered upon successful connection to the Redis server
client.on('connect', function() {
    console.log('Successfully connected to the Redis server!'); // Notify the connection status
});

// Event listener to handle errors during the connection or interaction with the Redis server
client.on('error', function(error) {
    console.error(`Error: Unable to connect to the Redis server. Details: ${error.message}`); // Log error details
});

// Function to set a key-value pair in the Redis store
function setSchool(schoolName, value) {  
    // Use the 'set' command to store a value, and print the operation's status
    client.set(schoolName, value, redis.print); 
    console.log(`Set operation complete for key: "${schoolName}" with value: "${value}"`);
}

// Function to retrieve and display a value associated with a specific key
function getSchoolValue(schoolName) {
    client.get(schoolName, (err, value) => {
        if (err) {
            console.error(`Error retrieving key "${schoolName}": ${err.message}`);
        } else {
            console.log(`Value for key "${schoolName}": ${value}`); // Log the retrieved value
        }
    });
}

// Example usage of the above functions
getSchoolValue('Holberton'); // Attempt to retrieve value for 'Holberton'
setSchool('HolbertonSanFrancisco', '100'); // Add a new key-value pair
getSchoolValue('HolbertonSanFrancisco'); // Retrieve the newly set value
