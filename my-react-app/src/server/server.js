import express from 'express';
import {connectDB} from './db.js';

const app = express();
const port = 5174;

connectDB();

app.get("/", (req, res) => {
    //res.json({ message: "Hello from backend!" });
});

app.listen(port, () => {

    console.log(`Server running on http://localhost:${port}`);
});


