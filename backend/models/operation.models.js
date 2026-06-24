

var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Operation = sequelize.define("operation", {

  operationType: {
    type: DataTypes.ENUM("Surgical", "Non-Surgical"),
    allowNull: false,
    comment: "Type of the operation (Surgical or Non-Surgical)"
  },
  procedureName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Name of the procedure being performed (e.g., Root Canal, Tooth Extraction)"
  },
  operationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "The date and time when the operation is scheduled or was performed"
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Estimated duration of the operation in minutes"
  },
  anesthesiaType: {
    type: DataTypes.ENUM("Local", "General", "None"),
    allowNull: false,
    comment: "Type of anesthesia used during the operation"
  },
  complications: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Complications encountered during the operation (if any)"
  },
  postOperationInstructions: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Instructions provided to the patient after the operation"
  },
  followUpRequired: {
    type: DataTypes.ENUM("Yes", "No"),
    allowNull: false,
    comment: "Whether a follow-up is required after the operation"
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: "Date and time for follow-up if applicable"
  },
  status: {
    type: DataTypes.ENUM("Scheduled", "Completed", "Canceled"),
    allowNull: false,
    comment: "Current status of the operation"
  }
});



module.exports = Operation;


const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const createDummyOperation = async () => {
  try {
    const dummyData = {
      operationType: "Surgical",
      procedureName: "Tooth Extraction",
      operationDate: new Date("2025-07-10T09:30:00Z"),
      duration: 45,
      anesthesiaType: "Local",
      complications: "None reported",
      postOperationInstructions: "Avoid solid foods for 24 hours. Take antibiotics as prescribed.",
      followUpRequired: "Yes",
      followUpDate: new Date("2025-07-17T09:30:00Z"),
      status: "Completed"
    };

    const newOperation = await Operation.create(dummyData);
    console.log("Dummy Operation created:", newOperation.toJSON());
    return newOperation;
  } catch (error) {
    console.error("Error creating dummy Operation:", error);
  }
};

module.exports.createDummyOperation = createDummyOperation;