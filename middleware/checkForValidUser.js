
const config = require('../database')
const { Client } = require('pg');


module.exports = async (req, res, next) => {
    if (!req.headers.authtoken) return res.json("NO AUTH")
    const client = new Client(config);
    await client.connect();
    console.log(client)
    const users = await client.query(`SELECT * FROM users WHERE authtoken = '${req.headers.authtoken}'`)
    console.log('2.8')
    await client.end()
    console.log("3")
    if (users.rows.length > 0) {
        req.user = users.rows[0]
        next()
    } else {
        res.json("No user logged in.")
    }
}