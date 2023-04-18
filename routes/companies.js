// Ioana A Mititean
// Exercise 33.1: Node-pg Intro


const express = require("express");
const router = express.Router();

const { ExpressError } = require("../expressError");
const { db } = require("../db");


/**
 * Get list of all companies: {companies: [{code, name, description}, ...]}
 */
router.get("/", async (req, res, next) => {

    try {
        const results = await db.query(
            `SELECT code, name, description FROM companies`
        );

        return res.json({companies: results.rows});

    } catch(err) {
        return next(err);
    }
})


/**
 * Get a specific company, by company code: {company: {code, name, description}}
 *
 * If company cannot be found, return 404 status response.
 */
router.get("/:code", async (req, res, next) => {

    try {
        const result = await db.query(
            `SELECT code, name, description FROM companies
             WHERE code = $1`,
             [req.params.code]
        );

        // Throw error if company not found
        if (result.rows.length === 0) {
            throw new ExpressError("Company not found!", 404);
        }

        return res.json({company: result.rows[0]});

    } catch(err) {
        return next(err);
    }
})


/**
 * Add a new company.
 *
 * Request body format (JSON): {code, name, description}
 *
 * Returns JSON with added company info, if successful: {company: {code, name, description}}
 */
router.post("/", async (req, res, next) => {

    try {
        const {code, name, description} = req.body;
        const result = await db.query(
            `INSERT INTO companies (code, name, description)
             VALUES ($1, $2, $3)
             RETURNING code, name, description`,
            [code, name, description]
        );

        return res.status(201).json(result.rows[0]);

    } catch(err) {
        return next(err);
    }
})


/**
 * Update an existing company.
 *
 * If company cannot be found, return 404 status response.
 *
 * Request body format (JSON): {name, description}
 *
 * Returns JSON with updated company info, if successful: {company: {code, name, description}}
 */
router.put("/:code", async (req, res, next) => {

    try {
        const {name, description} = req.body;
        const result = await db.query(
            `UPDATE companies
             SET name = $1, description = $2
             WHERE code = $3
             RETURNING code, name, description`,
            [name, description, req.params.code]
        );

        // Throw error if company not found
        if (result.rows.length === 0) {
            throw new ExpressError("Company not found!", 404);
        }

        return res.json(result.rows[0]);

    } catch(err) {
        return next(err);
    }
})


/**
 * Delete a company.
 *
 * If company cannot be found, return 404 status response.
 *
 * Return JSON on success: {status: "deleted"}
 */
router.delete("/:code", async (req, res, next) => {

    try {
        const result = await db.query(
            `DELETE FROM companies
             WHERE code = $1
             RETURNING code`,
             [req.params.code]
        );

        // Throw error if company not found
        if (result.rows.length === 0) {
            throw new ExpressError("Company not found!", 404);
        }

        return res.json({"status": "deleted"});

    } catch(err) {
        return next(err);
    }
})


module.exports = {
    router
};
