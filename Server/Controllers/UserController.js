
/************************Imports*********************** */
const userModel = require("../Models/UserModel").userModel;
const respCodes = require("../Config/Config").responseCodes;

/*************************Controllers****************** */
async function createUserAccount(req, resp)
{
    //Getting the provided user details
    const userDetails = req.body.userDetails;
    if(userDetails === undefined)
    {
        resp.status(200).json({success: false, code: respCodes.invalidInput});
        return;
    }

    return Promise();
}