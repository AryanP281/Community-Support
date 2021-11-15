/*****************Imports************** */
const express = require("express")
require("dotenv").config();

/*****************Server Initialization************** */
const expressApp = express();

//Setting up middleware
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: false}));

//Adding routes
expressApp.use("/users", require("./Routes/UserApi").router);

//Starting the express server
expressApp.listen(parseInt(process.env.SERVER_PORT), "0.0.0.0", () => console.log(`Express Server started at port ${process.env.SERVER_PORT}`));

//Running config
require("./Config/Config");
