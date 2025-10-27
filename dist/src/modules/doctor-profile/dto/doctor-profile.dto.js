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
exports.UpdateDoctorScheduleDto = exports.CreateDoctorScheduleDto = exports.UpdateConsultationFeeDto = exports.CreateConsultationFeeDto = exports.UpdateDoctorInsuranceDto = exports.CreateDoctorInsuranceDto = exports.UpdateDoctorServiceDto = exports.CreateDoctorServiceDto = exports.UpdateDoctorProfileDto = exports.CreateDoctorProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDoctorProfileDto {
}
exports.CreateDoctorProfileDto = CreateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Professional title (Dr., Prof., etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Professional credentials (MD, PhD, etc.)', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "credentials", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Medical specialties', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sub-specialties', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "subSpecialties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Years of experience' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreateDoctorProfileDto.prototype, "yearsExperience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of practice', enum: ['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE'] }),
    (0, class_validator_1.IsEnum)(['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE']),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice city' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice state' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice ZIP code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceZipCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practicePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice website' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "practiceWebsite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "medicalLicenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license state' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "medicalLicenseState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license expiry date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "medicalLicenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DEA number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "deaNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'NPI number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "npiNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Board certifications', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "boardCertifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional biography' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "professionalBio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Education background' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorProfileDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional awards', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "awards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Publications', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "publications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Languages spoken', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether accepting new patients' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorProfileDto.prototype, "isAcceptingNewPatients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Available consultation types', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDoctorProfileDto.prototype, "consultationTypes", void 0);
class UpdateDoctorProfileDto {
}
exports.UpdateDoctorProfileDto = UpdateDoctorProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional title' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional credentials', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "credentials", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical specialties', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sub-specialties', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "subSpecialties", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Years of experience' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], UpdateDoctorProfileDto.prototype, "yearsExperience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Type of practice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['PRIVATE', 'GROUP', 'HOSPITAL', 'CLINIC', 'ACADEMIC', 'TELEMEDICINE']),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice city' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceCity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice state' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice ZIP code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceZipCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice phone number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practicePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Practice website' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "practiceWebsite", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "medicalLicenseNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license state' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "medicalLicenseState", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Medical license expiry date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "medicalLicenseExpiry", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'DEA number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "deaNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'NPI number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "npiNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Board certifications', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "boardCertifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional biography' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "professionalBio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Education background' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorProfileDto.prototype, "education", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Professional awards', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "awards", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Publications', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "publications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Languages spoken', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether accepting new patients' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorProfileDto.prototype, "isAcceptingNewPatients", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Available consultation types', type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDoctorProfileDto.prototype, "consultationTypes", void 0);
class CreateDoctorServiceDto {
}
exports.CreateDoctorServiceDto = CreateDoctorServiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service category', enum: ['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL'] }),
    (0, class_validator_1.IsEnum)(['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL']),
    __metadata("design:type", String)
], CreateDoctorServiceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service duration in minutes' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(480),
    __metadata("design:type", Number)
], CreateDoctorServiceDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service price override' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateDoctorServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorServiceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is virtual' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorServiceDto.prototype, "isVirtual", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is in-person' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorServiceDto.prototype, "isInPerson", void 0);
class UpdateDoctorServiceDto {
}
exports.UpdateDoctorServiceDto = UpdateDoctorServiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorServiceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorServiceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service category' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['CONSULTATION', 'FOLLOW_UP', 'PROCEDURE', 'DIAGNOSTIC', 'THERAPEUTIC', 'PREVENTIVE', 'EMERGENCY', 'SPECIALIST_REFERRAL']),
    __metadata("design:type", String)
], UpdateDoctorServiceDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service duration in minutes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(480),
    __metadata("design:type", Number)
], UpdateDoctorServiceDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Service price override' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateDoctorServiceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorServiceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is virtual' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorServiceDto.prototype, "isVirtual", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether service is in-person' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorServiceDto.prototype, "isInPerson", void 0);
class CreateDoctorInsuranceDto {
}
exports.CreateDoctorInsuranceDto = CreateDoctorInsuranceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insurance company name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorInsuranceDto.prototype, "insuranceName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Insurance type', enum: ['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER'] }),
    (0, class_validator_1.IsEnum)(['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER']),
    __metadata("design:type", String)
], CreateDoctorInsuranceDto.prototype, "insuranceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance plan name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorInsuranceDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether insurance is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorInsuranceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Copay amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateDoctorInsuranceDto.prototype, "copayAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deductible amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateDoctorInsuranceDto.prototype, "deductibleAmount", void 0);
class UpdateDoctorInsuranceDto {
}
exports.UpdateDoctorInsuranceDto = UpdateDoctorInsuranceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance company name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorInsuranceDto.prototype, "insuranceName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['PRIVATE', 'MEDICARE', 'MEDICAID', 'WORKERS_COMPENSATION', 'SELF_PAY', 'OTHER']),
    __metadata("design:type", String)
], UpdateDoctorInsuranceDto.prototype, "insuranceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Insurance plan name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorInsuranceDto.prototype, "planName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether insurance is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorInsuranceDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Copay amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateDoctorInsuranceDto.prototype, "copayAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deductible amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateDoctorInsuranceDto.prototype, "deductibleAmount", void 0);
class CreateConsultationFeeDto {
}
exports.CreateConsultationFeeDto = CreateConsultationFeeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Consultation type', enum: ['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE'] }),
    (0, class_validator_1.IsEnum)(['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE']),
    __metadata("design:type", String)
], CreateConsultationFeeDto.prototype, "consultationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base consultation fee' }),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateConsultationFeeDto.prototype, "baseFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Follow-up fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateConsultationFeeDto.prototype, "followUpFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancellation fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateConsultationFeeDto.prototype, "cancellationFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'No-show fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], CreateConsultationFeeDto.prototype, "noShowFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether fee is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConsultationFeeDto.prototype, "isActive", void 0);
class UpdateConsultationFeeDto {
}
exports.UpdateConsultationFeeDto = UpdateConsultationFeeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Consultation type' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['INITIAL_CONSULTATION', 'FOLLOW_UP', 'TELEMEDICINE', 'IN_PERSON', 'URGENT', 'ROUTINE']),
    __metadata("design:type", String)
], UpdateConsultationFeeDto.prototype, "consultationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Base consultation fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateConsultationFeeDto.prototype, "baseFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Follow-up fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateConsultationFeeDto.prototype, "followUpFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancellation fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateConsultationFeeDto.prototype, "cancellationFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'No-show fee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateConsultationFeeDto.prototype, "noShowFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether fee is active' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateConsultationFeeDto.prototype, "isActive", void 0);
class CreateDoctorScheduleDto {
}
exports.CreateDoctorScheduleDto = CreateDoctorScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Day of the week', enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] }),
    (0, class_validator_1.IsEnum)(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start time in HH:MM format' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End time in HH:MM format' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether schedule is available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Break start time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "breakStartTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Break end time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "breakEndTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether schedule is recurring' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDoctorScheduleDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule effective from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDoctorScheduleDto.prototype, "effectiveUntil", void 0);
class UpdateDoctorScheduleDto {
}
exports.UpdateDoctorScheduleDto = UpdateDoctorScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Day of the week' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether schedule is available' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorScheduleDto.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Break start time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "breakStartTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Break end time in HH:MM format' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "breakEndTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether schedule is recurring' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDoctorScheduleDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule effective from date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule effective until date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDoctorScheduleDto.prototype, "effectiveUntil", void 0);
//# sourceMappingURL=doctor-profile.dto.js.map