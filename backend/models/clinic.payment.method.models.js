const { DataTypes } = require('sequelize');
const sequelize = require('../db/init.sequelize');

const ClinicPaymentMethod = sequelize.define('clinic_payment_method', {
  clinicId:    { type: DataTypes.INTEGER, allowNull: true },
  name:        { type: DataTypes.STRING,  allowNull: false }, // e.g. Cash, Card, Insurance, Bank Transfer
  type:        { type: DataTypes.ENUM('cash','card','insurance','bank_transfer','online','other'), defaultValue: 'other' },
  provider:    { type: DataTypes.STRING,  allowNull: true },  // e.g. Stripe, PayPal
  accountInfo: { type: DataTypes.JSON,    allowNull: true },  // masked account details
  isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
  isDefault:   { type: DataTypes.BOOLEAN, defaultValue: false },
  notes:       { type: DataTypes.TEXT,    allowNull: true },
});

module.exports = ClinicPaymentMethod;
