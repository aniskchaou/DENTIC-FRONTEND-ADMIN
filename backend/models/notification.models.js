


  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const Notification = sequelize.define("notification", {

  recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the recipient (either a Patient or Staff)"
  },
  type: {
    type: DataTypes.ENUM(
      "Appointment Reminder",
      "Payment Alert",
      "Promotional Offer",
      "System Alert"
    ),
    allowNull: false,
    comment: "Type of the notification"
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "The content of the notification message"
  },
  deliveryMethod: {
    type: DataTypes.ENUM("Email", "SMS", "Push Notification", "In-App Alert"),
    allowNull: false,
    comment: "The method through which the notification is delivered"
  },
  status: {
    type: DataTypes.ENUM("Sent", "Pending", "Failed"),
    allowNull: false,
    comment: "Current status of the notification"
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Timestamp when the notification was sent"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the notification was created"
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the notification was last updated"
  }
});

module.exports = Notification;
