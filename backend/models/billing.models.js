
  var sequelize = require("../db/init.sequelize.js");
  var Sequelize = require("sequelize");
  
  var Billing = sequelize.define("billing", {

    patientId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users", // Assuming patients are stored in the User table
        key: "id",
      },
    },
    doctorId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "users", // Assuming doctors are also in the User table
        key: "id",
      },
    },
    appointmentId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "appointments", // Assuming there is an Appointments table
        key: "id",
      },
    },
    totalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    finalAmount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: Sequelize.ENUM("Pending", "Paid", "Partially Paid", "Overdue"),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentMethod: {
      type: Sequelize.ENUM("Cash", "Credit Card", "Insurance", "Online Payment"),
      allowNull: false,
    },
    transactionId: {
      type: Sequelize.STRING,
      allowNull: true, // Only required for online payments
    },
    invoiceUrl: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
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
  
  module.exports = Billing;
   