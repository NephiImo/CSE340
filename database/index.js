// database/index.js
const { Pool } = require("pg")
require("dotenv").config()

// Build pool config
const poolConfig = {
  connectionString: process.env.DATABASE_URL || undefined,
  // sensible defaults (override via env)
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT_MS, 10) || 5000,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10) || 10000,
  max: parseInt(process.env.DB_MAX_CLIENTS, 10) || 10,
}

// Decide whether to use SSL
// Use SSL when not in local development OR when DB_SSL env var explicitly set to "true"
const isDev = process.env.NODE_ENV === "development"
const envWantsSsl = String(process.env.DB_SSL || "").toLowerCase() === "true"

if (!isDev || envWantsSsl) {
  // Many managed DBs (Render, Heroku, etc.) require SSL with rejectUnauthorized: false
  poolConfig.ssl = { rejectUnauthorized: false }
}

const pool = new Pool(poolConfig)

// Optional: helpful logging on pool error
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err)
})

module.exports = {
  // standard query wrapper
  query: (text, params) => pool.query(text, params),
  pool,
}
