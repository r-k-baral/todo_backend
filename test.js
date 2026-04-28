import { MongoClient } from "mongodb";

const uri = "";

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("✅ Connected successfully");
} catch (err) {
  console.error("❌ Connection failed:", err);
}