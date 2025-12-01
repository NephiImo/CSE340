// src/controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data && data[0] ? data[0].classification_name : "Classification";
    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (err) {
    next(err);
  }
};

/* ***************************
 *  Build vehicle detail view
 *  Assignment 3, Task 1
 * ************************** */
invCont.buildDetail = async function (req, res, next) {
  try {
    const invId = req.params.id;
    let vehicle = await invModel.getInventoryById(invId);
    const htmlData = await utilities.buildSingleVehicleDisplay(vehicle);
    let nav = await utilities.getNav();
    const vehicleTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
    res.render("./inventory/detail", {
      title: vehicleTitle,
      nav,
      message: null,
      htmlData,
    });
  } catch (err) {
    next(err);
  }
};

/* *******************************
 *  Build inventory management view
 * ***************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
}

/* ****************************************
 *  Process intentional error
 *  Assignment 3, Task 3
 * ************************************ */
invCont.throwError = async function (req, res, next) {
  try {
    throw new Error("I am an intentional error");
  } catch (err) {
    next(err);
  }
};

// Export: spread invCont so routes can call invController.buildDetail, etc.
module.exports = { ...invCont, buildManagement };
