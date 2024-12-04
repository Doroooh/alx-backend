// Import the Kue library for managing job queues
import kue from "kue";

// Import Chai's `expect` assertion library for testing
import { expect } from "chai";

// Import the function to be tested, which creates push notification jobs
import createPushNotificationsJobs from "./8-job";

// Initialize a queue using Kue
const queue = kue.createQueue();

// Describe block for grouping tests related to `createPushNotificationsJobs`
describe("createPushNotificationsJobs", () => {
  // Before all tests, enter Kue's test mode to prevent actual job processing
  before(() => {
    queue.testMode.enter();
  });

  // After each test, clear all test jobs from the queue
  afterEach(() => {
    queue.testMode.clear();
  });

  // After all tests, exit Kue's test mode to restore normal functionality
  after(() => {
    queue.testMode.exit();
  });

  // Test: Verify that passing a number instead of an array throws an error
  it("should throw an error if jobs is not an array (Number provided)", () => {
    expect(() => {
      createPushNotificationsJobs(2, queue); // Call with a number
    }).to.throw("Jobs is not an array"); // Verify the expected error message
  });

  // Test: Verify that passing an object instead of an array throws an error
  it("should throw an error if jobs is not an array (Object provided)", () => {
    expect(() => {
      createPushNotificationsJobs({}, queue); // Call with an object
    }).to.throw("Jobs is not an array"); // Verify the expected error message
  });

  // Test: Verify that passing a string instead of an array throws an error
  it("should throw an error if jobs is not an array (String provided)", () => {
    expect(() => {
      createPushNotificationsJobs("Hello", queue); // Call with a string
    }).to.throw("Jobs is not an array"); // Verify the expected error message
  });
});
