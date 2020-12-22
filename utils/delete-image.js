const fs = require("fs");

const deleteImage = (imagePath, next) =>{
    fs.unlink(imagePath, (error) =>{
        if(error){
            console.log("Failed to delete image at delete profile");
            return next(error);
        }
    });
};
module.exports = deleteImage;