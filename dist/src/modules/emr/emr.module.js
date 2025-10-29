"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmrModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const emr_controller_1 = require("./controllers/emr.controller");
const imaging_controller_1 = require("./controllers/imaging.controller");
const lab_controller_1 = require("./controllers/lab.controller");
const patient_profile_controller_1 = require("./controllers/patient-profile.controller");
const prescription_controller_1 = require("./controllers/prescription.controller");
const visit_controller_1 = require("./controllers/visit.controller");
const clinical_template_service_1 = require("./services/clinical-template.service");
const drug_interaction_service_1 = require("./services/drug-interaction.service");
const emr_service_1 = require("./services/emr.service");
const imaging_service_1 = require("./services/imaging.service");
const lab_service_1 = require("./services/lab.service");
const patient_profile_service_1 = require("./services/patient-profile.service");
const prescription_service_1 = require("./services/prescription.service");
const visit_service_1 = require("./services/visit.service");
let EmrModule = class EmrModule {
};
exports.EmrModule = EmrModule;
exports.EmrModule = EmrModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [
            emr_controller_1.EmrController,
            patient_profile_controller_1.PatientProfileController,
            visit_controller_1.VisitController,
            prescription_controller_1.PrescriptionController,
            lab_controller_1.LabController,
            imaging_controller_1.ImagingController,
        ],
        providers: [
            emr_service_1.EmrService,
            patient_profile_service_1.PatientProfileService,
            visit_service_1.VisitService,
            prescription_service_1.PrescriptionService,
            lab_service_1.LabService,
            imaging_service_1.ImagingService,
            clinical_template_service_1.ClinicalTemplateService,
            drug_interaction_service_1.DrugInteractionService,
        ],
        exports: [
            emr_service_1.EmrService,
            patient_profile_service_1.PatientProfileService,
            visit_service_1.VisitService,
            prescription_service_1.PrescriptionService,
            lab_service_1.LabService,
            imaging_service_1.ImagingService,
            clinical_template_service_1.ClinicalTemplateService,
            drug_interaction_service_1.DrugInteractionService,
        ],
    })
], EmrModule);
//# sourceMappingURL=emr.module.js.map