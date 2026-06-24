

  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const InventoryItem = sequelize.define("inventoryItem", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM("Dental Tools", "Medications", "Consumables", "Equipment"),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "piece",
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reorderLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5, // Minimum stock threshold before reordering
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true, // Only applicable for medications/consumables
  },
  status: {
    type: DataTypes.ENUM("In Stock", "Low Stock", "Out of Stock"),
    allowNull: false,
    defaultValue: "In Stock",
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

InventoryItem.insertDummyInventory = async function () {
  const dummyInventory = [
    {
      name: "Dental Mirror",
      category: "Dental Tools",
      quantity: 50,
      unit: "piece",
      supplierId: null,
      clinicId: 1,
      reorderLevel: 10,
      expiryDate: null,
      status: "In Stock"
    },
    {
      name: "Amoxicillin",
      category: "Medications",
      quantity: 100,
      unit: "box",
      supplierId: null,
      clinicId: 1,
      reorderLevel: 20,
      expiryDate: new Date("2026-01-01"),
      status: "In Stock"
    },
    {
      name: "Latex Gloves",
      category: "Consumables",
      quantity: 200,
      unit: "pack",
      supplierId: null,
      clinicId: 1,
      reorderLevel: 30,
      expiryDate: new Date("2025-12-31"),
      status: "Low Stock"
    },
    {
      name: "X-Ray Machine",
      category: "Equipment",
      quantity: 2,
      unit: "piece",
      supplierId: null,
      clinicId: 1,
      reorderLevel: 1,
      expiryDate: null,
      status: "In Stock"
    }
  ];
  return await InventoryItem.bulkCreate(dummyInventory);
};

module.exports = InventoryItem;
module.exports.insertDummyInventory = InventoryItem.insertDummyInventory;

