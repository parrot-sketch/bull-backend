export interface CreateBookingDto {
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  appointmentType: string;
  notes?: string;
}

export interface UpdateBookingDto {
  appointmentDate?: Date;
  appointmentType?: string;
  notes?: string;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export interface BookingFilters {
  patientId?: string;
  doctorId?: string;
  fromDate?: Date;
  toDate?: Date;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}