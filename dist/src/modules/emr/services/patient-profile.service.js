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
exports.PatientProfileService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../auth/services/database.service");
let PatientProfileService = class PatientProfileService {
    constructor(db) {
        this.db = db;
    }
    async upsertPatientProfile(patientId, profileData) {
        const patient = await this.db.user.findUnique({
            where: { id: patientId, role: 'PATIENT' },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const dataToUpsert = {};
        if (profileData.dateOfBirth) {
            dataToUpsert.dateOfBirth = new Date(profileData.dateOfBirth);
        }
        if (profileData.gender) {
            dataToUpsert.gender = profileData.gender;
        }
        if (profileData.bloodType) {
            dataToUpsert.bloodType = profileData.bloodType;
        }
        if (profileData.height !== undefined) {
            dataToUpsert.height = profileData.height;
        }
        if (profileData.weight !== undefined) {
            dataToUpsert.weight = profileData.weight;
        }
        if (profileData.emergencyContact) {
            dataToUpsert.emergencyContact = profileData.emergencyContact;
        }
        if (profileData.emergencyPhone) {
            dataToUpsert.emergencyPhone = profileData.emergencyPhone;
        }
        if (profileData.medicalHistory) {
            dataToUpsert.medicalHistory = profileData.medicalHistory;
        }
        if (profileData.surgicalHistory) {
            dataToUpsert.surgicalHistory = profileData.surgicalHistory;
        }
        if (profileData.familyHistory) {
            dataToUpsert.familyHistory = profileData.familyHistory;
        }
        if (profileData.socialHistory) {
            dataToUpsert.socialHistory = profileData.socialHistory;
        }
        if (profileData.primaryInsurance) {
            dataToUpsert.primaryInsurance = profileData.primaryInsurance;
        }
        if (profileData.insuranceNumber) {
            dataToUpsert.insuranceNumber = profileData.insuranceNumber;
        }
        if (profileData.insuranceExpiry) {
            dataToUpsert.insuranceExpiry = new Date(profileData.insuranceExpiry);
        }
        if (profileData.preferredLanguage) {
            dataToUpsert.preferredLanguage = profileData.preferredLanguage;
        }
        if (profileData.communicationPref) {
            dataToUpsert.communicationPref = profileData.communicationPref;
        }
        const profile = await this.db.patientProfile.upsert({
            where: { patientId },
            update: dataToUpsert,
            create: {
                patientId,
                ...dataToUpsert,
            },
            include: {
                allergies: true,
                currentMedications: true,
            },
        });
        return {
            success: true,
            data: profile,
            message: 'Patient profile updated successfully',
        };
    }
    async getPatientProfile(patientId) {
        const include = {
            allergies: true,
            currentMedications: true,
            visits: {
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            specialization: true,
                        },
                    },
                },
                orderBy: { visitDate: 'desc' },
                take: 10,
            },
        };
        let profile = await this.db.patientProfile.findUnique({
            where: { patientId },
            include,
        });
        if (!profile) {
            profile = await this.db.patientProfile.create({
                data: {
                    patientId,
                    preferredLanguage: 'English',
                    communicationPref: 'EMAIL',
                },
                include,
            });
            return {
                success: true,
                data: profile,
                message: 'Patient profile initialized',
            };
        }
        return {
            success: true,
            data: profile,
            message: 'Patient profile retrieved successfully',
        };
    }
    async addAllergy(patientId, allergyData) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const allergy = await this.db.patientAllergy.create({
            data: {
                patientId: profile.id,
                allergen: allergyData.allergen,
                severity: allergyData.severity,
                reaction: allergyData.reaction,
                notes: allergyData.notes,
                diagnosedAt: allergyData.diagnosedAt ? new Date(allergyData.diagnosedAt) : null,
                diagnosedBy: allergyData.diagnosedBy,
            },
        });
        return {
            success: true,
            data: allergy,
            message: 'Allergy added successfully',
        };
    }
    async updateAllergy(allergyId, allergyData) {
        const allergy = await this.db.patientAllergy.update({
            where: { id: allergyId },
            data: {
                allergen: allergyData.allergen,
                severity: allergyData.severity,
                reaction: allergyData.reaction,
                notes: allergyData.notes,
            },
        });
        return {
            success: true,
            data: allergy,
            message: 'Allergy updated successfully',
        };
    }
    async removeAllergy(allergyId) {
        await this.db.patientAllergy.delete({
            where: { id: allergyId },
        });
        return {
            success: true,
            message: 'Allergy removed successfully',
        };
    }
    async addCurrentMedication(patientId, medicationData) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const medication = await this.db.patientMedication.create({
            data: {
                patientId: profile.id,
                medicationName: medicationData.medicationName,
                dosage: medicationData.dosage,
                frequency: medicationData.frequency,
                route: medicationData.route,
                startDate: new Date(medicationData.startDate),
                endDate: medicationData.endDate ? new Date(medicationData.endDate) : null,
                prescribedBy: medicationData.prescribedBy,
                pharmacy: medicationData.pharmacy,
                notes: medicationData.notes,
            },
        });
        return {
            success: true,
            data: medication,
            message: 'Medication added successfully',
        };
    }
    async updateCurrentMedication(medicationId, medicationData) {
        const updateData = {
            medicationName: medicationData.medicationName,
            dosage: medicationData.dosage,
            frequency: medicationData.frequency,
            route: medicationData.route,
            pharmacy: medicationData.pharmacy,
            notes: medicationData.notes,
        };
        if (medicationData.endDate) {
            updateData.endDate = new Date(medicationData.endDate);
        }
        const medication = await this.db.patientMedication.update({
            where: { id: medicationId },
            data: updateData,
        });
        return {
            success: true,
            data: medication,
            message: 'Medication updated successfully',
        };
    }
    async removeCurrentMedication(medicationId) {
        await this.db.patientMedication.delete({
            where: { id: medicationId },
        });
        return {
            success: true,
            message: 'Medication removed successfully',
        };
    }
    async getPatientAllergies(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            return {
                success: true,
                data: [],
                message: 'No allergies found',
            };
        }
        const allergies = await this.db.patientAllergy.findMany({
            where: { patientId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: allergies,
            message: 'Allergies retrieved successfully',
        };
    }
    async getPatientMedications(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            return {
                success: true,
                data: [],
                message: 'No medications found',
            };
        }
        const medications = await this.db.patientMedication.findMany({
            where: {
                patientId: profile.id,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
            orderBy: { startDate: 'desc' },
        });
        return {
            success: true,
            data: medications,
            message: 'Current medications retrieved successfully',
        };
    }
};
exports.PatientProfileService = PatientProfileService;
exports.PatientProfileService = PatientProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PatientProfileService);
//# sourceMappingURL=patient-profile.service.js.map