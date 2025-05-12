import {configDotenv} from "dotenv";
import {startup} from "./app.js";

configDotenv({
  path: [".env.local", ".env"]
});

try {
  const { url } = await startup(Number(process.env.API_PORT));

  console.log("API runs at", url);
} catch (e) {
  console.log("Startup fail");
  console.error(e);
}