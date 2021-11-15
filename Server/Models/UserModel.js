
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
        hashedPassword: {type: String, minlength: 60, maxlength: 60},
        fname: {type: String, required: true, maxlength: 50},
        lname: {type: String, required: true, maxlength: 50},
        phone: {type: String, maxlength: 10, minlength: 10},
        collegeName: {type:String, maxlength: 50},
        profilePicUrl: String,
        bdate: {type: String, validate: {validator: (val) => /\d{2}[/]\d{2}[/]\d{4}/.test(val) } },
        interests: {type:String, maxlength: 50}
    },
    {
        collection: "Users"
    }
);

/*******************Imports******************/
module.exports.userModel = mongoose.model("User", userSchema);