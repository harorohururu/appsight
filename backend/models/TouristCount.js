const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TouristCount', {
    count_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tourist_info: {
      type: DataTypes.INTEGER,
      references: { model: 'tourist_info', key: 'info_id' },
    },
    num_male: {
      type: DataTypes.INTEGER,
    },
    num_female: {
      type: DataTypes.INTEGER,
    },
    num_foreign_male: {
      type: DataTypes.INTEGER,
    },
    num_foreign_female: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'tourist_count',
    timestamps: false,
  });
};
