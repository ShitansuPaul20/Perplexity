require('dotenv').config();
const app = require('./src/app');
const connectToDB = require('./src/config/database');
const { testAI } = require('./src/services/ai.service');

// Connect to the database
connectToDB();

testAI();

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});