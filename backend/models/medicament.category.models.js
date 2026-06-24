var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const MedicamentCategory = sequelize.define("medicamentCategory", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "e.g., Antibiotics, Painkillers, Anesthetics, Anti-inflammatory, Mouthwash"
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Details about this category and its use cases"
  },
  // We'll use a JSONB column to store the array of medicaments
  medicaments: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of medicaments under this category"
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
 * Insert dummy medicament categories for testing/demo purposes.
 */
MedicamentCategory.insertDummyCategories = async function() {
  const dummyCategories = [
    {
      name: "Antibiotics",
      description: "Used to treat bacterial infections.",
      medicaments: [
        { medicamentId: "11111111-aaaa-bbbb-cccc-111111111111", medicamentName: "Amoxicillin" },
        { medicamentId: "11111111-aaaa-bbbb-cccc-222222222222", medicamentName: "Clindamycin" }
      ]
    },
    {
      name: "Painkillers",
      description: "Used to relieve pain.",
      medicaments: [
        { medicamentId: "22222222-aaaa-bbbb-cccc-111111111111", medicamentName: "Ibuprofen" },
        { medicamentId: "22222222-aaaa-bbbb-cccc-222222222222", medicamentName: "Paracetamol" }
      ]
    },
    {
      name: "Mouthwash",
      description: "Used for oral hygiene and to reduce oral bacteria.",
      medicaments: [
        { medicamentId: "33333333-aaaa-bbbb-cccc-111111111111", medicamentName: "Chlorhexidine" }
      ]
    }
  ];
  return await MedicamentCategory.bulkCreate(dummyCategories);
};

module.exports = MedicamentCategory;
