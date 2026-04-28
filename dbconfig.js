import {MongoClient} from 'mongodb'
const url = "";
const dbname ="node-project";
export const collectionname ="todo"
const client = new MongoClient(url)
export const  connection = async ( ) => {
    const connect = await client.connect();
    console.log(connect);
    
    return await connect.db(dbname)
}

// what  problem we can face url link ,do name , collection name  may be passward or username have somw problem in it 