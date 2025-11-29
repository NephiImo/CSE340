/* **********************************
* Account Controller
* Unit 4, process registration activity                                      
* ********************************* */  
const accountModel = require("../models/account-model")

/* **********************************
* Account Controller
* Unit 4, deliver login view activity                                      
* ********************************* */
const utilities = require("../utilities")

/* ****************************************
* Deliver login view
* Unit 4, deliver login view activity                                      
**************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
* Deliver registration view
**************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      // repopulate submitted values so the user doesn't lose what they typed
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }