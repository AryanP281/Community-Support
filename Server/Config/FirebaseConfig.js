/*************************Imports******************** */
const firebase = require("firebase/app")
const getStorage = require("firebase/storage").getStorage
const firebaseConfig = require("../Config/Config").firebaseConfig;

/*************************Script******************** */

//Initializing the firebase app
firebase.initializeApp(firebaseConfig); 

//Getting reference to the Profile Pictures folder
const firebaseStorage = getStorage();

/*************************Exports******************** */
module.exports.firebaseStorage = firebaseStorage;