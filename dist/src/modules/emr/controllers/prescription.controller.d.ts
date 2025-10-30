import { PrescriptionService } from '../services/prescription.service';
export declare class PrescriptionController {
    private readonly prescriptionService;
    constructor(prescriptionService: PrescriptionService);
    createPrescription(req: any, prescriptionData: {
        patientId: string;
        doctorId: string;
        visitId?: string;
        medicationName: string;
        genericName?: string;
        dosage: string;
        frequency: string;
        duration: string;
        quantity: number;
        refills?: number;
        instructions?: string;
        pharmacyName?: string;
        pharmacyAddress?: string;
        pharmacyPhone?: string;
        deliveryMethod?: string;
    }): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                bloodType: import(".prisma/client").$Enums.BloodType | null;
                height: number | null;
                weight: number | null;
                emergencyContact: string | null;
                emergencyPhone: string | null;
                medicalHistory: string[];
                surgicalHistory: string[];
                familyHistory: string[];
                socialHistory: string | null;
                primaryInsurance: string | null;
                insuranceNumber: string | null;
                insuranceExpiry: Date | null;
                preferredLanguage: string;
                communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
            };
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
                licenseNumber: string;
            };
            visit: {
                id: string;
                visitDate: Date;
                chiefComplaint: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        };
        interactions: any[];
        message: string;
    }>;
    updatePrescription(prescriptionId: string, updateData: {
        dosage?: string;
        frequency?: string;
        duration?: string;
        quantity?: number;
        refills?: number;
        instructions?: string;
        pharmacyName?: string;
        pharmacyAddress?: string;
        pharmacyPhone?: string;
        deliveryMethod?: string;
    }): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                bloodType: import(".prisma/client").$Enums.BloodType | null;
                height: number | null;
                weight: number | null;
                emergencyContact: string | null;
                emergencyPhone: string | null;
                medicalHistory: string[];
                surgicalHistory: string[];
                familyHistory: string[];
                socialHistory: string | null;
                primaryInsurance: string | null;
                insuranceNumber: string | null;
                insuranceExpiry: Date | null;
                preferredLanguage: string;
                communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
            };
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        };
        message: string;
    }>;
    getPrescription(prescriptionId: string): Promise<{
        success: boolean;
        data: {
            patient: {
                id: string;
                dateOfBirth: Date | null;
                gender: import(".prisma/client").$Enums.Gender | null;
                createdAt: Date;
                updatedAt: Date;
                patientId: string;
                bloodType: import(".prisma/client").$Enums.BloodType | null;
                height: number | null;
                weight: number | null;
                emergencyContact: string | null;
                emergencyPhone: string | null;
                medicalHistory: string[];
                surgicalHistory: string[];
                familyHistory: string[];
                socialHistory: string | null;
                primaryInsurance: string | null;
                insuranceNumber: string | null;
                insuranceExpiry: Date | null;
                preferredLanguage: string;
                communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
            };
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
                licenseNumber: string;
                npiNumber: string;
            };
            visit: {
                id: string;
                visitDate: Date;
                chiefComplaint: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        };
        message: string;
    }>;
    getPatientPrescriptions(patientId: string, status?: string, startDate?: string, endDate?: string, doctorId?: string, limit?: number): Promise<{
        success: boolean;
        data: ({
            doctor: {
                id: string;
                firstName: string;
                lastName: string;
                specialization: string;
            };
            visit: {
                id: string;
                visitDate: Date;
                chiefComplaint: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        })[];
        message: string;
    }>;
    updatePrescriptionStatus(prescriptionId: string, statusData: {
        status: string;
        notes?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        };
        message: string;
    }>;
    cancelPrescription(prescriptionId: string, cancelData: {
        reason?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            doctorId: string;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            patientId: string;
            duration: string;
            visitId: string | null;
            medicationName: string;
            genericName: string | null;
            dosage: string;
            frequency: string;
            quantity: number;
            refills: number;
            instructions: string | null;
            drugInteractions: string[];
            contraindications: string[];
            pharmacyName: string | null;
            pharmacyAddress: string | null;
            pharmacyPhone: string | null;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
            prescribedAt: Date;
            filledAt: Date | null;
            pickedUpAt: Date | null;
            qrCode: string | null;
            digitalSignature: string | null;
        };
        message: string;
    }>;
    getPrescriptionStatistics(doctorId: string, startDate?: string, endDate?: string): Promise<{
        success: boolean;
        data: {
            totalPrescriptions: number;
            prescriptionsByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PrescriptionGroupByOutputType, "status"[]> & {
                _count: {
                    status: number;
                };
            })[];
            recentPrescriptions: ({
                patient: {
                    id: string;
                    dateOfBirth: Date | null;
                    gender: import(".prisma/client").$Enums.Gender | null;
                    createdAt: Date;
                    updatedAt: Date;
                    patientId: string;
                    bloodType: import(".prisma/client").$Enums.BloodType | null;
                    height: number | null;
                    weight: number | null;
                    emergencyContact: string | null;
                    emergencyPhone: string | null;
                    medicalHistory: string[];
                    surgicalHistory: string[];
                    familyHistory: string[];
                    socialHistory: string | null;
                    primaryInsurance: string | null;
                    insuranceNumber: string | null;
                    insuranceExpiry: Date | null;
                    preferredLanguage: string;
                    communicationPref: import(".prisma/client").$Enums.CommunicationPreference;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                doctorId: string;
                status: import(".prisma/client").$Enums.PrescriptionStatus;
                patientId: string;
                duration: string;
                visitId: string | null;
                medicationName: string;
                genericName: string | null;
                dosage: string;
                frequency: string;
                quantity: number;
                refills: number;
                instructions: string | null;
                drugInteractions: string[];
                contraindications: string[];
                pharmacyName: string | null;
                pharmacyAddress: string | null;
                pharmacyPhone: string | null;
                deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod;
                prescribedAt: Date;
                filledAt: Date | null;
                pickedUpAt: Date | null;
                qrCode: string | null;
                digitalSignature: string | null;
            })[];
        };
        message: string;
    }>;
    searchMedications(query: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            genericName: string | null;
            contraindications: string[];
            brandNames: string[];
            drugClass: string | null;
            mechanism: string | null;
            standardDosage: string | null;
            maxDosage: string | null;
        }[];
        message: string;
    }>;
    checkDrugInteractions(interactionData: {
        medications: string[];
        patientId: string;
    }): Promise<any>;
    checkNewMedicationInteractions(interactionData: {
        patientId: string;
        newMedication: string;
    }): Promise<any>;
}
