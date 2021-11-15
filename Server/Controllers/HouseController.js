const House = require("../Models/HouseModel")

const getAllHouses = async (req,res)=> {
    try {
        const houses = await House.find({});
        return res.status(200).json({
            success: true,
            data: houses
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false
        })
    }
}

const createHouse = async (req,res)=> {
    try {
        const data = req.body;
        const house = new House({
            photos: data.photos,
            address: data.address,
            location: data.location,
            rent: data.rent,
            description: data.description,
            noOfBedrooms: data.noOfBedrooms,
            features: data.features
        })
        await house.save();
        return res.status(200).json({
            success: true,
            data: house
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}

const updateHouse = async(req,res)=> {
    try {
        const {id} = req.params
        const dataToUpdate = req.body;
        const updatedData = await House.findByIdAndUpdate(
            id,
            {$set: dataToUpdate},
            {new: true}
        )
        res.status(200).json({
            success: true,
            data: updatedData
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}

const deleteHouse = async(req,res)=> {
    try {
        const {id} = req.params;
        const deletedDoc = await House.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            data: deletedDoc
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json({
            success: false
        })
    }
}

module.exports = {
    getAllHouses,
    createHouse,
    updateHouse,
    deleteHouse
}