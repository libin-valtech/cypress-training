import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://0.0.0.0:27017', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(
      `MongoDB connected: ${conn.connection.host}`.green.underline.bold
    )
  } catch (err) {
    console.error(`💥💥💥 Error: ${err.message}`.red.bold)
    process.exit(1)
  }
}

export default connectDB
