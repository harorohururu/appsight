const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TouristInfo', {
    info_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    landmark_info: {
      type: DataTypes.INTEGER,
      references: { model: 'landmark_info', key: 'info_id' },
    },
    allocation: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
    stay_duration: {
      type: DataTypes.INTEGER,
    },
    form_date: {
      type: DataTypes.DATEONLY,
    },
  }, {
    tableName: 'tourist_info',
    timestamps: false,
  });
};
