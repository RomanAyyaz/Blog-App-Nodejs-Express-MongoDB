const jwt = require("jsonwebtoken")
const SecretKey = "mynameis$uperman"

function compareToken (token){
    const payload = jwt.verify(token,SecretKey)
    return payload
}

module.exports = {
    compareToken
}