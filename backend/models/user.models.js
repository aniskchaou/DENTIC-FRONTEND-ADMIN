var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');

var User = sequelize.define("user", {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  fullName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  dateOfBirth: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Active",
  }
});


module.exports = User;

User.addSeedUsers = async function(userSeeds) {
  try {
    await User.bulkCreate(userSeeds, { ignoreDuplicates: true });
    console.log('Seed users added successfully.');
  } catch (error) {
    console.error('Error adding seed users:', error);
  }
};


