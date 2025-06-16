//backend/index.js
process.setMaxListeners(20); 

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('redis');
const {createServer} = require('http');
let { RedisStore } = require('connect-redis');
const userRoutes = require('./routes/userRoutes.js');
const electionRoutes = require('./routes/electionRoutes.js');
const setupWebSocket = require('./websocket.js');
const kycRoutes = require('./routes/kyc.js')


const app = express(); 
const server = createServer(app); 
// setupWebSocket(server); // Pass the server to the WebSocket setup functio
const port = 3001;

// Enable JSON request body parsing
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: ['http://localhost:3000','http://10.5.48.95:3000', 'fbbc-46-252-96-196.ngrok-free.app' ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  })
);

// Redis Error Listener
const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  // socket: {
  //   tls: true,
  // }
});

(async () => {
  await redisClient.connect();
})();

redisClient.on('error', err => console.log('Redis error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Session Middleware (backed by Redis)
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: 'myapp:'
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid', 
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/'
    }
  })
);


app.use((req, res, next) => {
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/admin', electionRoutes);
app.use('/api/kyc', kycRoutes)

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the voting system' });
});

// Start the Server
server.listen(port, '0.0.0.0', () => {
  console.log(`Backend + WebSocket server running at http://localhost:${port}`);
});
