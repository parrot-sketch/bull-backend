export declare class AppointmentsController {
    getAppointments(req: any, startDate?: string, endDate?: string, status?: string, limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            patientName: string;
            patientEmail: string;
            appointmentDate: string;
            startTime: string;
            endTime: string;
            status: string;
            type: string;
            notes: string;
        }[];
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data: any[];
        message?: undefined;
    }>;
}
