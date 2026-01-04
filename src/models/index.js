const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Role = require("./Role")(sequelize, DataTypes);
const Company = require("./Company")(sequelize, DataTypes);
const User = require("./User")(sequelize, DataTypes);
const Machine = require("./Machine")(sequelize, DataTypes);

/* User ↔ Role */
Role.hasMany(User, {
  foreignKey: { name: "roleId", allowNull: false }
});
User.belongsTo(Role, {
  foreignKey: { name: "roleId", allowNull: false }
});

/* User ↔ Company */
Company.hasMany(User, {
  foreignKey: { name: "companyId", allowNull: false }
});
User.belongsTo(Company, {
  foreignKey: { name: "companyId", allowNull: false }
});

/* Company ↔ Machine (OPTIONAL) */
Company.hasMany(Machine, {
  foreignKey: { name: "companyId", allowNull: true }
});
Machine.belongsTo(Company, {
  foreignKey: { name: "companyId", allowNull: true }
});

/* Admin(User) ↔ Machine (OPTIONAL) */
User.hasMany(Machine, {
  foreignKey: { name: "adminId", allowNull: true }
});
Machine.belongsTo(User, {
  as: "admin",
  foreignKey: { name: "adminId", allowNull: true }
});

module.exports = {
  sequelize,
  Role,
  Company,
  User,
  Machine
};
