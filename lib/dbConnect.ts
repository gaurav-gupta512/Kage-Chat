import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number // ? means the attribute is optional 
}

const connection:connectionObject = {}

async function dbConnect(): Promise<void>{ //promise is expected to be returned and void means type mattersn't
    if(connection.isConnected){
        console.log('Already connected to database')
        return
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{}) 
        connection.isConnected = db.connections[0].readyState // checks if database is ready to connect
        console.log("Database connected")
    }
    catch(error){
        console.log("Database connection failed",error)
        process.exit(1) // stop connection process
    }
}

export default dbConnect