
const config = require('../database.json')
const { Client } = require('pg');


module.exports = async (req, res, next) => {
    const client = new Client(config.dev);
    await client.connect();
    const users = await client.query(`SELECT * FROM users WHERE authtoken = '${req.headers.authtoken}'`)
    await client.end()
    console.log(req.headers.authtoken)
    if (users.rows.length > 0) {
        req.user = users.rows[0]
        next()
    } else {
        res.json("No user logged in.")
    }
}