"use server"

import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || "hotel-booking"

// Check if MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Create a new connection
  const client = new MongoClient(MONGODB_URI as string, {
    // Avoid using optional features that require binary modules
    monitorCommands: false,
  })

  await client.connect()
  const db = client.db(MONGODB_DB)

  // Cache the connection
  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function dbConnect() {
  const { db } = await connectToDatabase()
  return db
}

