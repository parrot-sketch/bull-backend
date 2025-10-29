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
exports.ScheduleAnalyticsDto = exports.TimeSlotAvailabilityDto = exports.UpdateAvailabilityDto = exports.GetAvailabilityDto = exports.UpdateAppointmentDto = exports.BookAppointmentDto = exports.AppointmentStatus = exports.AppointmentType = exports.CreateExceptionDto = exports.ExceptionType = exports.UpdateTimeSlotDto = exports.CreateTimeSlotDto = exports.UpdateScheduleTemplateDto = exports.CreateScheduleTemplateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateScheduleTemplateDto {
}
exports.CreateScheduleTemplateDto = CreateScheduleTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateScheduleTemplateDto.prototype, "slotDuration", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateScheduleTemplateDto.prototype, "bufferTime", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateScheduleTemplateDto.prototype, "maxBookings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateScheduleTemplateDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleTemplateDto.prototype, "isActive", void 0);
class UpdateScheduleTemplateDto {
}
exports.UpdateScheduleTemplateDto = UpdateScheduleTemplateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateScheduleTemplateDto.prototype, "slotDuration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateScheduleTemplateDto.prototype, "bufferTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateScheduleTemplateDto.prototype, "maxBookings", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "serviceType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateScheduleTemplateDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateScheduleTemplateDto.prototype, "isActive", void 0);
class CreateTimeSlotDto {
}
exports.CreateTimeSlotDto = CreateTimeSlotDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTimeSlotDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "notes", void 0);
class UpdateTimeSlotDto {
}
exports.UpdateTimeSlotDto = UpdateTimeSlotDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTimeSlotDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "notes", void 0);
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["BLOCKED"] = "BLOCKED";
    ExceptionType["UNAVAILABLE"] = "UNAVAILABLE";
    ExceptionType["CUSTOM_HOURS"] = "CUSTOM_HOURS";
})(ExceptionType || (exports.ExceptionType = ExceptionType = {}));
class CreateExceptionDto {
}
exports.CreateExceptionDto = CreateExceptionDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExceptionDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExceptionDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExceptionDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateExceptionDto.prototype, "isAvailable", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExceptionDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ExceptionType),
    __metadata("design:type", String)
], CreateExceptionDto.prototype, "type", void 0);
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["CONSULTATION"] = "CONSULTATION";
    AppointmentType["FOLLOW_UP"] = "FOLLOW_UP";
    AppointmentType["EMERGENCY"] = "EMERGENCY";
    AppointmentType["ROUTINE"] = "ROUTINE";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["SCHEDULED"] = "SCHEDULED";
    AppointmentStatus["CONFIRMED"] = "CONFIRMED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
    AppointmentStatus["NO_SHOW"] = "NO_SHOW";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
class BookAppointmentDto {
}
exports.BookAppointmentDto = BookAppointmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "doctorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "scheduleId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AppointmentType),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BookAppointmentDto.prototype, "notes", void 0);
class UpdateAppointmentDto {
}
exports.UpdateAppointmentDto = UpdateAppointmentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AppointmentType),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AppointmentStatus),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppointmentDto.prototype, "notes", void 0);
class GetAvailabilityDto {
}
exports.GetAvailabilityDto = GetAvailabilityDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAvailabilityDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetAvailabilityDto.prototype, "doctorId", void 0);
class UpdateAvailabilityDto {
}
exports.UpdateAvailabilityDto = UpdateAvailabilityDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAvailabilityDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TimeSlotAvailabilityDto),
    __metadata("design:type", Array)
], UpdateAvailabilityDto.prototype, "timeSlots", void 0);
class TimeSlotAvailabilityDto {
}
exports.TimeSlotAvailabilityDto = TimeSlotAvailabilityDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TimeSlotAvailabilityDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TimeSlotAvailabilityDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TimeSlotAvailabilityDto.prototype, "isAvailable", void 0);
class ScheduleAnalyticsDto {
}
exports.ScheduleAnalyticsDto = ScheduleAnalyticsDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleAnalyticsDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleAnalyticsDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleAnalyticsDto.prototype, "doctorId", void 0);
//# sourceMappingURL=scheduling.dto.js.map