

    var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');

var VRTreatmentSimulation = sequelize.define("vrtreatment_simulation", {

  patientId: {
    type: Sequelize.UUID,
    allowNull: false,
  },
  procedureType: {
    type: Sequelize.ENUM("Root Canal", "Teeth Whitening", "Implant Surgery"),
    allowNull: false,
  },
  vrSessionId: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1, 
    },
  },
  comfortLevel: {
    type: Sequelize.ENUM("Low", "Medium", "High"),
    allowNull: true,
  },
  anxietyReductionScore: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10,
    },
  },
  assignedDoctorId: {
    type: Sequelize.UUID,
    allowNull: false,
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

module.exports = VRTreatmentSimulation;

const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");


// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomProcedure() {
  const procedures = ["Root Canal", "Teeth Whitening", "Implant Surgery"];
  return procedures[Math.floor(Math.random() * procedures.length)];
}

function getRandomComfortLevel() {
  const levels = ["Low", "Medium", "High"];
  return levels[Math.floor(Math.random() * levels.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




  