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

  // Create doctor user with profile info
  const doctorPassword = await bcrypt.hash('doctor123', 12);
  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@ihosi.com' },
    update: {},
    create: {
      email: 'doctor@ihosi.com',
      password: doctorPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'DOCTOR',
      isActive: true,
      isVerified: true,
      dateOfBirth: new Date('1980-01-15'),
      gender: 'MALE',
      phoneNumber: '+254-700-123455',
      address: '123 Medical Center Dr',
      city: 'Nairobi',
      state: 'Nairobi',
      country: 'KE',
      zipCode: '00100',
      specialization: 'Internal Medicine',
      department: 'Cardiology',
      licenseNumber: 'MD123456',
      avatar: 'https://i.pravatar.cc/150?img=68', // Placeholder profile image
    },
  });

  console.log('✅ Doctor user created:', doctor.email);

  // Create doctor profile
  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { doctorId: doctor.id },
    update: {},
    create: {
      doctorId: doctor.id,
      title: 'Dr.',
      credentials: ['MD', 'FACP'],
      specialties: ['Internal Medicine', 'Cardiology'],
      yearsExperience: 15,
      practiceName: 'Metropolitan Medical Center',
      practiceAddress: '123 Medical Center Dr',
      practiceCity: 'Nairobi',
      practiceState: 'Nairobi',
      practicePhone: '+254-700-123455',
      professionalBio: 'Board-certified cardiologist with 15 years of experience in treating cardiovascular diseases. Specialized in preventive cardiology and interventional procedures.',
      education: 'Harvard Medical School, MD | Johns Hopkins Hospital, Residency',
      isAcceptingNewPatients: true,
    },
  });

  console.log('✅ Doctor profile created');

  // Create consultation fee for doctor
  await prisma.consultationFee.create({
    data: {
      doctorId: doctor.id,
      profileId: doctorProfile.id,
      consultationType: 'IN_PERSON',
      baseFee: 50.00,
      isActive: true,
    },
  });

  console.log('✅ Consultation fee created');

  // Add doctor services
  await prisma.doctorService.createMany({
    data: [
      {
        doctorId: doctor.id,
        profileId: doctorProfile.id,
        name: 'General Consultation',
        category: 'CONSULTATION',
        duration: 30,
        isActive: true,
        isInPerson: true,
        isVirtual: false,
      },
      {
        doctorId: doctor.id,
        profileId: doctorProfile.id,
        name: 'Follow-up Consultation',
        category: 'FOLLOW_UP',
        duration: 15,
        isActive: true,
        isInPerson: true,
        isVirtual: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Doctor services created');

  // Create doctor schedule template and availability
  const scheduleTemplate = await prisma.doctorScheduleTemplate.create({
    data: {
      doctorId: doctor.id,
      name: 'Standard Week',
      description: 'Monday to Friday availability',
      isDefault: true,
      isActive: true,
    },
  });

  console.log('✅ Schedule template created');

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
      dateOfBirth: new Date('1990-05-20'),
      gender: 'FEMALE',
      phoneNumber: '+1-555-0200',
      address: '456 Patient St',
      city: 'New York',
      state: 'NY',
      country: 'US',
      zipCode: '10002',
    },
  });

  console.log('✅ Patient user created:', patient.email);

  // Create patient profile
  const patientProfile = await prisma.patientProfile.upsert({
    where: { patientId: patient.id },
    update: {},
    create: {
      patientId: patient.id,
      dateOfBirth: new Date('1990-05-20'),
      gender: 'FEMALE',
      bloodType: 'O_POSITIVE',
      emergencyContact: 'John Doe',
      emergencyPhone: '+1-555-0123',
      primaryInsurance: 'Blue Cross Blue Shield',
      insuranceNumber: 'INS123456789',
      preferredLanguage: 'English',
    },
  });

  console.log('✅ Patient profile created');

  // Create user profile for patient
  await prisma.userProfile.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+1-555-0123',
      emergencyContactRelation: 'Spouse',
      allergies: ['Penicillin', 'Shellfish'],
      medications: ['Metformin 500mg', 'Lisinopril 10mg'],
      medicalConditions: ['Type 2 Diabetes', 'Hypertension'],
      bloodType: 'O_POSITIVE',
      preferences: {},
      timezone: 'America/New_York',
      language: 'en',
    },
  });

  console.log('✅ User profile created');

  // Create a schedule for today and next few days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + i);
    
    await prisma.doctorSchedule.create({
      data: {
        doctorId: doctor.id,
        profileId: doctorProfile.id,
        templateId: scheduleTemplate.id,
        date: scheduleDate,
        dayOfWeek: scheduleDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() as any,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true,
        isRecurring: i === 0, // Only today is recurring
        slotDuration: 30,
        bufferTime: 5,
        maxBookings: 1,
        effectiveFrom: scheduleDate,
      },
    });
  }

  console.log('✅ Doctor schedules created');

  // Create additional doctors with complete profiles
  const doctorsData = [
    {
      email: 'sarah.johnson@ihosi.com',
      password: 'doctor123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialization: 'Pediatrics',
      department: 'Pediatrics',
      avatar: 'https://i.pravatar.cc/150?img=47',
      profile: {
        title: 'Dr.',
        credentials: ['MD', 'FAAP'],
        specialties: ['Pediatrics', 'Child Development'],
        yearsExperience: 12,
        practiceName: 'Children\'s Health Clinic',
        practiceAddress: '789 Pediatric Ave',
        practiceCity: 'Nairobi',
        practiceState: 'Nairobi',
        practicePhone: '+254-700-123456',
        professionalBio: 'Pediatrician specializing in child development and preventive care. Passionate about children\'s health and wellness.',
        education: 'University of Nairobi, MBChB | Kenyatta National Hospital, Residency',
      },
      consultationFee: 45.00,
      services: [
        { name: 'Pediatric Consultation', category: 'CONSULTATION', duration: 30 },
        { name: 'Child Vaccination', category: 'PREVENTIVE', duration: 15 },
        { name: 'Growth Assessment', category: 'DIAGNOSTIC', duration: 20 },
      ],
    },
    {
      email: 'michael.chen@ihosi.com',
      password: 'doctor123',
      firstName: 'Michael',
      lastName: 'Chen',
      specialization: 'Orthopedics',
      department: 'Orthopedic Surgery',
      avatar: 'https://i.pravatar.cc/150?img=33',
      profile: {
        title: 'Dr.',
        credentials: ['MD', 'FRCS'],
        specialties: ['Orthopedics', 'Sports Medicine'],
        yearsExperience: 18,
        practiceName: 'Nairobi Orthopedic Center',
        practiceAddress: '456 Sports Medicine Blvd',
        practiceCity: 'Nairobi',
        practiceState: 'Nairobi',
        practicePhone: '+254-700-123457',
        professionalBio: 'Orthopedic surgeon with expertise in sports injuries and joint replacement. Former team doctor for local football clubs.',
        education: 'Moi University, MBChB | Aga Khan Hospital, Residency',
      },
      consultationFee: 60.00,
      services: [
        { name: 'Orthopedic Consultation', category: 'CONSULTATION', duration: 45 },
        { name: 'Sports Injury Assessment', category: 'DIAGNOSTIC', duration: 30 },
        { name: 'Joint Injection', category: 'PROCEDURE', duration: 20 },
      ],
    },
    {
      email: 'amy.williams@ihosi.com',
      password: 'doctor123',
      firstName: 'Amy',
      lastName: 'Williams',
      specialization: 'Dermatology',
      department: 'Dermatology',
      avatar: 'https://i.pravatar.cc/150?img=45',
      profile: {
        title: 'Dr.',
        credentials: ['MD', 'FACD'],
        specialties: ['Dermatology', 'Cosmetic Dermatology'],
        yearsExperience: 10,
        practiceName: 'Skin Care Clinic',
        practiceAddress: '321 Beauty Lane',
        practiceCity: 'Nairobi',
        practiceState: 'Nairobi',
        practicePhone: '+254-700-123458',
        professionalBio: 'Dermatologist specializing in skin conditions, acne treatment, and cosmetic procedures. Committed to helping patients achieve healthy, radiant skin.',
        education: 'University of Nairobi, MBChB | Nairobi Hospital, Residency',
      },
      consultationFee: 55.00,
      services: [
        { name: 'Dermatology Consultation', category: 'CONSULTATION', duration: 30 },
        { name: 'Acne Treatment', category: 'THERAPEUTIC', duration: 20 },
        { name: 'Skin Biopsy', category: 'PROCEDURE', duration: 15 },
      ],
    },
    {
      email: 'james.odhiambo@ihosi.com',
      password: 'doctor123',
      firstName: 'James',
      lastName: 'Odhiambo',
      specialization: 'Obstetrics and Gynecology',
      department: 'OB/GYN',
      avatar: 'https://i.pravatar.cc/150?img=51',
      profile: {
        title: 'Dr.',
        credentials: ['MD', 'FRCOG'],
        specialties: ['Obstetrics', 'Gynecology', 'Maternal Health'],
        yearsExperience: 14,
        practiceName: 'Women\'s Health Center',
        practiceAddress: '654 Maternity Way',
        practiceCity: 'Nairobi',
        practiceState: 'Nairobi',
        practicePhone: '+254-700-123459',
        professionalBio: 'OB/GYN specialist providing comprehensive women\'s healthcare services including prenatal care, delivery, and gynecological procedures.',
        education: 'Moi University, MBChB | Kenyatta National Hospital, Residency',
      },
      consultationFee: 50.00,
      services: [
        { name: 'Prenatal Consultation', category: 'CONSULTATION', duration: 45 },
        { name: 'Antenatal Visit', category: 'CONSULTATION', duration: 30 },
        { name: 'Gynecological Exam', category: 'PREVENTIVE', duration: 30 },
      ],
    },
    {
      email: 'priya.patel@ihosi.com',
      password: 'doctor123',
      firstName: 'Priya',
      lastName: 'Patel',
      specialization: 'Endocrinology',
      department: 'Endocrinology',
      avatar: 'https://i.pravatar.cc/150?img=49',
      profile: {
        title: 'Dr.',
        credentials: ['MD', 'FACP'],
        specialties: ['Endocrinology', 'Diabetes Management'],
        yearsExperience: 11,
        practiceName: 'Diabetes Care Center',
        practiceAddress: '987 Wellness Lane',
        practiceCity: 'Nairobi',
        practiceState: 'Nairobi',
        practicePhone: '+254-700-123460',
        professionalBio: 'Endocrinologist specializing in diabetes, thyroid disorders, and hormonal imbalances. Focused on comprehensive diabetes management.',
        education: 'University of Nairobi, MBChB | Aga Khan Hospital, Fellowship',
      },
      consultationFee: 55.00,
      services: [
        { name: 'Endocrinology Consultation', category: 'CONSULTATION', duration: 40 },
        { name: 'Diabetes Management', category: 'THERAPEUTIC', duration: 30 },
        { name: 'Thyroid Function Test Review', category: 'DIAGNOSTIC', duration: 20 },
      ],
    },
  ];

  // Create additional doctors
  for (const doctorData of doctorsData) {
    const doctorPassword = await bcrypt.hash(doctorData.password, 12);
    
    const newDoctor = await prisma.user.upsert({
      where: { email: doctorData.email },
      update: {},
      create: {
        email: doctorData.email,
        password: doctorPassword,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        role: 'DOCTOR',
        isActive: true,
        isVerified: true,
        avatar: doctorData.avatar,
        specialization: doctorData.specialization,
        department: doctorData.department,
        phoneNumber: doctorData.profile.practicePhone,
        city: doctorData.profile.practiceCity,
        state: doctorData.profile.practiceState,
        country: 'KE',
      },
    });

    const newDoctorProfile = await prisma.doctorProfile.upsert({
      where: { doctorId: newDoctor.id },
      update: {},
      create: {
        doctorId: newDoctor.id,
        ...doctorData.profile,
        isAcceptingNewPatients: true,
      },
    });

    // Create consultation fee
    await prisma.consultationFee.create({
      data: {
        doctorId: newDoctor.id,
        profileId: newDoctorProfile.id,
        consultationType: 'IN_PERSON',
        baseFee: doctorData.consultationFee,
        isActive: true,
      },
    });

    // Create services
    await prisma.doctorService.createMany({
      data: doctorData.services.map(service => ({
        doctorId: newDoctor.id,
        profileId: newDoctorProfile.id,
        name: service.name,
        category: service.category as any,
        duration: service.duration,
        isActive: true,
        isInPerson: true,
        isVirtual: false,
      })),
      skipDuplicates: true,
    });

    // Create schedule template
    const newScheduleTemplate = await prisma.doctorScheduleTemplate.create({
      data: {
        doctorId: newDoctor.id,
        name: 'Standard Week',
        description: 'Monday to Friday availability',
        isDefault: true,
        isActive: true,
      },
    });

    // Create schedules for next 7 days
    for (let i = 0; i < 7; i++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + i);
      const dayOfWeek = scheduleDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      
      await prisma.doctorSchedule.create({
        data: {
          doctorId: newDoctor.id,
          profileId: newDoctorProfile.id,
          templateId: newScheduleTemplate.id,
          date: scheduleDate,
          dayOfWeek: dayOfWeek as any,
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
          isRecurring: i === 0,
          slotDuration: 30,
          bufferTime: 5,
          maxBookings: 1,
          effectiveFrom: scheduleDate,
        },
      });
    }

    console.log(`✅ Doctor created: ${newDoctor.email}`);
  }

  console.log('✅ All doctors with complete profiles created');

  // Create sample appointment (PENDING status for testing booking workflow)
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 2); // 2 days from now
  appointmentDate.setHours(0, 0, 0, 0); // Set to midnight for date comparison

  // Delete any existing appointment with same doctor/date/time to avoid unique constraint
  await prisma.appointment.deleteMany({
    where: {
      doctorId: doctor.id,
      appointmentDate: appointmentDate,
      startTime: '10:00',
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      doctorId: doctor.id,
      patientId: patient.id,
      appointmentDate: appointmentDate,
      startTime: '10:00',
      endTime: '10:30',
      duration: 30,
      type: 'CONSULTATION',
      status: 'PENDING', // For testing - doctor needs to confirm
      reasonForVisit: 'Regular checkup',
      requiresConfirmation: true,
      bookingRequestedAt: new Date(),
    },
  });

  console.log('✅ Sample appointment created');

  // Create sample notification for doctor (appointment request)
  await prisma.notification.create({
    data: {
      userId: doctor.id,
      type: 'APPOINTMENT_REQUESTED',
      title: 'New Appointment Request',
      message: `${patient.firstName} ${patient.lastName} requested an appointment on ${appointmentDate.toLocaleDateString()} at 10:00`,
      body: 'Regular checkup',
      priority: 'NORMAL',
      actionUrl: `/appointments/${appointment.id}`,
      actionLabel: 'View Request',
      metadata: {
        appointmentId: appointment.id,
        patientId: patient.id,
        date: appointmentDate.toISOString(),
      },
      relatedEntityType: 'APPOINTMENT',
      relatedEntityId: appointment.id,
      channels: ['IN_APP', 'PUSH'],
    },
  });

  console.log('✅ Sample notification created for doctor');

  // Create welcome notification for patient
  await prisma.notification.create({
    data: {
      userId: patient.id,
      type: 'WELCOME',
      title: 'Welcome to iHosi',
      message: 'Welcome to the iHosi Healthcare platform!',
      body: 'We are excited to have you on board. Book your first appointment to get started.',
      priority: 'NORMAL',
      channels: ['IN_APP', 'EMAIL'],
    },
  });

  console.log('✅ Welcome notification created for patient');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('   Admin: admin@ihosi.com / admin123');
  console.log('   Patient: patient@ihosi.com / patient123');
  console.log('\n👨‍⚕️ Doctors (password: doctor123):');
  console.log('   1. Dr. John Smith (Cardiology): doctor@ihosi.com');
  console.log('   2. Dr. Sarah Johnson (Pediatrics): sarah.johnson@ihosi.com');
  console.log('   3. Dr. Michael Chen (Orthopedics): michael.chen@ihosi.com');
  console.log('   4. Dr. Amy Williams (Dermatology): amy.williams@ihosi.com');
  console.log('   5. Dr. James Odhiambo (OB/GYN): james.odhiambo@ihosi.com');
  console.log('   6. Dr. Priya Patel (Endocrinology): priya.patel@ihosi.com');
  console.log('\n💡 All doctors have:');
  console.log('   ✓ Complete profiles with bio and education');
  console.log('   ✓ Consultation fees (KES 45-60)');
  console.log('   ✓ Multiple services');
  console.log('   ✓ Schedule availability for next 7 days');
  console.log('   ✓ Placeholder profile images');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
