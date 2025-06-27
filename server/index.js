const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basit test endpoint
app.get("/", (req, res) => {
  res.send("Blog API çalışıyor 🚀");
});

// Port ayarı
const PORT = process.env.PORT || 5000;

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı ✅");
    app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`));
  })
  .catch((err) => console.error("MongoDB bağlantı hatası ❌", err));


const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const postRoute = require("./routes/posts");
app.use("/api/posts", postRoute);

const commentRoute = require("./routes/comments");
app.use("/api/comments", commentRoute);

