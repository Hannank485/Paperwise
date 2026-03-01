import "dotenv/config";
import app from "./app";
const PORT = process.env.PORT || 3000;
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
app.listen(Number(PORT), () =>
  console.log("Server is up and running on ", PORT),
);
