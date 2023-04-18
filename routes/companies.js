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

        // Go to global error handler if company not found
        if (result.rows.length === 0) {
            throw new ExpressError("Company not found!", 404);
        }

        return res.json({company: result.rows[0]});

    } catch(err) {
        return next(err);
    }
})



module.exports = {
    router
};
