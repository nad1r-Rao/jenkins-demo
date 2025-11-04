const express = require("express");
const app = express();
app.get("/", (_req, res) => res.send("CI/CD via Jenkins ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));
