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
    async createProfile(doctorId, data) {
        return this.doctorProfile.create({
            data: {
                ...data,
                doctorId
            },
            include: {
                services: true,
                insurances: true,
                consultationFees: true
            }
        });
    }
    async findProfileById(doctorId) {
        const profile = await this.doctorProfile.findUnique({
            where: { doctorId },
            include: {
                services: true,
                insurances: true,
                consultationFees: true,
                schedules: true
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException(`Doctor profile not found for ID: ${doctorId}`);
        }
        return profile;
    }
    async updateProfile(doctorId, data) {
        return this.doctorProfile.update({
            where: { doctorId },
            data,
            include: {
                services: true,
                insurances: true,
                schedules: true
            }
        });
    }
    async updateServices(doctorId, services) {
        await this.doctorService.deleteMany({
            where: { doctorId }
        });
        return this.prisma.$transaction(services.map(service => this.doctorService.create({
            data: {
                ...service,
                doctorId,
            }
        })));
    }
    async removeService(serviceId) {
        const service = await this.doctorService.findUnique({
            where: { id: serviceId }
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service not found: ${serviceId}`);
        }
        return this.doctorService.delete({
            where: { id: serviceId }
        });
    }
    async updateInsurance(doctorId, providers) {
        await this.doctorInsurance.deleteMany({
            where: { doctorId }
        });
        return this.prisma.$transaction(providers.map(provider => this.doctorInsurance.create({
            data: {
                ...provider,
                doctorId,
            }
        })));
    }
    async removeInsurance(id) {
        const insurance = await this.doctorInsurance.findUnique({
            where: { id }
        });
        if (!insurance) {
            throw new common_1.NotFoundException(`Insurance provider not found: ${id}`);
        }
        return this.doctorInsurance.delete({
            where: { id }
        });
    }
};
exports.DoctorProfileRepository = DoctorProfileRepository;
exports.DoctorProfileRepository = DoctorProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DoctorProfileRepository);
//# sourceMappingURL=doctor-profile.repository.js.map