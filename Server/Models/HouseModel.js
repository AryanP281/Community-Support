
/*******************Imports******************/
const mongoose = require("mongoose")

/********************Schemas******************/
const houseModel = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId()
        },
        photos: {
            type: [ {
                    type: String
                }
            ]
        },
        address: {
            type: String
        },
        location: {
            Type: String
        },
        rent: {
            Type: String
        },
        description: {
            Type: String
        },
        noOfBedrooms: {
            type: Number
        },
        features: {
            type: {
                squareFeet: {
                    type: Number
                },
                furnished: {
                    type: String,
                    enum: ["Not Furnished", "Semi Furnished", "Completely Furnished"]
                }
            }
        }
    },
    {
        collection: "House"
    }
);

/*******************Imports******************/
module.exports.houseModel = mongoose.model("House", houseModel);