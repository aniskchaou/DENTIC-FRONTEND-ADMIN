var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

const Telemedicine = sequelize.define("telemedicine", {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the patient",
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Reference to the doctor",
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "URL for the video call meeting",
  },
  sessionDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Duration of the session in minutes",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Scheduled",
    comment: "Status of the telemedicine session",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the telemedicine session was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the telemedicine session was last updated",
  },
});

module.exports = Telemedicine;

async function insertDummyTelemedicine() {
  const dummyTelemedicine = {
    patientId: 1,
    doctorId: 2,
    meetingLink: "https://meet.example.com/session/123456",
    sessionDuration: 30,
    status: "Scheduled",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  return await Telemedicine.create(dummyTelemedicine);
}
module.exports.insertDummyTelemedicine = insertDummyTelemedicine;
