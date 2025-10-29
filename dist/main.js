/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(6);
const core_1 = __webpack_require__(3);
const throttler_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(8);
const doctor_profile_module_1 = __webpack_require__(23);
const emr_module_1 = __webpack_require__(26);
const notifications_module_1 = __webpack_require__(41);
const patient_booking_module_1 = __webpack_require__(46);
const scheduling_module_1 = __webpack_require__(49);
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


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(6);
const jwt_1 = __webpack_require__(9);
const passport_1 = __webpack_require__(10);
const appointments_controller_1 = __webpack_require__(11);
const auth_controller_1 = __webpack_require__(13);
const auth_service_1 = __webpack_require__(15);
const database_service_1 = __webpack_require__(19);
const audit_service_1 = __webpack_require__(18);
const jwt_strategy_1 = __webpack_require__(21);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const secret = config.get('JWT_SECRET');
                    if (!secret) {
                        throw new Error('JWT_SECRET must be set');
                    }
                    const expiresIn = config.get('JWT_EXPIRES_IN') || '15m';
                    return {
                        secret,
                        signOptions: { expiresIn },
                    };
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController, appointments_controller_1.AppointmentsController],
        providers: [
            auth_service_1.AuthService,
            database_service_1.DatabaseService,
            audit_service_1.AuditService,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [auth_service_1.AuthService, database_service_1.DatabaseService],
    })
], AuthModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentsController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
let AppointmentsController = class AppointmentsController {
    async getAppointments(req, startDate, endDate, status, limit) {
        try {
            const mockAppointments = [
                {
                    id: '1',
                    patientName: 'John Doe',
                    patientEmail: 'john@example.com',
                    appointmentDate: new Date().toISOString(),
                    startTime: '09:00',
                    endTime: '09:30',
                    status: 'SCHEDULED',
                    type: 'CONSULTATION',
                    notes: 'Regular checkup'
                },
                {
                    id: '2',
                    patientName: 'Jane Smith',
                    patientEmail: 'jane@example.com',
                    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    startTime: '10:00',
                    endTime: '10:30',
                    status: 'PENDING',
                    type: 'FOLLOW_UP',
                    notes: 'Follow-up appointment'
                }
            ];
            return {
                success: true,
                data: mockAppointments,
                message: 'Mock appointments data'
            };
        }
        catch (error) {
            console.error('Error in getAppointments:', error);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointments", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, swagger_1.ApiTags)('Appointments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('appointments')
], AppointmentsController);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(10);
const core_1 = __webpack_require__(3);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Invalid or expired token');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = exports.RefreshDto = exports.RegisterDto = exports.LoginDto = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const throttler_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(14);
const jwt_auth_guard_1 = __webpack_require__(12);
const auth_service_1 = __webpack_require__(15);
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginDto.prototype, "mfaCode", void 0);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain uppercase, lowercase, number and special character'
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
class RefreshDto {
}
exports.RefreshDto = RefreshDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshDto.prototype, "refreshToken", void 0);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(credentials, req) {
        const auditContext = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        };
        return this.authService.login(credentials, auditContext);
    }
    async register(userData, req) {
        const auditContext = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        };
        return this.authService.register(userData, auditContext);
    }
    async refreshToken(body) {
        return this.authService.refreshToken(body.refreshToken);
    }
    async logout(req) {
        const auditContext = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        };
        return this.authService.logout(req.user.userId, auditContext);
    }
    async getCurrentUser(req) {
        return this.authService.getCurrentUser(req.user.userId);
    }
    async mfaSetup(req) {
        return this.authService.setupMfa(req.user.userId);
    }
    async mfaVerify(req, body) {
        return this.authService.verifyMfa(req.user.userId, body.code);
    }
    async registerTestPatient(req) {
        const auditContext = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        };
        const testPatientData = {
            email: 'patient@test.com',
            password: 'patient123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'PATIENT',
        };
        return this.authService.register(testPatientData, auditContext);
    }
    async registerTestDoctor(req) {
        const auditContext = {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
        };
        const testDoctorData = {
            email: 'doctor@test.com',
            password: 'doctor123',
            firstName: 'Dr. Sarah',
            lastName: 'Smith',
            role: 'DOCTOR',
        };
        return this.authService.register(testDoctorData, auditContext);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60 } }),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60 } }),
    (0, swagger_1.ApiOperation)({ summary: 'User registration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Registration successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh authentication token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User logout' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout successful' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)('mfa/setup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate MFA TOTP setup' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "mfaSetup", null);
__decorate([
    (0, common_1.Post)('mfa/verify'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify MFA TOTP code and enable MFA' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "mfaVerify", null);
__decorate([
    (0, common_1.Post)('test/register-patient'),
    (0, swagger_1.ApiOperation)({ summary: 'Register test patient (development only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test patient registered successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerTestPatient", null);
__decorate([
    (0, common_1.Post)('test/register-doctor'),
    (0, swagger_1.ApiOperation)({ summary: 'Register test doctor (development only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test doctor registered successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerTestDoctor", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(9);
const bcrypt = __webpack_require__(16);
const speakeasy = __webpack_require__(17);
const audit_service_1 = __webpack_require__(18);
const database_service_1 = __webpack_require__(19);
let AuthService = class AuthService {
    constructor(db, jwtService, auditService) {
        this.db = db;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    }
    async register(userData, auditContext) {
        const existingUser = await this.db.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
            await this.auditService.log('REGISTER_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: userData.email, reason: 'EMAIL_EXISTS' },
                severity: 'WARN',
            });
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.db.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role || 'PATIENT',
            },
        });
        const tokens = this.generateJwtPair(user.id);
        await this.db.userSession.create({
            data: {
                userId: user.id,
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        });
        await this.auditService.log('REGISTER_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: userData.email, role: user.role },
            severity: 'INFO',
        });
        return {
            success: true,
            message: 'User registered successfully',
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async login(credentials, auditContext) {
        console.log('🔐 Login attempt for:', credentials.email);
        const user = await this.db.user.findUnique({
            where: { email: credentials.email },
        });
        console.log('👤 User found:', !!user);
        console.log('👤 User active:', user?.isActive);
        console.log('👤 User verified:', user?.isVerified);
        if (!user || !user.isActive) {
            console.log('❌ User not found or not active');
            await this.auditService.log('LOGIN_FAILED', {
                resource: 'USER',
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: credentials.email, reason: 'USER_NOT_FOUND_OR_INACTIVE' },
                severity: 'WARN',
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log('🔑 Comparing password...');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log('🔑 Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            await this.auditService.log('LOGIN_FAILED', {
                userId: user.id,
                resource: 'USER',
                resourceId: user.id,
                ipAddress: auditContext?.ipAddress,
                userAgent: auditContext?.userAgent,
                metadata: { email: credentials.email, reason: 'INVALID_PASSWORD' },
                severity: 'WARN',
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const mfaSettings = await this.db.mfaSettings.findUnique({ where: { userId: user.id } });
        if (mfaSettings?.isEnabled) {
            if (!credentials.mfaCode) {
                await this.auditService.log('LOGIN_MFA_REQUIRED', {
                    userId: user.id,
                    resource: 'USER',
                    resourceId: user.id,
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    severity: 'INFO',
                });
                return {
                    success: true,
                    mfaRequired: true,
                    user: this.mapUserToResponse(user),
                };
            }
            const validMfa = speakeasy.totp.verify({
                secret: mfaSettings.secret || '',
                encoding: 'base32',
                token: credentials.mfaCode,
                window: 1,
            });
            if (!validMfa) {
                await this.auditService.log('LOGIN_FAILED', {
                    userId: user.id,
                    resource: 'USER',
                    resourceId: user.id,
                    ipAddress: auditContext?.ipAddress,
                    userAgent: auditContext?.userAgent,
                    metadata: { reason: 'INVALID_MFA_CODE' },
                    severity: 'WARN',
                });
                throw new common_1.UnauthorizedException('Invalid MFA code');
            }
        }
        const tokens = this.generateJwtPair(user.id);
        await this.db.userSession.create({
            data: {
                userId: user.id,
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isActive: true,
            },
        });
        await this.auditService.log('LOGIN_SUCCESS', {
            userId: user.id,
            resource: 'USER',
            resourceId: user.id,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { email: credentials.email, role: user.role },
            severity: 'INFO',
        });
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async setupMfa(userId) {
        const user = await this.db.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const secret = speakeasy.generateSecret({ name: `iHosi (${user.email})`, length: 20 });
        await this.db.mfaSettings.upsert({
            where: { userId },
            update: { secret: secret.base32, method: 'TOTP', isEnabled: false },
            create: { userId, secret: secret.base32, method: 'TOTP', isEnabled: false },
        });
        await this.auditService.log('MFA_SETUP_REQUESTED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { secret: secret.base32, otpauthUrl: secret.otpauth_url } };
    }
    async verifyMfa(userId, code) {
        const settings = await this.db.mfaSettings.findUnique({ where: { userId } });
        if (!settings || !settings.secret) {
            throw new common_1.BadRequestException('MFA not initialized');
        }
        const verified = speakeasy.totp.verify({ secret: settings.secret, encoding: 'base32', token: code, window: 1 });
        if (!verified) {
            throw new common_1.UnauthorizedException('Invalid MFA code');
        }
        const backupCodes = Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10));
        await this.db.mfaSettings.update({ where: { userId }, data: { isEnabled: true, backupCodes } });
        await this.auditService.log('MFA_ENABLED', { userId, resource: 'USER', resourceId: userId, severity: 'INFO' });
        return { success: true, data: { backupCodes } };
    }
    async refreshToken(refreshToken) {
        const session = await this.db.userSession.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = this.generateJwtPair(session.userId);
        await this.db.userSession.update({
            where: { id: session.id },
            data: {
                refreshToken: tokens.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            success: true,
            data: {
                user: this.mapUserToResponse(session.user),
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            },
        };
    }
    async logout(userId, auditContext) {
        await this.db.userSession.updateMany({
            where: { userId },
            data: { isActive: false },
        });
        await this.auditService.log('LOGOUT_SUCCESS', {
            userId,
            resource: 'USER',
            resourceId: userId,
            ipAddress: auditContext?.ipAddress,
            userAgent: auditContext?.userAgent,
            metadata: { userId },
            severity: 'INFO',
        });
        return {
            success: true,
            message: 'Logout successful',
        };
    }
    async getCurrentUser(userId) {
        const user = await this.db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            success: true,
            data: this.mapUserToResponse(user),
        };
    }
    generateJwtPair(userId) {
        const accessToken = this.jwtService.sign({ userId, type: 'access' }, { expiresIn: this.jwtExpiresIn });
        const refreshToken = this.jwtService.sign({ userId, type: 'refresh' }, { expiresIn: this.refreshTokenExpiresIn });
        return { accessToken, refreshToken, token: accessToken };
    }
    mapUserToResponse(user) {
        return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            avatar: user.avatar,
            department: user.department,
            specialization: user.specialization,
            isVerified: user.isVerified,
            mfaEnabled: false,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof audit_service_1.AuditService !== "undefined" && audit_service_1.AuditService) === "function" ? _c : Object])
], AuthService);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("speakeasy");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuditService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let AuditService = class AuditService {
    constructor(db) {
        this.db = db;
    }
    async log(action, params = {}) {
        try {
            await this.db.auditLog.create({
                data: {
                    userId: params.userId ?? null,
                    action,
                    resource: params.resource,
                    resourceId: params.resourceId,
                    ipAddress: params.ipAddress,
                    userAgent: params.userAgent,
                    metadata: params.metadata ?? {},
                    severity: params.severity || 'INFO',
                },
            });
        }
        catch (e) {
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], AuditService);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(1);
const client_1 = __webpack_require__(20);
let DatabaseService = class DatabaseService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        console.log('📊 Database connected successfully');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        console.log('📊 Database disconnected');
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);


/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(10);
const passport_jwt_1 = __webpack_require__(22);
const database_service_1 = __webpack_require__(19);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, db) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: (() => {
                const secret = configService.get('JWT_SECRET');
                if (!secret) {
                    throw new Error('JWT_SECRET must be set');
                }
                return secret;
            })(),
        });
        this.configService = configService;
        this.db = db;
    }
    async validate(payload) {
        const user = await this.db.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isLocked: true,
                lockedUntil: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        if (user.isLocked && user.lockedUntil && user.lockedUntil > new Date()) {
            throw new common_1.UnauthorizedException('Account is locked');
        }
        return {
            userId: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorProfileModule = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const doctor_profile_controller_1 = __webpack_require__(24);
const doctor_profile_service_1 = __webpack_require__(25);
let DoctorProfileModule = class DoctorProfileModule {
};
exports.DoctorProfileModule = DoctorProfileModule;
exports.DoctorProfileModule = DoctorProfileModule = __decorate([
    (0, common_1.Module)({
        controllers: [doctor_profile_controller_1.DoctorProfileController],
        providers: [doctor_profile_service_1.DoctorProfileService, database_service_1.DatabaseService],
        exports: [doctor_profile_service_1.DoctorProfileService],
    })
], DoctorProfileModule);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorProfileController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const doctor_profile_service_1 = __webpack_require__(25);
let DoctorProfileController = class DoctorProfileController {
    constructor(doctorProfileService) {
        this.doctorProfileService = doctorProfileService;
    }
    async createProfile(req, profileData) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Creating profile for doctorId =', doctorId);
        return this.doctorProfileService.createProfile(doctorId, profileData);
    }
    async getProfile(req) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Getting profile for doctorId =', doctorId);
        return this.doctorProfileService.getProfile(doctorId);
    }
    async updateProfile(req, updateData) {
        const doctorId = req.user.userId || req.user.id;
        console.log('🔍 DEBUG: Updating profile for doctorId =', doctorId);
        console.log('🔍 DEBUG: Update data =', updateData);
        return this.doctorProfileService.updateProfile(doctorId, updateData);
    }
    async getServices(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getServices(doctorId);
    }
    async upsertServices(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.upsertServices(doctorId, body.services || []);
    }
    async deleteService(req, serviceId) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.deleteService(doctorId, serviceId);
    }
    async getInsurance(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getInsurance(doctorId);
    }
    async upsertInsurance(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.upsertInsurance(doctorId, body.providers || []);
    }
    async deleteInsurance(req, id) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.deleteInsurance(doctorId, id);
    }
    async getBilling(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.getBilling(doctorId);
    }
    async updateBilling(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.doctorProfileService.updateBilling(doctorId, body);
    }
    async getPublicProfile(doctorId) {
        return this.doctorProfileService.getPublicProfile(doctorId);
    }
};
exports.DoctorProfileController = DoctorProfileController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Profile created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Profile already exists' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'List doctor services' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert doctor services (bulk)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "upsertServices", null);
__decorate([
    (0, common_1.Post)('services/:serviceId/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a doctor service' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('serviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)('insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'List supported insurance providers' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getInsurance", null);
__decorate([
    (0, common_1.Post)('insurance'),
    (0, swagger_1.ApiOperation)({ summary: 'Upsert insurance providers (bulk)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "upsertInsurance", null);
__decorate([
    (0, common_1.Post)('insurance/:id/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an insurance provider' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "deleteInsurance", null);
__decorate([
    (0, common_1.Get)('billing'),
    (0, swagger_1.ApiOperation)({ summary: 'Get billing settings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getBilling", null);
__decorate([
    (0, common_1.Put)('billing'),
    (0, swagger_1.ApiOperation)({ summary: 'Update billing settings' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "updateBilling", null);
__decorate([
    (0, common_1.Get)('public/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public doctor profile (for patients)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorProfileController.prototype, "getPublicProfile", null);
exports.DoctorProfileController = DoctorProfileController = __decorate([
    (0, swagger_1.ApiTags)('Doctor Profile'),
    (0, common_1.Controller)('doctor-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [typeof (_a = typeof doctor_profile_service_1.DoctorProfileService !== "undefined" && doctor_profile_service_1.DoctorProfileService) === "function" ? _a : Object])
], DoctorProfileController);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorProfileService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let DoctorProfileService = class DoctorProfileService {
    constructor(db) {
        this.db = db;
    }
    async createProfile(doctorId, profileData) {
        const existingProfile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (existingProfile) {
            throw new common_1.ConflictException('Doctor profile already exists');
        }
        const doctor = await this.db.user.findUnique({
            where: { id: doctorId, role: 'DOCTOR' }
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const profile = await this.db.doctorProfile.create({
            data: {
                doctorId,
                specialties: profileData.specialties ?? (profileData.specialization ? [profileData.specialization] : []),
                professionalBio: profileData.bio ?? null,
                education: profileData.education ?? null,
                yearsExperience: profileData.experience ? Number(profileData.experience) : 0,
            },
        });
        return {
            success: true,
            data: profile,
            message: 'Doctor profile created successfully'
        };
    }
    async getProfile(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                        phoneNumber: true,
                    }
                },
                services: true,
                insurances: true,
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return {
            success: true,
            data: profile
        };
    }
    async updateProfile(doctorId, updateData) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const prismaData = {};
        if (updateData.specialization)
            prismaData.specialties = { set: [updateData.specialization] };
        if (updateData.specialties)
            prismaData.specialties = { set: updateData.specialties };
        if (updateData.bio !== undefined)
            prismaData.professionalBio = updateData.bio;
        if (updateData.education !== undefined)
            prismaData.education = updateData.education;
        if (updateData.yearsOfExperience !== undefined)
            prismaData.yearsExperience = Number(updateData.yearsOfExperience);
        const updatedProfile = await this.db.doctorProfile.update({
            where: { doctorId },
            data: prismaData,
        });
        return {
            success: true,
            data: updatedProfile,
            message: 'Doctor profile updated successfully'
        };
    }
    async getServices(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const services = await this.db.doctorService.findMany({ where: { doctorId } });
        return { success: true, data: services };
    }
    async upsertServices(doctorId, services) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const ops = services.map((s) => {
            const lower = (s.name || '').toLowerCase();
            const category = lower.match(/x-?ray|ultra\s?sound|ct|mri|lab|test|scan/)
                ? 'DIAGNOSTIC'
                : 'CONSULTATION';
            return this.db.doctorService.upsert({
                where: { id: s.id ?? '___nonexistent___' },
                update: {
                    name: s.name,
                    description: s.description,
                    duration: s.duration ?? 30,
                    price: s.price ?? null,
                    category,
                },
                create: {
                    doctorId,
                    profileId: profile.id,
                    name: s.name,
                    description: s.description,
                    duration: s.duration ?? 30,
                    price: s.price ?? null,
                    category,
                },
            });
        });
        const result = await this.db.$transaction(ops);
        return { success: true, data: result };
    }
    async deleteService(doctorId, serviceId) {
        const service = await this.db.doctorService.findUnique({ where: { id: serviceId } });
        if (!service || service.doctorId !== doctorId)
            throw new common_1.NotFoundException('Service not found');
        await this.db.doctorService.delete({ where: { id: serviceId } });
        return { success: true };
    }
    async getInsurance(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const providers = await this.db.doctorInsurance.findMany({ where: { doctorId } });
        return { success: true, data: providers };
    }
    async upsertInsurance(doctorId, providers) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const ops = providers.map((p) => this.db.doctorInsurance.upsert({
            where: { id: p.id ?? '___nonexistent___' },
            update: {
                insuranceName: p.insuranceName,
                insuranceType: p.insuranceType ?? 'PRIVATE',
                planName: p.planName ?? null,
            },
            create: {
                doctorId,
                profileId: profile.id,
                insuranceName: p.insuranceName,
                insuranceType: p.insuranceType ?? 'PRIVATE',
                planName: p.planName ?? null,
            },
        }));
        const result = await this.db.$transaction(ops);
        return { success: true, data: result };
    }
    async deleteInsurance(doctorId, id) {
        const rec = await this.db.doctorInsurance.findUnique({ where: { id } });
        if (!rec || rec.doctorId !== doctorId)
            throw new common_1.NotFoundException('Insurance not found');
        await this.db.doctorInsurance.delete({ where: { id } });
        return { success: true };
    }
    async getBilling(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const fee = await this.db.consultationFee.findFirst({
            where: { profileId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: fee ? {
                consultationFee: fee.baseFee,
                currency: profile.currency || 'KES'
            } : {
                consultationFee: 0,
                currency: profile.currency || 'KES'
            }
        };
    }
    async updateBilling(doctorId, billing) {
        const profile = await this.db.doctorProfile.findUnique({ where: { doctorId } });
        if (!profile)
            throw new common_1.NotFoundException('Doctor profile not found');
        const fee = await this.db.consultationFee.create({
            data: {
                doctorId,
                profileId: profile.id,
                consultationType: 'IN_PERSON',
                baseFee: billing.consultationFee,
            },
        });
        if (billing.currency) {
            await this.db.doctorProfile.update({
                where: { doctorId },
                data: { currency: billing.currency }
            });
        }
        return {
            success: true,
            data: {
                consultationFee: fee.baseFee,
                currency: billing.currency || profile.currency || 'KES'
            }
        };
    }
    async getPublicProfile(doctorId) {
        const profile = await this.db.doctorProfile.findUnique({
            where: { doctorId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                },
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        return {
            success: true,
            data: profile
        };
    }
};
exports.DoctorProfileService = DoctorProfileService;
exports.DoctorProfileService = DoctorProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], DoctorProfileService);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmrModule = void 0;
const common_1 = __webpack_require__(1);
const auth_module_1 = __webpack_require__(8);
const emr_controller_1 = __webpack_require__(27);
const imaging_controller_1 = __webpack_require__(29);
const lab_controller_1 = __webpack_require__(31);
const patient_profile_controller_1 = __webpack_require__(33);
const prescription_controller_1 = __webpack_require__(35);
const visit_controller_1 = __webpack_require__(37);
const clinical_template_service_1 = __webpack_require__(39);
const drug_interaction_service_1 = __webpack_require__(40);
const emr_service_1 = __webpack_require__(28);
const imaging_service_1 = __webpack_require__(30);
const lab_service_1 = __webpack_require__(32);
const patient_profile_service_1 = __webpack_require__(34);
const prescription_service_1 = __webpack_require__(36);
const visit_service_1 = __webpack_require__(38);
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


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmrController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const emr_service_1 = __webpack_require__(28);
let EmrController = class EmrController {
    constructor(emrService) {
        this.emrService = emrService;
    }
    async getPatientOverview(patientId) {
        return this.emrService.getPatientOverview(patientId);
    }
    async searchPatients(name, email, phoneNumber, dateOfBirth, medicalRecordNumber, limit) {
        return this.emrService.searchPatients({
            name,
            email,
            phoneNumber,
            dateOfBirth,
            medicalRecordNumber,
            limit,
        });
    }
    async getPatientTimeline(patientId, startDate, endDate) {
        return this.emrService.getPatientTimeline(patientId, startDate, endDate);
    }
    async getVitalSignsHistory(patientId, limit) {
        return this.emrService.getVitalSignsHistory(patientId, limit);
    }
    async generatePatientSummary(patientId) {
        return this.emrService.generatePatientSummary(patientId);
    }
};
exports.EmrController = EmrController;
__decorate([
    (0, common_1.Get)('patient/:patientId/overview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get comprehensive patient overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient overview retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getPatientOverview", null);
__decorate([
    (0, common_1.Get)('patients/search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search patients by various criteria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patients retrieved successfully' }),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('email')),
    __param(2, (0, common_1.Query)('phoneNumber')),
    __param(3, (0, common_1.Query)('dateOfBirth')),
    __param(4, (0, common_1.Query)('medicalRecordNumber')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "searchPatients", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient medical history timeline' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient timeline retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getPatientTimeline", null);
__decorate([
    (0, common_1.Get)('patient/:patientId/vital-signs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient vital signs history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs history retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "getVitalSignsHistory", null);
__decorate([
    (0, common_1.Post)('patient/:patientId/summary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate comprehensive patient summary report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient summary generated successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmrController.prototype, "generatePatientSummary", null);
exports.EmrController = EmrController = __decorate([
    (0, swagger_1.ApiTags)('EMR'),
    (0, common_1.Controller)('emr'),
    __metadata("design:paramtypes", [typeof (_a = typeof emr_service_1.EmrService !== "undefined" && emr_service_1.EmrService) === "function" ? _a : Object])
], EmrController);


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmrService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let EmrService = class EmrService {
    constructor(db) {
        this.db = db;
    }
    async getPatientOverview(patientId) {
        const patient = await this.db.user.findUnique({
            where: { id: patientId },
            include: {
                patientProfile: {
                    include: {
                        allergies: true,
                        currentMedications: true,
                        visits: {
                            include: {
                                doctor: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        specialization: true,
                                    },
                                },
                                diagnoses: true,
                            },
                            orderBy: { visitDate: 'desc' },
                            take: 5,
                        },
                        labResults: {
                            orderBy: { reportedAt: 'desc' },
                            take: 10,
                        },
                        imagingResults: {
                            orderBy: { reportedAt: 'desc' },
                            take: 5,
                        },
                        prescriptions: {
                            where: { status: { not: 'CANCELLED' } },
                            orderBy: { prescribedAt: 'desc' },
                            take: 10,
                        },
                    },
                },
            },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!patient.patientProfile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const healthMetrics = await this.calculateHealthMetrics(patientId);
        return {
            success: true,
            data: {
                patient: {
                    id: patient.id,
                    name: `${patient.firstName} ${patient.lastName}`,
                    email: patient.email,
                    phoneNumber: patient.phoneNumber,
                    dateOfBirth: patient.dateOfBirth,
                    gender: patient.gender,
                },
                profile: patient.patientProfile,
                healthMetrics,
                recentActivity: {
                    visits: patient.patientProfile.visits,
                    labResults: patient.patientProfile.labResults,
                    imagingResults: patient.patientProfile.imagingResults,
                    prescriptions: patient.patientProfile.prescriptions,
                },
            },
            message: 'Patient overview retrieved successfully',
        };
    }
    async searchPatients(searchCriteria) {
        const where = { role: 'PATIENT', isActive: true };
        if (searchCriteria.name) {
            where.OR = [
                { firstName: { contains: searchCriteria.name, mode: 'insensitive' } },
                { lastName: { contains: searchCriteria.name, mode: 'insensitive' } },
            ];
        }
        if (searchCriteria.email) {
            where.email = { contains: searchCriteria.email, mode: 'insensitive' };
        }
        if (searchCriteria.phoneNumber) {
            where.phoneNumber = { contains: searchCriteria.phoneNumber };
        }
        if (searchCriteria.dateOfBirth) {
            where.dateOfBirth = new Date(searchCriteria.dateOfBirth);
        }
        const patients = await this.db.user.findMany({
            where,
            include: {
                patientProfile: {
                    include: {
                        allergies: true,
                        currentMedications: true,
                    },
                },
            },
            take: searchCriteria.limit || 50,
            orderBy: { firstName: 'asc' },
        });
        return {
            success: true,
            data: patients.map(patient => ({
                id: patient.id,
                name: `${patient.firstName} ${patient.lastName}`,
                email: patient.email,
                phoneNumber: patient.phoneNumber,
                dateOfBirth: patient.dateOfBirth,
                gender: patient.gender,
                profile: patient.patientProfile,
            })),
            message: 'Patients retrieved successfully',
        };
    }
    async getPatientTimeline(patientId, startDate, endDate) {
        const where = { patientId };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [visits, labResults, imagingResults, prescriptions] = await Promise.all([
            this.db.patientVisit.findMany({
                where: { patientId },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            specialization: true,
                        },
                    },
                    diagnoses: true,
                },
                orderBy: { visitDate: 'desc' },
            }),
            this.db.labResult.findMany({
                where: { patientId },
                orderBy: { reportedAt: 'desc' },
            }),
            this.db.imagingResult.findMany({
                where: { patientId },
                orderBy: { reportedAt: 'desc' },
            }),
            this.db.prescription.findMany({
                where: { patientId },
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { prescribedAt: 'desc' },
            }),
        ]);
        const timeline = [
            ...visits.map(visit => ({
                type: 'VISIT',
                date: visit.visitDate,
                data: visit,
            })),
            ...labResults.map(result => ({
                type: 'LAB_RESULT',
                date: result.reportedAt,
                data: result,
            })),
            ...imagingResults.map(result => ({
                type: 'IMAGING_RESULT',
                date: result.reportedAt,
                data: result,
            })),
            ...prescriptions.map(prescription => ({
                type: 'PRESCRIPTION',
                date: prescription.prescribedAt,
                data: prescription,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            success: true,
            data: timeline,
            message: 'Patient timeline retrieved successfully',
        };
    }
    async calculateHealthMetrics(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
            include: {
                allergies: true,
                currentMedications: true,
                visits: {
                    include: { diagnoses: true },
                    orderBy: { visitDate: 'desc' },
                },
                labResults: {
                    orderBy: { reportedAt: 'desc' },
                },
            },
        });
        if (!profile) {
            return {
                riskFactors: [],
                activeConditions: [],
                medicationCount: 0,
                allergyCount: 0,
                lastVisitDate: null,
                criticalLabResults: 0,
            };
        }
        const activeConditions = profile.visits
            .flatMap(visit => visit.diagnoses)
            .map(diagnosis => diagnosis.diagnosisName)
            .filter((value, index, self) => self.indexOf(value) === index);
        const criticalLabResults = profile.labResults.filter(result => result.criticalValue || result.isAbnormal).length;
        const riskFactors = [];
        if (profile.allergies.length > 0) {
            riskFactors.push('Known allergies');
        }
        if (profile.currentMedications.length > 5) {
            riskFactors.push('Multiple medications');
        }
        if (criticalLabResults > 0) {
            riskFactors.push('Abnormal lab values');
        }
        return {
            riskFactors,
            activeConditions,
            medicationCount: profile.currentMedications.length,
            allergyCount: profile.allergies.length,
            lastVisitDate: profile.visits[0]?.visitDate || null,
            criticalLabResults,
        };
    }
    async getVitalSignsHistory(patientId, limit = 50) {
        return {
            success: true,
            data: {
                bloodPressure: [],
                heartRate: [],
                temperature: [],
                weight: [],
                height: [],
            },
            message: 'Vital signs history retrieved successfully',
        };
    }
    async generatePatientSummary(patientId) {
        const overview = await this.getPatientOverview(patientId);
        const timeline = await this.getPatientTimeline(patientId);
        return {
            success: true,
            data: {
                ...overview.data,
                timeline: timeline.data,
                generatedAt: new Date(),
            },
            message: 'Patient summary generated successfully',
        };
    }
};
exports.EmrService = EmrService;
exports.EmrService = EmrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], EmrService);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImagingController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const imaging_service_1 = __webpack_require__(30);
let ImagingController = class ImagingController {
    constructor(imagingService) {
        this.imagingService = imagingService;
    }
    async createImagingOrder(req, orderData) {
        return this.imagingService.createImagingOrder(orderData);
    }
    async uploadImagingResult(req, resultData) {
        return this.imagingService.uploadImagingResult(resultData);
    }
    async getPatientImagingResults(patientId, studyType, bodyPart, startDate, endDate, status, limit) {
        return this.imagingService.getPatientImagingResults(patientId, {
            studyType,
            bodyPart,
            startDate,
            endDate,
            status,
            limit,
        });
    }
    async getImagingResult(resultId) {
        return this.imagingService.getImagingResult(resultId);
    }
    async reviewImagingResult(resultId, req, reviewData) {
        return this.imagingService.reviewImagingResult(resultId, req.user.userId, reviewData.reviewNotes);
    }
    async flagImagingResult(resultId, req, flagData) {
        return this.imagingService.flagImagingResult(resultId, req.user.userId, flagData.flagReason);
    }
    async getCriticalImagingResults(doctorId) {
        return this.imagingService.getCriticalImagingResults(doctorId);
    }
    async getImagingStatistics(doctorId, startDate, endDate) {
        return this.imagingService.getImagingStatistics(doctorId, startDate, endDate);
    }
    async getPatientImagingOrders(patientId, status, studyType, startDate, endDate, doctorId, limit) {
        return this.imagingService.getPatientImagingOrders(patientId, {
            status,
            studyType,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
    async updateImagingOrderStatus(orderId, statusData) {
        return this.imagingService.updateImagingOrderStatus(orderId, statusData.status, statusData.notes);
    }
};
exports.ImagingController = ImagingController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create imaging order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging order created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "createImagingOrder", null);
__decorate([
    (0, common_1.Post)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload imaging result with OCR processing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imaging result uploaded successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "uploadImagingResult", null);
__decorate([
    (0, common_1.Get)('results/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging results for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging results retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('studyType')),
    __param(2, (0, common_1.Query)('bodyPart')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getPatientImagingResults", null);
__decorate([
    (0, common_1.Get)('results/:resultId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging result details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result retrieved successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getImagingResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Review imaging result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result reviewed successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "reviewImagingResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/flag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Flag imaging result for follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging result flagged for follow-up' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "flagImagingResult", null);
__decorate([
    (0, common_1.Get)('results/critical'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical imaging results requiring immediate attention' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical imaging results retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getCriticalImagingResults", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging statistics for dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getImagingStatistics", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get imaging orders for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('studyType')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('doctorId')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "getPatientImagingOrders", null);
__decorate([
    (0, common_1.Put)('orders/:orderId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update imaging order status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imaging order status updated successfully' }),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImagingController.prototype, "updateImagingOrderStatus", null);
exports.ImagingController = ImagingController = __decorate([
    (0, swagger_1.ApiTags)('Imaging Results'),
    (0, common_1.Controller)('imaging'),
    __metadata("design:paramtypes", [typeof (_a = typeof imaging_service_1.ImagingService !== "undefined" && imaging_service_1.ImagingService) === "function" ? _a : Object])
], ImagingController);


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImagingService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let ImagingService = class ImagingService {
    constructor(db) {
        this.db = db;
    }
    async createImagingOrder(orderData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: orderData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: orderData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const imagingOrder = await this.db.imagingOrder.create({
            data: {
                patientId: orderData.patientId,
                doctorId: orderData.doctorId,
                visitId: orderData.visitId,
                studyType: orderData.studyType,
                bodyPart: orderData.bodyPart,
                clinicalHistory: orderData.clinicalHistory,
                urgency: orderData.urgency || 'ROUTINE',
                imagingCenter: orderData.imagingCenter,
                centerAddress: orderData.centerAddress,
                status: 'PENDING',
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: imagingOrder,
            message: 'Imaging order created successfully',
        };
    }
    async uploadImagingResult(resultData) {
        const patient = await this.db.user.findUnique({
            where: { id: resultData.patientId, role: 'PATIENT' },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        let ocrText = resultData.ocrText;
        if (!ocrText && resultData.reportFileUrl) {
            ocrText = await this.processOCR(resultData.reportFileUrl);
        }
        const analysisResult = await this.analyzeImagingFindings(resultData.findings, resultData.impression);
        const imagingResult = await this.db.imagingResult.create({
            data: {
                patientId: resultData.patientId,
                orderId: resultData.orderId,
                doctorId: resultData.doctorId,
                studyType: resultData.studyType,
                bodyPart: resultData.bodyPart,
                technique: resultData.technique,
                contrastUsed: resultData.contrastUsed || false,
                findings: resultData.findings,
                impression: resultData.impression,
                recommendations: resultData.recommendations,
                imageUrls: resultData.imageUrls,
                reportFileUrl: resultData.reportFileUrl,
                ocrText,
                radiologistName: resultData.radiologistName,
                radiologistId: resultData.radiologistId,
                performedAt: new Date(resultData.performedAt),
                reportedAt: new Date(),
                status: analysisResult.isCritical ? 'CRITICAL_FINDING_ALERT' : 'PENDING_REVIEW',
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                    },
                },
            },
        });
        if (analysisResult.isCritical) {
            await this.sendCriticalImagingAlert(imagingResult);
        }
        return {
            success: true,
            data: imagingResult,
            analysis: analysisResult,
            message: 'Imaging result uploaded successfully',
        };
    }
    async getPatientImagingResults(patientId, filters) {
        const where = { patientId };
        if (filters?.studyType) {
            where.studyType = filters.studyType;
        }
        if (filters?.bodyPart) {
            where.bodyPart = { contains: filters.bodyPart, mode: 'insensitive' };
        }
        if (filters?.startDate || filters?.endDate) {
            where.reportedAt = {};
            if (filters?.startDate)
                where.reportedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.reportedAt.lte = new Date(filters.endDate);
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const imagingResults = await this.db.imagingResult.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                    },
                },
            },
            orderBy: { reportedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: imagingResults,
            message: 'Imaging results retrieved successfully',
        };
    }
    async getImagingResult(resultId) {
        const imagingResult = await this.db.imagingResult.findUnique({
            where: { id: resultId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        studyType: true,
                        bodyPart: true,
                        clinicalHistory: true,
                        urgency: true,
                    },
                },
            },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        return {
            success: true,
            data: imagingResult,
            message: 'Imaging result retrieved successfully',
        };
    }
    async reviewImagingResult(resultId, doctorId, reviewNotes) {
        const imagingResult = await this.db.imagingResult.findUnique({
            where: { id: resultId },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        const updatedResult = await this.db.imagingResult.update({
            where: { id: resultId },
            data: {
                status: 'REVIEWED',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Imaging result reviewed successfully',
        };
    }
    async flagImagingResult(resultId, doctorId, flagReason) {
        const imagingResult = await this.db.imagingResult.findUnique({
            where: { id: resultId },
        });
        if (!imagingResult) {
            throw new common_1.NotFoundException('Imaging result not found');
        }
        const updatedResult = await this.db.imagingResult.update({
            where: { id: resultId },
            data: {
                status: 'FLAGGED_FOR_FOLLOWUP',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Imaging result flagged for follow-up',
        };
    }
    async getCriticalImagingResults(doctorId) {
        const where = {
            status: 'CRITICAL_FINDING_ALERT',
        };
        if (doctorId) {
            where.doctorId = doctorId;
        }
        const criticalResults = await this.db.imagingResult.findMany({
            where,
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
            orderBy: { reportedAt: 'asc' },
        });
        return {
            success: true,
            data: criticalResults,
            message: 'Critical imaging results retrieved successfully',
        };
    }
    async getImagingStatistics(doctorId, startDate, endDate) {
        const where = {};
        if (doctorId) {
            where.doctorId = doctorId;
        }
        if (startDate || endDate) {
            where.reportedAt = {};
            if (startDate)
                where.reportedAt.gte = new Date(startDate);
            if (endDate)
                where.reportedAt.lte = new Date(endDate);
        }
        const [totalResults, criticalResults, resultsByType] = await Promise.all([
            this.db.imagingResult.count({ where }),
            this.db.imagingResult.count({ where: { ...where, status: 'CRITICAL_FINDING_ALERT' } }),
            this.db.imagingResult.groupBy({
                by: ['studyType'],
                where,
                _count: { studyType: true },
            }),
        ]);
        return {
            success: true,
            data: {
                totalResults,
                criticalResults,
                resultsByType,
                criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
            },
            message: 'Imaging statistics retrieved successfully',
        };
    }
    async getPatientImagingOrders(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.studyType) {
            where.studyType = filters.studyType;
        }
        if (filters?.startDate || filters?.endDate) {
            where.orderedAt = {};
            if (filters?.startDate)
                where.orderedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.orderedAt.lte = new Date(filters.endDate);
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const imagingOrders = await this.db.imagingOrder.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
                results: {
                    select: {
                        id: true,
                        studyType: true,
                        bodyPart: true,
                        findings: true,
                        impression: true,
                        status: true,
                    },
                },
            },
            orderBy: { orderedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: imagingOrders,
            message: 'Imaging orders retrieved successfully',
        };
    }
    async processOCR(fileUrl) {
        return `Mock OCR text extracted from imaging report ${fileUrl}`;
    }
    async analyzeImagingFindings(findings, impression) {
        const criticalKeywords = ['mass', 'tumor', 'fracture', 'hemorrhage', 'pneumonia', 'stroke'];
        const text = `${findings || ''} ${impression || ''}`.toLowerCase();
        const isCritical = criticalKeywords.some(keyword => text.includes(keyword));
        const isAbnormal = Math.random() > 0.6;
        return {
            isCritical,
            isAbnormal,
            interpretation: isCritical ? 'Critical finding detected' : 'Routine imaging study',
            recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
        };
    }
    async sendCriticalImagingAlert(imagingResult) {
        console.log(`CRITICAL IMAGING ALERT: Result ${imagingResult.id} requires immediate attention for patient ${imagingResult.patient.firstName} ${imagingResult.patient.lastName}`);
        return true;
    }
    async updateImagingOrderStatus(orderId, status, notes) {
        const order = await this.db.imagingOrder.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Imaging order not found');
        }
        const updateData = { status: status };
        if (status === 'SCHEDULED') {
            updateData.scheduledAt = new Date();
        }
        else if (status === 'IN_PROGRESS') {
            updateData.performedAt = new Date();
        }
        else if (status === 'COMPLETED') {
            updateData.completedAt = new Date();
        }
        const updatedOrder = await this.db.imagingOrder.update({
            where: { id: orderId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedOrder,
            message: `Imaging order status updated to ${status}`,
        };
    }
};
exports.ImagingService = ImagingService;
exports.ImagingService = ImagingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], ImagingService);


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const lab_service_1 = __webpack_require__(32);
let LabController = class LabController {
    constructor(labService) {
        this.labService = labService;
    }
    async createLabOrder(req, orderData) {
        return this.labService.createLabOrder(orderData);
    }
    async uploadLabResult(req, resultData) {
        return this.labService.uploadLabResult(resultData);
    }
    async getPatientLabResults(patientId, testCategory, startDate, endDate, isAbnormal, criticalValue, status, limit) {
        return this.labService.getPatientLabResults(patientId, {
            testCategory,
            startDate,
            endDate,
            isAbnormal,
            criticalValue,
            status,
            limit,
        });
    }
    async getLabResult(resultId) {
        return this.labService.getLabResult(resultId);
    }
    async reviewLabResult(resultId, req, reviewData) {
        return this.labService.reviewLabResult(resultId, req.user.userId, reviewData.reviewNotes);
    }
    async flagLabResult(resultId, req, flagData) {
        return this.labService.flagLabResult(resultId, req.user.userId, flagData.flagReason);
    }
    async getCriticalLabResults(doctorId) {
        return this.labService.getCriticalLabResults(doctorId);
    }
    async getLabStatistics(doctorId, startDate, endDate) {
        return this.labService.getLabStatistics(doctorId, startDate, endDate);
    }
    async getPatientLabOrders(patientId, status, startDate, endDate, doctorId, limit) {
        return this.labService.getPatientLabOrders(patientId, {
            status,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
};
exports.LabController = LabController;
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create lab order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lab order created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "createLabOrder", null);
__decorate([
    (0, common_1.Post)('results'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload lab result with OCR processing' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lab result uploaded successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "uploadLabResult", null);
__decorate([
    (0, common_1.Get)('results/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab results for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab results retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('testCategory')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('isAbnormal')),
    __param(5, (0, common_1.Query)('criticalValue')),
    __param(6, (0, common_1.Query)('status')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Boolean, Boolean, String, Number]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getPatientLabResults", null);
__decorate([
    (0, common_1.Get)('results/:resultId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab result details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result retrieved successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getLabResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Review lab result' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result reviewed successfully' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "reviewLabResult", null);
__decorate([
    (0, common_1.Put)('results/:resultId/flag'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Flag lab result for follow-up' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab result flagged for follow-up' }),
    __param(0, (0, common_1.Param)('resultId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "flagLabResult", null);
__decorate([
    (0, common_1.Get)('results/critical'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical lab results requiring immediate attention' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Critical lab results retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getCriticalLabResults", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab statistics for dashboard' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab statistics retrieved successfully' }),
    __param(0, (0, common_1.Query)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getLabStatistics", null);
__decorate([
    (0, common_1.Get)('orders/patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get lab orders for patient' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lab orders retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], LabController.prototype, "getPatientLabOrders", null);
exports.LabController = LabController = __decorate([
    (0, swagger_1.ApiTags)('Lab Results'),
    (0, common_1.Controller)('lab'),
    __metadata("design:paramtypes", [typeof (_a = typeof lab_service_1.LabService !== "undefined" && lab_service_1.LabService) === "function" ? _a : Object])
], LabController);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LabService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let LabService = class LabService {
    constructor(db) {
        this.db = db;
    }
    async createLabOrder(orderData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: orderData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: orderData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const labOrder = await this.db.labOrder.create({
            data: {
                patientId: orderData.patientId,
                doctorId: orderData.doctorId,
                visitId: orderData.visitId,
                testsRequested: orderData.testsRequested,
                clinicalNotes: orderData.clinicalNotes,
                urgency: orderData.urgency || 'ROUTINE',
                labName: orderData.labName,
                labAddress: orderData.labAddress,
                status: 'PENDING',
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: labOrder,
            message: 'Lab order created successfully',
        };
    }
    async uploadLabResult(resultData) {
        const patient = await this.db.user.findUnique({
            where: { id: resultData.patientId, role: 'PATIENT' },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        let ocrText = resultData.ocrText;
        if (!ocrText && resultData.reportFileUrl) {
            ocrText = await this.processOCR(resultData.reportFileUrl);
        }
        const analysisResult = await this.analyzeLabResult(resultData.testName, resultData.resultValue, resultData.referenceRange);
        const labResult = await this.db.labResult.create({
            data: {
                patientId: resultData.patientId,
                orderId: resultData.orderId,
                doctorId: resultData.doctorId,
                testName: resultData.testName,
                testCategory: resultData.testCategory,
                resultValue: resultData.resultValue,
                resultUnit: resultData.resultUnit,
                referenceRange: resultData.referenceRange,
                isAbnormal: resultData.isAbnormal || analysisResult.isAbnormal,
                criticalValue: resultData.criticalValue || analysisResult.isCritical,
                reportFileUrl: resultData.reportFileUrl,
                ocrText,
                labName: resultData.labName,
                labAddress: resultData.labAddress,
                labPhone: resultData.labPhone,
                technicianName: resultData.technicianName,
                collectedAt: new Date(resultData.collectedAt),
                processedAt: resultData.processedAt ? new Date(resultData.processedAt) : null,
                reportedAt: new Date(),
                status: analysisResult.isCritical ? 'CRITICAL_ALERT_SENT' : 'PENDING_REVIEW',
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                    },
                },
            },
        });
        if (analysisResult.isCritical) {
            await this.sendCriticalAlert(labResult);
        }
        return {
            success: true,
            data: labResult,
            analysis: analysisResult,
            message: 'Lab result uploaded successfully',
        };
    }
    async getPatientLabResults(patientId, filters) {
        const where = { patientId };
        if (filters?.testCategory) {
            where.testCategory = filters.testCategory;
        }
        if (filters?.startDate || filters?.endDate) {
            where.reportedAt = {};
            if (filters?.startDate)
                where.reportedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.reportedAt.lte = new Date(filters.endDate);
        }
        if (filters?.isAbnormal !== undefined) {
            where.isAbnormal = filters.isAbnormal;
        }
        if (filters?.criticalValue !== undefined) {
            where.criticalValue = filters.criticalValue;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        const labResults = await this.db.labResult.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                    },
                },
            },
            orderBy: { reportedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: labResults,
            message: 'Lab results retrieved successfully',
        };
    }
    async getLabResult(resultId) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                order: {
                    select: {
                        id: true,
                        testsRequested: true,
                        clinicalNotes: true,
                        urgency: true,
                    },
                },
            },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        return {
            success: true,
            data: labResult,
            message: 'Lab result retrieved successfully',
        };
    }
    async reviewLabResult(resultId, doctorId, reviewNotes) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        const updatedResult = await this.db.labResult.update({
            where: { id: resultId },
            data: {
                status: 'REVIEWED',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Lab result reviewed successfully',
        };
    }
    async flagLabResult(resultId, doctorId, flagReason) {
        const labResult = await this.db.labResult.findUnique({
            where: { id: resultId },
        });
        if (!labResult) {
            throw new common_1.NotFoundException('Lab result not found');
        }
        const updatedResult = await this.db.labResult.update({
            where: { id: resultId },
            data: {
                status: 'FLAGGED_FOR_FOLLOWUP',
                reviewedAt: new Date(),
                reviewedBy: doctorId,
            },
        });
        return {
            success: true,
            data: updatedResult,
            message: 'Lab result flagged for follow-up',
        };
    }
    async getCriticalLabResults(doctorId) {
        const where = {
            criticalValue: true,
            status: 'PENDING_REVIEW',
        };
        if (doctorId) {
            where.doctorId = doctorId;
        }
        const criticalResults = await this.db.labResult.findMany({
            where,
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
            orderBy: { reportedAt: 'asc' },
        });
        return {
            success: true,
            data: criticalResults,
            message: 'Critical lab results retrieved successfully',
        };
    }
    async getLabStatistics(doctorId, startDate, endDate) {
        const where = {};
        if (doctorId) {
            where.doctorId = doctorId;
        }
        if (startDate || endDate) {
            where.reportedAt = {};
            if (startDate)
                where.reportedAt.gte = new Date(startDate);
            if (endDate)
                where.reportedAt.lte = new Date(endDate);
        }
        const [totalResults, abnormalResults, criticalResults, resultsByCategory] = await Promise.all([
            this.db.labResult.count({ where }),
            this.db.labResult.count({ where: { ...where, isAbnormal: true } }),
            this.db.labResult.count({ where: { ...where, criticalValue: true } }),
            this.db.labResult.groupBy({
                by: ['testCategory'],
                where,
                _count: { testCategory: true },
            }),
        ]);
        return {
            success: true,
            data: {
                totalResults,
                abnormalResults,
                criticalResults,
                resultsByCategory,
                abnormalRate: totalResults > 0 ? (abnormalResults / totalResults) * 100 : 0,
                criticalRate: totalResults > 0 ? (criticalResults / totalResults) * 100 : 0,
            },
            message: 'Lab statistics retrieved successfully',
        };
    }
    async processOCR(fileUrl) {
        return `Mock OCR text extracted from ${fileUrl}`;
    }
    async analyzeLabResult(testName, resultValue, referenceRange) {
        const isAbnormal = Math.random() > 0.7;
        const isCritical = Math.random() > 0.9;
        return {
            isAbnormal,
            isCritical,
            interpretation: isAbnormal ? 'Result outside normal range' : 'Result within normal range',
            recommendations: isCritical ? 'Immediate medical attention required' : 'Follow up as needed',
        };
    }
    async sendCriticalAlert(labResult) {
        console.log(`CRITICAL ALERT: Lab result ${labResult.id} requires immediate attention for patient ${labResult.patient.firstName} ${labResult.patient.lastName}`);
        return true;
    }
    async getPatientLabOrders(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.orderedAt = {};
            if (filters?.startDate)
                where.orderedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.orderedAt.lte = new Date(filters.endDate);
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const labOrders = await this.db.labOrder.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
                results: {
                    select: {
                        id: true,
                        testName: true,
                        resultValue: true,
                        isAbnormal: true,
                        criticalValue: true,
                        status: true,
                    },
                },
            },
            orderBy: { orderedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: labOrders,
            message: 'Lab orders retrieved successfully',
        };
    }
};
exports.LabService = LabService;
exports.LabService = LabService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], LabService);


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatientProfileController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const patient_profile_service_1 = __webpack_require__(34);
let PatientProfileController = class PatientProfileController {
    constructor(patientProfileService) {
        this.patientProfileService = patientProfileService;
    }
    async upsertPatientProfile(req, profileData) {
        return this.patientProfileService.upsertPatientProfile(req.user.userId, profileData);
    }
    async getPatientProfile(req) {
        return this.patientProfileService.getPatientProfile(req.user.userId);
    }
    async addAllergy(req, allergyData) {
        return this.patientProfileService.addAllergy(req.user.userId, allergyData);
    }
    async updateAllergy(allergyId, allergyData) {
        return this.patientProfileService.updateAllergy(allergyId, allergyData);
    }
    async removeAllergy(allergyId) {
        return this.patientProfileService.removeAllergy(allergyId);
    }
    async getPatientAllergies(req) {
        return this.patientProfileService.getPatientAllergies(req.user.userId);
    }
    async addCurrentMedication(req, medicationData) {
        return this.patientProfileService.addCurrentMedication(req.user.userId, medicationData);
    }
    async updateCurrentMedication(medicationId, medicationData) {
        return this.patientProfileService.updateCurrentMedication(medicationId, medicationData);
    }
    async removeCurrentMedication(medicationId) {
        return this.patientProfileService.removeCurrentMedication(medicationId);
    }
    async getPatientMedications(req) {
        return this.patientProfileService.getPatientMedications(req.user.userId);
    }
};
exports.PatientProfileController = PatientProfileController;
__decorate([
    (0, common_1.Post)('upsert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create or update patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient profile updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "upsertPatientProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient profile retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientProfile", null);
__decorate([
    (0, common_1.Post)('allergies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add allergy to patient profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy added successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "addAllergy", null);
__decorate([
    (0, common_1.Put)('allergies/:allergyId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update allergy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy updated successfully' }),
    __param(0, (0, common_1.Param)('allergyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "updateAllergy", null);
__decorate([
    (0, common_1.Delete)('allergies/:allergyId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove allergy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergy removed successfully' }),
    __param(0, (0, common_1.Param)('allergyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "removeAllergy", null);
__decorate([
    (0, common_1.Get)('allergies'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient allergies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Allergies retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientAllergies", null);
__decorate([
    (0, common_1.Post)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication added successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "addCurrentMedication", null);
__decorate([
    (0, common_1.Put)('medications/:medicationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication updated successfully' }),
    __param(0, (0, common_1.Param)('medicationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "updateCurrentMedication", null);
__decorate([
    (0, common_1.Delete)('medications/:medicationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove current medication' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medication removed successfully' }),
    __param(0, (0, common_1.Param)('medicationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "removeCurrentMedication", null);
__decorate([
    (0, common_1.Get)('medications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient current medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current medications retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PatientProfileController.prototype, "getPatientMedications", null);
exports.PatientProfileController = PatientProfileController = __decorate([
    (0, swagger_1.ApiTags)('Patient Profile'),
    (0, common_1.Controller)('patient-profile'),
    __metadata("design:paramtypes", [typeof (_a = typeof patient_profile_service_1.PatientProfileService !== "undefined" && patient_profile_service_1.PatientProfileService) === "function" ? _a : Object])
], PatientProfileController);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatientProfileService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let PatientProfileService = class PatientProfileService {
    constructor(db) {
        this.db = db;
    }
    async upsertPatientProfile(patientId, profileData) {
        const patient = await this.db.user.findUnique({
            where: { id: patientId, role: 'PATIENT' },
        });
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        const dataToUpsert = {};
        if (profileData.dateOfBirth) {
            dataToUpsert.dateOfBirth = new Date(profileData.dateOfBirth);
        }
        if (profileData.gender) {
            dataToUpsert.gender = profileData.gender;
        }
        if (profileData.bloodType) {
            dataToUpsert.bloodType = profileData.bloodType;
        }
        if (profileData.height !== undefined) {
            dataToUpsert.height = profileData.height;
        }
        if (profileData.weight !== undefined) {
            dataToUpsert.weight = profileData.weight;
        }
        if (profileData.emergencyContact) {
            dataToUpsert.emergencyContact = profileData.emergencyContact;
        }
        if (profileData.emergencyPhone) {
            dataToUpsert.emergencyPhone = profileData.emergencyPhone;
        }
        if (profileData.medicalHistory) {
            dataToUpsert.medicalHistory = profileData.medicalHistory;
        }
        if (profileData.surgicalHistory) {
            dataToUpsert.surgicalHistory = profileData.surgicalHistory;
        }
        if (profileData.familyHistory) {
            dataToUpsert.familyHistory = profileData.familyHistory;
        }
        if (profileData.socialHistory) {
            dataToUpsert.socialHistory = profileData.socialHistory;
        }
        if (profileData.primaryInsurance) {
            dataToUpsert.primaryInsurance = profileData.primaryInsurance;
        }
        if (profileData.insuranceNumber) {
            dataToUpsert.insuranceNumber = profileData.insuranceNumber;
        }
        if (profileData.insuranceExpiry) {
            dataToUpsert.insuranceExpiry = new Date(profileData.insuranceExpiry);
        }
        if (profileData.preferredLanguage) {
            dataToUpsert.preferredLanguage = profileData.preferredLanguage;
        }
        if (profileData.communicationPref) {
            dataToUpsert.communicationPref = profileData.communicationPref;
        }
        const profile = await this.db.patientProfile.upsert({
            where: { patientId },
            update: dataToUpsert,
            create: {
                patientId,
                ...dataToUpsert,
            },
            include: {
                allergies: true,
                currentMedications: true,
            },
        });
        return {
            success: true,
            data: profile,
            message: 'Patient profile updated successfully',
        };
    }
    async getPatientProfile(patientId) {
        const include = {
            allergies: true,
            currentMedications: true,
            visits: {
                include: {
                    doctor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            specialization: true,
                        },
                    },
                },
                orderBy: { visitDate: 'desc' },
                take: 10,
            },
        };
        let profile = await this.db.patientProfile.findUnique({
            where: { patientId },
            include,
        });
        if (!profile) {
            profile = await this.db.patientProfile.create({
                data: {
                    patientId,
                    preferredLanguage: 'English',
                    communicationPref: 'EMAIL',
                },
                include,
            });
            return {
                success: true,
                data: profile,
                message: 'Patient profile initialized',
            };
        }
        return {
            success: true,
            data: profile,
            message: 'Patient profile retrieved successfully',
        };
    }
    async addAllergy(patientId, allergyData) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const allergy = await this.db.patientAllergy.create({
            data: {
                patientId: profile.id,
                allergen: allergyData.allergen,
                severity: allergyData.severity,
                reaction: allergyData.reaction,
                notes: allergyData.notes,
                diagnosedAt: allergyData.diagnosedAt ? new Date(allergyData.diagnosedAt) : null,
                diagnosedBy: allergyData.diagnosedBy,
            },
        });
        return {
            success: true,
            data: allergy,
            message: 'Allergy added successfully',
        };
    }
    async updateAllergy(allergyId, allergyData) {
        const allergy = await this.db.patientAllergy.update({
            where: { id: allergyId },
            data: {
                allergen: allergyData.allergen,
                severity: allergyData.severity,
                reaction: allergyData.reaction,
                notes: allergyData.notes,
            },
        });
        return {
            success: true,
            data: allergy,
            message: 'Allergy updated successfully',
        };
    }
    async removeAllergy(allergyId) {
        await this.db.patientAllergy.delete({
            where: { id: allergyId },
        });
        return {
            success: true,
            message: 'Allergy removed successfully',
        };
    }
    async addCurrentMedication(patientId, medicationData) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Patient profile not found');
        }
        const medication = await this.db.patientMedication.create({
            data: {
                patientId: profile.id,
                medicationName: medicationData.medicationName,
                dosage: medicationData.dosage,
                frequency: medicationData.frequency,
                route: medicationData.route,
                startDate: new Date(medicationData.startDate),
                endDate: medicationData.endDate ? new Date(medicationData.endDate) : null,
                prescribedBy: medicationData.prescribedBy,
                pharmacy: medicationData.pharmacy,
                notes: medicationData.notes,
            },
        });
        return {
            success: true,
            data: medication,
            message: 'Medication added successfully',
        };
    }
    async updateCurrentMedication(medicationId, medicationData) {
        const updateData = {
            medicationName: medicationData.medicationName,
            dosage: medicationData.dosage,
            frequency: medicationData.frequency,
            route: medicationData.route,
            pharmacy: medicationData.pharmacy,
            notes: medicationData.notes,
        };
        if (medicationData.endDate) {
            updateData.endDate = new Date(medicationData.endDate);
        }
        const medication = await this.db.patientMedication.update({
            where: { id: medicationId },
            data: updateData,
        });
        return {
            success: true,
            data: medication,
            message: 'Medication updated successfully',
        };
    }
    async removeCurrentMedication(medicationId) {
        await this.db.patientMedication.delete({
            where: { id: medicationId },
        });
        return {
            success: true,
            message: 'Medication removed successfully',
        };
    }
    async getPatientAllergies(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            return {
                success: true,
                data: [],
                message: 'No allergies found',
            };
        }
        const allergies = await this.db.patientAllergy.findMany({
            where: { patientId: profile.id },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: allergies,
            message: 'Allergies retrieved successfully',
        };
    }
    async getPatientMedications(patientId) {
        const profile = await this.db.patientProfile.findUnique({
            where: { patientId },
        });
        if (!profile) {
            return {
                success: true,
                data: [],
                message: 'No medications found',
            };
        }
        const medications = await this.db.patientMedication.findMany({
            where: {
                patientId: profile.id,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
            orderBy: { startDate: 'desc' },
        });
        return {
            success: true,
            data: medications,
            message: 'Current medications retrieved successfully',
        };
    }
};
exports.PatientProfileService = PatientProfileService;
exports.PatientProfileService = PatientProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], PatientProfileService);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrescriptionController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const prescription_service_1 = __webpack_require__(36);
let PrescriptionController = class PrescriptionController {
    constructor(prescriptionService) {
        this.prescriptionService = prescriptionService;
    }
    async createPrescription(req, prescriptionData) {
        return this.prescriptionService.createPrescription(prescriptionData);
    }
    async updatePrescription(prescriptionId, updateData) {
        return this.prescriptionService.updatePrescription(prescriptionId, updateData);
    }
    async getPrescription(prescriptionId) {
        return this.prescriptionService.getPrescription(prescriptionId);
    }
    async getPatientPrescriptions(patientId, status, startDate, endDate, doctorId, limit) {
        return this.prescriptionService.getPatientPrescriptions(patientId, {
            status,
            startDate,
            endDate,
            doctorId,
            limit,
        });
    }
    async updatePrescriptionStatus(prescriptionId, statusData) {
        return this.prescriptionService.updatePrescriptionStatus(prescriptionId, statusData.status, statusData.notes);
    }
    async cancelPrescription(prescriptionId, cancelData) {
        return this.prescriptionService.cancelPrescription(prescriptionId, cancelData.reason);
    }
    async getPrescriptionStatistics(doctorId, startDate, endDate) {
        return this.prescriptionService.getPrescriptionStatistics(doctorId, startDate, endDate);
    }
    async searchMedications(query) {
        return this.prescriptionService.searchMedications(query);
    }
    async checkDrugInteractions(interactionData) {
        const newMedication = interactionData.medications?.[0] || '';
        return this.prescriptionService.checkDrugInteractions(interactionData.patientId, newMedication);
    }
    async checkNewMedicationInteractions(interactionData) {
        return this.prescriptionService.checkDrugInteractions(interactionData.patientId, interactionData.newMedication);
    }
};
exports.PrescriptionController = PrescriptionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new prescription with drug interaction checking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Prescription created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "createPrescription", null);
__decorate([
    (0, common_1.Put)(':prescriptionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription updated successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "updatePrescription", null);
__decorate([
    (0, common_1.Get)(':prescriptionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription retrieved successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPrescription", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient prescriptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient prescriptions retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPatientPrescriptions", null);
__decorate([
    (0, common_1.Put)(':prescriptionId/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update prescription status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription status updated successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "updatePrescriptionStatus", null);
__decorate([
    (0, common_1.Put)(':prescriptionId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel prescription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription cancelled successfully' }),
    __param(0, (0, common_1.Param)('prescriptionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "cancelPrescription", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get prescription statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prescription statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "getPrescriptionStatistics", null);
__decorate([
    (0, common_1.Get)('medications/search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search for medications in drug database' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medications retrieved successfully' }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "searchMedications", null);
__decorate([
    (0, common_1.Post)('interactions/check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check drug interactions for medication list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug interaction check completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkDrugInteractions", null);
__decorate([
    (0, common_1.Post)('interactions/check-new'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check interactions for new medication with existing medications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Drug interaction check completed' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PrescriptionController.prototype, "checkNewMedicationInteractions", null);
exports.PrescriptionController = PrescriptionController = __decorate([
    (0, swagger_1.ApiTags)('Prescriptions'),
    (0, common_1.Controller)('prescriptions'),
    __metadata("design:paramtypes", [typeof (_a = typeof prescription_service_1.PrescriptionService !== "undefined" && prescription_service_1.PrescriptionService) === "function" ? _a : Object])
], PrescriptionController);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrescriptionService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let PrescriptionService = class PrescriptionService {
    constructor(db) {
        this.db = db;
    }
    async createPrescription(prescriptionData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: prescriptionData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: prescriptionData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const interactions = await this.checkDrugInteractions(prescriptionData.patientId, prescriptionData.medicationName);
        const qrCode = await this.generatePrescriptionQR(prescriptionData);
        const prescription = await this.db.prescription.create({
            data: {
                patientId: prescriptionData.patientId,
                doctorId: prescriptionData.doctorId,
                visitId: prescriptionData.visitId,
                medicationName: prescriptionData.medicationName,
                genericName: prescriptionData.genericName,
                dosage: prescriptionData.dosage,
                frequency: prescriptionData.frequency,
                duration: prescriptionData.duration,
                quantity: prescriptionData.quantity,
                refills: prescriptionData.refills || 0,
                instructions: prescriptionData.instructions,
                drugInteractions: interactions.map(i => i.description),
                contraindications: [],
                pharmacyName: prescriptionData.pharmacyName,
                pharmacyAddress: prescriptionData.pharmacyAddress,
                pharmacyPhone: prescriptionData.pharmacyPhone,
                deliveryMethod: prescriptionData.deliveryMethod || 'PICKUP',
                qrCode,
                status: 'PENDING',
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        licenseNumber: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: prescription,
            interactions,
            message: 'Prescription created successfully',
        };
    }
    async updatePrescription(prescriptionId, updateData) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: {
                dosage: updateData.dosage,
                frequency: updateData.frequency,
                duration: updateData.duration,
                quantity: updateData.quantity,
                refills: updateData.refills,
                instructions: updateData.instructions,
                pharmacyName: updateData.pharmacyName,
                pharmacyAddress: updateData.pharmacyAddress,
                pharmacyPhone: updateData.pharmacyPhone,
                deliveryMethod: updateData.deliveryMethod,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: updatedPrescription,
            message: 'Prescription updated successfully',
        };
    }
    async getPrescription(prescriptionId) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        licenseNumber: true,
                        npiNumber: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        return {
            success: true,
            data: prescription,
            message: 'Prescription retrieved successfully',
        };
    }
    async getPatientPrescriptions(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.prescribedAt = {};
            if (filters?.startDate)
                where.prescribedAt.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.prescribedAt.lte = new Date(filters.endDate);
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const prescriptions = await this.db.prescription.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                visit: {
                    select: {
                        id: true,
                        visitDate: true,
                        chiefComplaint: true,
                    },
                },
            },
            orderBy: { prescribedAt: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: prescriptions,
            message: 'Patient prescriptions retrieved successfully',
        };
    }
    async updatePrescriptionStatus(prescriptionId, status, notes) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        const updateData = { status: status };
        if (status === 'FILLED') {
            updateData.filledAt = new Date();
        }
        else if (status === 'PICKED_UP') {
            updateData.pickedUpAt = new Date();
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedPrescription,
            message: `Prescription status updated to ${status}`,
        };
    }
    async cancelPrescription(prescriptionId, reason) {
        const prescription = await this.db.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new common_1.NotFoundException('Prescription not found');
        }
        if (prescription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Prescription is already cancelled');
        }
        const updatedPrescription = await this.db.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: 'CANCELLED',
                instructions: reason ? `${prescription.instructions}\n\nCancellation reason: ${reason}` : prescription.instructions,
            },
        });
        return {
            success: true,
            data: updatedPrescription,
            message: 'Prescription cancelled successfully',
        };
    }
    async checkDrugInteractions(patientId, newMedication) {
        const currentMedications = await this.db.patientMedication.findMany({
            where: {
                patientId,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
        });
        const allergies = await this.db.patientAllergy.findMany({
            where: { patientId },
        });
        const interactions = [];
        for (const medication of currentMedications) {
            const interaction = await this.db.drugInteraction.findFirst({
                where: {
                    OR: [
                        {
                            drug: { name: { contains: newMedication, mode: 'insensitive' } },
                            interactingDrug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
                        },
                        {
                            drug: { name: { contains: medication.medicationName, mode: 'insensitive' } },
                            interactingDrug: { name: { contains: newMedication, mode: 'insensitive' } },
                        },
                    ],
                },
                include: {
                    drug: true,
                    interactingDrug: true,
                },
            });
            if (interaction) {
                interactions.push({
                    type: 'DRUG_INTERACTION',
                    severity: interaction.severity,
                    description: interaction.description,
                    clinicalEffect: interaction.clinicalEffect,
                    management: interaction.management,
                    medications: [newMedication, medication.medicationName],
                });
            }
        }
        for (const allergy of allergies) {
            if (newMedication.toLowerCase().includes(allergy.allergen.toLowerCase())) {
                interactions.push({
                    type: 'DRUG_ALLERGY',
                    severity: 'CONTRAINDICATED',
                    description: `Patient is allergic to ${allergy.allergen}`,
                    clinicalEffect: allergy.reaction,
                    management: 'Do not prescribe this medication',
                    medications: [newMedication],
                });
            }
        }
        return interactions;
    }
    async generatePrescriptionQR(prescriptionData) {
        const qrData = {
            prescriptionId: 'temp-id',
            patientId: prescriptionData.patientId,
            doctorId: prescriptionData.doctorId,
            medication: prescriptionData.medicationName,
            dosage: prescriptionData.dosage,
            timestamp: new Date().toISOString(),
        };
        return Buffer.from(JSON.stringify(qrData)).toString('base64');
    }
    async getPrescriptionStatistics(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate || endDate) {
            where.prescribedAt = {};
            if (startDate)
                where.prescribedAt.gte = new Date(startDate);
            if (endDate)
                where.prescribedAt.lte = new Date(endDate);
        }
        const [totalPrescriptions, prescriptionsByStatus, recentPrescriptions] = await Promise.all([
            this.db.prescription.count({ where }),
            this.db.prescription.groupBy({
                by: ['status'],
                where,
                _count: { status: true },
            }),
            this.db.prescription.findMany({
                where,
                include: {
                    patient: true,
                },
                orderBy: { prescribedAt: 'desc' },
                take: 10,
            }),
        ]);
        return {
            success: true,
            data: {
                totalPrescriptions,
                prescriptionsByStatus,
                recentPrescriptions,
            },
            message: 'Prescription statistics retrieved successfully',
        };
    }
    async searchMedications(query) {
        const medications = await this.db.drug.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { genericName: { contains: query, mode: 'insensitive' } },
                    { brandNames: { has: query } },
                ],
            },
            take: 20,
        });
        return {
            success: true,
            data: medications,
            message: 'Medications retrieved successfully',
        };
    }
};
exports.PrescriptionService = PrescriptionService;
exports.PrescriptionService = PrescriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], PrescriptionService);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VisitController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const visit_service_1 = __webpack_require__(38);
let VisitController = class VisitController {
    constructor(visitService) {
        this.visitService = visitService;
    }
    async createVisit(req, visitData) {
        return this.visitService.createVisit(visitData);
    }
    async updateVisit(visitId, updateData) {
        return this.visitService.updateVisit(visitId, updateData);
    }
    async getVisit(visitId) {
        return this.visitService.getVisit(visitId);
    }
    async getPatientVisits(patientId, startDate, endDate, visitType, doctorId, limit) {
        return this.visitService.getPatientVisits(patientId, {
            startDate,
            endDate,
            visitType,
            doctorId,
            limit,
        });
    }
    async addDiagnosis(visitId, diagnosisData) {
        return this.visitService.addDiagnosis(visitId, diagnosisData);
    }
    async updateDiagnosis(diagnosisId, diagnosisData) {
        return this.visitService.updateDiagnosis(diagnosisId, diagnosisData);
    }
    async removeDiagnosis(diagnosisId) {
        return this.visitService.removeDiagnosis(diagnosisId);
    }
    async processVoiceTranscription(visitId, transcriptionData) {
        return this.visitService.processVoiceTranscription(visitId, transcriptionData.voiceFileUrl, transcriptionData.transcribedText);
    }
    async getIcd10Suggestions(symptoms) {
        return this.visitService.getIcd10Suggestions(symptoms);
    }
    async getVisitStatistics(doctorId, startDate, endDate) {
        return this.visitService.getVisitStatistics(doctorId, startDate, endDate);
    }
};
exports.VisitController = VisitController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new patient visit (SOAP note)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Visit created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "createVisit", null);
__decorate([
    (0, common_1.Put)(':visitId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update visit (SOAP note)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit updated successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "updateVisit", null);
__decorate([
    (0, common_1.Get)(':visitId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit retrieved successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getVisit", null);
__decorate([
    (0, common_1.Get)('patient/:patientId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient visit history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient visits retrieved successfully' }),
    __param(0, (0, common_1.Param)('patientId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('visitType')),
    __param(4, (0, common_1.Query)('doctorId')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getPatientVisits", null);
__decorate([
    (0, common_1.Post)(':visitId/diagnoses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add diagnosis to visit' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis added successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "addDiagnosis", null);
__decorate([
    (0, common_1.Put)('diagnoses/:diagnosisId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis updated successfully' }),
    __param(0, (0, common_1.Param)('diagnosisId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "updateDiagnosis", null);
__decorate([
    (0, common_1.Delete)('diagnoses/:diagnosisId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove diagnosis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Diagnosis removed successfully' }),
    __param(0, (0, common_1.Param)('diagnosisId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "removeDiagnosis", null);
__decorate([
    (0, common_1.Post)(':visitId/voice-transcription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Process voice-to-text transcription' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Voice transcription processed successfully' }),
    __param(0, (0, common_1.Param)('visitId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "processVoiceTranscription", null);
__decorate([
    (0, common_1.Get)('icd10/suggestions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get ICD-10 code suggestions based on symptoms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'ICD-10 suggestions retrieved successfully' }),
    __param(0, (0, common_1.Query)('symptoms')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getIcd10Suggestions", null);
__decorate([
    (0, common_1.Get)('doctor/:doctorId/statistics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get visit statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Visit statistics retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VisitController.prototype, "getVisitStatistics", null);
exports.VisitController = VisitController = __decorate([
    (0, swagger_1.ApiTags)('Patient Visits'),
    (0, common_1.Controller)('visits'),
    __metadata("design:paramtypes", [typeof (_a = typeof visit_service_1.VisitService !== "undefined" && visit_service_1.VisitService) === "function" ? _a : Object])
], VisitController);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VisitService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let VisitService = class VisitService {
    constructor(db) {
        this.db = db;
    }
    async createVisit(visitData) {
        const [patient, doctor] = await Promise.all([
            this.db.user.findUnique({ where: { id: visitData.patientId, role: 'PATIENT' } }),
            this.db.user.findUnique({ where: { id: visitData.doctorId, role: 'DOCTOR' } }),
        ]);
        if (!patient) {
            throw new common_1.NotFoundException('Patient not found');
        }
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const visit = await this.db.patientVisit.create({
            data: {
                patientId: visitData.patientId,
                doctorId: visitData.doctorId,
                appointmentId: visitData.appointmentId,
                visitType: visitData.visitType,
                chiefComplaint: visitData.chiefComplaint,
                subjective: visitData.subjective,
                objective: visitData.objective,
                assessment: visitData.assessment,
                plan: visitData.plan,
                voiceNotes: visitData.voiceNotes,
                voiceFileUrl: visitData.voiceFileUrl,
                followUpRequired: visitData.followUpRequired || false,
                followUpDate: visitData.followUpDate ? new Date(visitData.followUpDate) : null,
                followUpNotes: visitData.followUpNotes,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                diagnoses: true,
            },
        });
        if (visitData.diagnoses && visitData.diagnoses.length > 0) {
            await Promise.all(visitData.diagnoses.map(diagnosis => this.db.visitDiagnosis.create({
                data: {
                    visitId: visit.id,
                    icd10Code: diagnosis.icd10Code,
                    diagnosisName: diagnosis.diagnosisName,
                    isPrimary: diagnosis.isPrimary,
                    notes: diagnosis.notes,
                },
            })));
        }
        return {
            success: true,
            data: visit,
            message: 'Visit created successfully',
        };
    }
    async updateVisit(visitId, updateData) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const updatedVisit = await this.db.patientVisit.update({
            where: { id: visitId },
            data: {
                visitType: updateData.visitType,
                chiefComplaint: updateData.chiefComplaint,
                subjective: updateData.subjective,
                objective: updateData.objective,
                assessment: updateData.assessment,
                plan: updateData.plan,
                voiceNotes: updateData.voiceNotes,
                voiceFileUrl: updateData.voiceFileUrl,
                followUpRequired: updateData.followUpRequired,
                followUpDate: updateData.followUpDate ? new Date(updateData.followUpDate) : null,
                followUpNotes: updateData.followUpNotes,
            },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                diagnoses: true,
            },
        });
        return {
            success: true,
            data: updatedVisit,
            message: 'Visit updated successfully',
        };
    }
    async getVisit(visitId) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
            include: {
                patient: true,
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        email: true,
                        phoneNumber: true,
                    },
                },
                diagnoses: true,
                prescriptions: {
                    include: {
                        doctor: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                labOrders: true,
                imagingOrders: true,
            },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        return {
            success: true,
            data: visit,
            message: 'Visit retrieved successfully',
        };
    }
    async getPatientVisits(patientId, filters) {
        const where = { patientId };
        if (filters?.startDate || filters?.endDate) {
            where.visitDate = {};
            if (filters?.startDate)
                where.visitDate.gte = new Date(filters.startDate);
            if (filters?.endDate)
                where.visitDate.lte = new Date(filters.endDate);
        }
        if (filters?.visitType) {
            where.visitType = filters.visitType;
        }
        if (filters?.doctorId) {
            where.doctorId = filters.doctorId;
        }
        const visits = await this.db.patientVisit.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
                diagnoses: true,
                prescriptions: {
                    select: {
                        id: true,
                        medicationName: true,
                        status: true,
                    },
                },
            },
            orderBy: { visitDate: 'desc' },
            take: filters?.limit || 50,
        });
        return {
            success: true,
            data: visits,
            message: 'Patient visits retrieved successfully',
        };
    }
    async addDiagnosis(visitId, diagnosisData) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const diagnosis = await this.db.visitDiagnosis.create({
            data: {
                visitId,
                icd10Code: diagnosisData.icd10Code,
                diagnosisName: diagnosisData.diagnosisName,
                isPrimary: diagnosisData.isPrimary,
                notes: diagnosisData.notes,
            },
        });
        return {
            success: true,
            data: diagnosis,
            message: 'Diagnosis added successfully',
        };
    }
    async updateDiagnosis(diagnosisId, diagnosisData) {
        const diagnosis = await this.db.visitDiagnosis.update({
            where: { id: diagnosisId },
            data: {
                icd10Code: diagnosisData.icd10Code,
                diagnosisName: diagnosisData.diagnosisName,
                isPrimary: diagnosisData.isPrimary,
                notes: diagnosisData.notes,
            },
        });
        return {
            success: true,
            data: diagnosis,
            message: 'Diagnosis updated successfully',
        };
    }
    async removeDiagnosis(diagnosisId) {
        await this.db.visitDiagnosis.delete({
            where: { id: diagnosisId },
        });
        return {
            success: true,
            message: 'Diagnosis removed successfully',
        };
    }
    async processVoiceTranscription(visitId, voiceFileUrl, transcribedText) {
        const visit = await this.db.patientVisit.findUnique({
            where: { id: visitId },
        });
        if (!visit) {
            throw new common_1.NotFoundException('Visit not found');
        }
        const updatedVisit = await this.db.patientVisit.update({
            where: { id: visitId },
            data: {
                voiceFileUrl,
                voiceNotes: transcribedText,
            },
        });
        return {
            success: true,
            data: updatedVisit,
            message: 'Voice transcription processed successfully',
        };
    }
    async getIcd10Suggestions(symptoms) {
        const suggestions = [
            {
                code: 'R50.9',
                description: 'Fever, unspecified',
                category: 'Symptoms and signs',
            },
            {
                code: 'R06.02',
                description: 'Shortness of breath',
                category: 'Symptoms and signs',
            },
            {
                code: 'R10.9',
                description: 'Unspecified abdominal pain',
                category: 'Symptoms and signs',
            },
        ];
        return {
            success: true,
            data: suggestions,
            message: 'ICD-10 suggestions retrieved successfully',
        };
    }
    async getVisitStatistics(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate || endDate) {
            where.visitDate = {};
            if (startDate)
                where.visitDate.gte = new Date(startDate);
            if (endDate)
                where.visitDate.lte = new Date(endDate);
        }
        const [totalVisits, visitsByType, recentVisits] = await Promise.all([
            this.db.patientVisit.count({ where }),
            this.db.patientVisit.groupBy({
                by: ['visitType'],
                where,
                _count: { visitType: true },
            }),
            this.db.patientVisit.findMany({
                where,
                include: {
                    patient: true,
                },
                orderBy: { visitDate: 'desc' },
                take: 10,
            }),
        ]);
        return {
            success: true,
            data: {
                totalVisits,
                visitsByType,
                recentVisits,
            },
            message: 'Visit statistics retrieved successfully',
        };
    }
};
exports.VisitService = VisitService;
exports.VisitService = VisitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], VisitService);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClinicalTemplateService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let ClinicalTemplateService = class ClinicalTemplateService {
    constructor(db) {
        this.db = db;
    }
    async createTemplate(templateData) {
        const template = await this.db.clinicalTemplate.create({
            data: {
                doctorId: templateData.doctorId,
                name: templateData.name,
                category: templateData.category,
                specialty: templateData.specialty,
                isPublic: templateData.isPublic || false,
                subjectiveTemplate: templateData.subjectiveTemplate,
                objectiveTemplate: templateData.objectiveTemplate,
                assessmentTemplate: templateData.assessmentTemplate,
                planTemplate: templateData.planTemplate,
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: template,
            message: 'Clinical template created successfully',
        };
    }
    async getDoctorTemplates(doctorId, filters) {
        const where = {
            OR: [
                { doctorId },
                { isPublic: true },
            ],
        };
        if (filters?.category) {
            where.category = filters.category;
        }
        if (filters?.specialty) {
            where.specialty = filters.specialty;
        }
        if (filters?.isPublic !== undefined) {
            where.isPublic = filters.isPublic;
        }
        const templates = await this.db.clinicalTemplate.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
            orderBy: [
                { isPublic: 'asc' },
                { usageCount: 'desc' },
                { name: 'asc' },
            ],
        });
        return {
            success: true,
            data: templates,
            message: 'Clinical templates retrieved successfully',
        };
    }
    async getTemplate(templateId) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        return {
            success: true,
            data: template,
            message: 'Clinical template retrieved successfully',
        };
    }
    async updateTemplate(templateId, updateData) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        const updatedTemplate = await this.db.clinicalTemplate.update({
            where: { id: templateId },
            data: {
                name: updateData.name,
                category: updateData.category,
                specialty: updateData.specialty,
                isPublic: updateData.isPublic,
                subjectiveTemplate: updateData.subjectiveTemplate,
                objectiveTemplate: updateData.objectiveTemplate,
                assessmentTemplate: updateData.assessmentTemplate,
                planTemplate: updateData.planTemplate,
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: updatedTemplate,
            message: 'Clinical template updated successfully',
        };
    }
    async deleteTemplate(templateId) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        await this.db.clinicalTemplate.delete({
            where: { id: templateId },
        });
        return {
            success: true,
            message: 'Clinical template deleted successfully',
        };
    }
    async useTemplate(templateId) {
        const template = await this.db.clinicalTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Clinical template not found');
        }
        const updatedTemplate = await this.db.clinicalTemplate.update({
            where: { id: templateId },
            data: {
                usageCount: template.usageCount + 1,
            },
        });
        return {
            success: true,
            data: updatedTemplate,
            message: 'Template usage recorded',
        };
    }
    async getPopularTemplates(limit = 10) {
        const templates = await this.db.clinicalTemplate.findMany({
            where: { isPublic: true },
            orderBy: { usageCount: 'desc' },
            take: limit,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: templates,
            message: 'Popular templates retrieved successfully',
        };
    }
    async getTemplateCategories() {
        const categories = await this.db.clinicalTemplate.groupBy({
            by: ['category'],
            _count: { category: true },
            orderBy: { _count: { category: 'desc' } },
        });
        return {
            success: true,
            data: categories.map(cat => ({
                category: cat.category,
                count: cat._count.category,
            })),
            message: 'Template categories retrieved successfully',
        };
    }
    async getDefaultSOAPTemplates() {
        const defaultTemplates = [
            {
                name: 'General Consultation',
                category: 'SOAP_NOTE',
                subjectiveTemplate: `Chief Complaint: [Patient's main concern]

History of Present Illness:
- Onset: [When symptoms started]
- Duration: [How long symptoms have been present]
- Severity: [Rate 1-10]
- Associated symptoms: [Other symptoms]
- Relieving factors: [What helps]
- Aggravating factors: [What makes it worse]

Past Medical History: [Previous conditions]
Medications: [Current medications]
Allergies: [Known allergies]
Social History: [Smoking, alcohol, occupation]`,
                objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Temperature: [Temp]
- Respiratory Rate: [RR]
- Oxygen Saturation: [SpO2]

Physical Examination:
- General: [General appearance]
- HEENT: [Head, eyes, ears, nose, throat]
- Cardiovascular: [Heart exam]
- Pulmonary: [Lung exam]
- Abdomen: [Abdominal exam]
- Extremities: [Extremity exam]
- Neurological: [Neuro exam]`,
                assessmentTemplate: `Assessment:
1. [Primary diagnosis] - [ICD-10 code]
2. [Secondary diagnosis] - [ICD-10 code]

Clinical Reasoning:
[Explanation of diagnosis based on history and exam]`,
                planTemplate: `Plan:
1. [Primary treatment]
2. [Medications]
3. [Follow-up instructions]
4. [Patient education]
5. [Referrals if needed]

Follow-up: [When to return]
Patient Instructions: [Specific instructions for patient]`,
            },
            {
                name: 'Follow-up Visit',
                category: 'FOLLOW_UP',
                subjectiveTemplate: `Follow-up for: [Previous diagnosis]

Since last visit:
- Symptoms: [Better/worse/same]
- Medication compliance: [Taking medications as prescribed]
- Side effects: [Any side effects from medications]
- New symptoms: [Any new concerns]`,
                objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Weight: [Current weight]

Physical Examination:
- Focused exam based on condition
- [Specific findings]`,
                assessmentTemplate: `Assessment:
1. [Primary condition] - [Status: improved/stable/worsened]
2. [Any new findings]`,
                planTemplate: `Plan:
1. [Continue/adjust/discontinue medications]
2. [Additional treatments]
3. [Follow-up schedule]
4. [Patient education updates]`,
            },
            {
                name: 'Emergency Visit',
                category: 'EMERGENCY',
                subjectiveTemplate: `Chief Complaint: [Patient's main concern]

History of Present Illness:
- Onset: [When symptoms started]
- Duration: [How long]
- Severity: [Rate 1-10]
- Associated symptoms: [Other symptoms]
- Mechanism of injury: [If applicable]

Emergency History:
- Allergies: [Known allergies]
- Medications: [Current medications]
- Past medical history: [Relevant conditions]`,
                objectiveTemplate: `Vital Signs:
- Blood Pressure: [BP reading]
- Heart Rate: [HR]
- Temperature: [Temp]
- Respiratory Rate: [RR]
- Oxygen Saturation: [SpO2]
- Pain Score: [1-10]

Physical Examination:
- General: [General appearance, distress level]
- Focused exam based on chief complaint
- [Specific findings]`,
                assessmentTemplate: `Assessment:
1. [Primary diagnosis] - [ICD-10 code]
2. [Secondary diagnosis] - [ICD-10 code]

Emergency Severity:
- [Mild/Moderate/Severe]
- [Stable/Unstable]`,
                planTemplate: `Plan:
1. [Immediate treatment]
2. [Medications]
3. [Procedures if needed]
4. [Disposition: discharge/admit/transfer]
5. [Follow-up instructions]

Discharge Instructions: [Specific instructions]
Return Precautions: [When to return immediately]`,
            },
        ];
        return {
            success: true,
            data: defaultTemplates,
            message: 'Default SOAP templates retrieved successfully',
        };
    }
    async generateSOAPFromTemplate(templateId, patientData) {
        const template = await this.getTemplate(templateId);
        if (!template.success) {
            throw new common_1.NotFoundException('Template not found');
        }
        const soapNote = {
            subjective: this.fillTemplate(template.data.subjectiveTemplate, patientData),
            objective: this.fillTemplate(template.data.objectiveTemplate, patientData),
            assessment: this.fillTemplate(template.data.assessmentTemplate, patientData),
            plan: this.fillTemplate(template.data.planTemplate, patientData),
        };
        await this.useTemplate(templateId);
        return {
            success: true,
            data: soapNote,
            message: 'SOAP note generated from template',
        };
    }
    fillTemplate(template, patientData) {
        if (!template)
            return '';
        let filledTemplate = template;
        const replacements = {
            '[Patient Name]': patientData.name || '[Patient Name]',
            '[Patient Age]': patientData.age || '[Patient Age]',
            '[Patient Gender]': patientData.gender || '[Patient Gender]',
            '[Date]': new Date().toLocaleDateString(),
            '[Time]': new Date().toLocaleTimeString(),
        };
        Object.entries(replacements).forEach(([placeholder, value]) => {
            filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), value);
        });
        return filledTemplate;
    }
};
exports.ClinicalTemplateService = ClinicalTemplateService;
exports.ClinicalTemplateService = ClinicalTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], ClinicalTemplateService);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DrugInteractionService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
let DrugInteractionService = class DrugInteractionService {
    constructor(db) {
        this.db = db;
    }
    async checkDrugInteractions(medications) {
        if (medications.length < 2) {
            return {
                success: true,
                data: {
                    interactions: [],
                    severity: 'NONE',
                    summary: 'No interactions possible with single medication',
                },
                message: 'Drug interaction check completed',
            };
        }
        const interactions = [];
        let maxSeverity = 'NONE';
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const interaction = await this.findDrugInteraction(medications[i], medications[j]);
                if (interaction) {
                    interactions.push(interaction);
                    if (this.getSeverityLevel(interaction.severity) > this.getSeverityLevel(maxSeverity)) {
                        maxSeverity = interaction.severity;
                    }
                }
            }
        }
        return {
            success: true,
            data: {
                interactions,
                severity: maxSeverity,
                summary: this.generateInteractionSummary(interactions, maxSeverity),
                recommendations: this.generateRecommendations(interactions),
            },
            message: 'Drug interaction check completed',
        };
    }
    async checkNewMedicationInteractions(patientId, newMedication) {
        const currentMedications = await this.db.patientMedication.findMany({
            where: {
                patientId,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } },
                ],
            },
        });
        const medicationNames = currentMedications.map(med => med.medicationName);
        medicationNames.push(newMedication);
        return this.checkDrugInteractions(medicationNames);
    }
    async addDrug(drugData) {
        const existingDrug = await this.db.drug.findUnique({
            where: { name: drugData.name },
        });
        if (existingDrug) {
            throw new common_1.BadRequestException('Drug already exists in database');
        }
        const drug = await this.db.drug.create({
            data: {
                name: drugData.name,
                genericName: drugData.genericName,
                brandNames: drugData.brandNames || [],
                drugClass: drugData.drugClass,
                mechanism: drugData.mechanism,
                standardDosage: drugData.standardDosage,
                maxDosage: drugData.maxDosage,
                contraindications: drugData.contraindications || [],
            },
        });
        return {
            success: true,
            data: drug,
            message: 'Drug added to database successfully',
        };
    }
    async addDrugInteraction(interactionData) {
        const [drug, interactingDrug] = await Promise.all([
            this.findOrCreateDrug(interactionData.drugName),
            this.findOrCreateDrug(interactionData.interactingDrugName),
        ]);
        const existingInteraction = await this.db.drugInteraction.findFirst({
            where: {
                OR: [
                    {
                        drugId: drug.id,
                        interactingDrugId: interactingDrug.id,
                    },
                    {
                        drugId: interactingDrug.id,
                        interactingDrugId: drug.id,
                    },
                ],
            },
        });
        if (existingInteraction) {
            throw new common_1.BadRequestException('Drug interaction already exists');
        }
        const interaction = await this.db.drugInteraction.create({
            data: {
                drugId: drug.id,
                interactingDrugId: interactingDrug.id,
                severity: interactionData.severity,
                description: interactionData.description,
                clinicalEffect: interactionData.clinicalEffect,
                management: interactionData.management,
            },
            include: {
                drug: true,
                interactingDrug: true,
            },
        });
        return {
            success: true,
            data: interaction,
            message: 'Drug interaction added successfully',
        };
    }
    async searchDrugs(query, limit = 20) {
        const drugs = await this.db.drug.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { genericName: { contains: query, mode: 'insensitive' } },
                    { brandNames: { has: query } },
                    { drugClass: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: limit,
            orderBy: { name: 'asc' },
        });
        return {
            success: true,
            data: drugs,
            message: 'Drugs retrieved successfully',
        };
    }
    async getDrugDetails(drugId) {
        const drug = await this.db.drug.findUnique({
            where: { id: drugId },
            include: {
                interactions: {
                    include: {
                        interactingDrug: true,
                    },
                },
            },
        });
        if (!drug) {
            throw new common_1.NotFoundException('Drug not found');
        }
        return {
            success: true,
            data: drug,
            message: 'Drug details retrieved successfully',
        };
    }
    async getCommonDrugInteractions() {
        const commonInteractions = await this.db.drugInteraction.findMany({
            include: {
                drug: true,
                interactingDrug: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return {
            success: true,
            data: commonInteractions,
            message: 'Common drug interactions retrieved successfully',
        };
    }
    async seedDrugDatabase() {
        const commonDrugs = [
            {
                name: 'Warfarin',
                genericName: 'Warfarin',
                brandNames: ['Coumadin', 'Jantoven'],
                drugClass: 'Anticoagulant',
                contraindications: ['Active bleeding', 'Severe liver disease'],
            },
            {
                name: 'Aspirin',
                genericName: 'Aspirin',
                brandNames: ['Bayer', 'Bufferin', 'Ecotrin'],
                drugClass: 'NSAID',
                contraindications: ['Active bleeding', 'Peptic ulcer disease'],
            },
            {
                name: 'Metformin',
                genericName: 'Metformin',
                brandNames: ['Glucophage', 'Fortamet'],
                drugClass: 'Biguanide',
                contraindications: ['Severe kidney disease', 'Severe liver disease'],
            },
            {
                name: 'Lisinopril',
                genericName: 'Lisinopril',
                brandNames: ['Prinivil', 'Zestril'],
                drugClass: 'ACE Inhibitor',
                contraindications: ['Pregnancy', 'Bilateral renal artery stenosis'],
            },
            {
                name: 'Atorvastatin',
                genericName: 'Atorvastatin',
                brandNames: ['Lipitor'],
                drugClass: 'Statin',
                contraindications: ['Active liver disease', 'Pregnancy'],
            },
        ];
        for (const drugData of commonDrugs) {
            try {
                await this.addDrug(drugData);
            }
            catch (error) {
            }
        }
        const commonInteractions = [
            {
                drugName: 'Warfarin',
                interactingDrugName: 'Aspirin',
                severity: 'MAJOR',
                description: 'Increased risk of bleeding',
                clinicalEffect: 'Enhanced anticoagulant effect',
                management: 'Monitor INR closely, consider reducing warfarin dose',
            },
            {
                drugName: 'Warfarin',
                interactingDrugName: 'Atorvastatin',
                severity: 'MODERATE',
                description: 'Increased warfarin effect',
                clinicalEffect: 'Enhanced anticoagulation',
                management: 'Monitor INR, may need warfarin dose reduction',
            },
            {
                drugName: 'Metformin',
                interactingDrugName: 'Lisinopril',
                severity: 'MINOR',
                description: 'Increased risk of hyperkalemia',
                clinicalEffect: 'Elevated potassium levels',
                management: 'Monitor potassium levels',
            },
        ];
        for (const interactionData of commonInteractions) {
            try {
                await this.addDrugInteraction(interactionData);
            }
            catch (error) {
            }
        }
        return {
            success: true,
            message: 'Drug database seeded successfully',
        };
    }
    async findDrugInteraction(medication1, medication2) {
        const interaction = await this.db.drugInteraction.findFirst({
            where: {
                OR: [
                    {
                        drug: { name: { contains: medication1, mode: 'insensitive' } },
                        interactingDrug: { name: { contains: medication2, mode: 'insensitive' } },
                    },
                    {
                        drug: { name: { contains: medication2, mode: 'insensitive' } },
                        interactingDrug: { name: { contains: medication1, mode: 'insensitive' } },
                    },
                ],
            },
            include: {
                drug: true,
                interactingDrug: true,
            },
        });
        return interaction;
    }
    async findOrCreateDrug(drugName) {
        let drug = await this.db.drug.findFirst({
            where: {
                OR: [
                    { name: { contains: drugName, mode: 'insensitive' } },
                    { genericName: { contains: drugName, mode: 'insensitive' } },
                ],
            },
        });
        if (!drug) {
            drug = await this.db.drug.create({
                data: {
                    name: drugName,
                    genericName: drugName,
                    brandNames: [],
                    contraindications: [],
                },
            });
        }
        return drug;
    }
    getSeverityLevel(severity) {
        const levels = {
            'MINOR': 1,
            'MODERATE': 2,
            'MAJOR': 3,
            'CONTRAINDICATED': 4,
        };
        return levels[severity] || 0;
    }
    generateInteractionSummary(interactions, maxSeverity) {
        if (interactions.length === 0) {
            return 'No drug interactions detected';
        }
        const severityCounts = interactions.reduce((acc, interaction) => {
            acc[interaction.severity] = (acc[interaction.severity] || 0) + 1;
            return acc;
        }, {});
        const summary = Object.entries(severityCounts)
            .map(([severity, count]) => `${count} ${severity.toLowerCase()} interaction${count > 1 ? 's' : ''}`)
            .join(', ');
        return `${interactions.length} drug interaction${interactions.length > 1 ? 's' : ''} detected: ${summary}`;
    }
    generateRecommendations(interactions) {
        const recommendations = [];
        if (interactions.some(i => i.severity === 'CONTRAINDICATED')) {
            recommendations.push('Consider alternative medications - contraindicated interactions detected');
        }
        if (interactions.some(i => i.severity === 'MAJOR')) {
            recommendations.push('Monitor patient closely - major interactions detected');
        }
        if (interactions.some(i => i.severity === 'MODERATE')) {
            recommendations.push('Consider dose adjustments - moderate interactions detected');
        }
        if (interactions.some(i => i.severity === 'MINOR')) {
            recommendations.push('Monitor for side effects - minor interactions detected');
        }
        return recommendations;
    }
};
exports.DrugInteractionService = DrugInteractionService;
exports.DrugInteractionService = DrugInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], DrugInteractionService);


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const notification_controller_1 = __webpack_require__(42);
const notification_service_1 = __webpack_require__(45);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [notification_controller_1.NotificationController],
        providers: [notification_service_1.NotificationService, database_service_1.DatabaseService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationsModule);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationController = void 0;
const common_1 = __webpack_require__(1);
const jwt_auth_guard_1 = __webpack_require__(12);
const notification_dto_1 = __webpack_require__(43);
const notification_service_1 = __webpack_require__(45);
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(req, query) {
        const userId = req.user.id;
        const filters = {
            type: query.type,
            unreadOnly: query.unreadOnly || false,
            includeArchived: query.includeArchived || false,
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 20,
        };
        return this.notificationService.getUserNotifications(userId, filters);
    }
    async getUnreadCount(req) {
        const userId = req.user.id;
        const count = await this.notificationService.getUnreadCount(userId);
        return { success: true, count };
    }
    async markAsRead(req, notificationId) {
        const userId = req.user.id;
        await this.notificationService.markAsRead(notificationId, userId);
        return { success: true, message: 'Notification marked as read' };
    }
    async markAllAsRead(req) {
        const userId = req.user.id;
        await this.notificationService.markAllAsRead(userId);
        return { success: true, message: 'All notifications marked as read' };
    }
    async archiveNotification(req, notificationId) {
        const userId = req.user.id;
        await this.notificationService.archiveNotification(notificationId, userId);
        return { success: true, message: 'Notification archived' };
    }
    async deleteNotification(req, notificationId) {
        const userId = req.user.id;
        await this.notificationService.deleteNotification(notificationId, userId);
        return { success: true, message: 'Notification deleted' };
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof notification_dto_1.QueryNotificationsDto !== "undefined" && notification_dto_1.QueryNotificationsDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('unread/count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('read-all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)(':id/archive'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "archiveNotification", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotification", null);
exports.NotificationController = NotificationController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _a : Object])
], NotificationController);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryNotificationsDto = exports.UpdateNotificationDto = exports.CreateNotificationDto = exports.NotificationChannel = exports.NotificationPriority = exports.NotificationType = void 0;
const class_transformer_1 = __webpack_require__(44);
const class_validator_1 = __webpack_require__(14);
var NotificationType;
(function (NotificationType) {
    NotificationType["APPOINTMENT_REQUESTED"] = "APPOINTMENT_REQUESTED";
    NotificationType["APPOINTMENT_SCHEDULED"] = "APPOINTMENT_SCHEDULED";
    NotificationType["APPOINTMENT_CONFIRMED"] = "APPOINTMENT_CONFIRMED";
    NotificationType["APPOINTMENT_CANCELLED"] = "APPOINTMENT_CANCELLED";
    NotificationType["APPOINTMENT_REMINDER"] = "APPOINTMENT_REMINDER";
    NotificationType["APPOINTMENT_RESCHEDULED"] = "APPOINTMENT_RESCHEDULED";
    NotificationType["SYSTEM_ALERT"] = "SYSTEM_ALERT";
    NotificationType["SYSTEM_MAINTENANCE"] = "SYSTEM_MAINTENANCE";
    NotificationType["WELCOME"] = "WELCOME";
    NotificationType["PROFILE_UPDATE"] = "PROFILE_UPDATE";
    NotificationType["PRESCRIPTION_READY"] = "PRESCRIPTION_READY";
    NotificationType["LAB_RESULT_AVAILABLE"] = "LAB_RESULT_AVAILABLE";
    NotificationType["IMAGING_RESULT_AVAILABLE"] = "IMAGING_RESULT_AVAILABLE";
    NotificationType["MESSAGE_RECEIVED"] = "MESSAGE_RECEIVED";
    NotificationType["FILE_SHARED"] = "FILE_SHARED";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["PUSH"] = "PUSH";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NotificationType),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(NotificationPriority),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "actionUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "actionLabel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object)
], CreateNotificationDto.prototype, "metadata", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(NotificationChannel, { each: true }),
    __metadata("design:type", Array)
], CreateNotificationDto.prototype, "channels", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "relatedEntityType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "relatedEntityId", void 0);
class UpdateNotificationDto {
}
exports.UpdateNotificationDto = UpdateNotificationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "isRead", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateNotificationDto.prototype, "isArchived", void 0);
class QueryNotificationsDto {
}
exports.QueryNotificationsDto = QueryNotificationsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryNotificationsDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true' || value === true)
            return true;
        if (value === 'false' || value === false)
            return false;
        return undefined;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryNotificationsDto.prototype, "unreadOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true' || value === true)
            return true;
        if (value === 'false' || value === false)
            return false;
        return undefined;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryNotificationsDto.prototype, "includeArchived", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryNotificationsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryNotificationsDto.prototype, "limit", void 0);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const notification_dto_1 = __webpack_require__(43);
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(db) {
        this.db = db;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async createAndDispatch(dto) {
        try {
            const channels = dto.channels || [notification_dto_1.NotificationChannel.IN_APP];
            const notification = await this.db.notification.create({
                data: {
                    userId: dto.userId,
                    type: dto.type,
                    title: dto.title,
                    message: dto.message,
                    body: dto.body,
                    priority: dto.priority || notification_dto_1.NotificationPriority.NORMAL,
                    actionUrl: dto.actionUrl,
                    actionLabel: dto.actionLabel,
                    metadata: dto.metadata || {},
                    channels: channels,
                    relatedEntityType: dto.relatedEntityType,
                    relatedEntityId: dto.relatedEntityId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            this.logger.log(`Notification created: ${notification.id} for user ${dto.userId}`);
            return notification;
        }
        catch (error) {
            this.logger.error(`Error creating notification: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUserNotifications(userId, filters) {
        const where = { userId };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.unreadOnly) {
            where.isRead = false;
        }
        if (!filters?.includeArchived) {
            where.isArchived = false;
        }
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.db.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit,
            }),
            this.db.notification.count({ where }),
        ]);
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUnreadCount(userId) {
        return this.db.notification.count({
            where: {
                userId,
                isRead: false,
                isArchived: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        return this.db.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async markAllAsRead(userId) {
        return this.db.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });
    }
    async archiveNotification(notificationId, userId) {
        return this.db.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                isArchived: true,
                archivedAt: new Date(),
            },
        });
    }
    async deleteNotification(notificationId, userId) {
        return this.db.notification.deleteMany({
            where: {
                id: notificationId,
                userId,
            },
        });
    }
    async notifyAppointmentRequested(appointment) {
        const doctor = await this.db.user.findUnique({
            where: { id: appointment.doctorId },
            select: { firstName: true, lastName: true },
        });
        const patient = await this.db.user.findUnique({
            where: { id: appointment.patientId },
            select: { firstName: true, lastName: true },
        });
        const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Patient';
        const dateStr = new Date(appointment.appointmentDate).toLocaleDateString();
        const timeStr = appointment.startTime || '';
        return this.createAndDispatch({
            userId: appointment.doctorId,
            type: notification_dto_1.NotificationType.APPOINTMENT_REQUESTED,
            title: 'New Appointment Request',
            message: `${patientName} requested an appointment on ${dateStr} at ${timeStr}`,
            body: appointment.reasonForVisit || 'No reason provided',
            priority: notification_dto_1.NotificationPriority.NORMAL,
            actionUrl: `/appointments/${appointment.id}`,
            actionLabel: 'View Request',
            metadata: {
                appointmentId: appointment.id,
                patientId: appointment.patientId,
                patientName,
                date: appointment.appointmentDate,
                time: appointment.startTime,
                reasonForVisit: appointment.reasonForVisit,
            },
            relatedEntityType: 'APPOINTMENT',
            relatedEntityId: appointment.id,
            channels: [notification_dto_1.NotificationChannel.IN_APP, notification_dto_1.NotificationChannel.PUSH],
        });
    }
    async notifyAppointmentScheduled(appointment) {
        const doctor = await this.db.user.findUnique({
            where: { id: appointment.doctorId },
            select: { firstName: true, lastName: true },
        });
        const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Doctor';
        const dateStr = new Date(appointment.appointmentDate).toLocaleDateString();
        const timeStr = appointment.startTime || '';
        return this.createAndDispatch({
            userId: appointment.patientId,
            type: notification_dto_1.NotificationType.APPOINTMENT_SCHEDULED,
            title: 'Appointment Scheduled',
            message: `Your appointment with ${doctorName} is scheduled for ${dateStr} at ${timeStr}`,
            body: `Appointment confirmed. Please arrive 10 minutes early.`,
            priority: notification_dto_1.NotificationPriority.NORMAL,
            actionUrl: `/appointments/${appointment.id}`,
            actionLabel: 'View Appointment',
            metadata: {
                appointmentId: appointment.id,
                doctorId: appointment.doctorId,
                doctorName,
                date: appointment.appointmentDate,
                time: appointment.startTime,
            },
            relatedEntityType: 'APPOINTMENT',
            relatedEntityId: appointment.id,
            channels: [notification_dto_1.NotificationChannel.IN_APP, notification_dto_1.NotificationChannel.PUSH, notification_dto_1.NotificationChannel.EMAIL],
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], NotificationService);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatientBookingModule = void 0;
const common_1 = __webpack_require__(1);
const auth_module_1 = __webpack_require__(8);
const notifications_module_1 = __webpack_require__(41);
const patient_booking_controller_1 = __webpack_require__(47);
const patient_booking_service_1 = __webpack_require__(48);
let PatientBookingModule = class PatientBookingModule {
};
exports.PatientBookingModule = PatientBookingModule;
exports.PatientBookingModule = PatientBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, notifications_module_1.NotificationsModule],
        controllers: [patient_booking_controller_1.PatientBookingController],
        providers: [patient_booking_service_1.PatientBookingService],
        exports: [patient_booking_service_1.PatientBookingService],
    })
], PatientBookingModule);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatientBookingController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const patient_booking_service_1 = __webpack_require__(48);
let PatientBookingController = class PatientBookingController {
    constructor(patientBookingService) {
        this.patientBookingService = patientBookingService;
    }
    async findDoctors(specialty, location, city, acceptingNewPatients) {
        return this.patientBookingService.findDoctors({
            specialty,
            location,
            city,
            isAcceptingNewPatients: acceptingNewPatients,
        });
    }
    async getDoctorDetails(doctorId) {
        return this.patientBookingService.getDoctorDetails(doctorId);
    }
    async getDoctorAvailability(doctorId, date) {
        return this.patientBookingService.getDoctorAvailability(doctorId, date);
    }
    async bookAppointment(req, bookingData) {
        return this.patientBookingService.bookAppointment(req.user.userId, bookingData);
    }
    async getPatientAppointments(req, status, startDate, endDate) {
        return this.patientBookingService.getPatientAppointments(req.user.userId, {
            status,
            startDate,
            endDate,
        });
    }
    async cancelAppointment(req, appointmentId, body) {
        return this.patientBookingService.cancelAppointment(req.user.userId, appointmentId, body?.reason);
    }
};
exports.PatientBookingController = PatientBookingController;
__decorate([
    (0, common_1.Get)('doctors'),
    (0, swagger_1.ApiOperation)({ summary: 'Find available doctors' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctors retrieved successfully' }),
    __param(0, (0, common_1.Query)('specialty')),
    __param(1, (0, common_1.Query)('location')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('acceptingNewPatients')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "findDoctors", null);
__decorate([
    (0, common_1.Get)('doctors/:doctorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor details for booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Doctor details retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getDoctorDetails", null);
__decorate([
    (0, common_1.Get)('doctors/:doctorId/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a specific date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability retrieved successfully' }),
    __param(0, (0, common_1.Param)('doctorId')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getDoctorAvailability", null);
__decorate([
    (0, common_1.Post)('book'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Book an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment booking requested successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get patient appointments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "getPatientAppointments", null);
__decorate([
    (0, common_1.Post)('appointments/:appointmentId/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PatientBookingController.prototype, "cancelAppointment", null);
exports.PatientBookingController = PatientBookingController = __decorate([
    (0, swagger_1.ApiTags)('Patient Booking'),
    (0, common_1.Controller)('patient'),
    __metadata("design:paramtypes", [typeof (_a = typeof patient_booking_service_1.PatientBookingService !== "undefined" && patient_booking_service_1.PatientBookingService) === "function" ? _a : Object])
], PatientBookingController);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PatientBookingService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PatientBookingService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const notification_service_1 = __webpack_require__(45);
let PatientBookingService = PatientBookingService_1 = class PatientBookingService {
    constructor(db, notificationService) {
        this.db = db;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(PatientBookingService_1.name);
    }
    async findDoctors(filters) {
        const where = {
            role: 'DOCTOR',
            isActive: true,
            doctorProfile: filters?.isAcceptingNewPatients
                ? { isAcceptingNewPatients: filters.isAcceptingNewPatients }
                : undefined,
        };
        if (filters?.specialty) {
            where.department = filters.specialty;
        }
        if (filters?.location) {
            where.city = filters.location;
        }
        const doctors = await this.db.user.findMany({
            where,
            include: {
                doctorProfile: {
                    include: {
                        services: true,
                        insurances: true,
                        consultationFees: true,
                    },
                },
            },
            take: 50,
        });
        return {
            success: true,
            data: doctors.map(doc => this.mapDoctorForBooking(doc)),
            message: 'Doctors retrieved successfully',
        };
    }
    async getDoctorDetails(doctorId) {
        const doctor = await this.db.user.findUnique({
            where: { id: doctorId, role: 'DOCTOR' },
            include: {
                doctorProfile: {
                    include: {
                        services: true,
                        insurances: true,
                        consultationFees: true,
                        schedules: {
                            where: {
                                isAvailable: true,
                                date: {
                                    gte: new Date(),
                                },
                            },
                            take: 30,
                        },
                    },
                },
            },
        });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        return {
            success: true,
            data: this.mapDoctorForBooking(doctor),
            message: 'Doctor details retrieved successfully',
        };
    }
    async getDoctorAvailability(doctorId, date) {
        const targetDate = new Date(date);
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
                isAvailable: true,
            },
        });
        if (!schedule) {
            return {
                success: true,
                data: {
                    isAvailable: false,
                    date,
                    slots: [],
                    message: 'No availability for this date',
                },
                message: 'No schedule found for this date',
            };
        }
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    notIn: ['CANCELLED', 'NO_SHOW'],
                },
            },
        });
        const slots = this.generateAvailableSlots(schedule, appointments);
        return {
            success: true,
            data: {
                isAvailable: true,
                date,
                schedule,
                slots,
            },
            message: 'Availability retrieved successfully',
        };
    }
    async bookAppointment(patientId, bookingData) {
        const doctor = await this.db.user.findUnique({
            where: { id: bookingData.doctorId, role: 'DOCTOR' },
        });
        if (!doctor || !doctor.isActive) {
            throw new common_1.NotFoundException('Doctor not found or inactive');
        }
        const appointmentDate = new Date(bookingData.date);
        const availability = await this.getDoctorAvailability(bookingData.doctorId, bookingData.date);
        if (!availability.data.isAvailable) {
            throw new common_1.BadRequestException('No availability for this date');
        }
        const slotAvailable = availability.data.slots.find(slot => slot.time === bookingData.startTime && slot.isAvailable);
        if (!slotAvailable) {
            throw new common_1.BadRequestException('Time slot is no longer available');
        }
        const slotStart = new Date(`${bookingData.date}T${bookingData.startTime}:00`);
        if (slotStart.getTime() < Date.now()) {
            throw new common_1.BadRequestException('Cannot book a past time slot');
        }
        const existingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId: bookingData.doctorId,
                appointmentDate,
                startTime: bookingData.startTime,
                status: {
                    notIn: ['CANCELLED', 'NO_SHOW'],
                },
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId: bookingData.doctorId,
                date: appointmentDate,
            },
        });
        const appointment = await this.db.appointment.create({
            data: {
                doctorId: bookingData.doctorId,
                patientId,
                scheduleId: schedule?.id,
                appointmentDate,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                duration: this.calculateDuration(bookingData.startTime, bookingData.endTime),
                type: bookingData.type || 'CONSULTATION',
                status: 'PENDING',
                reasonForVisit: bookingData.reasonForVisit,
                symptoms: bookingData.symptoms,
                requiresConfirmation: true,
                bookingRequestedAt: new Date(),
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        doctorProfile: true,
                    },
                },
            },
        });
        try {
            await this.notificationService.notifyAppointmentRequested(appointment);
            this.logger.log(`Notification sent to doctor ${bookingData.doctorId} for appointment ${appointment.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
        }
        return {
            success: true,
            data: appointment,
            message: 'Appointment booking requested successfully. Awaiting doctor confirmation.',
        };
    }
    async getPatientAppointments(patientId, filters) {
        const where = { patientId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.startDate || filters?.endDate) {
            where.appointmentDate = {};
            if (filters?.startDate) {
                where.appointmentDate.gte = new Date(filters.startDate);
            }
            if (filters?.endDate) {
                where.appointmentDate.lte = new Date(filters.endDate);
            }
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        specialization: true,
                        doctorProfile: {
                            select: {
                                specialties: true,
                                practiceName: true,
                                practiceAddress: true,
                                practiceCity: true,
                                practicePhone: true,
                            },
                        },
                    },
                },
            },
            orderBy: { appointmentDate: 'desc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Appointments retrieved successfully',
        };
    }
    async cancelAppointment(patientId, appointmentId, reason) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.patientId !== patientId) {
            throw new common_1.BadRequestException('Unauthorized to cancel this appointment');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Appointment is already cancelled');
        }
        if (appointment.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed appointment');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date(),
                cancelledBy: 'PATIENT',
                cancellationReason: reason,
            },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
    mapDoctorForBooking(doctor) {
        const fees = Array.isArray(doctor?.doctorProfile?.consultationFees)
            ? doctor.doctorProfile.consultationFees
            : [];
        const activeFees = fees.filter((f) => f?.isActive !== false);
        const mostRecent = activeFees.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime())[0];
        const normalizedAmount = mostRecent?.amount ?? mostRecent?.fee ?? mostRecent?.baseFee ?? null;
        return {
            id: doctor.id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            avatar: doctor.avatar,
            department: doctor.department,
            specialization: doctor.specialization,
            profile: doctor.doctorProfile ? {
                specialties: doctor.doctorProfile.specialties,
                practiceName: doctor.doctorProfile.practiceName,
                practiceAddress: doctor.doctorProfile.practiceAddress,
                practiceCity: doctor.doctorProfile.practiceCity,
                practiceState: doctor.doctorProfile.practiceState,
                practicePhone: doctor.doctorProfile.practicePhone,
                isAcceptingNewPatients: doctor.doctorProfile.isAcceptingNewPatients,
                services: doctor.doctorProfile.services || [],
                insurances: doctor.doctorProfile.insurances || [],
                consultationFees: doctor.doctorProfile.consultationFees || [],
            } : null,
            doctorProfile: doctor.doctorProfile ? {
                specialization: doctor.specialization,
                bio: doctor.doctorProfile.professionalBio,
                experience: doctor.doctorProfile.yearsExperience,
                education: doctor.doctorProfile.education,
                services: doctor.doctorProfile.services || [],
                insurances: doctor.doctorProfile.insurances || [],
                consultationFee: normalizedAmount,
                currency: mostRecent?.currency ?? 'KES',
                location: doctor.doctorProfile.practiceAddress,
                city: doctor.doctorProfile.practiceCity,
            } : null,
        };
    }
    generateAvailableSlots(schedule, existingAppointments) {
        const slots = [];
        const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
        const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            const timeStr = currentTime.toTimeString().split(' ')[0].substring(0, 5);
            const isBooked = existingAppointments.some(apt => apt.startTime === timeStr);
            slots.push({
                time: timeStr,
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                duration: schedule.slotDuration,
                isAvailable: !isBooked,
                isBooked,
            });
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    calculateDuration(startTime, endTime) {
        const start = this.parseTime(startTime);
        const end = this.parseTime(endTime);
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    parseTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
};
exports.PatientBookingService = PatientBookingService;
exports.PatientBookingService = PatientBookingService = PatientBookingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], PatientBookingService);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulingModule = void 0;
const common_1 = __webpack_require__(1);
const schedule_1 = __webpack_require__(50);
const database_service_1 = __webpack_require__(19);
const notifications_module_1 = __webpack_require__(41);
const scheduling_controller_1 = __webpack_require__(51);
const appointment_management_service_1 = __webpack_require__(54);
const doctor_availability_service_1 = __webpack_require__(56);
const scheduling_service_1 = __webpack_require__(53);
const slot_engine_service_1 = __webpack_require__(55);
let SchedulingModule = class SchedulingModule {
};
exports.SchedulingModule = SchedulingModule;
exports.SchedulingModule = SchedulingModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), notifications_module_1.NotificationsModule],
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


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulingController = void 0;
const common_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(4);
const jwt_auth_guard_1 = __webpack_require__(12);
const scheduling_dto_1 = __webpack_require__(52);
const scheduling_service_1 = __webpack_require__(53);
let SchedulingController = class SchedulingController {
    constructor(schedulingService) {
        this.schedulingService = schedulingService;
    }
    async createScheduleTemplate(req, createTemplateDto) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.createScheduleTemplate(doctorId, createTemplateDto);
    }
    async getScheduleTemplates(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.getScheduleTemplates(doctorId);
    }
    async updateScheduleTemplate(templateId, updateTemplateDto) {
        return this.schedulingService.updateScheduleTemplate(templateId, updateTemplateDto);
    }
    async deleteScheduleTemplate(templateId) {
        return this.schedulingService.deleteScheduleTemplate(templateId);
    }
    async createTimeSlot(templateId, createSlotDto) {
        return this.schedulingService.createTimeSlot(templateId, createSlotDto);
    }
    async updateTimeSlot(slotId, updateSlotDto) {
        return this.schedulingService.updateTimeSlot(slotId, updateSlotDto);
    }
    async deleteTimeSlot(slotId) {
        return this.schedulingService.deleteTimeSlot(slotId);
    }
    async generateSchedule(req, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.generateSchedule(doctorId, body.templateId, body.date);
    }
    async getAvailability(req, query) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.getAvailability(doctorId, query.date);
    }
    async getAvailabilityRange(req, startDate, endDate) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.doctorAvailability.getAvailability(doctorId, startDate, endDate);
    }
    async getAvailableSlots(req, date, startTime, endTime) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.doctorAvailability.getAvailableSlots(doctorId, date);
    }
    async updateAvailability(req, updateAvailabilityDto) {
        console.log('🔍 DEBUG: req.user =', JSON.stringify(req.user));
        const doctorId = req.user?.userId || req.user?.id;
        console.log('🔍 DEBUG: doctorId =', doctorId);
        if (!doctorId) {
            throw new Error('Doctor ID is missing from authentication');
        }
        return this.schedulingService.updateAvailability(doctorId, updateAvailabilityDto.date, updateAvailabilityDto.timeSlots);
    }
    async setupRecurringAvailability(req, availabilityData) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.doctorAvailability.setRecurringAvailability(doctorId, availabilityData);
    }
    async createException(req, createExceptionDto) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.createException(doctorId, createExceptionDto);
    }
    async getExceptions(req, startDate, endDate) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.getExceptions(doctorId, startDate, endDate);
    }
    async deleteException(exceptionId) {
        return this.schedulingService.deleteException(exceptionId);
    }
    async bookAppointment(bookAppointmentDto) {
        return this.schedulingService.bookAppointment(bookAppointmentDto);
    }
    async getAppointments(req, startDate, endDate, status, limit) {
        const mockAppointments = [
            {
                id: '1',
                patientName: 'John Doe',
                patientEmail: 'john@example.com',
                appointmentDate: new Date().toISOString(),
                startTime: '09:00',
                endTime: '09:30',
                status: 'SCHEDULED',
                type: 'CONSULTATION',
                notes: 'Regular checkup'
            },
            {
                id: '2',
                patientName: 'Jane Smith',
                patientEmail: 'jane@example.com',
                appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                startTime: '10:00',
                endTime: '10:30',
                status: 'PENDING',
                type: 'FOLLOW_UP',
                notes: 'Follow-up appointment'
            }
        ];
        return {
            success: true,
            data: mockAppointments,
            message: 'Mock appointments data'
        };
    }
    async getUpcomingAppointments(req, limit) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.appointmentManagement.getUpcomingAppointments(doctorId, limit || 10);
    }
    async getTodaysAppointments(req) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.appointmentManagement.getTodaysAppointments(doctorId);
    }
    async getAppointmentStats(req, startDate, endDate) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.appointmentManagement.getAppointmentStats(doctorId, startDate, endDate);
    }
    async updateAppointment(appointmentId, updateAppointmentDto) {
        return this.schedulingService.updateAppointment(appointmentId, updateAppointmentDto);
    }
    async confirmAppointment(req, appointmentId) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.appointmentManagement.confirmAppointment(appointmentId, doctorId);
    }
    async rescheduleAppointment(appointmentId, body) {
        return this.schedulingService.appointmentManagement.rescheduleAppointment(appointmentId, body.newDate, body.newStartTime, body.newEndTime, body.reason);
    }
    async cancelAppointment(appointmentId, body) {
        return this.schedulingService.appointmentManagement.cancelAppointment(appointmentId, body.reason, body.cancelledBy);
    }
    async completeAppointment(req, appointmentId, body) {
        const doctorId = req.user.userId || req.user.id;
        return this.schedulingService.appointmentManagement.completeAppointment(appointmentId, doctorId, body.notes);
    }
    async getAnalytics(req, query) {
        const doctorId = req.user.userId || req.user.id;
        return {
            success: true,
            data: {
                totalAppointments: 0,
                completedAppointments: 0,
                cancelledAppointments: 0,
                noShowAppointments: 0,
                averageAppointmentDuration: 0,
                mostPopularTimeSlots: [],
                revenue: 0,
            },
            message: 'Analytics retrieved successfully',
        };
    }
};
exports.SchedulingController = SchedulingController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule template created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof scheduling_dto_1.CreateScheduleTemplateDto !== "undefined" && scheduling_dto_1.CreateScheduleTemplateDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createScheduleTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all schedule templates for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule templates retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getScheduleTemplates", null);
__decorate([
    (0, common_1.Put)('templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule template updated successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof scheduling_dto_1.UpdateScheduleTemplateDto !== "undefined" && scheduling_dto_1.UpdateScheduleTemplateDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateScheduleTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a schedule template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule template deleted successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteScheduleTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:templateId/time-slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a time slot for a template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Time slot created successfully' }),
    __param(0, (0, common_1.Param)('templateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof scheduling_dto_1.CreateTimeSlotDto !== "undefined" && scheduling_dto_1.CreateTimeSlotDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createTimeSlot", null);
__decorate([
    (0, common_1.Put)('time-slots/:slotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a time slot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time slot updated successfully' }),
    __param(0, (0, common_1.Param)('slotId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof scheduling_dto_1.UpdateTimeSlotDto !== "undefined" && scheduling_dto_1.UpdateTimeSlotDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateTimeSlot", null);
__decorate([
    (0, common_1.Delete)('time-slots/:slotId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a time slot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time slot deleted successfully' }),
    __param(0, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteTimeSlot", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate schedule from template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule generated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "generateSchedule", null);
__decorate([
    (0, common_1.Get)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof scheduling_dto_1.GetAvailabilityDto !== "undefined" && scheduling_dto_1.GetAvailabilityDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailability", null);
__decorate([
    (0, common_1.Get)('availability/range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get doctor availability for a date range' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability range retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailabilityRange", null);
__decorate([
    (0, common_1.Get)('availability/slots'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available time slots for a specific date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available slots retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('startTime')),
    __param(3, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAvailableSlots", null);
__decorate([
    (0, common_1.Put)('availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Update doctor availability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Availability updated successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof scheduling_dto_1.UpdateAvailabilityDto !== "undefined" && scheduling_dto_1.UpdateAvailabilityDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateAvailability", null);
__decorate([
    (0, common_1.Post)('availability/setup'),
    (0, swagger_1.ApiOperation)({ summary: 'Set up recurring availability for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Recurring availability set up successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "setupRecurringAvailability", null);
__decorate([
    (0, common_1.Post)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a schedule exception' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule exception created successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof scheduling_dto_1.CreateExceptionDto !== "undefined" && scheduling_dto_1.CreateExceptionDto) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "createException", null);
__decorate([
    (0, common_1.Get)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get schedule exceptions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule exceptions retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getExceptions", null);
__decorate([
    (0, common_1.Delete)('exceptions/:exceptionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a schedule exception' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule exception deleted successfully' }),
    __param(0, (0, common_1.Param)('exceptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "deleteException", null);
__decorate([
    (0, common_1.Post)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Book a new appointment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Appointment booked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof scheduling_dto_1.BookAppointmentDto !== "undefined" && scheduling_dto_1.BookAppointmentDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "bookAppointment", null);
__decorate([
    (0, common_1.Get)('appointments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Get upcoming appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Upcoming appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/today'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s appointments for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Today\'s appointments retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getTodaysAppointments", null);
__decorate([
    (0, common_1.Get)('appointments/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get appointment statistics for a doctor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAppointmentStats", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment updated successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof scheduling_dto_1.UpdateAppointmentDto !== "undefined" && scheduling_dto_1.UpdateAppointmentDto) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "updateAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment confirmed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "confirmAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/reschedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Reschedule an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment rescheduled successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel an appointment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment cancelled successfully' }),
    __param(0, (0, common_1.Param)('appointmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Put)('appointments/:appointmentId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark appointment as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Appointment marked as completed' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appointmentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "completeAppointment", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduling analytics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_l = typeof scheduling_dto_1.ScheduleAnalyticsDto !== "undefined" && scheduling_dto_1.ScheduleAnalyticsDto) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], SchedulingController.prototype, "getAnalytics", null);
exports.SchedulingController = SchedulingController = __decorate([
    (0, swagger_1.ApiTags)('Scheduling'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('scheduling'),
    __metadata("design:paramtypes", [typeof (_a = typeof scheduling_service_1.SchedulingService !== "undefined" && scheduling_service_1.SchedulingService) === "function" ? _a : Object])
], SchedulingController);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScheduleAnalyticsDto = exports.TimeSlotAvailabilityDto = exports.UpdateAvailabilityDto = exports.GetAvailabilityDto = exports.UpdateAppointmentDto = exports.BookAppointmentDto = exports.AppointmentStatus = exports.AppointmentType = exports.CreateExceptionDto = exports.ExceptionType = exports.UpdateTimeSlotDto = exports.CreateTimeSlotDto = exports.UpdateScheduleTemplateDto = exports.CreateScheduleTemplateDto = void 0;
const class_validator_1 = __webpack_require__(14);
const class_transformer_1 = __webpack_require__(44);
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


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulingService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const appointment_management_service_1 = __webpack_require__(54);
const doctor_availability_service_1 = __webpack_require__(56);
const slot_engine_service_1 = __webpack_require__(55);
let SchedulingService = class SchedulingService {
    constructor(db, doctorAvailability, slotEngine, appointmentManagement) {
        this.db = db;
        this.doctorAvailability = doctorAvailability;
        this.slotEngine = slotEngine;
        this.appointmentManagement = appointmentManagement;
    }
    async createScheduleTemplate(doctorId, templateData) {
        const doctor = await this.db.user.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        const template = await this.db.doctorScheduleTemplate.create({
            data: {
                doctorId,
                ...templateData,
            },
            include: {
                timeSlots: true,
            },
        });
        return {
            success: true,
            data: template,
            message: 'Schedule template created successfully',
        };
    }
    async getScheduleTemplates(doctorId) {
        const templates = await this.db.doctorScheduleTemplate.findMany({
            where: { doctorId },
            include: {
                timeSlots: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: templates,
            message: 'Schedule templates retrieved successfully',
        };
    }
    async updateScheduleTemplate(templateId, updateData) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const updatedTemplate = await this.db.doctorScheduleTemplate.update({
            where: { id: templateId },
            data: updateData,
            include: {
                timeSlots: true,
            },
        });
        return {
            success: true,
            data: updatedTemplate,
            message: 'Schedule template updated successfully',
        };
    }
    async deleteScheduleTemplate(templateId) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        await this.db.doctorScheduleTemplate.delete({ where: { id: templateId } });
        return {
            success: true,
            message: 'Schedule template deleted successfully',
        };
    }
    async createTimeSlot(templateId, slotData) {
        const template = await this.db.doctorScheduleTemplate.findUnique({ where: { id: templateId } });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const timeSlot = await this.db.doctorTimeSlot.create({
            data: {
                templateId,
                ...slotData,
            },
        });
        return {
            success: true,
            data: timeSlot,
            message: 'Time slot created successfully',
        };
    }
    async updateTimeSlot(slotId, updateData) {
        const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });
        if (!timeSlot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        const updatedSlot = await this.db.doctorTimeSlot.update({
            where: { id: slotId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedSlot,
            message: 'Time slot updated successfully',
        };
    }
    async deleteTimeSlot(slotId) {
        const timeSlot = await this.db.doctorTimeSlot.findUnique({ where: { id: slotId } });
        if (!timeSlot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        await this.db.doctorTimeSlot.delete({ where: { id: slotId } });
        return {
            success: true,
            message: 'Time slot deleted successfully',
        };
    }
    async generateSchedule(doctorId, templateId, date) {
        const template = await this.db.doctorScheduleTemplate.findUnique({
            where: { id: templateId },
        });
        if (!template) {
            throw new common_1.NotFoundException('Schedule template not found');
        }
        const existingSchedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: new Date(date),
            },
        });
        if (existingSchedule) {
            throw new common_1.BadRequestException('Schedule already exists for this date');
        }
        const profile = await this.db.doctorProfile.findFirst({
            where: { doctorId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Doctor profile not found');
        }
        const schedule = await this.db.doctorSchedule.create({
            data: {
                doctorId,
                profileId: profile.id,
                templateId,
                dayOfWeek: this.getDayOfWeek(new Date(date)),
                startTime: '09:00',
                endTime: '17:00',
                date: new Date(date),
                slotDuration: 30,
                bufferTime: 10,
                maxBookings: 1,
                location: 'Main Clinic',
                serviceType: 'CONSULTATION',
                isAvailable: true,
            },
        });
        return {
            success: true,
            data: schedule,
            message: 'Schedule generated successfully',
        };
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    generateTimeSlotsFromTemplate(template, date) {
        const slots = [];
        const startTime = new Date(`${date}T${template.startTime}`);
        const endTime = new Date(`${date}T${template.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + template.slotDuration * 60000);
            slots.push({
                startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                isAvailable: true,
            });
            currentTime = new Date(currentTime.getTime() + (template.slotDuration + template.bufferTime) * 60000);
        }
        return slots;
    }
    async getAvailability(doctorId, date) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: new Date(date),
                isAvailable: true,
            },
            include: {
                template: true,
            },
        });
        if (!schedule) {
            return {
                success: true,
                data: {
                    isAvailable: false,
                    date,
                },
                message: 'No schedule found for this date',
            };
        }
        const timeSlots = this.generateTimeSlotsForSchedule(schedule);
        return {
            success: true,
            data: {
                isAvailable: true,
                template: schedule.template,
                timeSlots,
                schedule,
            },
            message: 'Availability retrieved successfully',
        };
    }
    generateTimeSlotsForSchedule(schedule) {
        const slots = [];
        const startTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.startTime}`);
        const endTime = new Date(`${schedule.date.toISOString().split('T')[0]}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            slots.push({
                id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
                startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                isAvailable: true,
                isBooked: false,
            });
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    async updateAvailability(doctorId, date, timeSlots) {
        const scheduleDate = new Date(date);
        let schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: scheduleDate,
            },
        });
        if (!schedule) {
            let profile = await this.db.doctorProfile.findUnique({
                where: { doctorId },
            });
            if (!profile) {
                profile = await this.db.doctorProfile.create({
                    data: {
                        doctorId,
                        specialties: ['General Practice'],
                        isAcceptingNewPatients: true,
                    },
                });
            }
            let template = await this.db.doctorScheduleTemplate.findFirst({
                where: { doctorId, isDefault: true },
            });
            if (!template) {
                template = await this.db.doctorScheduleTemplate.create({
                    data: {
                        doctorId,
                        name: 'Default Availability',
                        isDefault: true,
                        isActive: true,
                    },
                });
            }
            const dayOfWeekMap = {
                0: 'SUNDAY',
                1: 'MONDAY',
                2: 'TUESDAY',
                3: 'WEDNESDAY',
                4: 'THURSDAY',
                5: 'FRIDAY',
                6: 'SATURDAY',
            };
            const dayOfWeek = dayOfWeekMap[scheduleDate.getDay()];
            const sortedSlots = timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
            const startTime = sortedSlots[0]?.startTime || '09:00';
            const endTime = sortedSlots[sortedSlots.length - 1]?.endTime || '17:00';
            const slotDuration = 30;
            const bufferTime = 5;
            schedule = await this.db.doctorSchedule.create({
                data: {
                    doctorId,
                    profileId: profile.id,
                    templateId: template.id,
                    dayOfWeek,
                    date: scheduleDate,
                    startTime,
                    endTime,
                    slotDuration,
                    bufferTime,
                    isAvailable: timeSlots.some(slot => slot.isAvailable),
                    notes: `Availability created for ${date}`,
                },
            });
        }
        else {
            const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
            const totalSlots = timeSlots.length;
            await this.db.doctorSchedule.update({
                where: { id: schedule.id },
                data: {
                    isAvailable: availableSlots > 0,
                    notes: `Updated availability: ${availableSlots}/${totalSlots} slots available`,
                },
            });
        }
        return {
            success: true,
            data: {
                schedule,
                timeSlots,
            },
            message: 'Availability updated successfully',
        };
    }
    async createException(doctorId, exceptionData) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                ...exceptionData,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Schedule exception created successfully',
        };
    }
    async getExceptions(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const exceptions = await this.db.doctorScheduleException.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        return {
            success: true,
            data: exceptions,
            message: 'Schedule exceptions retrieved successfully',
        };
    }
    async deleteException(exceptionId) {
        const exception = await this.db.doctorScheduleException.findUnique({ where: { id: exceptionId } });
        if (!exception) {
            throw new common_1.NotFoundException('Schedule exception not found');
        }
        await this.db.doctorScheduleException.delete({ where: { id: exceptionId } });
        return {
            success: true,
            message: 'Schedule exception deleted successfully',
        };
    }
    async bookAppointment(appointmentData) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                id: appointmentData.scheduleId,
                isAvailable: true,
            },
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Schedule is not available');
        }
        const existingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId: appointmentData.doctorId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                status: { not: 'CANCELLED' },
            },
        });
        if (existingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const appointment = await this.db.appointment.create({
            data: {
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                scheduleId: appointmentData.scheduleId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                duration: 30,
                type: appointmentData.type,
                status: 'SCHEDULED',
                notes: appointmentData.notes,
            },
            include: {
                patient: true,
            },
        });
        return {
            success: true,
            data: appointment,
            message: 'Appointment booked successfully',
        };
    }
    async getAppointments(doctorId, startDate, endDate) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'desc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Appointments retrieved successfully',
        };
    }
    async updateAppointment(appointmentId, updateData) {
        const appointment = await this.db.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: updateData,
            include: {
                patient: true,
            },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment updated successfully',
        };
    }
    async cancelAppointment(appointmentId) {
        const appointment = await this.db.appointment.findUnique({ where: { id: appointmentId } });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: { status: 'CANCELLED' },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
};
exports.SchedulingService = SchedulingService;
exports.SchedulingService = SchedulingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof doctor_availability_service_1.DoctorAvailabilityService !== "undefined" && doctor_availability_service_1.DoctorAvailabilityService) === "function" ? _b : Object, typeof (_c = typeof slot_engine_service_1.SlotEngineService !== "undefined" && slot_engine_service_1.SlotEngineService) === "function" ? _c : Object, typeof (_d = typeof appointment_management_service_1.AppointmentManagementService !== "undefined" && appointment_management_service_1.AppointmentManagementService) === "function" ? _d : Object])
], SchedulingService);


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppointmentManagementService_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppointmentManagementService = void 0;
const common_1 = __webpack_require__(1);
const database_service_1 = __webpack_require__(19);
const notification_service_1 = __webpack_require__(45);
const slot_engine_service_1 = __webpack_require__(55);
let AppointmentManagementService = AppointmentManagementService_1 = class AppointmentManagementService {
    constructor(db, slotEngine, notificationService) {
        this.db = db;
        this.slotEngine = slotEngine;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AppointmentManagementService_1.name);
    }
    async createAppointment(appointmentData) {
        const availabilityCheck = await this.slotEngine.checkSlotAvailability(appointmentData.doctorId, appointmentData.date, appointmentData.startTime, appointmentData.endTime);
        if (!availabilityCheck.success) {
            throw new common_1.BadRequestException(availabilityCheck.message);
        }
        const conflictCheck = await this.slotEngine.checkConflicts(appointmentData.doctorId, appointmentData.date, appointmentData.startTime, appointmentData.endTime);
        if (conflictCheck.hasConflicts) {
            throw new common_1.BadRequestException('Time slot conflicts with existing appointment');
        }
        const appointment = await this.db.appointment.create({
            data: {
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
                scheduleId: availabilityCheck.data.scheduleId,
                appointmentDate: new Date(appointmentData.date),
                startTime: appointmentData.startTime,
                endTime: appointmentData.endTime,
                duration: this.slotEngine.calculateSlotDuration(appointmentData.startTime, appointmentData.endTime),
                type: appointmentData.type,
                status: 'PENDING',
                notes: appointmentData.notes,
                patientName: appointmentData.patientName,
                patientPhone: appointmentData.patientPhone,
                patientEmail: appointmentData.patientEmail,
            },
            include: {
                patient: true,
            },
        });
        await this.slotEngine.lockSlot(appointmentData.doctorId, availabilityCheck.data.scheduleId, appointmentData.startTime, appointmentData.endTime);
        return {
            success: true,
            data: appointment,
            message: 'Appointment created successfully',
        };
    }
    async confirmAppointment(appointmentId, doctorId) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: true },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.BadRequestException('Unauthorized to confirm this appointment');
        }
        if (appointment.status !== 'PENDING') {
            throw new common_1.BadRequestException('Appointment is not in pending status');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CONFIRMED',
                confirmedAt: new Date(),
            },
            include: { patient: true },
        });
        try {
            await this.notificationService.notifyAppointmentScheduled(updatedAppointment);
            this.logger.log(`Notification sent to patient ${updatedAppointment.patientId} for appointment ${appointmentId}`);
        }
        catch (error) {
            this.logger.error(`Failed to send notification: ${error.message}`, error.stack);
        }
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment confirmed successfully',
        };
    }
    async rescheduleAppointment(appointmentId, newDate, newStartTime, newEndTime, reason) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot reschedule a cancelled appointment');
        }
        const availabilityCheck = await this.slotEngine.checkSlotAvailability(appointment.doctorId, newDate, newStartTime, newEndTime);
        if (!availabilityCheck.success) {
            throw new common_1.BadRequestException(availabilityCheck.message);
        }
        const conflictCheck = await this.slotEngine.checkConflicts(appointment.doctorId, newDate, newStartTime, newEndTime, appointmentId);
        if (conflictCheck.hasConflicts) {
            throw new common_1.BadRequestException('New time slot conflicts with existing appointment');
        }
        await this.slotEngine.releaseSlot(appointment.doctorId, appointment.scheduleId, appointment.startTime);
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                appointmentDate: new Date(newDate),
                startTime: newStartTime,
                endTime: newEndTime,
                duration: this.slotEngine.calculateSlotDuration(newStartTime, newEndTime),
                scheduleId: availabilityCheck.data.scheduleId,
                status: 'PENDING',
                notes: reason ? `${appointment.notes || ''}\nRescheduled: ${reason}` : appointment.notes,
            },
            include: { patient: true },
        });
        await this.slotEngine.lockSlot(appointment.doctorId, availabilityCheck.data.scheduleId, newStartTime, newEndTime);
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment rescheduled successfully',
        };
    }
    async cancelAppointment(appointmentId, reason, cancelledBy) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Appointment is already cancelled');
        }
        if (appointment.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cannot cancel a completed appointment');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'CANCELLED',
                notes: reason
                    ? `${appointment.notes || ''}\nCancelled by ${cancelledBy}: ${reason}`
                    : appointment.notes,
            },
            include: { patient: true },
        });
        await this.slotEngine.releaseSlot(appointment.doctorId, appointment.scheduleId, appointment.startTime);
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment cancelled successfully',
        };
    }
    async completeAppointment(appointmentId, doctorId, notes) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        if (appointment.doctorId !== doctorId) {
            throw new common_1.BadRequestException('Unauthorized to complete this appointment');
        }
        if (appointment.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Only confirmed appointments can be marked as completed');
        }
        const updatedAppointment = await this.db.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'COMPLETED',
                notes: notes ? `${appointment.notes || ''}\nCompleted: ${notes}` : appointment.notes,
            },
            include: { patient: true },
        });
        return {
            success: true,
            data: updatedAppointment,
            message: 'Appointment marked as completed',
        };
    }
    async getDoctorAppointments(doctorId, startDate, endDate, status) {
        const where = { doctorId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            where.status = status;
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Doctor appointments retrieved successfully',
        };
    }
    async getPatientAppointments(patientId, startDate, endDate, status) {
        const where = { patientId };
        if (startDate && endDate) {
            where.appointmentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        if (status) {
            where.status = status;
        }
        const appointments = await this.db.appointment.findMany({
            where,
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Patient appointments retrieved successfully',
        };
    }
    async getAppointmentById(appointmentId) {
        const appointment = await this.db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: true,
            },
        });
        if (!appointment) {
            throw new common_1.NotFoundException('Appointment not found');
        }
        return {
            success: true,
            data: appointment,
            message: 'Appointment retrieved successfully',
        };
    }
    async getUpcomingAppointments(doctorId, limit = 10) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: { gte: today },
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'asc' },
            take: limit,
        });
        return {
            success: true,
            data: appointments,
            message: 'Upcoming appointments retrieved successfully',
        };
    }
    async getTodaysAppointments(doctorId) {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
                status: { not: 'CANCELLED' },
            },
            include: {
                patient: true,
            },
            orderBy: { startTime: 'asc' },
        });
        return {
            success: true,
            data: appointments,
            message: 'Today\'s appointments retrieved successfully',
        };
    }
    async getAppointmentStats(doctorId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : new Date();
        if (!startDate) {
            start.setDate(start.getDate() - 30);
        }
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const stats = {
            total: appointments.length,
            pending: appointments.filter(apt => apt.status === 'PENDING').length,
            confirmed: appointments.filter(apt => apt.status === 'CONFIRMED').length,
            completed: appointments.filter(apt => apt.status === 'COMPLETED').length,
            cancelled: appointments.filter(apt => apt.status === 'CANCELLED').length,
            noShow: appointments.filter(apt => apt.status === 'NO_SHOW').length,
        };
        return {
            success: true,
            data: stats,
            message: 'Appointment statistics retrieved successfully',
        };
    }
    async getPatientAppointmentHistory(patientId, limit = 20) {
        const appointments = await this.db.appointment.findMany({
            where: { patientId },
            include: {
                patient: true,
            },
            orderBy: { appointmentDate: 'desc' },
            take: limit,
        });
        return {
            success: true,
            data: appointments,
            message: 'Patient appointment history retrieved successfully',
        };
    }
};
exports.AppointmentManagementService = AppointmentManagementService;
exports.AppointmentManagementService = AppointmentManagementService = AppointmentManagementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof slot_engine_service_1.SlotEngineService !== "undefined" && slot_engine_service_1.SlotEngineService) === "function" ? _b : Object, typeof (_c = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _c : Object])
], AppointmentManagementService);


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SlotEngineService = void 0;
const common_1 = __webpack_require__(1);
const schedule_1 = __webpack_require__(50);
const database_service_1 = __webpack_require__(19);
let SlotEngineService = class SlotEngineService {
    constructor(db) {
        this.db = db;
    }
    async generateSlotsForDate(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
                isAvailable: true,
            },
        });
        if (!schedule) {
            return {
                success: true,
                data: [],
                message: 'No schedule found for this date',
            };
        }
        const slots = this.generateTimeSlotsFromSchedule(schedule, date);
        const appointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        const processedSlots = slots.map(slot => {
            const isBooked = appointments.some(apt => apt.startTime === slot.startTime);
            return {
                ...slot,
                isAvailable: !isBooked,
                isBooked,
                status: isBooked ? 'BOOKED' : 'AVAILABLE',
            };
        });
        return {
            success: true,
            data: processedSlots,
            message: 'Slots generated successfully',
        };
    }
    generateTimeSlotsFromSchedule(schedule, date) {
        const slots = [];
        const startTime = new Date(`${date}T${schedule.startTime}`);
        const endTime = new Date(`${date}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            if (slotEnd <= endTime) {
                slots.push({
                    id: `${schedule.id}-${currentTime.toTimeString().split(' ')[0]}`,
                    scheduleId: schedule.id,
                    startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                    endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                    duration: schedule.slotDuration,
                    bufferTime: schedule.bufferTime,
                    location: schedule.location,
                    serviceType: schedule.serviceType,
                    isAvailable: true,
                    isBooked: false,
                    status: 'AVAILABLE',
                });
            }
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    async checkSlotAvailability(doctorId, date, startTime, endTime) {
        const targetDate = new Date(date);
        const conflictingAppointment = await this.db.appointment.findFirst({
            where: {
                doctorId,
                appointmentDate: targetDate,
                startTime,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        if (conflictingAppointment) {
            throw new common_1.BadRequestException('Time slot is already booked');
        }
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
                isAvailable: true,
                startTime: { lte: startTime },
                endTime: { gte: endTime },
            },
        });
        if (!schedule) {
            throw new common_1.BadRequestException('Doctor is not available at this time');
        }
        return {
            success: true,
            data: {
                isAvailable: true,
                scheduleId: schedule.id,
            },
            message: 'Slot is available',
        };
    }
    async lockSlot(doctorId, scheduleId, startTime, endTime) {
        return {
            success: true,
            message: 'Slot locked successfully',
        };
    }
    async releaseSlot(doctorId, scheduleId, startTime) {
        return {
            success: true,
            message: 'Slot released successfully',
        };
    }
    async generateSlotsForDateRange(doctorId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const allSlots = [];
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const slots = await this.generateSlotsForDate(doctorId, dateStr);
            if (slots.success && slots.data.length > 0) {
                allSlots.push({
                    date: dateStr,
                    slots: slots.data,
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return {
            success: true,
            data: allSlots,
            message: 'Slots generated for date range',
        };
    }
    async getAvailableSlotsInRange(doctorId, date, startTime, endTime) {
        const slots = await this.generateSlotsForDate(doctorId, date);
        if (!slots.success) {
            return slots;
        }
        let filteredSlots = slots.data.filter(slot => slot.isAvailable);
        if (startTime) {
            filteredSlots = filteredSlots.filter(slot => slot.startTime >= startTime);
        }
        if (endTime) {
            filteredSlots = filteredSlots.filter(slot => slot.endTime <= endTime);
        }
        return {
            success: true,
            data: filteredSlots,
            message: 'Available slots retrieved successfully',
        };
    }
    async updateSlotStatus(slotId, status) {
        return {
            success: true,
            message: `Slot status updated to ${status}`,
        };
    }
    async markExpiredSlots() {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
        const expiredSchedules = await this.db.doctorSchedule.findMany({
            where: {
                date: {
                    gte: new Date(now.toISOString().split('T')[0]),
                    lt: new Date(now.toISOString().split('T')[0] + 'T23:59:59'),
                },
                endTime: { lt: currentTime },
                isAvailable: true,
            },
        });
        for (const schedule of expiredSchedules) {
            await this.db.doctorSchedule.update({
                where: { id: schedule.id },
                data: { isAvailable: false },
            });
        }
        console.log(`Marked ${expiredSchedules.length} expired schedules as unavailable`);
    }
    async checkConflicts(doctorId, date, startTime, endTime, excludeAppointmentId) {
        const targetDate = new Date(date);
        const whereClause = {
            doctorId,
            appointmentDate: targetDate,
            status: { not: 'CANCELLED' },
        };
        if (excludeAppointmentId) {
            whereClause.id = { not: excludeAppointmentId };
        }
        const conflicts = await this.db.appointment.findMany({
            where: whereClause,
        });
        const overlappingAppointments = conflicts.filter(apt => {
            return ((startTime >= apt.startTime && startTime < apt.endTime) ||
                (endTime > apt.startTime && endTime <= apt.endTime) ||
                (startTime <= apt.startTime && endTime >= apt.endTime));
        });
        return {
            hasConflicts: overlappingAppointments.length > 0,
            conflicts: overlappingAppointments,
            message: overlappingAppointments.length > 0
                ? 'Scheduling conflicts detected'
                : 'No conflicts found',
        };
    }
    async validateSlotDuration(doctorId, duration) {
        const schedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                isAvailable: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!schedule) {
            return {
                isValid: true,
                message: 'No existing schedule to validate against',
            };
        }
        const isValid = duration >= schedule.slotDuration;
        return {
            isValid,
            message: isValid
                ? 'Slot duration is valid'
                : `Slot duration must be at least ${schedule.slotDuration} minutes`,
        };
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    calculateSlotDuration(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return (end.getTime() - start.getTime()) / (1000 * 60);
    }
    async getNextAvailableSlot(doctorId, fromDate) {
        const startDate = fromDate || new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        const slots = await this.generateSlotsForDateRange(doctorId, startDate, endDate.toISOString().split('T')[0]);
        if (!slots.success) {
            return slots;
        }
        for (const daySlots of slots.data) {
            const availableSlot = daySlots.slots.find(slot => slot.isAvailable);
            if (availableSlot) {
                return {
                    success: true,
                    data: {
                        date: daySlots.date,
                        slot: availableSlot,
                    },
                    message: 'Next available slot found',
                };
            }
        }
        return {
            success: false,
            data: null,
            message: 'No available slots found in the next 30 days',
        };
    }
};
exports.SlotEngineService = SlotEngineService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SlotEngineService.prototype, "markExpiredSlots", null);
exports.SlotEngineService = SlotEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], SlotEngineService);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorAvailabilityService = void 0;
const common_1 = __webpack_require__(1);
const schedule_1 = __webpack_require__(50);
const database_service_1 = __webpack_require__(19);
let DoctorAvailabilityService = class DoctorAvailabilityService {
    constructor(db) {
        this.db = db;
    }
    async setRecurringAvailability(doctorId, availabilityData) {
        const doctor = await this.db.user.findUnique({ where: { id: doctorId } });
        if (!doctor) {
            throw new common_1.NotFoundException('Doctor not found');
        }
        let template = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                name: 'Default Weekly Schedule',
            },
        });
        if (template) {
            template = await this.db.doctorScheduleTemplate.update({
                where: { id: template.id },
                data: {
                    description: 'Recurring weekly availability',
                    isDefault: true,
                    isActive: true,
                },
            });
        }
        else {
            template = await this.db.doctorScheduleTemplate.create({
                data: {
                    doctorId,
                    name: 'Default Weekly Schedule',
                    description: 'Recurring weekly availability',
                    isDefault: true,
                    isActive: true,
                },
            });
        }
        for (const dayOfWeek of availabilityData.workingDays) {
            await this.createTimeSlotForDay(template.id, dayOfWeek, availabilityData);
        }
        return {
            success: true,
            data: template,
            message: 'Recurring availability set successfully',
        };
    }
    async createTimeSlotForDay(templateId, dayOfWeek, availabilityData) {
        const existingSlot = await this.db.doctorTimeSlot.findFirst({
            where: {
                templateId,
                dayOfWeek: dayOfWeek,
            },
        });
        if (existingSlot) {
            await this.db.doctorTimeSlot.update({
                where: { id: existingSlot.id },
                data: {
                    startTime: availabilityData.startTime,
                    endTime: availabilityData.endTime,
                    slotDuration: availabilityData.slotDuration,
                    bufferTime: availabilityData.bufferTime,
                    isAvailable: true,
                },
            });
        }
        else {
            await this.db.doctorTimeSlot.create({
                data: {
                    templateId,
                    dayOfWeek: dayOfWeek,
                    startTime: availabilityData.startTime,
                    endTime: availabilityData.endTime,
                    slotDuration: availabilityData.slotDuration,
                    bufferTime: availabilityData.bufferTime,
                    isAvailable: true,
                    maxBookings: 1,
                },
            });
        }
    }
    async markDateUnavailable(doctorId, date, reason) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                date: new Date(date),
                type: 'PERSONAL',
                reason: reason || 'Doctor unavailable',
                isAllDay: true,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Date marked as unavailable',
        };
    }
    async addCustomHours(doctorId, date, startTime, endTime, reason) {
        const exception = await this.db.doctorScheduleException.create({
            data: {
                doctorId,
                date: new Date(date),
                startTime,
                endTime,
                type: 'CUSTOM_HOURS',
                reason: reason || 'Custom working hours',
                isAllDay: false,
            },
        });
        return {
            success: true,
            data: exception,
            message: 'Custom hours added successfully',
        };
    }
    async getAvailability(doctorId, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: true,
            },
        });
        const exceptions = await this.db.doctorScheduleException.findMany({
            where: {
                doctorId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
        });
        const availability = [];
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dayOfWeek = this.getDayOfWeek(currentDate);
            const dateStr = currentDate.toISOString().split('T')[0];
            const exception = exceptions.find(ex => ex.date.toISOString().split('T')[0] === dateStr);
            if (exception) {
                const isAvailable = exception.type !== 'PERSONAL';
                availability.push({
                    date: dateStr,
                    isAvailable,
                    startTime: exception.startTime,
                    endTime: exception.endTime,
                    reason: exception.reason,
                    type: 'exception',
                });
            }
            else if (recurringSchedule) {
                const daySlot = recurringSchedule.timeSlots.find(slot => slot.dayOfWeek === dayOfWeek);
                if (daySlot) {
                    availability.push({
                        date: dateStr,
                        isAvailable: daySlot.isAvailable,
                        startTime: daySlot.startTime,
                        endTime: daySlot.endTime,
                        slotDuration: daySlot.slotDuration,
                        bufferTime: daySlot.bufferTime,
                        type: 'recurring',
                    });
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return {
            success: true,
            data: availability,
            message: 'Availability retrieved successfully',
        };
    }
    async getAvailableSlots(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        let baseSchedule;
        if (exception) {
            if (exception.type === 'PERSONAL') {
                return {
                    success: true,
                    data: [],
                    message: 'Doctor is unavailable on this date',
                };
            }
            baseSchedule = {
                startTime: exception.startTime || '09:00',
                endTime: exception.endTime || '17:00',
                slotDuration: 30,
                bufferTime: 10,
            };
        }
        else {
            const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
                where: {
                    doctorId,
                    isActive: true,
                    isDefault: true,
                },
                include: {
                    timeSlots: {
                        where: {
                            dayOfWeek: dayOfWeek,
                        },
                    },
                },
            });
            if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
                return {
                    success: true,
                    data: [],
                    message: 'No schedule found for this day',
                };
            }
            const daySlot = recurringSchedule.timeSlots[0];
            baseSchedule = {
                startTime: daySlot.startTime,
                endTime: daySlot.endTime,
                slotDuration: daySlot.slotDuration,
                bufferTime: daySlot.bufferTime,
            };
        }
        const slots = this.generateTimeSlots(baseSchedule, date);
        const existingAppointments = await this.db.appointment.findMany({
            where: {
                doctorId,
                appointmentDate: targetDate,
                status: {
                    not: 'CANCELLED',
                },
            },
        });
        const availableSlots = slots.map(slot => {
            const isBooked = existingAppointments.some(apt => apt.startTime === slot.startTime);
            return {
                ...slot,
                isAvailable: !isBooked,
                isBooked,
            };
        });
        return {
            success: true,
            data: availableSlots,
            message: 'Available slots retrieved successfully',
        };
    }
    generateTimeSlots(schedule, date) {
        const slots = [];
        const startTime = new Date(`${date}T${schedule.startTime}`);
        const endTime = new Date(`${date}T${schedule.endTime}`);
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime.getTime() + schedule.slotDuration * 60000);
            if (slotEnd <= endTime) {
                slots.push({
                    id: `${date}-${currentTime.toTimeString().split(' ')[0]}`,
                    startTime: currentTime.toTimeString().split(' ')[0].substring(0, 5),
                    endTime: slotEnd.toTimeString().split(' ')[0].substring(0, 5),
                    isAvailable: true,
                    isBooked: false,
                });
            }
            currentTime = new Date(currentTime.getTime() + (schedule.slotDuration + schedule.bufferTime) * 60000);
        }
        return slots;
    }
    getDayOfWeek(date) {
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        return days[date.getDay()];
    }
    async generateDailySlots() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const doctors = await this.db.user.findMany({
            where: {
                role: 'DOCTOR',
            },
        });
        for (const doctor of doctors) {
            await this.generateSlotsForDoctor(doctor.id, tomorrow.toISOString().split('T')[0]);
        }
        console.log('Daily slot generation completed');
    }
    async generateSlotsForDoctor(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const existingSchedule = await this.db.doctorSchedule.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (existingSchedule) {
            return;
        }
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: {
                    where: {
                        dayOfWeek: dayOfWeek,
                    },
                },
            },
        });
        if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
            return;
        }
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (exception && exception.type === 'PERSONAL') {
            return;
        }
        const profile = await this.db.doctorProfile.findFirst({
            where: { doctorId },
        });
        if (!profile) {
            return;
        }
        const daySlot = recurringSchedule.timeSlots[0];
        const scheduleData = exception ? {
            startTime: exception.startTime || daySlot.startTime,
            endTime: exception.endTime || daySlot.endTime,
            slotDuration: daySlot.slotDuration,
            bufferTime: daySlot.bufferTime,
        } : {
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            slotDuration: daySlot.slotDuration,
            bufferTime: daySlot.bufferTime,
        };
        await this.db.doctorSchedule.create({
            data: {
                doctorId,
                profileId: profile.id,
                templateId: recurringSchedule.id,
                dayOfWeek: dayOfWeek,
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                date: targetDate,
                slotDuration: scheduleData.slotDuration,
                bufferTime: scheduleData.bufferTime,
                maxBookings: 1,
                location: 'Main Clinic',
                serviceType: 'CONSULTATION',
                isAvailable: true,
            },
        });
    }
    async getWorkingHours(doctorId, date) {
        const targetDate = new Date(date);
        const dayOfWeek = this.getDayOfWeek(targetDate);
        const exception = await this.db.doctorScheduleException.findFirst({
            where: {
                doctorId,
                date: targetDate,
            },
        });
        if (exception) {
            const isAvailable = exception.type !== 'PERSONAL';
            return {
                startTime: exception.startTime || '09:00',
                endTime: exception.endTime || '17:00',
                isAvailable,
                reason: exception.reason,
                type: 'exception',
            };
        }
        const recurringSchedule = await this.db.doctorScheduleTemplate.findFirst({
            where: {
                doctorId,
                isActive: true,
                isDefault: true,
            },
            include: {
                timeSlots: {
                    where: {
                        dayOfWeek: dayOfWeek,
                    },
                },
            },
        });
        if (!recurringSchedule || recurringSchedule.timeSlots.length === 0) {
            return {
                startTime: null,
                endTime: null,
                isAvailable: false,
                reason: 'No schedule for this day',
                type: 'no_schedule',
            };
        }
        const daySlot = recurringSchedule.timeSlots[0];
        return {
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            isAvailable: daySlot.isAvailable,
            reason: null,
            type: 'recurring',
        };
    }
};
exports.DoctorAvailabilityService = DoctorAvailabilityService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DoctorAvailabilityService.prototype, "generateDailySlots", null);
exports.DoctorAvailabilityService = DoctorAvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object])
], DoctorAvailabilityService);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const helmet_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.HELMET_CSP_ENABLED === 'true' ? undefined : false,
        hsts: process.env.HELMET_HSTS_ENABLED === 'true' ? undefined : false,
    }));
    const corsOrigins = (process.env.CORS_ORIGIN?.split(',') || [
        'http://localhost:3000',
        'http://localhost:8081',
        'http://localhost:19006',
        'http://192.168.100.110:3000',
        'http://192.168.100.40:3000',
        'http://10.0.2.2:3000',
        'http://10.0.2.15:3000',
    ]).map(o => o.trim());
    app.enableCors({
        origin: corsOrigins,
        credentials: process.env.CORS_CREDENTIALS === 'true',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('iHosi Healthcare API')
        .setDescription('Enterprise Healthcare Information Management System - Authentication Module')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3000;
    const host = '0.0.0.0';
    await app.listen(port, host);
    console.log(`🚀 iHosi Healthcare API running on http://localhost:${port}`);
    console.log(`📱 Android Emulator Access: http://192.168.100.40:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🔐 Authentication Module: Enterprise Grade`);
}
bootstrap();

})();

/******/ })()
;