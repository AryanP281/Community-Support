
/**********************Imports********************* */
const { ObjectId } = require("mongodb");
const commentModel = require("../Models/CommentModel").commentModel;
const userModel = require("../Models/UserModel").userModel;
const respCodes = require("../Config/Config").responseCodes;

/***********************Variables**************** */
const commentPageSize = 10;

/***********************Controllers**************** */
async function createComment(req, resp)
{
    const commentDetails = req.body.comment;
    if(!commentDetails)
    {
        resp.status(200).json({success: false, code: respCodes.invalidInput});
        return;
    }

    try
    {
        //Creating the comment object
        commentDetails.userId = ObjectId(req.body.user.userId);
        commentDetails.parentId = ObjectId(commentDetails.parentId);
        const comment = new commentModel(commentDetails);

        //Adding the comment to database
        const commentId = (await comment.save())._id.toString();
        commentDetails.id = commentId;

        resp.status(200).json({success:true, comment:commentDetails});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

async function getComments(req, resp)
{

    try
    {
        //Getting the timestamp of the last comment
        const lastTimestamp = (await commentModel.findOne({_id: new ObjectId(req.query.lastId)})).createdAt;
        
        //Getting the next comments page
        const nextPage = await commentModel.find({createdAt: {$gt: lastTimestamp}}, {__v:false},{sort: {"createdAt":1}, limit: commentPageSize}).lean();
        
        //Getting the comment creator name
        for(let i = 0; i < nextPage.length; ++i)
        {
            const comment = nextPage[i];

            const creatorUsername = (await userModel.findOne({_id: comment.userId}, {fname: true, lname: true}));
            comment.username = creatorUsername.fname + " " + creatorUsername.lname;
            delete comment.userId;

            comment.parentId = comment.parentId.toString(); //Converting parentid to string
        }

        resp.status(200).json({success: true, commentsPage: {lastId: nextPage[nextPage.length-1]._id, comments: nextPage}});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function deleteComment(req, resp)
{
    const commentId = req.params.id;
    if(!commentId || commentId.length !== 24)
    {
        resp.status(200).json({success: false, code: respCodes.invalidInput});
        return;
    }

    try
    {
        await commentModel.deleteOne({_id: new ObjectId(commentId)});

        resp.status(200).json({success:true});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

/**********************Exports********************* */
module.exports = {createComment, getComments, deleteComment};