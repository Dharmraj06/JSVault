import express from 'express';
import {connectDB} from './db.js';
import newUser from './model/user.js';
import dotenv from 'dotenv';
import cors from 'cors';
import Note from './model/note.js';
import mongoose from 'mongoose';


dotenv.config();
const app = express();
const port = 5174;
let userID;

connectDB();

app.use(cors({
  origin: 'http://localhost:5173',   
  credentials: true                 
}));

let loggedIn = null;

app.get("/", (req, res) => {
    if (loggedIn) {
        res.redirect("/dashboard");
    }else {
        res.redirect("/login");
    }
}

);  

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('/client/public'));

app.get("/login", (req, res) => {
    if (loggedIn) {
        res.redirect("/dashboard");
    } else {
        res.sendFile('login.html', { root: './client/public' });
    }
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    //checking in the DB that this user exists
    if (email && password) {
        try {
            const user = await newUser.findOne({email: email.trim(), password: password.trim()});

            if(user) {
                loggedIn = user;
                userID = loggedIn._id;

                console.log("User found:", user);
                res.status(200).json({message: "Login successful", user});
                console.log("User logged in:", user.email);
            } else {
                res.status(401).json({message: "Invalid email or password"});
            }

        } catch (error) {

            res.status(500).json({message: "Internal server error"});
            console.error("Error during login:", error);
        }
    } else {
        res.status(400).json({message: "Invalid email or password"});
    }

});

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await newUser.create({name, email, password});
        console.log("User registered:", user);
        res.status(201).json({message: "Registration successful", user});
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

app.post('/newNote', async (req, res) => {
    console.log("Received new note request:");
    const {title, language, tags, code, codeDetails} = req.body;
    if (!title || !language || !tags || !code || !codeDetails) {
        return res.status(400).json({message: "All fields are required"});
    }
    try {
        const note = await Note.create({userId: userID, title, language, tags, isArchived: false, code, codeDetails});
        console.log("Note created:", note);
        res.status(201).json({message: "Note created successfully", note});
    } catch (error) {
        console.error("Error during note creation:", error);
        res.status(500).json({message: "Internal server error"});
    }
});


app.post('/dashboard', async (req, res) => {
    console.log("userid is :",userID)
    try {
        const notes = await Note.find({userId: userID}).sort({createdAt: -1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({message: "Internal server error"});
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // console.log(User.find());
});


