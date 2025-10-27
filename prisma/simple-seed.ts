import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create demo doctor user
  const doctorPassword = await bcrypt.hash('demo123', 12);
  const doctor = await prisma.user.upsert({
    where: { email: 'demo@ihosi.com' },
    update: {},
    create: {
      email: 'demo@ihosi.com',
      password: doctorPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'DOCTOR',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Demo doctor user created:', doctor.email);
  console.log('📧 Email: demo@ihosi.com');
  console.log('🔑 Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
