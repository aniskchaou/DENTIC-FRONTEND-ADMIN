


var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Medication = sequelize.define("medication", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., Amoxicillin, Ibuprofen, Lidocaine",
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Optional, generic alternative"
  },
  category: {
    type: DataTypes.ENUM("Antibiotic", "Painkiller", "Anesthetic", "Anti-inflammatory"),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Usage, precautions, side effects"
  },
  dosageForms: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: ["Tablet", "Capsule", "Liquid", "Injection", "Gel"],
    comment: "List of available dosage forms"
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., 500mg, 2%"
  },
  manufacturerId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to Manufacturer"
  },
  requiresPrescription: {
    type: DataTypes.ENUM("Yes", "No"),
    allowNull: false,
  },
  sideEffects: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of side effects like Nausea, Dizziness, Allergy",
    get() {
      const value = this.getDataValue('sideEffects');
      return value ? value : [];
    },
    set(value) {
      this.setDataValue('sideEffects', value);
    }
  },
  contraindications: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of contraindications like Pregnancy, Kidney Disease, Allergy to Penicillin",
    get() {
      const value = this.getDataValue('contraindications');
      return value ? value : [];
    },
    set(value) {
      this.setDataValue('contraindications', value);
    }
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Available stock in clinic/pharmacy"
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: "Cost per unit"
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Expiration date of the medication"
  },
  storageConditions: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "e.g., Store below 25°C"
  },
  status: {
    type: DataTypes.ENUM("Available", "Out of Stock", "Discontinued"),
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

module.exports = Medication;
