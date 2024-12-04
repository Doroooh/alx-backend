// Import the Kue library to create and manage Redis-backed job queues
import kue from 'kue';

// Initialize a Kue queue
const queue = kue.createQueue();

/**
 * Function to send a notification with a specific message to a phone number.
 * Logs the notification details for demonstration purposes.
 * 
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message content to be sent.
 */
function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Set up a job processor for the 'push_notification_code' job type
queue.process('push_notification_code', (job, done) => {
    // Extract phone number and message data from the job
    const { phoneNumber, message } = job.data;

    // Call the sendNotification function to process the job
    sendNotification(phoneNumber, message);

    // Indicate that the job is done processing
    done();
});
