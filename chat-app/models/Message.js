const db = require('../database');

class Message {
    static create(sender, content, callback) {
        db.run(
            'INSERT INTO messages (sender, content) VALUES (?, ?)',
            [sender, content],
            callback
        );
    }

    static getAll(callback) {
        db.all('SELECT * FROM messages ORDER BY timestamp', callback);
    }
}

module.exports = Message;