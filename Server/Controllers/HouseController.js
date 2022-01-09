const House = require("../Models/HouseModel")
const User = require("../Models/UserModel").userModel
const respCode = require("../Config/Config").responseCodes;
const firebaseStorage = require("../Config/FirebaseConfig").firebaseStorage;
const firebaseRef = require("firebase/storage").ref;
const deleteObject = require("firebase/storage").deleteObject;
const uploadBytes = require("firebase/storage").uploadBytes;
const getDownloadUrl = require("firebase/storage").getDownloadURL;

const roomImgLimit = 3; //The max number of images that can be uploaded for a room

const getAllHouses = async (req,res)=> {
    try {
        const houses = await House.find({}).lean();
        for(let i = 0; i < houses.length; ++i)
        {
            houses[i].owner = await User.findOne({_id: houses[i].ownerId}, {_id:false});
            delete houses[i].ownerId;
        }
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
            ownerId: new ObjectId(req.body.user.userId),
            photos: [],
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
        if(!checkUserRights(id, req.body.user.userId))
        {
            resp.status(200).json({success: false, code: respCode.doNotHavePermission});
            return;
        }
        
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
        if(!checkUserRights(id, req.body.user.userId))
        {
            resp.status(200).json({success: false, code: respCode.doNotHavePermission});
            return;
        }

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

async function addRoomImages(req, resp)
{
    if(!req.files || !req.body.roomId || req.body.roomId.length !== 24)
    {
        resp.status(200).json({success: false, code: respCode.invalidInput});
        return;
    }

    try
    {
        if(!checkUserRights(req.body.roomId, req.body.user.userId))
        {
            resp.status(200).json({success: false, code: respCode.doNotHavePermission});
            return;
        }
        
        const imgs = req.files; //Getting the image files to upload

        //Getting room document
        const roomDetails = await House.findOne({_id: req.body.roomId});
        if(!roomDetails)
        {
            resp.status(200).json({success: false, code: respCode.houseNotFound});
            return;
        }
        else if(roomDetails.photo && roomImgLimit - roomDetails.photo.size < imgs.length)
        {
            resp.status(200).json({success: false, code: respCode.houseImgLimitReached});
            return;
        }
        
        //Uploading the images
        const downloadUrls = [];
        const imageIndex = roomDetails.photos.length ? roomDetails.photos.reduce((prev, photo) => Math.max(prev, parseInt(photo[1].split('_')[1])), 0) + 1 : 0;
        for(let i = 0; i < imgs.length; ++i)
        {
            const imgFileName = `${roomDetails._id.toString()}_${imageIndex + i}`;
            const downloadUrl = await uploadRoomImages(imgFileName, imgs[i].buffer);
            if(!downloadUrl)
                throw Error("Failed to upload image");
            roomDetails.photos.push([downloadUrl, imgFileName]);
            downloadUrls.push(downloadUrl);
        }

        //Updating the room document
        await House.updateOne({_id: roomDetails._id}, {$set: {photos: roomDetails.photos}});
        
        resp.status(200).json({success: true, downloadUrls});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }
}

async function deleteRoomImages(req, resp)
{
    const imgDetails = req.body.imgDetails;
    if(!imgDetails)
    {
        resp.status(200).json({success: false, code: respCode.invalidInput});
        return;
    }

    try
    {
        if(!checkUserRights(req.body.roomId, req.body.user.userId))
        {
            resp.status(200).json({success: false, code: respCode.doNotHavePermission});
            return;
        }
        
        //Getting room document
        const roomDetails = await House.findOne({_id: imgDetails.roomId});
        if(!roomDetails)
        {
            resp.status(200).json({success: false, code: respCode.houseNotFound});
            return;
        }

        //Deleting the image
        await deleteObject(firebaseRef(firebaseStorage, `Rooms/${imgDetails.imgId}`));

        //Updating the database
        const newPhotosList = [];
        roomDetails.photos.forEach((photo) => {
            if(photo[1] !== imgDetails.imgId)
                newPhotosList.push(photo);
        });
        await House.updateOne({_id: imgDetails.roomId}, {$set: {photos: newPhotosList}});

        resp.status(200).json({success: true});
    }
    catch(err)
    {
        console.log(err);
        resp.sendStatus(500);
    }

}

async function uploadRoomImages(imgName, fileBuffer)
{
    try
    {
        const imgRef = firebaseRef(firebaseStorage, `Rooms/${imgName}`); //Creating reference to the new image
        await uploadBytes(imgRef, fileBuffer, {contentType: "image/jpeg"});

        //Returning the image download url
        return (await getDownloadUrl(imgRef));
    }
    catch(err)
    {
        console.log(err);
        return null;
    }
}

/********************Functions******************** */
async function checkUserRights(roomId, userId)
{
    /*Checks if the given user has the right to update the room details*/

    return userId === (await House.findOne({_id: new ObjectId(roomId)})).ownerId.toString();
}

/*******************Exports************************ */
module.exports = {
    getAllHouses,
    createHouse,
    updateHouse,
    deleteHouse,
    addRoomImages,
    deleteRoomImages
}