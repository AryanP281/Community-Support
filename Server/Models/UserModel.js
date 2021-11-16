
/*******************Imports******************/
const mongoose = require("mongoose")

/********************Schemas******************/
const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId()
        },
        email: {type: String, required: true, validate: {validator: (val) => /\w+@\D+[.]\D{2,3}/.test(val) } },
        hashedPassword: {type: String, minlength: 60, maxlength: 60, required: true},
        fname: {type: String, maxlength: 50, default: ""},
        lname: {type: String,  maxlength: 50, default: ""},
        phone: {type: String, maxlength: 10, default: ""},
        collegeName: {type:String, maxlength: 50, default: ""},
        profilePicUrl: {type: String, default: ""},
        bdate: {type: String, validate: {validator: (val) => val.length === 0 || /\d{2}[/]\d{2}[/]\d{4}/.test(val) }, default: "" },
        interests: {type:String, maxlength: 50, default: ""}
    },
    {
        collection: "Users"
    }
);

/*******************Imports******************/
module.exports.userModel = mongoose.model("User", userSchema);