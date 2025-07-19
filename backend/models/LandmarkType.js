const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LandmarkType', {
    type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    tableName: 'landmark_type',
    timestamps: false,
  });
};
