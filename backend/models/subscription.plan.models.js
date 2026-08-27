var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

// SaaS-level plans offered to clinics
var SubscriptionPlan = sequelize.define("subscription_plan", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: "e.g. Starter, Professional, Enterprise",
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  billingCycle: {
    type: DataTypes.ENUM("monthly", "yearly"),
    allowNull: false,
    defaultValue: "monthly",
  },
  maxUsers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxPatients: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "null = unlimited",
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    comment: "Array of feature keys enabled for this plan",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

SubscriptionPlan.insertDefaults = async function () {
  const defaults = [
    {
      name: "Starter",
      price: 29.0,
      billingCycle: "monthly",
      maxUsers: 3,
      maxPatients: 200,
      features: ["appointments", "billing", "odontogram"],
    },
    {
      name: "Professional",
      price: 79.0,
      billingCycle: "monthly",
      maxUsers: 10,
      maxPatients: 1000,
      features: ["appointments", "billing", "odontogram", "ai", "analytics", "telemedicine"],
    },
    {
      name: "Enterprise",
      price: 199.0,
      billingCycle: "monthly",
      maxUsers: null,
      maxPatients: null,
      features: ["all"],
    },
  ];
  await SubscriptionPlan.bulkCreate(defaults, { ignoreDuplicates: true });
};

module.exports = SubscriptionPlan;
