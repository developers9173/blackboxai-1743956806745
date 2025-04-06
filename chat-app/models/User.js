const db = require('../database');
const bcrypt = require('bcryptjs');

class User {
    static create(username, password, callback) {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return callback(err);
            db.run(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hash],
                callback
            );
        });
    }

    static findByUsername(username, callback) {
        db.get('SELECT * FROM users WHERE username = ?', [username], callback);
    }

    static comparePassword(candidatePassword, hash, callback) {
        bcrypt.compare(candidatePassword, hash, callback);
    }
}

module.exports = User;