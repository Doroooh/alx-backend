// Import the Kue library to create and manage Redis-backed job queues
import kue from 'kue';

// Initialize a Kue queue
const queue = kue.createQueue();

// List of blacklisted phone numbers that should not receive notifications
const blacklist = ['4153518780', '4153518781'];

/**
 * Function to send a notification to a phone number with a specific message.
 * If the phone number is blacklisted, the job will fail with an error.
 * The job progress is tracked from 0% to 100%.
 * 
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message content to be sent.
 * @param {object} job - The Kue job object used to track job progress and completion.
 * @param {function} done - The callback function that should be called when the job is finished.
 */
function sendNotification(phoneNumber, message, job, done) {
  // Initialize job progress at 0% 
  job.progress(0, 100);

  // Check if the phone number is not blacklisted
  if (!blacklist.includes(phoneNumber)) {
    // If not blacklisted, update progress to 50% and log the notification details
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

    // Indicate that the job has been completed successfully
    done();
  } else {
    // If blacklisted, fail the job with an error message
    done(Error(`Phone number ${phoneNumber} is blacklisted`));
  }
}

// Process the 'push_notification_code_2' job with a concurrency of 2 workers
queue.process('push_notification_code_2', 2, (job, done) => {
  // Extract the phone number and message from the job data
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function to handle the notification logic
  sendNotification(phoneNumber, message, job, done);
});
