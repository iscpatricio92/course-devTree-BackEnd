import colors from "colors";
import mongoose from "mongoose";
export const connectDB= async ()=>{
    try{
        const MONGO_URI= process.env.MONGO_URI;
        const {connection} = await mongoose.connect(MONGO_URI)
        const url =`${connection.host}:${connection.port}/${connection.name}`
        console.log(colors.cyan.bold(`Database connected to: ${url}`));
    }
    catch(e){
        console.error(colors.bgRed.white.bold(e.message));
        process.exit(1);
    }
}