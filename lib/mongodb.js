// lib/mongodb.js
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your .env.local file")
}

client = new MongoClient(uri, options)
clientPromise = client.connect()

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db("ticketvault") // 👈 This DB will be auto-created
  return { db }
}
