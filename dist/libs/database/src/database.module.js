"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const booking_repository_1 = require("./repositories/booking.repository");
const doctor_profile_repository_1 = require("./repositories/doctor-profile.repository");
const emr_repository_1 = require("./repositories/emr.repository");
const notification_repository_1 = require("./repositories/notification.repository");
const scheduling_repository_1 = require("./repositories/scheduling.repository");
const user_repository_1 = require("./repositories/user.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            prisma_service_1.PrismaService,
            user_repository_1.UserRepository,
            doctor_profile_repository_1.DoctorProfileRepository,
            emr_repository_1.EMRRepository,
            notification_repository_1.NotificationRepository,
            booking_repository_1.BookingRepository,
            scheduling_repository_1.SchedulingRepository,
        ],
        exports: [
            prisma_service_1.PrismaService,
            user_repository_1.UserRepository,
            doctor_profile_repository_1.DoctorProfileRepository,
            emr_repository_1.EMRRepository,
            notification_repository_1.NotificationRepository,
            booking_repository_1.BookingRepository,
            scheduling_repository_1.SchedulingRepository,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map