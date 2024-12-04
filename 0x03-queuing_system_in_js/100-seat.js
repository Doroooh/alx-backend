// Import required libraries
import kue from 'kue'; // Library for creating and managing job queues
import redis from 'redis'; // Redis client for interacting with the Redis database
import { promisify } from 'util'; // Utility to convert callback-based functions to promises
import express from 'express'; // Web framework for building the server

// Initialize Redis client
const client = redis.createClient();

// Initialize Kue queue for managing seat reservation jobs
const queue = kue.createQueue();

// Create an Express application
const app = express();
const PORT = 1245; // Define the port number for the server

// Promisify Redis `get` and `set` methods for better async/await support
const clientGet = promisify(client.get).bind(client);
const clientSet = promisify(client.set).bind(client);

// Helper function to set the number of available seats in Redis
const reserveSeat = async (number) => await clientSet('available_seats', number);

// Helper function to get the current number of available seats from Redis
const getCurrentAvailableSeats = async () => await clientGet('available_seats');

// Flag to track whether seat reservations are enabled
let reservationEnabled;

// Endpoint to fetch the current number of available seats
app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats(); // Fetch seat count from Redis
    res.json({ numberOfAvailableSeats }); // Send the seat count as a JSON response
});

// Endpoint to reserve a seat
app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        // If reservations are disabled, notify the user
        return res.json({ status: 'Reservations are blocked' });
    }

    // Get the current available seats
    const availableSeats = await getCurrentAvailableSeats();

    // Create a new job in the 'reserve_seat' queue
    const job = queue.create('reserve_seat', { availableSeats }).save((err) => {
        if (!err) {
            // Job successfully created
            res.json({ status: 'Reservation in process' });
        } else {
            // Failed to create the job
            res.json({ status: 'Reservation failed' });
        }
    });

    // Event listener for failed job processing
    job.on('failed', (err) => console.log(`Seat reservation job ${job.id} failed: ${err}`));

    // Event listener for successful job processing
    job.on('complete', () => console.log(`Seat reservation job ${job.id} completed`));
});

// Endpoint to start processing jobs in the 'reserve_seat' queue
app.get('/process', async (req, res) => {
    queue.process('reserve_seat', async (job, done) => {
        console.log(`Processing job: ${job.id}, Data: ${job.data.availableSeats}`);

        let availableSeats = await getCurrentAvailableSeats(); // Fetch available seats
        if (availableSeats <= 0) {
            // If no seats are available, fail the job
            return done(Error('Not enough seats available'));
        }

        // Update the available seats count
        const updatedAvailableSeats = Number(job.data.availableSeats) - 1;
        await reserveSeat(updatedAvailableSeats);

        // If no seats remain, disable reservations
        if (updatedAvailableSeats === 0) {
            reservationEnabled = false;
        }

        // Mark the job as complete
        done();
    });

    res.json({ status: 'Queue processing started' });
});

// Start the Express server
app.listen(PORT, () => {
    // Initialize available seats and enable reservations on server startup
    reserveSeat(50); // Set initial seat count to 50
    reservationEnabled = true; // Enable reservations
    console.log(`Server is running on port ${PORT}`);
});
