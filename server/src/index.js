import dotenv from "dotenv"
import connectDB from "./db/dbconnection.js";
import {app} from "./app.js" ;


dotenv.config({
    path: './.env'
})

//DataBase connection and App server start 
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : http://localhost:${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})