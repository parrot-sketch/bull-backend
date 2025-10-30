"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorProfileModule = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../libs/database/src");
const doctor_profile_controller_1 = require("./controllers/doctor-profile.controller");
const doctor_profile_service_1 = require("./services/doctor-profile.service");
let DoctorProfileModule = class DoctorProfileModule {
};
exports.DoctorProfileModule = DoctorProfileModule;
exports.DoctorProfileModule = DoctorProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [database_1.DatabaseModule],
        controllers: [doctor_profile_controller_1.DoctorProfileController],
        providers: [doctor_profile_service_1.DoctorProfileService],
        exports: [doctor_profile_service_1.DoctorProfileService],
    })
], DoctorProfileModule);
//# sourceMappingURL=doctor-profile.module.js.map