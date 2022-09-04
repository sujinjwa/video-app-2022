import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 4000; // 로컬에서는 4000으로, heroku에선s process.env.PORT로 연결

const handleListening = () =>
  console.log(`✅ Server Listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
// app.listen(PORT);
