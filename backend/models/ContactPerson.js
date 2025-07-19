const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ContactPerson', {
    contact_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    landmark_info: {
      type: DataTypes.INTEGER,
      references: { model: 'landmark_info', key: 'info_id' },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    telephone: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'contact_person',
    timestamps: false,
  });
};
