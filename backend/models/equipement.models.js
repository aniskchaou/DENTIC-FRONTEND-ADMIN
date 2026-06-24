

  var sequelize = require("../db/init.sequelize.js");
var Sequelize = require("sequelize");

var EquipmentMaintenance = sequelize.define("equipment_maintenance", {

  clinicId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    // references: {
    //   model: "clinics", // Assuming clinics are stored in a table
    //   key: "id",
    // },
  },
  equipmentName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  modelNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  manufacturer: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  purchaseDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  lastServiceDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  nextServiceDue: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Operational",
  },
  assignedTechnician: {
    type: Sequelize.STRING,
    allowNull: false,
    // references: {
    //   model: "technicians", // Assuming technicians are stored in a table
    //   key: "id",
    // },
  },
  maintenanceNotes: {
    type: Sequelize.TEXT,
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

/**
 * Insert dummy equipment maintenance records for testing/demo purposes.
 */
EquipmentMaintenance.insertDummyEquipment = async function() {
  const dummyEquipment = [
    {
      clinicId: 1,
      equipmentName: "Dental X-Ray Machine",
      modelNumber: "DXR-2025",
      manufacturer: "DentalTech",
      purchaseDate: new Date("2022-01-15"),
      lastServiceDate: new Date("2025-06-01"),
      nextServiceDue: new Date("2025-12-01"),
      status: "Operational",
      assignedTechnician: "",
      maintenanceNotes: "Last serviced in June 2025. No issues found."
    },
    {
      clinicId: 3,
      equipmentName: "Autoclave Sterilizer",
      modelNumber: "AUTO-9000",
      manufacturer: "SterilPro",
      purchaseDate: new Date("2023-03-10"),
      lastServiceDate: new Date("2025-05-20"),
      nextServiceDue: new Date("2025-11-20"),
      status: "Under Maintenance",
      assignedTechnician: "",
      maintenanceNotes: "Heating element replaced. Monitoring performance."
    },
    {
      clinicId: 1,
      equipmentName: "Dental Chair",
      modelNumber: "CHAIR-X1",
      manufacturer: "ChairMakers",
      purchaseDate: new Date("2021-08-05"),
      lastServiceDate: new Date("2025-04-15"),
      nextServiceDue: new Date("2025-10-15"),
      status: "Needs Replacement",
      assignedTechnician: "",
      maintenanceNotes: "Hydraulic system leaking. Replacement recommended."
    }
  ];
  return await EquipmentMaintenance.bulkCreate(dummyEquipment);
}

module.exports = EquipmentMaintenance;
module.exports.insertDummyEquipment = EquipmentMaintenance.insertDummyEquipment;
