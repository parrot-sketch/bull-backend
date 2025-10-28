"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const database_service_1 = require("../auth/services/database.service");
const scheduling_controller_1 = require("./controllers/scheduling.controller");
const appointment_management_service_1 = require("./services/appointment-management.service");
const doctor_availability_service_1 = require("./services/doctor-availability.service");
const scheduling_service_1 = require("./services/scheduling.service");
const slot_engine_service_1 = require("./services/slot-engine.service");
let SchedulingModule = class SchedulingModule {
};
exports.SchedulingModule = SchedulingModule;
exports.SchedulingModule = SchedulingModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot()],
        controllers: [scheduling_controller_1.SchedulingController],
        providers: [
            scheduling_service_1.SchedulingService,
            doctor_availability_service_1.DoctorAvailabilityService,
            slot_engine_service_1.SlotEngineService,
            appointment_management_service_1.AppointmentManagementService,
            database_service_1.DatabaseService,
        ],
        exports: [
            scheduling_service_1.SchedulingService,
            doctor_availability_service_1.DoctorAvailabilityService,
            slot_engine_service_1.SlotEngineService,
            appointment_management_service_1.AppointmentManagementService,
        ],
    })
], SchedulingModule);
//# sourceMappingURL=scheduling.module.js.map