// process.env.IS_LOCAL

// IF process.env.IS_LOCAL == true, export the dev option list
// Otherwise, export the production option list

const config = {
    "dev": {
        "driver": "pg",
        "user": "bri",
        "password": "",
        "host": "localhost",
        "database": "auditions",
        "port": "5432"
    },
    "production": {
        "connectionString": process.env.DATABASE_URL,
        "ssl": {
          "rejectUnauthorized": false
        }
    }
}

module.exports = process.env.IS_LOCAL == "true" ? config.dev : config.production