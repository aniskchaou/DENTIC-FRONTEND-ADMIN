

    const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StaffSchedule = sequelize.define("staff_schedule", {

  staffId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the staff member",
  },
  clinicId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the clinic",
  },
  shiftType: {
    type: DataTypes.ENUM("Morning", "Afternoon", "Night", "Custom"),
    allowNull: false,
    comment: "Type of shift (Morning, Afternoon, Night, or Custom)",
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "Start time of the shift",
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: "End time of the shift",
  },
  status: {
    type: DataTypes.ENUM("Scheduled", "Completed", "Canceled"),
    defaultValue: "Scheduled",
    comment: "Status of the shift",
  },
  assignedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the admin who assigned the schedule",
  },
  lastUpdatedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: "Reference to the admin or manager who last updated the schedule",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the schedule was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the schedule was last updated",
  },
});

/* // Define relationships with other models
StaffSchedule.associate = models => {
  // A staff schedule is associated with a staff member
  StaffSchedule.belongsTo(models.Staff, { foreignKey: "staffId" });
  // A staff schedule is associated with a clinic
  StaffSchedule.belongsTo(models.Clinic, { foreignKey: "clinicId" });
  // A staff schedule is associated with the admin who assigned it
  StaffSchedule.belongsTo(models.Staff, { foreignKey: "assignedBy", as: "assignedByAdmin" });
  // A staff schedule is associated with the admin/manager who last updated it
  StaffSchedule.belongsTo(models.Staff, { foreignKey: "lastUpdatedBy", as: "lastUpdatedByAdmin" });
}; */

module.exports = StaffSchedule;

  