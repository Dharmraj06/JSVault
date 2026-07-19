//import express from 'express';
//const app = express();
import mongoose from 'mongoose';

export const connectDB = async() => {
	try {
		const connect = await mongoose.connect('mongodb+srv://202401230:M21rhTT3Zyh1oXWa@cluster0.g2mqq8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
		console.log(`Database is connected successfully: ${connect.connection.host}`);
	} catch(error) {
		console.log(`error: ${error}`);
	}
}