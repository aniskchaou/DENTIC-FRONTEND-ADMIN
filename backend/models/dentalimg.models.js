
  var sequelize = require("../db/init.sequelize.js");
var Sequelize = require("sequelize");

var DentalImaging = sequelize.define("dental_imaging", {

  patientId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  imageType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING, // URL of the uploaded image
    allowNull: false,
  },
  diagnosisNotes: {
    type: Sequelize.TEXT, // Doctor's diagnosis or comments
    allowNull: true,
  },
  uploadDate: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Pending",
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
 * Insert dummy dental imaging records for testing/demo purposes.
 */
DentalImaging.insertDummyDentalImaging = async function() {
  const dummyImages = [
    {
      patientId: 1,
      doctorId: 2,
      imageType: "X-ray",
      imageUrl: "https://example.com/xray1.jpg",
      diagnosisNotes: "Possible caries detected on molar.",
      uploadDate: new Date("2025-07-01T09:00:00Z"),
      status: "Reviewed"
    }
  ];
  return await DentalImaging.bulkCreate(dummyImages);
};

module.exports = DentalImaging;
module.exports.insertDummyDentalImaging = DentalImaging.insertDummyDentalImaging;
