var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var Room = sequelize.define("room", {
  clinicId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false, comment: "e.g. Chair 1, Room A" },
  type: { type: DataTypes.ENUM("chair", "room", "lab", "xray", "consult"), defaultValue: "chair" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  notes: { type: DataTypes.STRING, allowNull: true },
  color: { type: DataTypes.STRING, defaultValue: "#4caf50" },
});

module.exports = Room;
