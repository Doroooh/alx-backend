// Import the Kue library for creating and managing jobs in a Redis-backed queue
import kue from 'kue';

// Initialize the Kue queue
const queue = kue.createQueue();

// Sample data for the job (phone number and message)
const jobData = {
    phoneNumber: '4153518780', // User's phone number for verification
    message: 'Your verification code is ready', // Message content for the verification code
};

// Create a new job in the queue with the type 'push_notification_code' and the job data
const job = queue.create('push_notification_code', jobData).save((err) => {
    if (!err) {
        console.log(`Push notification job successfully created with ID: ${job.id}`);
    }
});

// Event listener for when the job is completed
job.on('complete', () => {
    console.log(`Job ${job.id} successfully completed. Notification sent.`);
});

// Event listener for when the job fails
job.on('failed', () => {
    console.log(`Job ${job.id} failed. Notification not sent.`);
});
