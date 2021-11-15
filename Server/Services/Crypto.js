
/*********************Imports***************** */
const bcrypt = require("bcrypt");

/*********************Variables***************** */
const saltRounds = 10;

/*********************Functions***************** */
async function getHash(plainText)
{
    return await bcrypt.hash(plainText, saltRounds);
}

async function matchWithHash(plainText, hash)
{
    return await bcrypt.compare(plainText, hash);
}

/*********************Exports***************** */
module.exports.getHash = getHash;
module.exports.matchWithHash = matchWithHash;