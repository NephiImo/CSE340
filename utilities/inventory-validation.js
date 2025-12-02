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
      .isLength({ min: 2 })
      .withMessage("Please provide a make with at least 2 characters."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim()
      .matches(/^[0-9]{4}$/)
      .withMessage("Please provide a 4-digit year."),
    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Please provide a description of at least 10 characters."),
    body("inv_price")
      .trim()
      .isFloat({ gt: 0 })
      .withMessage("Please provide a price greater than 0."),
    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage (0 or greater)."),
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),
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
  } = req.body;

  if (!errors.isEmpty()) {
    // Build classification select list with the previously chosen classification selected
    let classificationList = await utilities.buildClassificationList(classification_id);

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
    });
  }
  next();
};


module.exports = invValidate;