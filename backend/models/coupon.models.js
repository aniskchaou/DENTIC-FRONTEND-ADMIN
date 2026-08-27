var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var Coupon = sequelize.define("coupon", {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  discountType: {
    type: DataTypes.ENUM("percentage", "fixed"),
    allowNull: false,
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "null = unlimited",
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  applicablePlans: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: "Empty array = applies to all plans",
  },
});

module.exports = Coupon;
