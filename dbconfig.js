
// import { MongoClient } from 'mongodb';

// const url = "om";

// const client = new MongoClient(url);

// const dbname = "node-project";
// export const collectionname = "todo";

// let db = null; // ✅ cache the connection

// export const connection = async () => {
//   try {
//     if (!db) {
//       await client.connect();
//       console.log("✅ MongoDB Connected");
//       db = client.db(dbname);
//     }
//     return db;
//   } catch (err) {
//     console.error("❌ MongoDB Connection Error:", err);
//     throw err;
//   }
// };




import {MongoClient} from 'mongodb'
const url = "sandeep";
const dbname ="node-project";
export const collectionname ="todo"
const client = new MongoClient(url)
export const  connection = async ( ) => {
    const connect = await client.connect();
    console.log(connect);
   
   
    return await connect.db(dbname)
}

// // what  problem we can face url link ,do name , collection name  may be passward or username have somw problem in it 