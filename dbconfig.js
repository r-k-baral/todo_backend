import {MongoClient} from 'mongodb'
const url = "";
const dbname ="node-project";
export const collectionname ="todo"
const client = new MongoClient(url)
export const  connection = async ( ) => {
    const connect = await client.connect();
    return await connect.db(dbname)
}
