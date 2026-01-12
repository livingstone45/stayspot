const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resource: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
});

module.exports = Permission;