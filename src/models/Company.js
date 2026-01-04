module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Company", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
