const router = require("express").Router();
const controller = require("../controllers/company.controller");

router.post("/create/", controller.createCompany);
router.get("/get/", controller.getCompanies);

module.exports = router;
