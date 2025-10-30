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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const database_1 = require("../../../../libs/database/src");
const common_1 = require("@nestjs/common");
let AuditService = AuditService_1 = class AuditService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(AuditService_1.name);
    }
    async log(action, params = {}) {
        try {
            await this.userRepository.logAudit(params.userId ?? null, action, {
                resource: params.resource,
                resourceId: params.resourceId,
                ipAddress: params.ipAddress,
                userAgent: params.userAgent,
                metadata: params.metadata ?? {},
                severity: params.severity ?? 'INFO'
            });
        }
        catch (error) {
            this.logger.error(`Failed to log audit event: ${action}`, error instanceof Error ? error.stack : undefined);
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.UserRepository])
], AuditService);
//# sourceMappingURL=audit.service.js.map