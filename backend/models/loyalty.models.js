


  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');

const LoyaltyProgram = sequelize.define("loyaltyProgram", {
  patientId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Reference to the patient in the loyalty program",
  },
  points: {
    type: DataTypes.STRING,
    defaultValue: "0",
    allowNull: false,
    comment: "Total points earned by the patient in the loyalty program",
  },
  earnedFrom: {
    type: DataTypes.TEXT, // Store JSON as string
    allowNull: false,
    comment: "List of activities that earned the patient points (JSON string)",
  },
  redeemedRewards: {
    type: DataTypes.TEXT, // Store JSON as string
    allowNull: true,
    comment: "List of rewards redeemed by the patient using loyalty points (JSON string)",
  }
});


/**
 * Insert a real LoyaltyProgram record.
 */
async function insertRealLoyaltyProgram() {
  const realData = {
    patientId: "987e6543-e21b-12d3-a456-426614174999",
    points: "150",
    earnedFrom: '[{"activity":"Appointment","pointsEarned":"50","date":"2025-05-01T10:00:00.000Z"},{"activity":"Referral","pointsEarned":"100","date":"2025-05-10T15:30:00.000Z"}]',
    redeemedRewards: '[{"rewardName":"Free Checkup","pointsUsed":"100","redeemedDate":"2025-05-15T09:00:00.000Z"}]'
    // createdAt and updatedAt will be handled by Sequelize if timestamps are enabled
  };

  return await LoyaltyProgram.create(realData);
}

/**
 * Insert dummy loyalty program records for testing/demo purposes.
 */
LoyaltyProgram.insertDummyLoyaltyPrograms = async function() {
  const dummyLoyaltyPrograms = [
    {
      patientId: "11111111-aaaa-bbbb-cccc-111111111111",
      points: "200",
      earnedFrom: JSON.stringify([
        { activity: "Appointment", pointsEarned: "100", date: "2025-06-01T09:00:00.000Z" },
        { activity: "Review", pointsEarned: "50", date: "2025-06-10T14:00:00.000Z" },
        { activity: "Referral", pointsEarned: "50", date: "2025-06-15T11:30:00.000Z" }
      ]),
      redeemedRewards: JSON.stringify([
        { rewardName: "Discount", pointsUsed: "50", redeemedDate: "2025-06-20T10:00:00.000Z" }
      ])
    },
    {
      patientId: "22222222-bbbb-cccc-dddd-222222222222",
      points: "120",
      earnedFrom: JSON.stringify([
        { activity: "Appointment", pointsEarned: "70", date: "2025-07-01T10:00:00.000Z" },
        { activity: "Referral", pointsEarned: "50", date: "2025-07-05T16:00:00.000Z" }
      ]),
      redeemedRewards: JSON.stringify([
        { rewardName: "Free Checkup", pointsUsed: "100", redeemedDate: "2025-07-10T09:00:00.000Z" }
      ])
    },
    {
      patientId: "33333333-cccc-dddd-eeee-333333333333",
      points: "80",
      earnedFrom: JSON.stringify([
        { activity: "Appointment", pointsEarned: "80", date: "2025-07-03T12:00:00.000Z" }
      ]),
      redeemedRewards: null
    }
  ];
  return await LoyaltyProgram.bulkCreate(dummyLoyaltyPrograms);
};

module.exports = { LoyaltyProgram };
