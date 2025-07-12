import express from 'express';
import {connectDB} from './db.js';
import User from './model/user.js';
import dotenv from 'dotenv';
import cors from 'cors';

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
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('/client/public'));

app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));


app.get("/login", (req, res) => {
    if (loggedIn) {
        res.redirect("/dashboard");
    } else {
        res.sendFile('index.html', {root: 'C:\\Users\\vaghe\\OneDrive\\Desktop\\Coding\\Development\\JS-MERN\\JSVault\\my-react-app'});
    }
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    //checking in the DB that this user exists
    if (email && password) {
        try {
            const user = await User.findOne({email: email.trim(), password: password.trim()});
            console.log("User found:", user);
            if(user) {
                loggedIn = user;
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


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    // console.log(User.find());
});


