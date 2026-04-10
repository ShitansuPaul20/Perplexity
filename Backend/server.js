require('dotenv').config();
const app = require('./src/app');
const http = require("http")
const connectToDB = require('./src/config/database');
const { testAI } = require('./src/services/ai.service');
const { initSocket } = require('./src/sockets/server.socket') 

// Connect to the database
connectToDB();

const httpServer = http.createServer(app);
initSocket(httpServer)

testAI();

// Start the server
httpServer.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

