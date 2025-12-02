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
router.get("/management",
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

// Process Add Classification
router.post(
  "/add-classification",
  invValidate.ClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

module.exports = router;