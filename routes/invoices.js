// Ioana A Mititean
// Exercise 33.1: Node-pg Intro


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

        const data = result.rows[0];

        // Construct and return response
        return res.json({
            id: data.id,
            amt: data.amt,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
            company: {
                code: data.code,
                name: data.name,
                description: data.description
            }
        });

    } catch(err) {
        return next(err);
    }
})



module.exports = {
    router
};
