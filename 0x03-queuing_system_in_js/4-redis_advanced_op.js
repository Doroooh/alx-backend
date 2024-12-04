// Import the Redis library for interacting with a Redis database
import redis from 'redis';
// Import the `promisify` utility to convert callback-based functions to promise-based ones
const { promisify } = require("util");

// Create a Redis client for interacting with the Redis server
const client = redis.createClient();
// Promisify the `hgetall` method to use it as a promise-based function
const hgetall = promisify(client.hgetall).bind(client);

async function main() {
    // Define an object containing data to be stored in a Redis hash
    const values = {
        Portland: 50,
        Seattle: 80,
        'New York': 20,
        Bogota: 20,
        Cali: 40,
        Paris: 2,
    };

    // Loop through the object and store each key-value pair in the Redis hash named 'HolbertonSchools'
    for (const value in values) {
        client.hset(
            'HolbertonSchools', // Hash key
            value,              // Field name
            values[value],      // Field value
            redis.print         // Callback for logging the result of the operation
        );
    }

    // Retrieve all key-value pairs from the 'HolbertonSchools' hash
    const storedObject = await hgetall('HolbertonSchools');
    
    // Print the retrieved object to the console
    console.log(storedObject);
}

// Call the main function to execute the script
main();
