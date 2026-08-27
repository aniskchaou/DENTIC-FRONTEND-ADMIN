var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require("sequelize");

var StorageConfig = sequelize.define("storage_config", {
  provider: {
    type: DataTypes.ENUM("local", "gcs", "s3", "azure_blob"),
    allowNull: false,
    defaultValue: "local",
  },
  bucketName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  region: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accessKeyId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secretAccessKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Used for GCS",
  },
  localBasePath: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Used when provider = local",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = StorageConfig;
