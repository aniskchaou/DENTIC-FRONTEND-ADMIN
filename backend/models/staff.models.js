


    var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');

const Staff = sequelize.define("staff", {

  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Full name of the staff member",
  },
  role: {
    type: DataTypes.ENUM("Admin", "Dentist", "Assistant", "Receptionist", "Accountant"),
    allowNull: false,
    comment: "Role of the staff member in the clinic",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    comment: "Email address of the staff member",
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Phone number of the staff member",
  },
  shiftSchedule: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: "Schedule for the staff member for each day of the week",
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    comment: "List of permissions assigned to the staff member",
  },
  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Active",
    comment: "Status of the staff member",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the staff record was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the staff record was last updated",
  },
});



module.exports = Staff;

const { v4: uuidv4 } = require('uuid');

const createDummyStaff = async () => {
  try {
    const dummyData = {
      fullName: "Alice Johnson",
      role: "Dentist",
      email: "alice.johnson@example.com",
      phone: "+1-555-123-4567",
      shiftSchedule: {
        Monday: "09:00-17:00",
        Tuesday: "09:00-17:00",
        Wednesday: "09:00-17:00",
        Thursday: "09:00-17:00",
        Friday: "09:00-17:00",
        Saturday: null,
        Sunday: null,
      },
      permissions: ["view_patients", "edit_appointments", "perform_operations"],
      status: "Active",
    };

    const newStaff = await Staff.create(dummyData);
    console.log("Dummy Staff created:", newStaff.toJSON());
    return newStaff;
  } catch (error) {
    console.error("Error creating dummy Staff:", error);
  }
};

module.exports.createDummyStaff = createDummyStaff;
  