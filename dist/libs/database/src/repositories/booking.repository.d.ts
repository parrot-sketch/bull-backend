import { PrismaService } from '../prisma.service';
export declare class BookingRepository {
    private prisma;
    constructor(prisma: PrismaService);
    get patientBooking(): import(".prisma/client").Prisma.PatientBookingDelegate<import("@prisma/client/runtime/library").DefaultArgs>;
    createBooking(patientId: string, doctorId: string, appointmentDate: Date, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        appointmentId: string | null;
        date: Date;
        time: string;
        serviceType: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        reasonForVisit: string | null;
        notes: string | null;
        patientId: string;
    }>;
    findBookingsByPatientId(patientId: string): Promise<({
        [x: string]: never;
        [x: number]: never;
        [x: symbol]: never;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        appointmentId: string | null;
        date: Date;
        time: string;
        serviceType: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        reasonForVisit: string | null;
        notes: string | null;
        patientId: string;
    })[]>;
    findBookingsByDoctorId(doctorId: string, fromDate: Date): Promise<({
        [x: string]: never;
        [x: number]: never;
        [x: symbol]: never;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        doctorId: string;
        appointmentId: string | null;
        date: Date;
        time: string;
        serviceType: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        reasonForVisit: string | null;
        notes: string | null;
        patientId: string;
    })[]>;
}
