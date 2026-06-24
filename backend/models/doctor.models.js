
    
var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');
    
    var Doctor = sequelize.define("doctor", {
      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "Full name of the doctor",
      },
      licenseNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false, // Ensures license numbers are unique
      },
      specialization: {
        type: Sequelize.ENUM(
          "General Dentist",
          "Orthodontist",
          "Periodontist",
          "Endodontist",
          "Prosthodontist"
        ),
        allowNull: false,
      },
      experienceYears: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      consultationFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      availableDays: {
        type: Sequelize.ARRAY(Sequelize.STRING), // Stores an array of available days
        allowNull: false,
      },
      availableTimeSlots: {
        type: Sequelize.JSONB, // Stores an array of objects with startTime and endTime
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        validate: { min: 1, max: 5 }, // Ensures rating is between 1-5
        defaultValue: 0, // Default rating is 0 until reviews are added
      },
      reviews: {
        type: Sequelize.JSONB, // Stores an array of review objects
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
     * Insert dummy doctors for testing/demo purposes.
     */
    Doctor.insertDummyDoctors = async function() {
      const dummyDoctors = [
        {

          fullName: "Dr. Sarah Lee",
          licenseNumber: "DENT-2025001",
          specialization: "General Dentist",
          experienceYears: 8,
          consultationFee: 75.00,
          availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          availableTimeSlots: [
            { startTime: "09:00", endTime: "12:00" },
            { startTime: "14:00", endTime: "18:00" }
          ],
          rating: 4.7,
          reviews: [
            {
              patientId: "22222222-bbbb-cccc-dddd-222222222222",
              rating: 5,
              comment: "Very professional and friendly.",
              reviewDate: "2025-07-01T10:00:00Z"
            }
          ]
        },
        {

          fullName: "Dr. Ahmed Patel",
          licenseNumber: "ORTHO-2025002",
          specialization: "Orthodontist",
          experienceYears: 12,
          consultationFee: 120.00,
          availableDays: ["Monday", "Wednesday", "Friday"],
          availableTimeSlots: [
            { startTime: "10:00", endTime: "13:00" }
          ],
          rating: 4.9,
          reviews: [
            {
              patientId: "44444444-dddd-eeee-ffff-444444444444",
              rating: 5,
              comment: "Great with kids and very thorough.",
              reviewDate: "2025-07-02T11:30:00Z"
            }
          ]
        }
      ];
      return await Doctor.bulkCreate(dummyDoctors);
    };
    
    module.exports = Doctor;
module.exports.insertDummyDoctors = Doctor.insertDummyDoctors;