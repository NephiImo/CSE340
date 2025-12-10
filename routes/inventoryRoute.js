const express = require("express");
const router = express.Router();

const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities");

// simple async wrapper (use your real utilities.handleErrors if you prefer)
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function assertHandler(fn, name) {
  if (typeof fn !== "function") {
    throw new Error(`inventoryRoute.js expected handler "${name}" to be a function but got ${typeof fn}. Check controller export or spelling.`);
  }
  return asyncHandler(fn);
}

/* Routes */

// Route to build inventory by classification view
router.get("/type/:classificationId", assertHandler(invController.buildByClassificationId, "buildByClassificationId"));

// Route to build vehicle detail view
router.get("/detail/:id", assertHandler(invController.buildDetail, "buildDetail"));

// Route to build management view (mounted at /inv in server.js)
router.get("/", assertHandler(invController.buildManagement, "buildManagement"));

// Error route
router.get("/broken", assertHandler(invController.throwError, "throwError"));

// Add classification view
router.get("/add-classification", assertHandler(invController.buildAddClassification, "buildAddClassification"));

// Add inventory view
router.get("/add-inventory", assertHandler(invController.buildAddInventory, "buildAddInventory"));

// Return inventory JSON for a classification (AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);


// Process Add Classification
router.post("/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  assertHandler(invController.addClassification, "addClassification")
);

// Process Add Inventory
router.post("/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  assertHandler(invController.addInventory, "addInventory")
);

module.exports = router;
