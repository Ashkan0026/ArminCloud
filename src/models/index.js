const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("./Role")(sequelize, DataTypes);
const Company = require("./Company")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);

Role.hasMany(User, {
  foreignKey: {
    name: "roleId",
    allowNull: false
  }
});

User.belongsTo(Role, {
  foreignKey: {
    name: "roleId",
    allowNull: false
  }
});

Company.hasMany(User, {
  foreignKey: {
    name: "companyId",
    allowNull: false
  }
});

User.belongsTo(Company, {
  foreignKey: {
    name: "companyId",
    allowNull: false
  }
});

module.exports = {
  sequelize,
  Role,
  Company,
  User
};
