


  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const DentalMembership = sequelize.define("dentalMembership", {

  membershipPlan: {
    type: DataTypes.ENUM("Basic", "Premium", "Family", "Corporate"),
    allowNull: false,
  },
  benefits: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [
      "Free Cleanings",
      "Discounted Treatments",
      "Priority Booking",
      "Emergency Support"
    ],
    comment: "List of benefits provided under the membership plan",
    get() {
      const value = this.getDataValue('benefits');
      return value ? value : [];
    },
    set(value) {
      this.setDataValue('benefits', value);
    }
  },
  validityPeriod: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: "Validity period of the membership",
    get() {
      const value = this.getDataValue('validityPeriod');
      return value ? value : { startDate: null, endDate: null };
    },
    set(value) {
      this.setDataValue('validityPeriod', value);
    }
  },
  paymentStatus: {
    type: DataTypes.ENUM("Active", "Expired", "Canceled"),
    allowNull: false,
  },
  renewalDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date when the membership is due for renewal"
  },
  lastPaymentAmount: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    comment: "Amount of the last payment made"
  },
  lastPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date when the last payment was made"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

/**
 * Insert dummy dental membership records for testing/demo purposes.
 */
DentalMembership.insertDummyMemberships = async function() {
  const dummyMemberships = [
    {
          membershipPlan: "Premium",
      benefits: [
        "Free Cleanings",
        "Discounted Treatments",
        "Priority Booking",
        "Emergency Support"
      ],
      validityPeriod: {
        startDate: "2025-01-01T00:00:00Z",
        endDate: "2025-12-31T23:59:59Z"
      },
      paymentStatus: "Active",
      renewalDate: "2025-12-01T00:00:00Z",
      lastPaymentAmount: 299.99,
      lastPaymentDate: "2025-01-01T10:00:00Z"
    },
    {
      membershipPlan: "Family",
      benefits: [
        "Free Cleanings",
        "Discounted Treatments",
        "Priority Booking"
      ],
      validityPeriod: {
        startDate: "2024-07-01T00:00:00Z",
        endDate: "2025-06-30T23:59:59Z"
      },
      paymentStatus: "Expired",
      renewalDate: "2025-06-01T00:00:00Z",
      lastPaymentAmount: 499.99,
      lastPaymentDate: "2024-07-01T09:00:00Z"
    },
    {
      membershipPlan: "Basic",
      benefits: [
        "Free Cleanings"
      ],
      validityPeriod: {
        startDate: "2025-03-01T00:00:00Z",
        endDate: "2026-02-28T23:59:59Z"
      },
      paymentStatus: "Active",
      renewalDate: "2026-02-01T00:00:00Z",
      lastPaymentAmount: 99.99,
      lastPaymentDate: "2025-03-01T08:30:00Z"
    }
  ];
  return await DentalMembership.bulkCreate(dummyMemberships);
};

module.exports = DentalMembership;
