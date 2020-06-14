
const config = require('../database')
const { Client } = require('pg');


module.exports = async (req, res, next) => {
    console.log(req.headers.authtoken)
    if (!req.headers.authtoken) return res.json("NO AUTH")
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