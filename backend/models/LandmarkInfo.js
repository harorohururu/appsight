const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LandmarkInfo', {
    info_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landmark_type: {
      type: DataTypes.INTEGER,
      references: { model: 'landmark_type', key: 'type_id' },
    },
    address: {
      type: DataTypes.TEXT,
    },
    total_rooms: {
      type: DataTypes.INTEGER,
    },
    attraction_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  }, {
    tableName: 'landmark_info',
    timestamps: false,
  });
};
