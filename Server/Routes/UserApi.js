
/*******************Imports******************/
const router = require("express").Router();

/********************Routes******************/
router.get("/", (req,resp) => {
    resp.status(200).json({success: true});
})


/*******************Exports******************/
module.exports.router = router;
