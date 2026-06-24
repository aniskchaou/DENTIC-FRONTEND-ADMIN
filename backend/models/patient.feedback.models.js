

    var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');
  const PatientFeedback = sequelize.define("patientFeedback", {

    patientId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
    },
    clinicId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "clinics",
        key: "id",
      },
    },
    doctorId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "doctors",
        key: "id",
      },
    },
    appointmentId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "appointments",
        key: "id",
      },
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    reviewText: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    feedbackCategory: {
      type: Sequelize.ENUM("General", "Treatment", "Facilities", "Staff Behavior", "Pricing"),
      allowNull: false,
    },
    responseFromClinic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM("Pending", "Addressed", "Archived"),
      defaultValue: "Pending",
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
  
  module.exports = PatientFeedback;
  
  