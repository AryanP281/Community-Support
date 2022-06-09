
/*******************Imports******************/
const router = require("express").Router();
const verifyUserToken = require("../Services/Middleware").verifyUserToken;

/********************Routes******************/
router.post("/signup", require("../Controllers/UserController").createUserAccount);
router.post("/signin", require("../Controllers/UserController").authenticateUser);
router.get("/userprofile", verifyUserToken, require("../Controllers/UserController").getUserProfile);
router.get("/findSimilarUsers", verifyUserToken, require("../Controllers/UserController").findSimilarUsers);
router.put("/editprofile", require("../Config/Config").multerUploader.single("profilePic"), verifyUserToken, require("../Controllers/UserController").editUserProfile);

/*******************Exports******************/
module.exports.router = router;
