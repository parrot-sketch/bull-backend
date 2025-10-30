export interface CreateScheduleDto {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {}

export interface ScheduleException {
  doctorId: string;
  date: Date;
  reason: string;
}

export interface ScheduleTemplate {
  doctorId: string;
  name: string;
  schedules: CreateScheduleDto[];
}

export interface AvailabilityFilters {
  doctorId: string;
  fromDate: Date;
  toDate: Date;
  appointmentType?: string;
}