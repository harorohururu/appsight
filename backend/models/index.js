const Sequelize = require('sequelize');
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

const User = require('./User')(sequelize);
const LandmarkType = require('./LandmarkType')(sequelize);
const LandmarkInfo = require('./LandmarkInfo')(sequelize);
const ContactPerson = require('./ContactPerson')(sequelize);
const TouristInfo = require('./TouristInfo')(sequelize);
const TouristCount = require('./TouristCount')(sequelize);

module.exports = {
  sequelize,
  User,
  LandmarkType,
  LandmarkInfo,
  ContactPerson,
  TouristInfo,
  TouristCount,
};
