// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

/* ****************************************
 * Route to build vehicle detail view
 **************************************** */
router.get("/detail/:id", 
utilities.handleErrors(invController.buildDetail))

/* *******************************
 * Route to build management view
 ******************************* */
router.get("/inv",
utilities.handleErrors(invController.buildManagement))

/* ****************************************
 * Error Route
 * Assignment 3, Task 3
 **************************************** */
router.get(
  "/broken",
  utilities.handleErrors(invController.throwError)
)

// Route to add Classification View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Route to add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);


// Process Add Classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Process Add Inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;