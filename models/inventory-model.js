const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory and classification data by inv_id
 * *************************** */
async function getInventoryById(invId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [invId]
    )
    return data.rows[0]
  } catch (error) {
    console.error(error)
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification
      (classification_name)
      VALUES ($1)
      RETURNING *;`
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("Add Classification Error:", error)
    return false
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
// src/models/inventory-model.js
const pool = require("../database/dbConnection"); // adapt to your project

async function addInventoryItem(item) {
  const sql = `INSERT INTO inventory
    (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;`;
  const values = [
    item.classification_id,
    item.inv_make,
    item.inv_model,
    item.inv_description,
    item.inv_image,
    item.inv_thumbnail,
    item.inv_price,
    item.inv_year,
    item.inv_miles,
    item.inv_color,
  ];

  console.log("DEBUG addInventoryItem - SQL values:", values);

  try {
    const result = await pool.query(sql, values);
    console.log("DEBUG addInventoryItem - inserted:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("ERROR addInventoryItem - DB error:", err);
    // rethrow so controller can report/log and present a failure message
    throw err;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventoryItem};