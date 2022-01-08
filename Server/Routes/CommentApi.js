/*******************Imports******************/
const router = require("express").Router();
const verifyUserToken = require("../Services/Middleware").verifyUserToken;
const {createComment, getComments, deleteComment} = require("../Controllers/CommentController");

/********************Routes******************/
router.post("/create", verifyUserToken, createComment);
router.get("/getcomments/", verifyUserToken, getComments);
router.delete("/delete/:id", verifyUserToken, deleteComment);

/********************Exports*************** */
module.exports.router = router;