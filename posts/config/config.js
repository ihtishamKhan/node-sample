require('dotenv').config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

module.exports = {
    "development": {
        "username": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": "sample_database_dev",
        "host": DB_HOST,
        "dialect": "postgres"
    },
    "test": {
        "username": "root",
        "password": DB_PASSWORD,
        "database": "sample_database_test",
        "host": DB_HOST,
        "dialect": "postgres"
    },
    "production": {
        "username": "root",
        "password": DB_PASSWORD,
        "database": "sample_database_prod",
        "host": DB_HOST,
        "dialect": "postgres"
    }
}