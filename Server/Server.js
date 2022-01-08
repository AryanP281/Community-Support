/*****************Package Imports************** */
const express = require("express")
const dotenv = require("dotenv");

/*****************User Imports************** */
const connectDB = require("./Config/connectDB")

/*****************Server Initialization************** */
const expressApp = express();
require('dotenv').config();

//Connecting database
if(!process.env.DEBUGGING)
    connectDB();

//Setting up middleware
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: false}));

//Adding routes
expressApp.use("/users", require("./Routes/UserApi").router);
expressApp.use("/house", require("./Routes/HouseApi").router);
expressApp.use("/comment",require("./Routes/CommentApi").router);

expressApp.get("/", (req,res)=> {
    return res.status(200).send("Welcome to Community Support")
})

//Starting the express server
expressApp.listen(parseInt(process.env.PORT), "0.0.0.0", () => console.log(`Express Server started at port ${process.env.PORT}`));

//Running config
require("./Config/Config");
