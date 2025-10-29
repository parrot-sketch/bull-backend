"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const auth_module_1 = require("./modules/auth/auth.module");
const doctor_profile_module_1 = require("./modules/doctor-profile/doctor-profile.module");
const emr_module_1 = require("./modules/emr/emr.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const patient_booking_module_1 = require("./modules/patient-booking/patient-booking.module");
const scheduling_module_1 = require("./modules/scheduling/scheduling.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10), limit: parseInt(process.env.RATE_LIMIT_LIMIT || '100', 10) }]),
            auth_module_1.AuthModule,
            doctor_profile_module_1.DoctorProfileModule,
            scheduling_module_1.SchedulingModule,
            patient_booking_module_1.PatientBookingModule,
            emr_module_1.EmrModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map