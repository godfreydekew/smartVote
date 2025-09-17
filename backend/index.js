process.setMaxListeners(20);

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { createClient } = require('redis');
const { createServer } = require('http');
let { RedisStore } = require('connect-redis');
const userRoutes = require('./routes/userRoutes.js');
const electionRoutes = require('./routes/electionRoutes.js');
const kycRoutes = require('./routes/kyc.js');
const analyticsRoutes = require('./routes/analyticsRoutes');
const etherscanRoutes = require('./routes/etherscanRoutes');
const { createTables } = require('./database/migrations/createTables.js');
const { dropTables } = require('./database/migrations/dropTables.js');
const { updateElectionsTable, updateEligibleVotersTable } = require('./database/migrations/add_election_type.js');
const { updateCandidatesTable } = require('./database/migrations/update_candidates_table.js');

const app = express();
const server = createServer(app);
const port = 3001;

//dropTables()
//createTables()
//updateElectionsTable();
updateEligibleVotersTable();
//updateCandidatesTable();

app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://10.5.48.95:3000',
      'https://smart-vote-ten.vercel.app',
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  })
);

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  // socket: {
  //   tls: true,
  // }
});

(async () => {
  await redisClient.connect();
})();

redisClient.on('error', err => console.log('Redis error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      prefix: 'myapp:',
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
      path: '/',
    },
  })
);

app.use((req, res, next) => {
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/admin', electionRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/etherscan', etherscanRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the voting system' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Backend + WebSocket server running at http://localhost:${port}`);
});
