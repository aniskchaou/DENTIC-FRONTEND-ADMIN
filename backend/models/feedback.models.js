

  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const Feedback = sequelize.define("feedback", {

  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "patients",
      key: "id",
    },
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "doctors",
      key: "id",
    },
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "appointments",
      key: "id",
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reviewDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Published", "Pending", "Hidden"),
    defaultValue: "Pending",
    allowNull: false,
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

module.exports = Feedback;

  