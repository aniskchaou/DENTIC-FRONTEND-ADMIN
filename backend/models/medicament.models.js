
var sequelize = require("../db/init.sequelize.js");


const { Sequelize, DataTypes } = require("sequelize");


const Medicament = sequelize.define("medicament", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., Amoxicillin, Ibuprofen, Lidocaine"
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Optional, generic alternative"
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Usage, precautions, side effects"
  },
  activeIngredients: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of active ingredients with concentration",
    get() {
      const value = this.getDataValue('activeIngredients');
      return value ? value : [];
    },
    set(value) {
      this.setDataValue('activeIngredients', value);
    }
  },
  dosageForm: {
    type: DataTypes.ENUM("Tablet", "Capsule", "Syrup", "Injection", "Gel", "Spray"),
    allowNull: false,
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., 500mg, 2%"
  },
  manufacturerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to Manufacturer",
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
  usageInstructions: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "How to take/administer the medication"
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: "Available stock in clinic/pharmacy"
  },
  pricePerUnit: {
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
    comment: "e.g., Store below 25°C, Keep away from sunlight"
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Unique barcode for tracking"
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Tracking batch for recalls"
  },
  status: {
    type: DataTypes.ENUM("Available", "Out of Stock", "Expired", "Discontinued"),
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

module.exports = Medicament;


const createDummyMedicament = async () => {
  try {
    const dummyData = {
      name: "Amoxicillin",
      genericName: "Amoxil",
      category: "Antibiotic",
      description: "Used to treat bacterial infections. Avoid if allergic to penicillin.",
      activeIngredients: [
        { ingredient: "Amoxicillin trihydrate", concentration: "500mg" }
      ],
      dosageForm: "Capsule",
      strength: "500mg",
      manufacturerId: 1,  // You can replace with actual UUID from your manufacturers table
      requiresPrescription: "Yes",
      sideEffects: ["Nausea", "Rash", "Diarrhea"],
      contraindications: ["Allergy to Penicillin", "Pregnancy"],
      usageInstructions: "Take orally every 8 hours with food.",
      stockQuantity: 150,
      pricePerUnit: 0.75,
      expirationDate: new Date("2026-05-01"),
      storageConditions: "Store below 25°C, keep away from sunlight",
      barcode: "1234567890123",
      batchNumber: "AMX202507",
      status: "Available"
    };

    const newMedicament = await Medicament.create(dummyData);
    console.log("Dummy Medicament created:", newMedicament.toJSON());
    return newMedicament;
  } catch (error) {
    console.error("Error creating dummy Medicament:", error);
  }
};

module.exports.createDummyMedicament = createDummyMedicament;