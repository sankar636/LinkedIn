import mongoose from 'mongoose'

const DB_NAME = "LinkedIn"

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`Connected To Database`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
export default connectDB