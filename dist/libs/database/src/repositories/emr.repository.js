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
exports.EMRRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let EMRRepository = class EMRRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get patientVisit() { return this.prisma.patientVisit; }
    get prescription() { return this.prisma.prescription; }
    get labOrder() { return this.prisma.labOrder; }
    get imagingOrder() { return this.prisma.imagingOrder; }
    get clinicalTemplate() { return this.prisma.clinicalTemplate; }
    get labResult() { return this.prisma.labResult; }
    get imagingResult() { return this.prisma.imagingResult; }
    async findVisitById(id) {
        return this.patientVisit.findUnique({
            where: { id },
            include: {
                prescriptions: true,
                labOrders: true,
                imagingOrders: true
            }
        });
    }
    async findVisitsByPatientId(patientId) {
        return this.patientVisit.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' },
            include: {
                prescriptions: true,
                labOrders: true,
                imagingOrders: true
            }
        });
    }
};
exports.EMRRepository = EMRRepository;
exports.EMRRepository = EMRRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EMRRepository);
//# sourceMappingURL=emr.repository.js.map