const app = require("./app");
const { sequelize, Role } = require("./models");

(async () => {
  try {
    await sequelize.sync({ alter: true });

    await Role.findOrCreate({ where: { name: "super_admin" } });
    await Role.findOrCreate({ where: { name: "admin" } });
    await Role.findOrCreate({ where: { name: "user" } });

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
})();
