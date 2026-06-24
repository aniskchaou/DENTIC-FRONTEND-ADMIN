var sequelize = require("../db/init.sequelize.js");
var Sequelize = require('sequelize');


var Expense = sequelize.define("expense", {
 
  expenseCategory: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  paymentStatus: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Pending",
  },
  vendorId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "vendors", // Assuming you have a vendors table
    //   key: "id",
    // },
  },
  vendorName: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
  },
  invoiceId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "invoices", // Assuming you have an invoices table
    //   key: "id",
    // },
  },
  clinicId: {
    type: Sequelize.UUID,
    allowNull: true
    // references: {
    //   model: "clinics", // Assuming you have a clinics table
    //   key: "id",
    // },
  },
  transactionDate: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  receiptAttachments: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
    defaultValue: [],
  },
  notes: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "",
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
 * Insert dummy expenses for testing/demo purposes.
 */
Expense.insertDummyExpenses = async function() {
  const dummyExpenses = [
    {
      expenseCategory: "Equipment",
      description: "Purchase of new dental chair",
      amount: 3500.00,
      paymentMethod: "Bank Transfer",
      paymentStatus: "Paid",
      vendorId: "11111111-aaaa-bbbb-cccc-111111111111",
      vendorName: "Dental Supplies Inc.",
      invoiceId: "22222222-bbbb-cccc-dddd-222222222222",
      clinicId: "33333333-cccc-dddd-eeee-333333333333",
      transactionDate: new Date("2025-07-01T10:00:00Z"),
      receiptAttachments: ["https://example.com/receipts/chair-invoice.pdf"],
      notes: "Chair installed in Room 2."
    },
    {
      expenseCategory: "Salaries",
      description: "Monthly salary for July",
      amount: 12000.00,
      paymentMethod: "Bank Transfer",
      paymentStatus: "Paid",
      vendorId: null,
      vendorName: "",
      invoiceId: null,
      clinicId: "33333333-cccc-dddd-eeee-333333333333",
      transactionDate: new Date("2025-07-05T09:00:00Z"),
      receiptAttachments: [],
      notes: "Salary paid to all staff."
    },
    {
      expenseCategory: "Utilities",
      description: "Electricity bill for June",
      amount: 450.75,
      paymentMethod: "Credit Card",
      paymentStatus: "Paid",
      vendorId: null,
      vendorName: "City Power Co.",
      invoiceId: "44444444-dddd-eeee-ffff-444444444444",
      clinicId: "33333333-cccc-dddd-eeee-333333333333",
      transactionDate: new Date("2025-07-03T15:30:00Z"),
      receiptAttachments: ["https://example.com/receipts/electricity-june.pdf"],
      notes: ""
    }
  ];
  return await Expense.bulkCreate(dummyExpenses);
};

module.exports = Expense;
