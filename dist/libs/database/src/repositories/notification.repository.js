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
exports.NotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let NotificationRepository = class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    get notification() { return this.prisma.notification; }
    async createNotification(userId, type, title, body) {
        return this.notification.create({
            data: {
                userId,
                type: type,
                title,
                body,
                isRead: false
            }
        });
    }
    async markAsRead(id) {
        return this.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }
    async findUnreadByUserId(userId) {
        return this.notification.findMany({
            where: {
                userId,
                isRead: false
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationRepository);
//# sourceMappingURL=notification.repository.js.map