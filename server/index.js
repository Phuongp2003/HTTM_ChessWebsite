require('module-alias/register');
const express = require('express');
const corsMiddleware = require('./middleware/cors');

const { config } = require('dotenv');
const setupSwagger = require('./swagger');
const apiRouter = require('./routes/api/index.js');
const { setupSocket, startSocket } = require('./socket/index.js');
const { initSecret } = require('./utils/secret');

const app = express();
config();

const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(corsMiddleware);
initSecret();

// Setup Swagger
setupSwagger(app);

app.use('/api', apiRouter);
const server = startSocket(app);
setupSocket();

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
