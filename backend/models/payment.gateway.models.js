var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var PaymentGateway = sequelize.define("payment_gateway", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g. Stripe, PayPal, Braintree",
  },
  provider: {
    type: DataTypes.ENUM("stripe", "paypal", "braintree", "square", "custom"),
    allowNull: false,
  },
  publicKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secretKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  webhookSecret: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "USD",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  sandboxMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  extraConfig: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
});

module.exports = PaymentGateway;
