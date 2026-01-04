const router = require("express").Router();
const controller = require("../controllers/machine.controller");

router.post("/create/", controller.createMachine);
router.get("/get/", controller.getMachines);
router.patch("/:id/assign", controller.assignMachine);

module.exports = router;
