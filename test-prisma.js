const { PrismaClient } = require("@prisma/client");

try {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || "file:./dev.db",
  });
  console.log("Success with datasourceUrl");
} catch (e) {
  console.error("Failed with datasourceUrl", e.message);
}

try {
  const prisma2 = new PrismaClient({
    url: "file:./dev.db",
  });
  console.log("Success with url");
} catch (e) {
  console.error("Failed with url", e.message);
}
