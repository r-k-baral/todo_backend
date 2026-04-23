const {MongoClient} = require("mongodb")
const url = "";
const dbname ="";
const client = new MongoClient(url)
const  connection = async ( ) => {
    const connect = await client.connect();
    return connect.db(dbname)
}