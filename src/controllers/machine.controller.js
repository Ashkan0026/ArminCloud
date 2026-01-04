const { Machine, Company, User } = require("../models");

exports.createMachine = async (req, res) => {
  try {
    const { memorySize, diskSize } = req.body;

    if (!memorySize || !diskSize) {
      return res.status(400).json({
        message: "memorySize and diskSize are required"
      });
    }

    const machine = await Machine.create({
      memorySize,
      diskSize
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Assign or change company/admin */
exports.assignMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, adminId } = req.body;

    const machine = await Machine.findByPk(id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    if (companyId !== undefined) {
      machine.companyId = companyId;
    }

    if (adminId !== undefined) {
      machine.adminId = adminId;
    }

    await machine.save();

    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll({
      include: [
        { model: Company },
        { model: User, as: "admin", attributes: ["id", "name", "email"] }
      ]
    });

    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
