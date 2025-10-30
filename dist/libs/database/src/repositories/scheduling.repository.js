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
exports.SchedulingRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SchedulingRepository = class SchedulingRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get doctorSchedule() { return this.prisma.doctorSchedule; }
    get doctorAvailability() { return this.prisma.doctorAvailability; }
    get doctorScheduleException() { return this.prisma.doctorScheduleException; }
    get doctorScheduleTemplate() { return this.prisma.doctorScheduleTemplate; }
    async findAvailableSlots(doctorId, fromDate, toDate) {
        const [schedule, exceptions] = await Promise.all([
            this.doctorSchedule.findMany({
                where: { doctorId }
            }),
            this.doctorScheduleException.findMany({
                where: {
                    doctorId,
                    date: {
                        gte: fromDate,
                        lte: toDate
                    }
                }
            })
        ]);
        return {
            schedule,
            exceptions
        };
    }
    async createException(doctorId, date, reason) {
        return this.doctorScheduleException.create({
            data: {
                doctorId,
                date,
                reason
            }
        });
    }
    async getTemplate(doctorId) {
        return this.doctorScheduleTemplate.findFirst({
            where: { doctorId }
        });
    }
};
exports.SchedulingRepository = SchedulingRepository;
exports.SchedulingRepository = SchedulingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchedulingRepository);
//# sourceMappingURL=scheduling.repository.js.map