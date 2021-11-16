
/*******************Package Imports******************/
const router = require("express").Router();

/*******************User Imports******************/
const {
    getAllHouses,
    createHouse,
    updateHouse,
    deleteHouse
}  = require("../Controllers/HouseController")

/********************Routes******************/
// 1. Get all rooms
// 2. Create a room
// 3. Update a room
// 4. Delete a room

router.get("/getAllHouses",getAllHouses)
router.post("/createHouse",createHouse)
router.post("/updateHouse/:id",updateHouse)
router.get("/deleteHouse/:id",deleteHouse)

/*******************Exports******************/
module.exports.router = router;