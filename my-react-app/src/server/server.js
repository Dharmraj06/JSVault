import express from "express";
import { connectDB } from "./db.js";
import Users from "./model/user.js";
import dotenv from "dotenv";
import cors from "cors";
import Notes from "./model/note.js";
import passport from "passport";
import session from "express-session";
import LocalStrategy from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });
const app = express();
const port = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/client/public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
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
        const user = await Users.findOne({ email: email.trim() });

        if (user) {
          if (!user.password) {
            return done(null, false, {
              message:
                "Account created via google login. please login with google.",
            });
          }
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
    },
  ),
);

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5174/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?profile.emails[0].value:null;

        if (!email) {
          return done(new Error("No email found in google profile"));
        }

        let user = await Users.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (user) {
          let updated = false;
          if (!user.googleId) {
            user.googleId = profile.id;
            updated = true;
          }
          if (updated) {
            await user.save();
          }
          return done(null, user);
        } else {
          user = await Users.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
          });
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get(
  "/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
  },
);

app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
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


app.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Users.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("user registered:", user);

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
    });

    res.status(201).json({
      message: "registration successful",
      user,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/newNote", ensureauth, async (req, res) => {
  console.log("Received new note request:");
  const { title, language, tags, code, codeDetails, summary } = req.body;

  if (!title || !language || !tags || !code || !codeDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userID = req.user._id;
    const note = await Notes.create({
      userId: userID,
      title,
      language,
      tags,
      isArchived: false,
      code,
      codeDetails,
      summary: summary || "",
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
  //console.log("userid is :", req.user._id);
  try {
    const recentnotes = await Notes.find({
      userId: req.user._id,
      isArchived: false,
      isTrashed: false,
    })
      .sort({
        createdAt: -1,
      })
      .limit(3);

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
      return res.status(400).json({ message: "invalid note ID" });
    }

    const note = await Notes.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/editNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  const { title, language, tags, code, codeDetails, summary } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const updatedNote = await Notes.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      {
        title,
        language,
        tags,
        code,
        codeDetails,
        summary: summary || "",
      },
      { new: true },
    );

    if (!updatedNote) {
      return res
        .status(404)
        .json({ message: "Note not found or unauthorized" });
    }

    res
      .status(200)
      .json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/archiveNote/:id", ensureauth, async (req, res) => {
  //console.log("archive request is reached to server");
  try {
    const noteId = req.params.id;
    const note = await Notes.findById(noteId);
    if (!note) {
      res.status(404).json({ message: "not found" });
    }
    note.isArchived = true;
    await note.save();
    res.status(200).json({ message: " Note achived successfully", note });
  } catch (error) {
    console.error("error in archiving", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/archivedNotes", ensureauth, async (req, res) => {
  //console.log("server se bol raha hun.");
  console.log("user id is:", req.user._id);
  try {
    const userId = req.user._id;
    const archivednotes = await Notes.find({ userId, isArchived: true });
    if (!archivednotes) {
      console.log("no archived notes");
      res.status(404).json({ message: "No archived notes" });

    }
    res.status(200).json(archivednotes);

  } catch (error) {

    console.log("error in achiving notes", error);
    res.status(500).json({ message: "internal server error" });
    
  }
});

app.post("/unarchiveNote/:id", ensureauth, async (req, res) => {
  //console.log("yeh note ab unarchive hogi");
  try {
    const noteId = req.params.id;
    const note = await Notes.findById(noteId);
    if (!note) {
      console.log("note not found");
    }

    note.isArchived = false;
    await note.save();

    res.status(200).json({ message: "Note unarchived successfully", note });
  } catch (error) {

    console.error("error in unarchiving", error);
    res.status(500).json({ message: "Internal server error" });

  }
});

app.post("/tempDeleteNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Notes.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    note.isTrashed = true;
    await note.save();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/trashedNotes", ensureauth, async (req, res) => {
  try {
    const userId = req.user._id;
    const trashedNotes = await Notes.find({ userId, isTrashed: true });

    if (!trashedNotes)  {

      console.log("no trashed notes");
      res.status(404).json({ message: "no trashed notes" });
    }
    res.status(200).json(trashedNotes);
  } catch (error) {

    console.error("error in trashing notes", error);
    res.status(500).json({ message: "internal server error" });
  }
});

app.put("/restoreNote/:id", ensureauth, async (req, res) => {
  const noteId = req.params.id;
  try {
    const note = await Notes.findById(noteId);

    note.isTrashed = false ;
    await note.save() ;

    res.status(200).json({ message: "Note restored success", note });

  } catch (error) {
    console.error("error in restoring note", error);
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

app.delete("/deleteAccount", ensureauth, async (req, res) => {
  try {
    const userId = req.user._id;
    // delete all user notes
    await Notes.deleteMany({ userId });
    // delete the user document
    await Users.findByIdAndDelete(userId);
    // log out and clear session cookie
    req.logout((err) => {
      if (err) {
        console.error("Logout error during account deletion:", err);
        return res
          .status(500)
          .json({ message: "Logout error during account deletion" });
      }

      req.session.destroy();
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Error during account deletion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/notes", ensureauth, async (req, res) => {
  const { search } = req.query;
  try {
    const queryConditions = {
      userId: req.user._id,
      isTrashed: false,
    };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      queryConditions.$or = [{ title: searchRegex }, { tags: searchRegex }];
    }

    const notes = await Notes.find(queryConditions).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error searching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/AllNotes", ensureauth, async (req, res) => {
  try {
    const allnotes = await Notes.find({
      userId: req.user._id,
      isTrashed: false,
    }).sort({
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
    const note = await Notes.findByIdAndDelete(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/notes/generate-summary", ensureauth, async (req, res) => {
  const { title, language, code, description } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message:
        "Summary service is not configured. Please add GEMINI_API_KEY to your .env file.",
    });
  }

  const prompt = `You are a programming tutor summarizing a developer note.

Write a concise summary in 2 plain sentences for a beginner developer.
Describe what the code does, important concepts used, and where the snippet is useful.
Use only the information provided below. Do not invent functionality or missing code.
Do not mention AI, Gemini, or that this was generated.
Do not use markdown, bullet points, or lists.

Title: ${title || "Untitled"}
Language: ${language || "Unknown"}
Description: ${description || "None provided"}
Code:
${code || "No code provided"}`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const timeout = 30000; // in ms

    const generateres = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const timeoutres = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Summary request timed out")), timeout);
    });

    const response = await Promise.race([generateres, timeoutres]);

    const summary = response.text?.trim();

    if (!summary) {
      return res.status(502).json({
        message:
          "Could not generate a summary. Please try again or write one manually.",
      });
    }

    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      message:
        "Failed to generate summary. Please try again or write one manually.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // console.log(User.find());
});
