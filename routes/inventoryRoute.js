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
router.get("/", utilities.checkAccountType, assertHandler(invController.buildManagement, "buildManagement"));

// Error route
router.get("/broken", assertHandler(invController.throwError, "throwError"));

// Add classification view
router.get("/add-classification", utilities.checkAccountType, assertHandler(invController.buildAddClassification, "buildAddClassification"));

// Add inventory view
router.get("/add-inventory", utilities.checkAccountType, assertHandler(invController.buildAddInventory, "buildAddInventory"));

// Return inventory JSON for a classification (AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.editInventoryView)
);

// Process Edit Inventory
router.post(
  "/update/",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Process Add Classification
router.post("/add-classification",
  utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  assertHandler(invController.addClassification, "addClassification")
);

// Process Add Inventory
router.post("/add-inventory",
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  assertHandler(invController.addInventory, "addInventory")
);

router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteView)
)

/* ****************************************
 * Process the delete inventory request
 * Unit 5, Delete Activity
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post("/delete", 
utilities.checkAccountType, 
utilities.handleErrors(invController.deleteItem)
)


module.exports = router;
