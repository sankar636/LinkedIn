import axios from "axios";
export const UploadImage = async ({ file, uploadUrl, fieldName, token }) => {
    if (!file) {
        throw new Error('No file provided for upload.');
    }

    const formData = new FormData()

    formData.append(fieldName, file)

    try {
        const response = await axios.patch(uploadUrl, formData,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        // console.log('Upload successful:', response.data);
        return response.data;
    } catch (error) {
        console.log("Error in UploadImage", error);
        throw new Error(error.response?.data?.message || 'Image upload failed.');
    }
}