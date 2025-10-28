import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test patient
  const hashedPassword = await bcrypt.hash('patient123', 10);
  
  const testPatient = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'PATIENT',
      phoneNumber: '+254700123456',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      address: '123 Main Street',
      city: 'Nairobi',
      state: 'Nairobi',
      zipCode: '00100',
      country: 'Kenya',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Test patient created:', testPatient.email);

  // Create patient profile
  const patientProfile = await prisma.patientProfile.upsert({
    where: { patientId: testPatient.id },
    update: {},
    create: {
      patientId: testPatient.id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      bloodType: 'O_POSITIVE',
      height: 175.0, // cm
      weight: 70.0, // kg
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+254700654321',
      medicalHistory: ['Hypertension', 'Diabetes Type 2'],
      surgicalHistory: ['Appendectomy (2015)'],
      familyHistory: ['Heart Disease', 'Diabetes'],
      socialHistory: 'Non-smoker, occasional alcohol',
      primaryInsurance: 'NHIF',
      insuranceNumber: 'NHIF123456789',
      insuranceExpiry: new Date('2025-12-31'),
      preferredLanguage: 'English',
      communicationPref: 'EMAIL',
    },
  });

  console.log('✅ Patient profile created for:', testPatient.email);

  // Add some allergies
  await prisma.patientAllergy.createMany({
    data: [
      {
        patientId: patientProfile.id,
        allergen: 'Penicillin',
        severity: 'SEVERE',
        reaction: 'Rash and difficulty breathing',
        diagnosedAt: new Date('2020-01-15'),
        diagnosedBy: 'Dr. Smith',
      },
      {
        patientId: patientProfile.id,
        allergen: 'Shellfish',
        severity: 'MODERATE',
        reaction: 'Nausea and vomiting',
        diagnosedAt: new Date('2019-06-20'),
        diagnosedBy: 'Dr. Johnson',
      },
    ],
  });

  console.log('✅ Patient allergies added');

  // Add current medications
  await prisma.patientMedication.createMany({
    data: [
      {
        patientId: patientProfile.id,
        medicationName: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        route: 'Oral',
        startDate: new Date('2023-01-01'),
        prescribedBy: 'Dr. Smith',
        pharmacy: 'Nairobi Pharmacy',
        notes: 'Take with food',
      },
      {
        patientId: patientProfile.id,
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'Oral',
        startDate: new Date('2023-02-15'),
        prescribedBy: 'Dr. Smith',
        pharmacy: 'Nairobi Pharmacy',
        notes: 'Monitor blood pressure',
      },
    ],
  });

  console.log('✅ Patient medications added');

  // Create test doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  
  const testDoctor = await prisma.user.upsert({
    where: { email: 'doctor@test.com' },
    update: {},
    create: {
      email: 'doctor@test.com',
      password: doctorPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Smith',
      role: 'DOCTOR',
      phoneNumber: '+254700987654',
      department: 'Internal Medicine',
      specialization: 'General Practitioner',
      licenseNumber: 'KMPC12345',
      npiNumber: '1234567890',
      isActive: true,
      isVerified: true,
    },
  });

  console.log('✅ Test doctor created:', testDoctor.email);

  // Create doctor profile
  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { doctorId: testDoctor.id },
    update: {},
    create: {
      doctorId: testDoctor.id,
      practiceName: 'Nairobi Medical Center',
      practiceAddress: '456 Hospital Road',
      practiceCity: 'Nairobi',
      practiceState: 'Nairobi',
      practicePhone: '+254700555555',
      specialties: ['General Practice', 'Internal Medicine'],
      yearsExperience: 10,
      professionalBio: 'Experienced general practitioner with expertise in chronic disease management.',
      isAcceptingNewPatients: true,
      currency: 'KES',
    },
  });

  console.log('✅ Doctor profile created for:', testDoctor.email);

  // Create some sample appointments
  const appointment1 = await prisma.appointment.create({
    data: {
      doctorId: testDoctor.id,
      patientId: testPatient.id,
      appointmentDate: new Date('2024-01-15'),
      startTime: '09:00',
      endTime: '09:30',
      duration: 30,
      type: 'CONSULTATION',
      status: 'CONFIRMED',
      reasonForVisit: 'Regular checkup',
      paymentStatus: 'PAID',
      bookingRequestedAt: new Date('2024-01-10'),
      confirmedAt: new Date('2024-01-11'),
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      doctorId: testDoctor.id,
      patientId: testPatient.id,
      appointmentDate: new Date('2024-01-20'),
      startTime: '14:00',
      endTime: '14:30',
      duration: 30,
      type: 'FOLLOW_UP',
      status: 'PENDING',
      reasonForVisit: 'Follow-up for diabetes management',
      paymentStatus: 'PENDING',
      bookingRequestedAt: new Date('2024-01-15'),
    },
  });

  console.log('✅ Sample appointments created');

  // Create a sample visit
  const visit = await prisma.patientVisit.create({
    data: {
      patientId: patientProfile.id,
      doctorId: testDoctor.id,
      appointmentId: appointment1.id,
      visitDate: new Date('2024-01-15'),
      visitType: 'CONSULTATION',
      chiefComplaint: 'Regular checkup and medication review',
      subjective: 'Patient reports feeling well overall. Blood sugar levels have been stable. No new symptoms.',
      objective: 'Vital signs: BP 130/80, HR 72, Temp 98.6°F. Weight stable at 70kg. Physical exam unremarkable.',
      assessment: 'Diabetes Type 2 - well controlled, Hypertension - stable',
      plan: 'Continue current medications. Follow up in 3 months. Monitor blood sugar levels.',
      followUpRequired: true,
      followUpDate: new Date('2024-04-15'),
      followUpNotes: 'Regular follow-up for diabetes and hypertension management',
    },
  });

  console.log('✅ Sample visit created');

  // Add diagnoses to visit
  await prisma.visitDiagnosis.createMany({
    data: [
      {
        visitId: visit.id,
        icd10Code: 'E11.9',
        diagnosisName: 'Type 2 diabetes mellitus without complications',
        isPrimary: true,
      },
      {
        visitId: visit.id,
        icd10Code: 'I10',
        diagnosisName: 'Essential hypertension',
        isPrimary: false,
      },
    ],
  });

  console.log('✅ Visit diagnoses added');

  // Create some sample drugs
  await prisma.drug.createMany({
    data: [
      {
        name: 'Metformin',
        genericName: 'Metformin',
        brandNames: ['Glucophage', 'Fortamet'],
        drugClass: 'Biguanide',
        contraindications: ['Severe kidney disease', 'Severe liver disease'],
      },
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        brandNames: ['Prinivil', 'Zestril'],
        drugClass: 'ACE Inhibitor',
        contraindications: ['Pregnancy', 'Bilateral renal artery stenosis'],
      },
      {
        name: 'Warfarin',
        genericName: 'Warfarin',
        brandNames: ['Coumadin', 'Jantoven'],
        drugClass: 'Anticoagulant',
        contraindications: ['Active bleeding', 'Severe liver disease'],
      },
    ],
  });

  console.log('✅ Sample drugs created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('👤 Patient: patient@test.com / patient123');
  console.log('👨‍⚕️ Doctor: doctor@test.com / doctor123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });