module.exports = {
  development: {
    username: 'hermes',
    password: 'hermes',
    database: 'hermes',
    host: 'function-registry-db',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
  },
  test: {
    username: 'hermes',
    password: 'hermes',
    database: 'hermes',
    host: 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT,
  },
  production: {
    username: 'hermes',
    password: 'hermes',
    database: 'hermes',
    host: 'function-registry-db',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
  },
}
