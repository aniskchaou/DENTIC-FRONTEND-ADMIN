



var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Invoice = sequelize.define("invoice", {

  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
    // references: {
    //   model: "patients",
    //   key: "id",
    // },
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false
    // references: {
    //   model: "clinics",
    //   key: "id",
    // },
  },
  items: {
    type: DataTypes.JSONB, // Store an array of objects for invoice items
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.JSONB, // Store discount details as an object
    allowNull: true,
  },
  taxAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true, // Reference from payment gateway, if applicable
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
 * Insert a dummy invoice record for testing/demo purposes.
 */
async function insertDummyInvoice() {
  const dummyInvoice = {
    invoiceNumber: "INV-2025001",
    patientId: 1,
    clinicId: 1,
    items: [
      {
        itemId: 1,
        itemType: "Consultation",
        itemDescription: "Initial dental consultation",
        quantity: 1,
        unitPrice: 50.0,
        totalPrice: 50.0
      }
    ],
    subTotal: 50.0,
    discount: {
      amount: 5.0,
      percentage: 10,
      discountReason: "Welcome discount"
    },
    taxAmount: 2.5,
    grandTotal: 47.5,
    paymentStatus: "Pending",
    paymentMethod: "Cash",
    transactionId: null,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    notes: "First invoice for patient.",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return await Invoice.create(dummyInvoice);
}

module.exports = Invoice;
module.exports.insertDummyInvoice = insertDummyInvoice;


