const router = require("express").Router();
const routeName = "/anomologita";
const anomologita = require("../controllers/anomologitaController");

// Anomologita ROUTE
router.post("/", anomologita.createAnomologito);

router.put("/", anomologita.updateAnomologito);

router.get("/getAll", anomologita.getAllAnomologita);

router.get("/:id", anomologita.getAnomologita);

module.exports = { routeName, router };
