var sequelize = require("../db/init.sequelize.js");
  var Sequelize = require("sequelize");
  
  var Clinic = sequelize.define("clinic", {
 
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    zipCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
      // validate: {
      //   isEmail: true,
      // },
    },
    workingHours: {
      type: Sequelize.JSONB, // Storing working hours as a JSON object
      allowNull: false,
    },
    doctorsAvailable: {
      type: Sequelize.ARRAY(Sequelize.UUID), // Storing an array of doctor IDs
      allowNull: true,
      // references: {
      //   model: "users", // Assuming doctors are in the User table
      //   key: "id",
      // },
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
   * Insert dummy clinics for testing/demo purposes.
   */
  Clinic.insertDummyClinics = async function() {
    const dummyClinics = [
      {
        name: "Downtown Dental Care",
        address: "123 Main St",
        city: "Metropolis",
        state: "Metro State",
        zipCode: "12345",
        country: "Countryland",
        contactNumber: "+1234567890",
        email: "downtown@dentalcare.com",
        workingHours: {
          monday: "08:00-17:00",
          tuesday: "08:00-17:00",
          wednesday: "08:00-17:00",
          thursday: "08:00-17:00",
          friday: "08:00-17:00",
          saturday: "09:00-13:00",
          sunday: "Closed"
        },
        doctorsAvailable: [
          "11111111-aaaa-bbbb-cccc-111111111111",
          "22222222-bbbb-cccc-dddd-222222222222"
        ]
      },
      {
        name: "Smile Bright Clinic",
        address: "456 Elm St",
        city: "Smallville",
        state: "Metro State",
        zipCode: "54321",
        country: "Countryland",
        contactNumber: "+1987654321",
        email: "smile@brightclinic.com",
        workingHours: {
          monday: "09:00-18:00",
          tuesday: "09:00-18:00",
          wednesday: "09:00-18:00",
          thursday: "09:00-18:00",
          friday: "09:00-18:00",
          saturday: "10:00-14:00",
          sunday: "Closed"
        },
        doctorsAvailable: [
          "33333333-cccc-dddd-eeee-333333333333"
        ]
      }
    ];
    return await Clinic.bulkCreate(dummyClinics);
  };
  
  module.exports = Clinic;
  module.exports.insertDummyClinics = Clinic.insertDummyClinics;
