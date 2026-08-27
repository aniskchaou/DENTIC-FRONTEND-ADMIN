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
    const bcrypt = require('bcrypt');
    for (const seed of userSeeds) {
      const existing = await User.findOne({ where: { username: seed.username } });
      if (!existing) {
        // new user: hash and insert
        await User.create({ ...seed, password: await bcrypt.hash(seed.password, 10) });
      } else if (!existing.password.startsWith('$2')) {
        // existing user has plain-text password: fix it
        await existing.update({ password: await bcrypt.hash(seed.password, 10) });
      }
    }
    console.log('Seed users added/updated successfully.');
  } catch (error) {
    console.error('Error adding seed users:', error);
  }
};


