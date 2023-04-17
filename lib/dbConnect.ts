import mongoose from 'mongoose'

const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    'Please define the MONGODB_CONNECTION_STRING environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
//@ts-ignore
let cached = global.mongoose

if (!cached) {
  //@ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
//@ts-ignore
    cached.promise = mongoose.connect(MONGODB_CONNECTION_STRING, opts).then((mongoose) => {
        console.log("Connected!")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect