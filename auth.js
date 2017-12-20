const bcrypt = require('bcryptjs');

//Check if password is correct:
function checkPassword(plainTextPassword, storedHash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, storedHash, (err, match) => {
            if (err) {
                reject(err);
            } else {
                resolve(match);
            }
        })
    })
}

//Create new user password:
function hashPassword(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                console.log(err);
            }
            bcrypt.hash(plainTextPassword, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            })
        })
    })
}

//EXPORTS-----------------------------------------------------------------------
//------------------------------------------------------------------------------

module.exports = {
    checkPassword: checkPassword,
    hashPassword: hashPassword
}
