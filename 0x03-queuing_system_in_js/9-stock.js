// Import required libraries
import express from 'express'; // Web framework for building the server
import redis from 'redis'; // Redis client for managing key-value storage
import { promisify } from 'util'; // Utility to convert callback-based functions to promises

// Product catalog with initial data
const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 0 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

/* Helper function to find a product by its ID */
function getItemById(id) {
  // Filter the product list to find the one matching the given ID
  return listProducts.filter((item) => item.itemId === id);
}

/* Initialize Express server */
const app = express();

// Start the server and set up initial stock values in Redis
app.listen(1245, () => {
  listProducts.forEach((product) => {
    reserveStockById(product.itemId, product.initialAvailableQuantity); // Set stock in Redis for each product
  });
  console.log('Server running on port 1245');
});

// Endpoint to list all products
app.get('/list_products', (req, res) => {
  res.json(listProducts); // Respond with the full product list
});

/* Endpoint to get details of a single product by its ID */
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId); // Convert itemId to a number from the route parameter
  const item = getItemById(itemId); // Find the product by ID
  const stock = await getCurrentReservedStockById(itemId); // Get current stock from Redis

  if (item.length > 0) {
    item[0].currentQuantity = stock; // Add current stock to the product details
    res.json(item[0]); // Respond with the product details
    return;
  }

  res.status(404).json({ status: 'Product not found' }); // Return 404 if product is not found
});

/* Endpoint to reserve a product */
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId); // Convert itemId to a number
  const item = getItemById(itemId); // Find the product by ID

  if (item.length < 1) {
    res.status(404).json({ status: 'Product not found' }); // If product not found, return 404
    return;
  }

  const stock = await getCurrentReservedStockById(itemId); // Get current stock from Redis

  if (stock < 1) {
    res.status(403).json({ status: 'Not enough stock available', itemId }); // If stock is zero, return 403
    return;
  }

  reserveStockById(itemId, stock - 1); // Decrease stock by 1 in Redis
  res.json({ status: 'Reservation confirmed', itemId }); // Confirm reservation
});

/* Redis Client Setup */
const client = redis.createClient(); // Initialize Redis client
const get = promisify(client.get).bind(client); // Promisify the `get` method for async/await support

/* Helper function to set stock for a product in Redis */
function reserveStockById(itemId, stock) {
  client.set(itemId, stock); // Store the stock value in Redis using product ID as key
}

/* Helper function to get the current reserved stock for a product from Redis */
async function getCurrentReservedStockById(itemId) {
  const stock = await get(itemId); // Fetch the stock value for the given product ID
  return Number(stock); // Ensure the value is returned as a number
}
