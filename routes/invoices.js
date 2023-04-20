// Ioana A Mititean
// Exercise 33.1: Node-pg Intro

/**
 * Routes for invoices.
 */


const express = require("express");
const router = express.Router();

const { ExpressError } = require("../expressError");
const { db } = require("../db");


/**
 * Get list of all invoices: {invoices: [{id, comp_code}, ...]}
 */
router.get("/", async (req, res, next) => {

    try {
        const results = await db.query(
            `SELECT id, comp_code FROM invoices`
        );

        return res.json({invoices: results.rows});

    } catch(err) {
        return next(err);
    }
})


/**
 * Get a specific invoice, by invoice ID:
 *      {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}
 *
 * If invoice cannot be found, return 404 status response.
 */
router.get("/:id", async (req, res, next) => {

    try {
        const result = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, code, name, description
             FROM invoices JOIN companies
             ON invoices.comp_code = companies.code
             WHERE id = $1`,
            [req.params.id]
        );

        // Throw error if invoice not found
        if (result.rows.length === 0) {
            throw new ExpressError("Invoice not found!", 404);
        }

        // Construct and return response
        const {code, name, description, ...invData} = result.rows[0];
        invData.company = {code, name, description};
        return res.json({invoice: invData});

    } catch(err) {
        return next(err);
    }
})


/**
 * Add a new invoice.
 *
 * Request body format (JSON): {comp_code, amt}
 *
 * Return JSON with added invoice info, if successful:
 *      {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 */
router.post("/", async (req, res, next) => {

    try {
        const {comp_code, amt} = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt)
             VALUES ($1, $2)
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
             [comp_code, amt]
        );

        return res.status(201).json({invoice: result.rows[0]});

    } catch(err) {
        return next(err);
    }
})


/**
 * Update an existing invoice.
 *
 * If invoice cannot be found, return 404 status response.
 *
 * Request body format (JSON): {amt}
 *
 * Return JSON with updated invoice info, if successful:
 *      {invoice: {id, comp_code, amt, paid, add_date, paid_date}}
 */
router.put("/:id", async (req, res, next) => {

    try {
        const { amt } = req.body;
        const result = await db.query(
            `UPDATE invoices
             SET amt = $1
             WHERE id = $2
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
             [amt, req.params.id]
        );

        // Throw error if invoice not found
        if (result.rows.length === 0) {
            throw new ExpressError("Invoice not found!", 404);
        }

        return res.json({invoice: result.rows[0]});

    } catch(err) {
        return next(err);
    }
})


/**
 * Delete an invoice.
 *
 * If invoice cannot be found, return 404 status response.
 *
 * Return JSON on success: {status: "deleted"}
 */
router.delete("/:id", async (req, res, next) => {

    try {
        const result = await db.query(
            `DELETE FROM invoices
             WHERE id = $1
             RETURNING id`,
             [req.params.id]
        );

        // Throw error if invoice not found
        if (result.rows.length === 0) {
            throw new ExpressError("Invoice not found!", 404);
        }

        return res.json({"status": "deleted"});

    } catch(err) {
        return next(err);
    }
})



module.exports = {
    router
};
