const { DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const SupportTicket = sequelize.define('support_ticket', {
  clinicId:    { type: DataTypes.INTEGER, allowNull: true },
  submittedBy: { type: DataTypes.INTEGER, allowNull: true },
  subject:     { type: DataTypes.STRING,  allowNull: false },
  description: { type: DataTypes.TEXT,    allowNull: false },
  status:      { type: DataTypes.ENUM('open','in_progress','resolved','closed'), defaultValue: 'open' },
  priority:    { type: DataTypes.ENUM('low','medium','high','critical'),          defaultValue: 'medium' },
  assignedTo:  { type: DataTypes.INTEGER, allowNull: true },
  resolution:  { type: DataTypes.TEXT,    allowNull: true },
  replies:     { type: DataTypes.JSON,    defaultValue: [] },
});

module.exports = SupportTicket;
