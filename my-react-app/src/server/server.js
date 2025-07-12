import express from 'express';
import {connectDB} from './db.js';
import User from './model/user.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 5174;

connectDB();

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

// app.get("/login", (req, res) => {
//     User.create(req.body);
// })

app.post("/login", (req, res) => {
    const {email, password} = req.body;

    //checking in the DB that this user exists
    if (email && password) {
        if(User.findOne({email, password})){
            loggedIn = true;
            res.status(200).json({message: "Login successful", email});
            res.redirect("/dashboard");
        }
    } else {
        res.status(400).json({message: "Invalid email or password"});
    }

});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // console.log(User.find());
});


