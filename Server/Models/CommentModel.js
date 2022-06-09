/*******************Imports******************/
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose")

/********************Model***************** */
const commentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId()
    },
    text: { type: String, required: true, minlength: 1, maxlength: 50},
    userId: {type: ObjectId, required: true},
    parentId: {type: ObjectId, required: true}
},
{
    collection: "Comments",
    timestamps: true
});

/*******************Exports************** */
module.exports.commentModel = mongoose.model("Comment", commentSchema);