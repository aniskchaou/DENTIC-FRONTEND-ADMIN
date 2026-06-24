
var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Procedure = sequelize.define("procedure", {

  procedureName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Name of the procedure (e.g., Root Canal, Dental Implant)",
  },
  procedureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "Date when the procedure was performed",
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "Estimated duration in minutes",
  },
  anesthesiaType: {
    type: DataTypes.ENUM("Local", "General", "None"),
    allowNull: true,
    comment: "Type of anesthesia used",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: "Additional details about the procedure",
  },
  status: {
    type: DataTypes.ENUM("Scheduled", "Completed", "Canceled"),
    defaultValue: "Scheduled",
    comment: "Status of the procedure",
  }
});

module.exports = Procedure;


const { v4: uuidv4 } = require('uuid');

const createDummyProcedure = async () => {
  try {
    const dummyData = {
      procedureName: "Root Canal",
      procedureDate: new Date("2025-07-12T10:00:00Z"),
      duration: 90,
      anesthesiaType: "Local",
      notes: "Procedure went smoothly with no complications.",
      status: "Completed"
    };

    const newProcedure = await Procedure.create(dummyData);
    console.log("Dummy Procedure created:", newProcedure.toJSON());
    return newProcedure;
  } catch (error) {
    console.error("Error creating dummy Procedure:", error);
  }
};

module.exports.createDummyProcedure = createDummyProcedure;
