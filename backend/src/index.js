const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// CREATE
app.post("/api/test", async (req, res) => {
  const msg = req.body?.message || "Hello from Prisma!";
  const row = await prisma.test.create({ data: { message: msg } });
  res.json(row);
});

// READ
app.get("/api/test", async (_req, res) => {
  const rows = await prisma.test.findMany({ orderBy: { id: "desc" } });
  res.json(rows);
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
