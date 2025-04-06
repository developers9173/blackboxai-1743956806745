const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./chat.db');

process.on('exit', () => {
    db.close();
});

module.exports = db;