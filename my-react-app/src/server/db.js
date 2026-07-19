//import express from 'express';
//const app = express();
import mongoose from 'mongoose';

export const connectDB = async() => {
	try {
		const connect = await mongoose.connect(process.env.mongoDB_URI)
		console.log(`Database is connected successfully: ${connect.connection.host}`);
	} catch(error) {
		console.log(`error: ${error}`);
	}
}