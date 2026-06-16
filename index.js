require("dotenv").config({ override: true });

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("./models/Todo");
const todoRouter = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || origin === "null") {
      callback(null, true);
      return;
    }

    const allowed =
      /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

    callback(null, allowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/todos", todoRouter);
app.use(express.static(path.join(__dirname, "../todo")));

async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI 환경 변수가 필요합니다.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("연결 성공");
    console.log(`MongoDB: ${mongoose.connection.host} / ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log(`서버 실행 중: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
}

startServer();
