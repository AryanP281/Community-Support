
/*********************Imports***************** */
const bcrypt = require("bcrypt");

/*********************Variables***************** */
const saltRounds = 10;

/*********************Functions***************** */
async function getHash(plainText)
{
    return await bcrypt.hash(plainText, saltRounds);
}

/*********************Exports***************** */
module.exports.getHash = getHash;