

    var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');
    const PatientHealthHistory = sequelize.define("patientHealthHistory", {
 
      patientId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "patients",
          key: "id",
        },
      },
      chronicDiseases: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Stores multiple chronic diseases
        defaultValue: [],
      },
      allergies: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Stores multiple allergies
        defaultValue: [],
      },
      medications: {
        type: Sequelize.ARRAY(Sequelize.STRING), // List of medications
        defaultValue: [],
      },
      familyHistory: {
        type: Sequelize.JSONB, // JSON object to store family history
        defaultValue: {
          diabetes: "No",
          heartDisease: "No",
          gumDisease: "No",
        },
      },
      lifestyleFactors: {
        type: Sequelize.JSONB, // JSON object for lifestyle habits
        defaultValue: {
          smoking: "No",
          alcoholConsumption: "No",
          diet: "Non-Vegetarian",
          oralHygieneHabits: "Average",
        },
      },
      lastDentalCheckup: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes: {
        type: Sequelize.STRING,
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
    
    module.exports = PatientHealthHistory;
    
  