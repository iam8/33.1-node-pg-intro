// Ioana A Mititean
// Exercise 33.1: Node-pg Intro


const express = require("express");
const router = express.Router();

const { db } = require("../db");


/**
 * Get list of all companies: {companies: [{code, name, description}, ...]}
 */
router.get("/", async (req, res, next) => {

    try {
        const results = await db.query(
            `SELECT * FROM companies`
        );

        return res.json({companies: results.rows});

    } catch(err) {
        return next(err);
    }
})


module.exports = {
    router
};
