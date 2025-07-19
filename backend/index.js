
const express = require('express');
const { Sequelize } = require('sequelize');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'appsight',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || '1234',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
  }
);

sequelize.authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Models
const User = require('./models/User')(sequelize);
const LandmarkType = require('./models/LandmarkType')(sequelize);
const LandmarkInfo = require('./models/LandmarkInfo')(sequelize);
const ContactPerson = require('./models/ContactPerson')(sequelize);
const TouristInfo = require('./models/TouristInfo')(sequelize);
const TouristCount = require('./models/TouristCount')(sequelize);

// Sync models with database
const fs = require('fs');
const SYNC_FLAG = './.db_synced';

sequelize.sync()
  .then(() => {
    // Check if flag file exists
    if (!fs.existsSync(SYNC_FLAG)) {
      console.log('Database tables synced (created for the first time)');
      fs.writeFileSync(SYNC_FLAG, 'synced');
    } else {
      // Optionally, check for changes (not trivial with Sequelize)
      // For now, only log if flag is missing
    }
  })
  .catch((err) => {
    console.error('Sync error:', err);
    if (fs.existsSync(SYNC_FLAG)) fs.unlinkSync(SYNC_FLAG);
  });

// Example route
app.get('/', (req, res) => {
  res.send('Appsight backend is running with PostgreSQL!');
});


// User routes
const userRouter = require('./routes/user')(User);
app.use('/api/users', userRouter);

// Landmark routes
const landmarkRouter = require('./routes/landmark');
app.use('/api', landmarkRouter);

const os = require('os');
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

app.listen(PORT, () => {
  const ip = getLocalIp();
  console.log(`Server running on port ${PORT}`);
  console.log(`Detected local IP: ${ip}`);
  console.log('---');
  console.log('If you are running the frontend on a mobile device or emulator, update your API URL in AuthContext.jsx:');
  console.log(`fetch('http://${ip}:5000/api/users/login', { ... })`);
  console.log('---');
});
