

var sequelize = require("../db/init.sequelize.js");
var { Sequelize, DataTypes } = require('sequelize');


const MedicamentManufacture = sequelize.define("medicamentManufacture", {

  name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "e.g., Pfizer, Johnson & Johnson, GlaxoSmithKline"
  },
  contactPerson: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Contact person details including full name, phone, and email",
    get() {
      const value = this.getDataValue('contactPerson');
      return value ? value : { fullName: null, phone: null, email: null }; // default value
    },
    set(value) {
      this.setDataValue('contactPerson', value);
    }
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "Address of the manufacturer including street, city, state, postalCode, and country",
    get() {
      const value = this.getDataValue('address');
      return value ? value : { street: null, city: null, state: null, postalCode: null, country: null }; // default value
    },
    set(value) {
      this.setDataValue('address', value);
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Phone number of the manufacturer"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Email address of the manufacturer"
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Website URL of the manufacturer"
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Regulatory approval/license ID"
  },
  certifications: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of certifications like FDA Approved, GMP Certified"
  },
  medicamentsSupplied: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of medicaments supplied by the manufacturer",
    get() {
      const value = this.getDataValue('medicamentsSupplied');
      return value ? value : [];
    },
    set(value) {
      this.setDataValue('medicamentsSupplied', value);
    }
  },
  contractStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  contractEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: "Status of the manufacturer contract"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = MedicamentManufacture;

const createDummyMedicamentManufacture = async () => {
  try {
    const dummyData = {
      name: "Pfizer",
      contactPerson: {
        fullName: "John Doe",
        phone: "+1-202-555-0147",
        email: "john.doe@pfizer.com"
      },
      address: {
        street: "123 Pharma St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA"
      },
      phone: "+1-202-555-0123",
      email: "contact@pfizer.com",
      website: "https://www.pfizer.com",
      licenseNumber: "FDA123456",
      certifications: ["FDA Approved", "GMP Certified"],
      medicamentsSupplied: [
        { name: "Vaccine A", batchNumber: "VA2025" },
        { name: "Painkiller B", batchNumber: "PB2025" }
      ],
      contractStartDate: new Date("2023-01-01"),
      contractEndDate: new Date("2026-12-31"),
      status: "Active"
    };

    const newManufacture = await MedicamentManufacture.create(dummyData);
    console.log("Dummy MedicamentManufacture created:", newManufacture.toJSON());
    return newManufacture;
  } catch (error) {
    console.error("Error creating dummy MedicamentManufacture:", error);
  }
};

module.exports.createDummyMedicamentManufacture = createDummyMedicamentManufacture;
