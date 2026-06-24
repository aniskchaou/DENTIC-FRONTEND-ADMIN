const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../db/init.sequelize.js");

const Settings = sequelize.define("settings", {
  system: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  dashboard: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  email: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  localisation: {
    type: DataTypes.JSON,
    allowNull: false,
  }
});

/**
 * Add settings data to the database.
 */
async function addSettingsData() {
  const data = {
    system: {
      appName: 'Dentic',
      address: '123 Dentic St',
      email: 'support@dentic.com',
      showLogo: false,
    },
    dashboard: {}, // Provide default or empty object if required by model
    email: {},     // Provide default or empty object if required by model
    localisation: {
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24',
      currency: 'USD',
    }
  };

  // Check if settings already exist
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    // If no settings exist, create new settings with the provided data
    await Settings.create(data);
    console.log('Default settings added to the database.');
  } else {
    console.log('Settings already exist in the database.');
  }
}

module.exports.Settings = Settings;
module.exports.addSettingsData = addSettingsData;