module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Machine", {
    memorySize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Memory size in MB"
    },
    diskSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Disk size in GB"
    }
  });
};
