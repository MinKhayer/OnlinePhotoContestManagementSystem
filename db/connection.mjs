import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve('.env') });
//console.log(path.resolve('./Backend','.env'))
const connectionString  = process.env.mongoURI || "";
const client = new MongoClient(connectionString);
let con ;
try {
    con = await client.connect();
    if(con)
    {
        console.log("Connected to the database");
    }
} catch (error) {
    console.error(error);
}
let db = con.db("ContestManagement");
export default db;