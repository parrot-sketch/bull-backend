import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simplified database seeding...');

  // Create a test doctor user
  const doctor = await prisma.user.upsert({
    where: { email: 'demo@ihosi.com' },
    update: {},
    create: {
      id: 'demo-user-123',
      email: 'demo@ihosi.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      firstName: 'Demo',
      lastName: 'User',
      role: 'DOCTOR',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Created doctor user:', doctor.email);

  // Create a simplified doctor profile
  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { doctorId: doctor.id },
    update: {},
    create: {
      doctorId: doctor.id,
      specialization: 'General Medicine',
      bio: 'Experienced general practitioner with 10+ years of experience in primary care and preventive medicine.',
      experience: '10+ years',
      education: 'MD from Harvard Medical School',
      consultationFee: 150,
      services: 'General Consultation, Health Checkups, Preventive Care, Chronic Disease Management',
      availability: 'Monday-Friday 9AM-5PM, Weekends by appointment',
    },
  });

  console.log('✅ Created doctor profile for:', doctor.email);

  // Create a test patient user
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      id: 'patient-user-123',
      email: 'patient@example.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      firstName: 'John',
      lastName: 'Patient',
      role: 'PATIENT',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Created patient user:', patient.email);

  console.log('🎉 Simplified seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });