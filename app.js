// Ioana A Mititean
// Exercise 33.1: Node-pg Intro

/** BizTime Express application. */


const express = require("express");

const app = express();
const { router: companiesRoutes } = require("./routes/companies");
const ExpressError = require("./expressError");

app.use(express.json());
app.use("/companies", companiesRoutes);


/** 404 handler */
app.use(function(req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});


/** General error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});


module.exports = {
    app
};
