
/***********************Import****************** */
const respCodes = require("../Config/Config").responseCodes;
const jwt = require("jsonwebtoken");

/**********************Middleware**************** */
async function verifyUserToken(req, resp, next)
{
    //Getting token from header
    if(!req.headers.authorization)
    {
        resp.status(200).json({success: false, code: respCodes.invalidToken});
        return;
    }
    const userToken = req.headers.authorization.split(" ")[1]
    if(!userToken)
    {
        resp.status(200).json({success: false, code: respCodes.invalidToken});
        return;
    }

    //Decrypting the token
    req.body.user = await jwt.decode(userToken, process.env.JWT_SECRET);

    next()
}

/***********************Exports****************** */
module.exports.verifyUserToken = verifyUserToken;
