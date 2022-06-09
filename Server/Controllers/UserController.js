
/************************Imports*********************** */
const userModel = require("../Models/UserModel").userModel;
const passwordHasher = require("../Services/Crypto").getHash;
const passwordMatcher = require("../Services/Crypto").matchWithHash;
const respCodes = require("../Config/Config").responseCodes;
const jwt = require("jsonwebtoken");
const firebaseStorage = require("../Config/FirebaseConfig").firebaseStorage;
const firebaseRef = require("firebase/storage").ref;
const deleteObject = require("firebase/storage").deleteObject;
const uploadBytes = require("firebase/storage").uploadBytes;
const getDownloadUrl = require("firebase/storage").getDownloadURL;

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

async function authenticateUser(req, resp)
{
    try
    {
        const userCreds = req.body.userCreds;
        if(!userCreds || !userCreds.email || !userCreds.email.length || !userCreds.password || !userCreds.password.length)
        {
            resp.status(200).json({success: false, code: respCodes.invalidInput});
            return;
        }

        //Getting user details
        const userDetails = (await userModel.find({email: userCreds.email}, "email hashedPassword _id"))[0];
        if(!userDetails)
        {
            resp.status(200).json({success: false, code: respCodes.userNotFound});
            return;
        }
        
        //Checking password 
        if(!(await passwordMatcher(userCreds.password, userDetails.hashedPassword)))
        {
            resp.status(200).json({success: false, code: respCodes.incorrectPassword});
            return;
        }

        //Creating jwt
        const userToken = await jwt.sign({userId: userDetails._id.toString()}, process.env.JWT_SECRET);

        resp.status(200).json({success: true, token: userToken});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function getUserProfile(req, resp)
{
    try
    {
        //Getting the user id
        const userId = req.body.user.userId;

        //Getting the user profile details
        const userProfile = (await userModel.find({_id: userId}, "-_id -__v -hashedPassword"))[0]
        if(!userProfile)
        {
            resp.status(200).json({success: false, code: respCodes.userNotFound});
            return;   
        }
        
        resp.status(200).json({success: true, userProfile})
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function findSimilarUsers(req, resp) {
  try {
    //Getting the user id
    const userId = req.body.user.userId;

    //Getting the user profile details
    const userProfile = (
      await userModel.find({ _id: userId }, "-_id -__v -hashedPassword")
    )[0];
    if (!userProfile) {
      resp.status(200).json({ success: false, code: respCodes.userNotFound });
      return;
    }
    const allUsers = await userModel.find({});

    

    resp.status(200).json({ success: true, userProfile, all: allUsers });
  } catch (err) {
    console.log(err);
    resp.sendStatus(500);
  }
}

async function editUserProfile(req, resp)
{
    try
    {
        //Checking if the user image needs to be updated
        const imgUrl = req.file ? (await uploadUserProfilePic(req.body.user.userId, req.file.buffer)) : null;
        if(imgUrl)
            req.body.profilePicUrl = imgUrl;

        //Getting the user id
        const userId = req.body.user.userId;
        delete req.body.user;

        //Updatint the user document
        const updatedDoc = await userModel.findByIdAndUpdate(userId, req.body, {new: true, lean: true});
        delete updatedDoc._id;
        delete updatedDoc.__v;
        delete updatedDoc.hashedPassword;

        resp.status(200).json({success: true, updatedDetails: updatedDoc})
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/************************Functions*********************** */
async function uploadUserProfilePic(userId, userPicBytes)
{
    try
    {
        //Deleting the old profile pic
        try
        {
            (await deleteObject(firebaseRef(profilePicturesStorageRef, `Profile Pictures/${userId}.jpg`)));
        }
        catch(err)
        {
            //Handles File Does Not Exist error
        }

        //Adding the new profile picture
        const fileRef = firebaseRef(firebaseStorage, `Profile Pictures/${userId}.jpg`);
        await uploadBytes(fileRef, userPicBytes, {contentType: "image/jpeg"});

        //Returning the image download url
        return (await getDownloadUrl(fileRef));
    }
    catch(err)
    {
        console.log(err);
    }

    return null;
}


/************************Exports*********************** */
module.exports.createUserAccount = createUserAccount;
module.exports.getUserProfile = getUserProfile;
module.exports.authenticateUser = authenticateUser;
module.exports.editUserProfile = editUserProfile;
module.exports.findSimilarUsers = findSimilarUsers;
