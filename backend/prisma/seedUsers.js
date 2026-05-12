const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Seeding users...');

  const hash = async (pw) => bcrypt.hash(pw, 10);

  const users = [
    { name:'Admin (Jeff)',    email:'admin@realcrm.com',   password: await hash('admin123'),  role:'admin'   },
    { name:'Sarah Johnson',  email:'sarah@realcrm.com',   password: await hash('demo123'),   role:'manager' },
    { name:'Marcus Lee',     email:'marcus@realcrm.com',  password: await hash('demo123'),   role:'agent'   },
    { name:'Diana Chen',     email:'diana@realcrm.com',   password: await hash('demo123'),   role:'agent'   },
    { name:'Billy Rabbitt',  email:'billy@demo.com',      password: await hash('billy2026'), role:'broker'  },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: u
    });
    console.log(`  ✓ ${u.email}`);
  }

  console.log('\n📋 Demo credentials:');
  console.log('  admin@realcrm.com  / admin123   (full access)');
  console.log('  sarah@realcrm.com  / demo123    (manager)');
  console.log('  billy@demo.com     / billy2026  (Billy Rabbitt — Broker)');
}

main().catch(console.error).finally(() => prisma.$disconnect());
