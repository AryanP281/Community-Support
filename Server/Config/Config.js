
/*******************Import************* */
const MONGOOSE = require("mongoose");
const mongoClient = require("mongodb").MongoClient;

/*******************Variables************* */
const responseCodes = {
    invalidInput: 0,
    emailAlreadyRegistered: 1
}; //The response codes to be used

const dbUrl = "localhost:27017"; //The mongo db url
const name = "IPDProject"; //The name of the mongo database
const connectionUrl  = `mongodb://${dbUrl}/${name}`; //The url to be used for connecting with mongo db

/*******************Script************* */
//Connecting to db using mongoose
MONGOOSE.connect(connectionUrl, {useNewUrlParser : true, useUnifiedTopology: true});

//DB Connected event
MONGOOSE.connection.on("connected", () => console.log("Connected to Mongoose"));

//DB disconnected event
MONGOOSE.connection.on("disconnected", () => console.log("Mongoose disconnected"));

//DB error event
MONGOOSE.connection.on("error", (err) => {
    console.log(err);
    MONGOOSE.disconnect(); //Disconnecting due to error
});

//Creating mongodb client
const mongodbClient = new mongoClient(connectionUrl);
mongodbClient.connect().then(() => console.log("Connected to MongoDb"));

/*******************Exports************* */
module.exports.responseCodes = responseCodes;
module.exports.mongoClient = mongodbClient;