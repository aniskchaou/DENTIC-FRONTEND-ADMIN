var sequelize = require("../db/init.sequelize.js");


const { Sequelize, DataTypes } = require("sequelize");
//const sequelize = require("../config/database");

const Payment = sequelize.define("payment", {

  patientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to the patient making the payment",
    },
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to the associated appointment (if applicable)",
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to the associated invoice (if applicable)",
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to the clinic receiving the payment",
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: "Total amount paid",
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Currency used for the payment (e.g., USD, EUR)",
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Method of payment",
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Reference ID from the payment gateway",
    },
    insuranceClaimId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to the insurance claim if applicable",
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Status of the payment",
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Timestamp when the payment was made",
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Optional additional details related to the payment",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Timestamp when the payment record was created",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      comment: "Timestamp when the payment record was last updated",
    },
});



/**
 * Insert dummy payment records for testing/demo purposes.
 */
insertDummyPayments = async function() {
  const dummyPayments = [
    {
      patientId: 1,
      appointmentId: 1,
      invoiceId: 1,
      clinicId: 1,
      amount: 150.00,
      currency: "USD",
      paymentMethod: "Credit Card",
      transactionId: "TXN123456789",
      insuranceClaimId: null,
      paymentStatus: "Completed",
      paymentDate: new Date("2025-07-01T10:00:00Z"),
      notes: "Paid in full at reception"
    }
  ];
  return await Payment.bulkCreate(dummyPayments);
};

insertDummyPayments()
    .then(() => console.log("Dummy payments inserted successfully."))
    .catch(err => console.error("Error inserting dummy payments:", err));
module.exports = Payment;
