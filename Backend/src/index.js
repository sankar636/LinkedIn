import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDB from "./Database/index.js";

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    console.log("Hello World");
    res.send("Hello World from Backend!");
});
app.listen(PORT, () => {    
    console.log(`Server running on http://localhost:${PORT}`);
});

connectDB().then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`MongoDB connected successfully on ${process.env.PORT || 4000}`);
    });
}).catch((error) => {
    console.log(`MongoDB connection error: ${error}`);    
})