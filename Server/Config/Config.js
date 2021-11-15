
/*******************Import************* */
const MONGOOSE = require("mongoose");
const mongoClient = require("mongodb").MongoClient;
const multer = require("multer");

/*******************Variables************* */
const responseCodes = {
    invalidInput: 0,
    emailAlreadyRegistered: 1,
    invalidToken: 2,
    userNotFound: 3,
    incorrectPassword: 4
}; //The response codes to be used

const dbUrl = "localhost:27017"; //The mongo db url
const name = "IPDProject"; //The name of the mongo database
const connectionUrl  = `mongodb://${dbUrl}/${name}`; //The url to be used for connecting with mongo db

/*******************Script************* */
if(process.env.DEBUGGING)
{
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

    
    module.exports.mongoClient = mongodbClient;
}

//Initializing multer
const multerUploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5*1024*1024 //Limiting file size to 5 MB
    }
});

//Setting the firebase config details
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

/*******************Exports************* */
module.exports.responseCodes = responseCodes;
module.exports.multerUploader = multerUploader;
module.exports.firebaseConfig = firebaseConfig;