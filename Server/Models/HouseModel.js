
/*******************Imports******************/
const { ObjectId } = require("bson");
const mongoose = require("mongoose")

/********************Schemas******************/
const houseModel = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId()
        },
        photos: {
            type: [[String]]
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
        isOccupied: {
          type: Boolean,
          default: false
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
        collection: "Houses"
    }
);

/*******************Imports******************/
module.exports = mongoose.model("House", houseModel);