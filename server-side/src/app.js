const express = require("express");
const app = express();

app.use(express.json());

app.use("/companies", require("./routes/company.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/machines", require("./routes/machine.routes"));

module.exports = app;
