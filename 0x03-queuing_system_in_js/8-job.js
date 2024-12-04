// Export the function to allow usage in other modules
export default function createPushNotificationsJobs(jobs, queue) {
  // Validate that the `jobs` parameter is an array
  if (Object.getPrototypeOf(jobs) !== Array.prototype) {
    // Throw an error if `jobs` is not an array
    throw new Error('Jobs is not an array');
  }

  // Iterate over each job in the `jobs` array
  jobs.forEach((job) => {
    // Create a job in the queue with the specified type and data
    const singleJob = queue.create('push_notification_code_3', job).save(
      (err) => {
        if (!err) {
          // Log a message when the job is successfully created
          console.log(`Notification job created: ${singleJob.id}`);
        }
      }
    );

    // Event listener for when the job is completed successfully
    singleJob.on('complete', () => {
      console.log(`Notification job ${singleJob.id} completed`);
    });

    // Event listener for when the job fails
    singleJob.on('failed', (err) => {
      console.log(`Notification job ${singleJob.id} failed: ${err}`);
    });

    // Event listener for progress updates on the job
    singleJob.on('progress', (progress) => {
      console.log(`Notification job ${singleJob.id} ${progress}% complete`);
    });
  });
}
