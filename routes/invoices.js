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



module.exports = {
    router
};
