import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ihosi.com' },
    update: {},
    create: {
      email: 'admin@ihosi.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create doctor user
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@ihosi.com' },
    update: {},
    create: {
      email: 'doctor@ihosi.com',
      password: doctorPassword,
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: 'DOCTOR',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Doctor user created:', doctor.email);

  // Create patient user
  const patientPassword = await bcrypt.hash('patient123', 12);
  const patient = await prisma.user.upsert({
    where: { email: 'patient@ihosi.com' },
    update: {},
    create: {
      email: 'patient@ihosi.com',
      password: patientPassword,
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'PATIENT',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Patient user created:', patient.email);

  // Create user profiles
  await prisma.userProfile.upsert({
    where: { userId: doctor.id },
    update: {},
    create: {
      userId: doctor.id,
      dateOfBirth: new Date('1980-01-15'),
      gender: 'MALE',
      address: '123 Medical Center Dr',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      licenseNumber: 'MD123456',
      specialization: 'Internal Medicine',
      department: 'Cardiology',
      experienceYears: 15,
    },
  });

  await prisma.userProfile.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      dateOfBirth: new Date('1990-05-20'),
      gender: 'FEMALE',
      address: '456 Patient St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10002',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+1-555-0123',
      emergencyContactRelation: 'Spouse',
    },
  });

  console.log('✅ User profiles created');

  // Create patient record
  await prisma.patient.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      patientId: 'PAT-001',
      insuranceNumber: 'INS123456789',
      insuranceProvider: 'Blue Cross Blue Shield',
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
      bloodType: 'O+',
      consentGiven: true,
      consentDate: new Date(),
    },
  });

  console.log('✅ Patient record created');

  // Create sample appointment
  await prisma.appointment.create({
    data: {
      title: 'Annual Checkup',
      description: 'Routine annual health checkup',
      type: 'ROUTINE_CHECKUP',
      status: 'SCHEDULED',
      priority: 'NORMAL',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 30,
      patientId: patient.id,
      doctorId: doctor.id,
      location: 'Medical Center - Room 101',
      isVirtual: false,
    },
  });

  console.log('✅ Sample appointment created');

  // Create sample notification
  await prisma.notification.create({
    data: {
      title: 'Welcome to iHosi',
      message: 'Welcome to the iHosi Healthcare platform!',
      type: 'SYSTEM_MAINTENANCE',
      priority: 'NORMAL',
      userId: patient.id,
      channels: ['IN_APP', 'EMAIL'],
      isSent: true,
      sentAt: new Date(),
    },
  });

  console.log('✅ Sample notification created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
