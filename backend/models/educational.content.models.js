var sequelize = require("../db/init.sequelize.js");
var { DataTypes } = require("sequelize");

const EducationalContent = sequelize.define("educational_content", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM("procedure", "hygiene", "prevention", "faq", "aftercare", "general"),
    defaultValue: "general",
  },
  contentType: {
    type: DataTypes.ENUM("article", "video", "infographic", "pdf"),
    defaultValue: "article",
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  relatedProcedures: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  readingTimeMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clinicId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = EducationalContent;
