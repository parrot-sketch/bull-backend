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
exports.BookingRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let BookingRepository = class BookingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get patientBooking() { return this.prisma.patientBooking; }
    async createBooking(patientId, doctorId, appointmentDate, data) {
        return this.patientBooking.create({
            data: {
                patientId,
                doctorId,
                appointmentDate,
                ...data
            }
        });
    }
    async findBookingsByPatientId(patientId) {
        return this.patientBooking.findMany({
            where: { patientId },
            include: {
                patient: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findBookingsByDoctorId(doctorId, fromDate) {
        return this.patientBooking.findMany({
            where: {
                doctorId,
                createdAt: {
                    gte: fromDate
                }
            },
            include: {
                patient: true
            },
            orderBy: { createdAt: 'asc' }
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingRepository);
//# sourceMappingURL=booking.repository.js.map