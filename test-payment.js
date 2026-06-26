const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
});

async function main() {
  const users = await prisma.user.findMany({ take: 1, orderBy: { createdAt: 'asc' } });
  if (users.length === 0) {
    console.log("No users found to assign a payment to.");
    return;
  }
  const user = users[0];

  const payment = await prisma.paymentRecord.create({
    data: {
      userId: user.id,
      amount: 500,
      status: 'REQUESTED',
      releaseDate: new Date(),
    }
  });

  console.log("Successfully created test payment:", payment);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
