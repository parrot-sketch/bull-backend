export interface CreateVisitDto {
  patientId: string;
  doctorId: string;
  visitDate: Date;
  chiefComplaint: string;
  diagnosis?: string;
  treatmentPlan?: string;
  followUpDate?: Date;
}

export interface CreatePrescriptionDto {
  visitId: string;
  patientId: string;
  doctorId: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

export interface CreateLabOrderDto {
  visitId: string;
  patientId: string;
  doctorId: string;
  testType: string;
  instructions?: string;
  urgency?: 'ROUTINE' | 'URGENT' | 'STAT';
}

export interface CreateImagingOrderDto {
  visitId: string;
  patientId: string;
  doctorId: string;
  imagingType: string;
  bodyPart: string;
  instructions?: string;
  urgency?: 'ROUTINE' | 'URGENT' | 'STAT';
}