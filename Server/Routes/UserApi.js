
/*******************Imports******************/
const router = require("express").Router();


/********************Routes******************/
router.post("/signup", require("../Controllers/UserController").createUserAccount);


/*******************Exports******************/
module.exports.router = router;
