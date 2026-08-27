var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

const PostTreatmentSurvey = sequelize.define("post_treatment_survey", {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  treatmentType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  overallRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // 1-5
  },
  painLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // 0-10
  },
  recoveryRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // 1-5
  },
  staffRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // 1-5
  },
  wouldRecommend: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  concerns: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  followUpNeeded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "expired"),
    defaultValue: "pending",
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});

module.exports = PostTreatmentSurvey;
