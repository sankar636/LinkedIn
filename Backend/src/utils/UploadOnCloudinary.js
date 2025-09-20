import { v2 as cloudinary}  from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async( localFilePath ) => {

    cloudinary.config(
        {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        }
    )

    try {
        if(!localFilePath){
            return;
        }

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto", folder: "my_uploads" })


        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return response.url
    } catch (error) {
        console.log("Error in uploading the file", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null
    }
}

export default uploadOnCloudinary