"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
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
//# sourceMappingURL=simple-seed.js.map