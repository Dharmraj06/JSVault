import express from "express";
import { connectDB } from "./db.js";
import newUser from "./model/user.js";
import dotenv from "dotenv";
import cors from "cors";
import Note from "./model/note.js";
import passport from "passport";
import session, { Cookie } from "express-session";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const port = 5174;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/client/public"));
app.use(
  session({
    secret: "secrets", //to be updated
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await newUser.findOne({ email: email.trim() });

        if (user) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, { message: "incorrect password" });
          }
        } else {
          return done(null, false, { message: "incorrect email" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await newUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "login successful", user: req.user });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await newUser.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("user registered:", user);

    res.status(201).json({ message: "registration successful", user });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/newNote", ensureauth, async (req, res) => {
  console.log("Received new note request:");
  const { title, language, tags, code, codeDetails } = req.body;

  if (!title || !language || !tags || !code || !codeDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userID = req.user._id;
    const note = await Note.create({
      userId: userID,
      title,
      language,
      tags,
      isArchived: false,
      code,
      codeDetails,
    });
    console.log("Note created:", note);
    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    console.error("Error during note creation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

function ensureauth(req, res, next) {
  if (req.isAuthenticated()) return next(); // calling the nxt middleware

  res.status(401).json({ message: "Unauthorized. please login!" });
}

app.post("/dashboard", ensureauth, async (req, res) => {
  console.log("userid is :", req.user._id);
  try {
    const recentnotes = await Note.find({ userId: req.user._id })
      .sort({
        createdAt: -1,
      })
      .limit(3);

    //console.log(recentnotes);
    res.status(200).json(recentnotes);
  } catch (error) {
    console.error("Error fetching recentnotes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/editNotes/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/editNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  const { title, language, tags, code, codeDetails } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id }, 
      {
        title,
        language,
        tags,
        code,
        codeDetails,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/deleteNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.get("/AllNotes", ensureauth, async (req, res) => {
  try {
    const allnotes = await Note.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("all notes are as follow ---------", allnotes);
    res.status(200).json(allnotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/deleteNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // console.log(User.find());
});
