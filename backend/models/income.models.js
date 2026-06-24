var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');


var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Income = sequelize.define("income", {

  incomeCategory: {
    type: Sequelize.ENUM(
      "Consultation Fees",
      "Treatment Fees",
      "Surgery",
      "Medication Sales",
      "Lab Tests",
      "Insurance Payments",
      "Other"
    ),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING, // Details of the income source
    allowNull: true,
  },
  amount: {
    type: Sequelize.FLOAT, // Total income amount
    allowNull: false,
  },
  paymentMethod: {
    type: Sequelize.ENUM(
      "Cash",
      "Credit Card",
      "Debit Card",
      "Insurance",
      "Online Payment"
    ),
    allowNull: false,
  },
  paymentStatus: {
    type: Sequelize.ENUM("Pending", "Received", "Partially Received"),
    defaultValue: "Pending",
  },
  patientId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "patients",
    //   key: "id",
    // },
  },
  doctorId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "doctors",
    //   key: "id",
    // },
  },
  invoiceId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "invoices",
    //   key: "id",
    // },
  },
  insuranceClaimId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "insurance_claims",
    //   key: "id",
    // },
  },
  clinicId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "clinics",
    //   key: "id",
    // },
  },
  transactionDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  receiptAttachments: {
    type: Sequelize.ARRAY(Sequelize.STRING), // Array of receipt URLs
    defaultValue: [],
  },
  notes: {
    type: Sequelize.STRING, // Additional remarks
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

/**
 * Insert dummy incomes for testing/demo purposes.
 */
Income.insertDummyIncomes = async function() {
  const dummyIncomes = [
    {
      incomeCategory: "Consultation Fees",
      description: "Consultation for new patient",
      amount: 100.00,
      paymentMethod: "Cash",
      paymentStatus: "Received",
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      doctorId: "22222222-bbbb-cccc-dddd-222222222222",
      invoiceId: "33333333-cccc-dddd-eeee-333333333333",
      insuranceClaimId: null,
      clinicId: "44444444-dddd-eeee-ffff-444444444444",
      transactionDate: new Date("2025-07-01T09:00:00Z"),
      receiptAttachments: ["https://example.com/receipts/consultation1.pdf"],
      notes: "Paid in full at front desk."
    },
    {
      incomeCategory: "Treatment Fees",
      description: "Root canal procedure",
      amount: 450.00,
      paymentMethod: "Credit Card",
      paymentStatus: "Received",
      patientId: "55555555-eeee-ffff-aaaa-555555555555",
      doctorId: "66666666-ffff-aaaa-bbbb-666666666666",
      invoiceId: "77777777-aaaa-bbbb-cccc-777777777777",
      insuranceClaimId: null,
      clinicId: "88888888-bbbb-cccc-dddd-888888888888",
      transactionDate: new Date("2025-07-02T11:30:00Z"),
      receiptAttachments: [],
      notes: "Procedure successful."
    },
    {
      incomeCategory: "Medication Sales",
      description: "Sale of antibiotics",
      amount: 35.50,
      paymentMethod: "Online Payment",
      paymentStatus: "Received",
      patientId: "99999999-cccc-dddd-eeee-999999999999",
      doctorId: null,
      invoiceId: null,
      insuranceClaimId: null,
      clinicId: "44444444-dddd-eeee-ffff-444444444444",
      transactionDate: new Date("2025-07-03T14:00:00Z"),
      receiptAttachments: ["https://example.com/receipts/medication1.pdf"],
      notes: ""
    }
  ];
  return await Income.bulkCreate(dummyIncomes);
};

module.exports = Income;
