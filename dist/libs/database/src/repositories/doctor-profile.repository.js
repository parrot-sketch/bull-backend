"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DoctorProfileRepository = class DoctorProfileRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get doctorProfile() { return this.prisma.doctorProfile; }
    get doctorService() { return this.prisma.doctorService; }
    get doctorInsurance() { return this.prisma.doctorInsurance; }
    get consultationFee() { return this.prisma.consultationFee; }
    get doctorSchedule() { return this.prisma.doctorSchedule; }
    get doctorAvailability() { return this.prisma.doctorAvailability; }
    async findByDoctorId(doctorId) {
        return this.doctorProfile.findUnique({ where: { doctorId } });
    }
    async createProfile(data) {
        return this.doctorProfile.create({ data: data });
    }
    async updateProfile(id, data) {
        return this.doctorProfile.update({ where: { id }, data: data });
    }
    async findServicesByDoctor(doctorId) {
        return this.doctorService.findMany({ where: { doctorId } });
    }
    async findAvailability(doctorId, date) {
        return this.doctorAvailability.findMany({ where: { doctorId, date } });
    }
};
exports.DoctorProfileRepository = DoctorProfileRepository;
exports.DoctorProfileRepository = DoctorProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorProfileRepository);
//# sourceMappingURL=doctor-profile.repository.js.map