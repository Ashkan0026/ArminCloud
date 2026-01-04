const router = require("express").Router();
const controller = require("../controllers/company.controller");

router.post("/", controller.createCompany);
router.get("/", controller.getCompanies);

module.exports = router;
