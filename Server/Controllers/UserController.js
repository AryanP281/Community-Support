
/************************Imports*********************** */
const userModel = require("../Models/UserModel").userModel;
const passwordHasher = require("../Services/Crypto").getHash;
const respCodes = require("../Config/Config").responseCodes;
const jwt = require("jsonwebtoken");

/*************************Controllers****************** */
async function createUserAccount(req, resp)
{
    try
    {
        //Getting the provided user details
        const userDetails = req.body.userDetails;
        if(userDetails === undefined || !userDetails.email || !userDetails.password)
        {
            resp.status(200).json({success: false, code: respCodes.invalidInput});
            return;
        }

        //Checking if email is already registered
        if(await userModel.exists({email: userDetails.email}))
        {
            resp.status(200).json({success: false, code: respCodes.emailAlreadyRegistered});
            return;
        }

        //Hashing the user password
        userDetails.hashedPassword = await passwordHasher(userDetails.password);
        delete userDetails.password;

        //Saving the user document
        const newUser = new userModel(userDetails);
        const userId = (await newUser.save())._id.toString();

        //Creating jwt
        const token = await jwt.sign({userId}, process.env.JWT_SECRET);
        
        resp.status(200).json({success: true, token});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/************************Exports*********************** */
module.exports.createUserAccount = createUserAccount;
