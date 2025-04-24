const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = low(adapter);

// Set default data
db.defaults({ users: [] }).write();

module.exports = {
    findUser: (username) => {
        return db.get('users')
            .find({ username })
            .value();
    },

    saveUser: (userData) => {
        return db.get('users')
            .push(userData)
            .write();
    },

    updateUser: (username, data) => {
        return db.get('users')
            .find({ username })
            .assign(data)
            .write();
    }
};
