
/*******************Package Imports******************/
const router = require("express").Router();

/*******************User Imports******************/
const {
    getAllHouses,
    createHouse,
    updateHouse,
    deleteHouse,
    addRoomImages,
    deleteRoomImages
}  = require("../Controllers/HouseController")

const verifyUserToken = require("../Services/Middleware").verifyUserToken;

/********************Routes******************/
// 1. Get all rooms
// 2. Create a room
// 3. Update a room
// 4. Delete a room

router.get("/getAllHouses",verifyUserToken,getAllHouses)
router.post("/createHouse",verifyUserToken,createHouse)
router.post("/updateHouse/:id",verifyUserToken,updateHouse)
router.get("/deleteHouse/:id",verifyUserToken,deleteHouse)
router.put("/house/addimages", require("../Config/Config").multerUploader.array("roomImgs", 3), verifyUserToken, addRoomImages)
router.delete("/house/deleteimages", verifyUserToken, deleteRoomImages);

/*******************Exports******************/
module.exports.router = router;