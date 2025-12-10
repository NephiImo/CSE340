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

    const classificationSelect = await utilities.buildClassificationList();

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (err) {
    next(err);
  }
}

/* *******************************
 * Build Add Classification View
 *********************************/
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: ""
  })
}

/* *******************************
 * Build Add Inventory View
 *********************************/
async function buildAddInventory(req, res, next) {
  try {
    const nav = await utilities.getNav();
    let classificationList = "";
    try {
      classificationList = await utilities.buildClassificationList();
    } catch (err) {
      console.error("buildAddInventory: buildClassificationList failed:", err);
      classificationList = '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>';
    }

    res.render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      classificationList,
      classification_id: "",
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_price: "",
      inv_miles: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image.png",
      inv_color: "",
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

/* *******************************
 * Process Add Classification
 *********************************/
async function addClassification(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    // New classification was added successfully
    nav = await utilities.getNav() // Refresh nav so new item appears instantly

    req.flash("notice", "New classification added successfully!")
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    // Failed insertion
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    })
  }
}

/* *******************************
 * Process Add Inventory
 *********************************/
async function addInventory(req, res, next) {
  try {
    console.log("DEBUG addInventory - req.body:", req.body);

    // Check express-validator result (should normally be handled by middleware, but double-check)
    const { validationResult } = require("express-validator");
    const vres = validationResult(req);
    console.log("DEBUG addInventory - validationResult:", vres.isEmpty(), vres.array());

    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body;

    // Convert and sanitize numeric fields as necessary
    const item = {
      classification_id: Number(classification_id),
      inv_make: inv_make?.trim(),
      inv_model: inv_model?.trim(),
      inv_description: inv_description?.trim(),
      inv_image: inv_image?.trim(),
      inv_thumbnail: inv_thumbnail?.trim(),
      inv_price: Number(inv_price),
      inv_year: String(inv_year).trim(),
      inv_miles: Number(inv_miles),
      inv_color: inv_color?.trim(),
    };

    console.log("DEBUG addInventory - normalized item:", item);

    // Insert into DB
    const added = await invModel.addInventoryItem(item);
    console.log("DEBUG addInventory - model returned:", !!added);

    if (added) {
      // Success: refresh nav so new item appears immediately
      const nav = await utilities.getNav();
      req.flash("notice", `Vehicle "${item.inv_make} ${item.inv_model} (${item.inv_year})" added successfully.`);
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
      });
    }

    // Fallback (shouldn't normally be reached if model throws on error)
    const classificationList = await utilities.buildClassificationList(classification_id);
    const nav = await utilities.getNav();
    req.flash("notice", "Sorry, adding the vehicle failed.");
    return res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors: null,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_image,
      inv_thumbnail,
      inv_color,
    });
  } catch (err) {
    // Log the real error and show friendly failure in the add-inventory view
    console.error("addInventory caught error:", err);

    // Re-render the add-inventory page with sticky values and the DB error as a notice
    try {
      const classificationList = await utilities.buildClassificationList(req.body.classification_id);
      const nav = await utilities.getNav();
      req.flash("notice", "Sorry, adding the vehicle failed. See server logs for details.");
      return res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory Item",
        nav,
        errors: null,
        classificationList,
        classification_id: req.body.classification_id,
        inv_make: req.body.inv_make,
        inv_model: req.body.inv_model,
        inv_year: req.body.inv_year,
        inv_description: req.body.inv_description,
        inv_price: req.body.inv_price,
        inv_miles: req.body.inv_miles,
        inv_image: req.body.inv_image,
        inv_thumbnail: req.body.inv_thumbnail,
        inv_color: req.body.inv_color,
      });
    } catch (renderErr) {
      // If render fails, pass original error to global handler
      next(err);
    }
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id, 10);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if (Array.isArray(invData) && invData.length > 0) {
      return res.json(invData);
    } else {
      // return empty array (safer) or next(new Error("No data returned"))
      return res.json([]);
    }
  } catch (error) {
    next(error);
  }
};


module.exports = {
  // functions defined on invCont
  buildByClassificationId: invCont.buildByClassificationId,
  buildDetail: invCont.buildDetail,
  throwError: invCont.throwError,
  getInventoryJSON: invCont.getInventoryJSON,
  // top-level functions
  buildManagement,
  buildAddClassification,
  buildAddInventory,
  addClassification,
  addInventory,
};