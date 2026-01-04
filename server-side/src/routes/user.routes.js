const router = require("express").Router();
const controller = require("../controllers/user.controller");

router.post("/create/", controller.createUser);
router.get("/get/", controller.getUsers);

module.exports = router;

