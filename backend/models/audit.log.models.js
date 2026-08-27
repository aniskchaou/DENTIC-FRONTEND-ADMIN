const { DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const AuditLog = sequelize.define('audit_log', {
  userId:    { type: DataTypes.INTEGER, allowNull: true },
  username:  { type: DataTypes.STRING,  allowNull: true },
  role:      { type: DataTypes.STRING,  allowNull: true },
  action:    { type: DataTypes.STRING,  allowNull: false }, // CREATE UPDATE DELETE LOGIN etc.
  entity:    { type: DataTypes.STRING,  allowNull: true },  // e.g. 'user', 'appointment'
  entityId:  { type: DataTypes.INTEGER, allowNull: true },
  ipAddress: { type: DataTypes.STRING,  allowNull: true },
  details:   { type: DataTypes.JSON,    allowNull: true },  // before/after values
}, { updatedAt: false });

module.exports = AuditLog;
