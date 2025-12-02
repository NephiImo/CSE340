const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* Rules */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 }).withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Letters and numbers only. No spaces or special characters.")
  ]
}

/* Check validation results */
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

module.exports = invValidate