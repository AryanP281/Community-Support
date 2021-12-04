
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

router.get("/getAllHouses",getAllHouses)
router.post("/createHouse",createHouse)
router.post("/updateHouse/:id",updateHouse)
router.get("/deleteHouse/:id",deleteHouse)
router.put("/house/addimages", require("../Config/Config").multerUploader.array("roomImgs", 3), addRoomImages)
router.delete("/house/deleteimages", deleteRoomImages);

/*******************Exports******************/
module.exports.router = router;