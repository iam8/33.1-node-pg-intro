// Ioana A Mititean
// Exercise 33.1: Node-pg Intro

/** Server startup for BizTime. */


const { app } = require("./app");


app.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1, port 3000");
});

// const { Client } = require('pg')
// const client = new Client()

// client.connect()

// client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message) // Hello World!
//   client.end()
// })
