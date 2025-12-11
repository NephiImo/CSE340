const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* Validation Rules for add-classification */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 }).withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Letters and numbers only. No spaces or special characters.")
  ]
}

/* Validation Rules for add-inventory */
invValidate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters."),

    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number greater than 0."),

    body("inv_year")
      .trim()
      .matches(/^[0-9]{4}$/)
      .withMessage("Year must be a 4-digit year (e.g. 2020)."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be an integer >= 0."),

    body("inv_color")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Color must be at least 2 characters."),
  ];
};


/* Check validation results for add-classification */
invValidate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  const { classification_name } = req.body
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
      classification_name
    })
  }
  next()
}

/* Check validation results for add-inventory */
invValidate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const {
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
  } = req.body;

  if (!errors.isEmpty()) {
    // build classification select with the chosen value selected
    let classificationList = "";
    try {
      classificationList = await utilities.buildClassificationList(classification_id);
    } catch (err) {
      console.error("classificationList build failed:", err);
      // fallback empty select
      classificationList = '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>';
    }

    let nav = await utilities.getNav();
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory Item",
      nav,
      errors,
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
  }

  next();
};


/* Check validation results for update-inventory (errors will be directed back to the edit view.)*/
invValidate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);

  const {
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
    inv_id,
  } = req.body;

  if (!errors.isEmpty()) {
    // build classification select with the chosen value selected
    let classificationSelect = "";
    try {
      classificationSelect = await utilities.buildClassificationList(classification_id);
    } catch (err) {
      console.error("classificationSelect build failed:", err);
      classificationSelect =
        '<select name="classification_id" id="classificationList" required><option value="">Choose a Classification</option></select>';
    }

    // build nav defensively
    let nav = "";
    try {
      nav = await utilities.getNav();
    } catch (navErr) {
      console.error("checkUpdateData: getNav failed:", navErr);
      nav = "";
    }

    // create a nicer title when possible
    const itemName =
      (inv_make && inv_model) ? `${inv_make} ${inv_model}` : "Inventory Item";

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors,
      classificationSelect,
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
      inv_id,
    });
  }

  next();
};


module.exports = invValidate;