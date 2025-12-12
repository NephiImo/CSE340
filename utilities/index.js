const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Build the vehicle detail HTML
 * Assignment 3, Task 1
 **************************************** */
Util.buildSingleVehicleDisplay = async (vehicle) => {
  let svd = '<section id="vehicle-display">'
  svd += "<div>"
  svd += '<section class="imagePrice">'
  svd +=
    "<img src='" +
    vehicle.inv_image +
    "' alt='Image of " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " on cse motors' id='mainImage'>"
  svd += "</section>"
  svd += '<section class="vehicleDetail">'
  svd += "<h3> " + vehicle.inv_make + " " + vehicle.inv_model + " Details</h3>"
  svd += '<ul id="vehicle-details">'
  svd +=
    "<li><h4>Price: $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</h4></li>"
  svd += "<li><h4>Description:</h4> " + vehicle.inv_description + "</li>"
  svd += "<li><h4>Color:</h4> " + vehicle.inv_color + "</li>"
  svd +=
    "<li><h4>Miles:</h4> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>"
  svd += "</ul>"
  svd += "</section>"
  svd += "</div>"
  svd += "</section>"
  return svd
}

/* *************************************
 * Build the classification select list
 * returns a full <select>...</select> string
 * accepts an optional classification_id to mark as selected
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
  // data.rows expected (matches your getNav usage)
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += '<option value="">Choose a Classification</option>'

  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += ' selected'
    }
    classificationList += '>' + row.classification_name + '</option>'
  })

  classificationList += '</select>'
  return classificationList
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    console.log("JWT VERIFY: decoded accountData =>", accountData);
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Assignment 5 - Task 2
 * Middleware: allow only Employee or Admin
 **************************************** */
console.log("AUTH CHECK: res.locals.accountData =>", res.locals.accountData);

Util.checkAccountType = (req, res, next) => {
  try {
    // Ensure the JWT middleware ran and set res.locals.accountData
    const acct = res.locals.accountData;
    if (!acct) {
      req.flash("notice", "Please log in to access that page.");
      return res.redirect("/account/login");
    }

    const acctType = (acct.account_type || "").toString();

    // allow exactly Employee or Admin (case-insensitive)
    if (acctType.toLowerCase() === "employee" || acctType.toLowerCase() === "admin") {
      return next();
    }

    // unauthorized
    console.warn(
      `Authorization failure: account_id=${acct.account_id} account_type=${acct.account_type}`
    );
    req.flash("notice", "You are not authorized to view that page.");
    return res.redirect("/account/login");
  } catch (err) {
    // unexpected error — forward to global error handler
    next(err);
  }
};

module.exports = Util 