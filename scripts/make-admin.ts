import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error("Please provide an email address as the first argument.");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted ${user.email} to ADMIN.`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`User with email ${email} not found.`);
    } else {
      console.error("An error occurred:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
