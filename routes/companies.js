// Ioana A Mititean
// Exercise 33.1: Node-pg Intro


const express = require("express");
const router = express.Router();

const { db } = require("../db");

router.get("/", (req, res, next) => {
    return res.json({
        value: "Hello world",
    });
})


module.exports = {
    router
};
