import "dotenv/config";
import app from "./app";
const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), "0.0.0.0", () =>
  console.log("Server is up and running on ", PORT),
);
