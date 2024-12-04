// Import the Kue library to create and manage Redis-backed job queues
import kue from 'kue';

// List of jobs containing phone numbers and verification messages to be sent
const jobs =  [{
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create a new Kue queue to manage jobs
const queue = kue.createQueue();

// Loop through the jobs array to create a notification job for each entry
jobs.forEach((job) => {
    // Create a new job of type 'push_notification_code_2' and pass the job data
    const singleJob = queue.create('push_notification_code_2', job).save(
        (err) => {
            // If there is no error, log the created job's ID
            if (!err) console.log(`Notification job created: ${singleJob.id}`);
        });

    // Event listener for when the job is completed
    singleJob.on('complete', () => console.log(`Notification job ${singleJob.id} completed`));
    
    // Event listener for when the job fails
    singleJob.on('failed', (err) => console.log(`Notification job ${singleJob.id} failed: ${err}`));
    
    // Event listener to track job progress (from 0 to 100%)
    singleJob.on('progress', (progress) => console.log(`Notification job ${singleJob.id} ${progress}% complete`));
});
