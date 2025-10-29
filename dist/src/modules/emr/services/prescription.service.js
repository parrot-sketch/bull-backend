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
exports.PrescriptionService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let PrescriptionService = class PrescriptionService {
    constructor(db) {
        this.db = db;
    }
    async createPrescription(prescriptionData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: prescriptionData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: prescriptionData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const interactions = await this.checkDrugInteractions(prescriptionData.patientId, prescriptionData.medicationName);
        const qrCode = await this.generatePrescriptionQR(prescriptionData);
        const prescription = await this.db.prescription.create({
            data: {
                patientId: prescriptionData.patientId,
                doctorId: prescriptionData.doctorId,
                visitId: prescriptionData.visitId,
                medicationName: prescriptionData.medicationName,
                genericName: prescriptionData.genericName,
                dosage: prescriptionData.dosage,
                frequency: prescriptionData.frequency,
                duration: prescriptionData.duration,
                quantity: prescriptionData.quantity,
                refills: prescriptionData.refills || 0,
                instructions: prescriptionData.instructions,
                drugInteractions: interactions.map(i => i.description),
                contraindications: [],
                pharmacyName: prescriptionData.pharmacyName,
                pharmacyAddress: prescriptionData.pharmacyAddress,
                pharmacyPhone: prescriptionData.pharmacyPhone,
                deliveryMethod: prescriptionData.deliveryMethod || 'PICKUP',
                qrCode,
                status: 'PENDING',
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        licenseNumber: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: prescription,
            interactions,
            message: 'Prescription created successfully',
        };
    }
    async updatePrescription(prescriptionId, updateData) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: {
                dosage: updateData.dosage,
                frequency: updateData.frequency,
                duration: updateData.duration,
                quantity: updateData.quantity,
                refills: updateData.refills,
                instructions: updateData.instructions,
                pharmacyName: updateData.pharmacyName,
                pharmacyAddress: updateData.pharmacyAddress,
                pharmacyPhone: updateData.pharmacyPhone,
                deliveryMethod: updateData.deliveryMethod,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: updatedPrescription,
            message: 'Prescription updated successfully',
        };
    }
    async getPrescription(prescriptionId) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        licenseNumber: true,
                        npiNumber: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return {
            success: true,
            data: prescription,
            message: 'Prescription retrieved successfully',
        };
    }
    async getPatientPrescriptions(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.prescribedAt = {};
            if (filters?.startDate)
                where.prescribedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.prescribedAt.lte = new Date(filters.endDate);
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const prescriptions = await this.db.prescription.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
            orderBy: { prescribedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: prescriptions,
            message: 'Patient prescriptions retrieved successfully',
        };
    }
    async updatePrescriptionStatus(prescriptionId, status, notes) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const updateData = { status: status };
        if (status === 'FILLED') {
            updateData.filledAt = new Date();
        }
        else if (status === 'PICKED_UP') {
            updateData.pickedUpAt = new Date();
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedPrescription,
            message: `Prescription status updated to ${status}`,
        };
    }
    async cancelPrescription(prescriptionId, reason) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Prescription is already cancelled');
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: 'CANCELLED',
                instructions: reason ? `${prescription.instructions}\n\nCancellation reason: ${reason}` : prescription.instructions,
            },
        });
        return {
            success: true,
            data: updatedPrescription,
            message: 'Prescription cancelled successfully',
        };
    }
    async checkDrugInteractions(patientId, newMedication) {
        const currentMedications = await this.db.patientMedication.findMany({
            where: {
                patientId,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
        });
        const allergies = await this.db.patientAllergy.findMany({
            where: { patientId },
        });
        const interactions = [];
        for (const medication of currentMedications) {
            const interaction = await this.db.drugInteraction.findFirst({
                where: {
                    OR: [
                        {
                            drug: { name: { contains: newMedication, mode: 'insensitive' } },
                            interactingDrug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
                        },
                        {
                            drug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
                            interactingDrug: { name: { contains: newMedication, mode: 'insensitive' } },
                        },
                    ],
                },
                include: {
                    drug: true,
                    interactingDrug: true,
                },
            });
            if (interaction) {
                interactions.push({
                    type: 'DRUG_INTERACTION',
                    severity: interaction.severity,
                    description: interaction.description,
                    clinicalEffect: interaction.clinicalEffect,
                    management: interaction.management,
                    medications: [newMedication, medication.medicationName],
                });
            }
        }
        for (const allergy of allergies) {
            if (newMedication.toLowerCase().includes(allergy.allergen.toLowerCase())) {
                interactions.push({
                    type: 'DRUG_ALLERGY',
                    severity: 'CONTRAINDICATED',
                    description: `Patient is allergic to ${allergy.allergen}`,
                    clinicalEffect: allergy.reaction,
                    management: 'Do not prescribe this medication',
                    medications: [newMedication],
                });
            }
        }
        return interactions;
    }
    async generatePrescriptionQR(prescriptionData) {
        const qrData = {
            prescriptionId: 'temp-id',
            patientId: prescriptionData.patientId,
            doctorId: prescriptionData.doctorId,
            medication: prescriptionData.medicationName,
            dosage: prescriptionData.dosage,
            timestamp: new Date().toISOString(),
        };
        return Buffer.from(JSON.stringify(qrData)).toString('base64');
    }
    async getPrescriptionStatistics(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate || endDate) {
            where.prescribedAt = {};
            if (startDate)
                where.prescribedAt.gte = new Date(startDate);
            if (endDate)
                where.prescribedAt.lte = new Date(endDate);
        }
        const [totalPrescriptions, prescriptionsByStatus, recentPrescriptions] = await Promise.all([
            this.db.prescription.count({ where }),
            this.db.prescription.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            this.db.prescription.findMany({
                where,
                include: {
                    patient: true,
                },
                orderBy: { prescribedAt: 'desc' },
                take: 10,
            }),
        ]);
        return {
            success: true,
            data: {
                totalPrescriptions,
                prescriptionsByStatus,
                recentPrescriptions,
            },
            message: 'Prescription statistics retrieved successfully',
        };
    }
    async searchMedications(query) {
        const medications = await this.db.drug.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { genericName: { contains: query, mode: 'insensitive' } },
                    { brandNames: { has: query } },
                ],
            },
            take: 20,
        });
        return {
            success: true,
            data: medications,
            message: 'Medications retrieved successfully',
        };
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PrescriptionService);
//# sourceMappingURL=prescription.service.js.map