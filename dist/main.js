/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const doctor_profile_module_1 = __webpack_require__(/*! ./modules/doctor-profile/doctor-profile.module */ "./src/modules/doctor-profile/doctor-profile.module.ts");
const scheduling_module_1 = __webpack_require__(/*! ./modules/scheduling/scheduling.module */ "./src/modules/scheduling/scheduling.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            doctor_profile_module_1.DoctorProfileModule,
            scheduling_module_1.SchedulingModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const appointments_controller_1 = __webpack_require__(/*! ./controllers/appointments.controller */ "./src/modules/auth/controllers/appointments.controller.ts");
const auth_controller_1 = __webpack_require__(/*! ./controllers/auth.controller */ "./src/modules/auth/controllers/auth.controller.ts");
const auth_service_1 = __webpack_require__(/*! ./services/auth.service */ "./src/modules/auth/services/auth.service.ts");
const database_service_1 = __webpack_require__(/*! ./services/database.service */ "./src/modules/auth/services/database.service.ts");
const jwt_strategy_1 = __webpack_require__(/*! ./strategies/jwt.strategy */ "./src/modules/auth/strategies/jwt.strategy.ts");
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
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
            }),
        ],
        controllers: [auth_controller_1.AuthController, appointments_controller_1.AppointmentsController],
        providers: [
            auth_service_1.AuthService,
            database_service_1.DatabaseService,
            jwt_strategy_1.JwtStrategy,
        ],
        exports: [auth_service_1.AuthService, database_service_1.DatabaseService],
    })
], AuthModule);


/***/ }),

/***/ "./src/modules/auth/controllers/appointments.controller.ts":
/*!*****************************************************************!*\
  !*** ./src/modules/auth/controllers/appointments.controller.ts ***!
  \*****************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
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

/***/ "./src/modules/auth/controllers/auth.controller.ts":
/*!*********************************************************!*\
  !*** ./src/modules/auth/controllers/auth.controller.ts ***!
  \*********************************************************/
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
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const auth_service_1 = __webpack_require__(/*! ../services/auth.service */ "./src/modules/auth/services/auth.service.ts");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(credentials) {
        return this.authService.login(credentials);
    }
    async register(userData) {
        return this.authService.register(userData);
    }
    async refreshToken(body) {
        return this.authService.refreshToken(body.refreshToken);
    }
    async logout(req) {
        return this.authService.logout(req.user.userId);
    }
    async getCurrentUser(req) {
        return this.authService.getCurrentUser(req.user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'User registration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Registration successful' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh authentication token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),

/***/ "./src/modules/auth/guards/jwt-auth.guard.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/guards/jwt-auth.guard.ts ***!
  \***************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
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

/***/ "./src/modules/auth/services/auth.service.ts":
/*!***************************************************!*\
  !*** ./src/modules/auth/services/auth.service.ts ***!
  \***************************************************/
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
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");
const database_service_1 = __webpack_require__(/*! ./database.service */ "./src/modules/auth/services/database.service.ts");
let AuthService = class AuthService {
    constructor(db, jwtService) {
        this.db = db;
        this.jwtService = jwtService;
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
        this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
    }
    async register(userData) {
        const existingUser = await this.db.user.findUnique({
            where: { email: userData.email },
        });
        if (existingUser) {
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
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            message: 'User registered successfully',
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async login(credentials) {
        console.log('🔐 Login attempt for:', credentials.email);
        const user = await this.db.user.findUnique({
            where: { email: credentials.email },
        });
        console.log('👤 User found:', !!user);
        console.log('👤 User active:', user?.isActive);
        console.log('👤 User verified:', user?.isVerified);
        if (!user || !user.isActive) {
            console.log('❌ User not found or not active');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log('🔑 Comparing password...');
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        console.log('🔑 Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user.id);
        return {
            success: true,
            user: this.mapUserToResponse(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        const session = await this.db.userSession.findUnique({
            where: { refreshToken },
            include: { user: true },
        });
        if (!session || !session.isActive || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.generateTokens(session.userId);
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
    async logout(userId) {
        await this.db.userSession.updateMany({
            where: { userId },
            data: { isActive: false },
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
    async generateTokens(userId) {
        const accessToken = this.jwtService.sign({ userId, type: 'access' }, { expiresIn: this.jwtExpiresIn });
        const refreshToken = this.jwtService.sign({ userId, type: 'refresh' }, { expiresIn: this.refreshTokenExpiresIn });
        await this.db.userSession.create({
            data: {
                userId,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
            refreshToken,
            token: accessToken,
        };
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
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./src/modules/auth/services/database.service.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/services/database.service.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const client_1 = __webpack_require__(/*! @prisma/client */ "@prisma/client");
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

/***/ "./src/modules/auth/strategies/jwt.strategy.ts":
/*!*****************************************************!*\
  !*** ./src/modules/auth/strategies/jwt.strategy.ts ***!
  \*****************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_jwt_1 = __webpack_require__(/*! passport-jwt */ "passport-jwt");
const database_service_1 = __webpack_require__(/*! ../services/database.service */ "./src/modules/auth/services/database.service.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, db) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
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

/***/ "./src/modules/doctor-profile/controllers/doctor-profile.controller.ts":
/*!*****************************************************************************!*\
  !*** ./src/modules/doctor-profile/controllers/doctor-profile.controller.ts ***!
  \*****************************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const doctor_profile_service_1 = __webpack_require__(/*! ../services/doctor-profile.service */ "./src/modules/doctor-profile/services/doctor-profile.service.ts");
let DoctorProfileController = class DoctorProfileController {
    constructor(doctorProfileService) {
        this.doctorProfileService = doctorProfileService;
    }
    async createProfile(req, profileData) {
        return this.doctorProfileService.createProfile(req.user.id, profileData);
    }
    async getProfile(req) {
        return this.doctorProfileService.getProfile(req.user.id);
    }
    async updateProfile(req, updateData) {
        return this.doctorProfileService.updateProfile(req.user.id, updateData);
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

/***/ "./src/modules/doctor-profile/doctor-profile.module.ts":
/*!*************************************************************!*\
  !*** ./src/modules/doctor-profile/doctor-profile.module.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DoctorProfileModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const database_service_1 = __webpack_require__(/*! ../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
const doctor_profile_controller_1 = __webpack_require__(/*! ./controllers/doctor-profile.controller */ "./src/modules/doctor-profile/controllers/doctor-profile.controller.ts");
const doctor_profile_service_1 = __webpack_require__(/*! ./services/doctor-profile.service */ "./src/modules/doctor-profile/services/doctor-profile.service.ts");
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

/***/ "./src/modules/doctor-profile/services/doctor-profile.service.ts":
/*!***********************************************************************!*\
  !*** ./src/modules/doctor-profile/services/doctor-profile.service.ts ***!
  \***********************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const database_service_1 = __webpack_require__(/*! ../../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
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
                specialization: profileData.specialization,
                bio: profileData.bio,
                experience: profileData.experience,
                education: profileData.education,
                consultationFee: profileData.consultationFee,
                services: profileData.services,
                availability: profileData.availability,
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
        const updatedProfile = await this.db.doctorProfile.update({
            where: { doctorId },
            data: updateData,
        });
        return {
            success: true,
            data: updatedProfile,
            message: 'Doctor profile updated successfully'
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

/***/ "./src/modules/scheduling/controllers/scheduling.controller.ts":
/*!*********************************************************************!*\
  !*** ./src/modules/scheduling/controllers/scheduling.controller.ts ***!
  \*********************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const jwt_auth_guard_1 = __webpack_require__(/*! ../../auth/guards/jwt-auth.guard */ "./src/modules/auth/guards/jwt-auth.guard.ts");
const scheduling_dto_1 = __webpack_require__(/*! ../dto/scheduling.dto */ "./src/modules/scheduling/dto/scheduling.dto.ts");
const scheduling_service_1 = __webpack_require__(/*! ../services/scheduling.service */ "./src/modules/scheduling/services/scheduling.service.ts");
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

/***/ "./src/modules/scheduling/dto/scheduling.dto.ts":
/*!******************************************************!*\
  !*** ./src/modules/scheduling/dto/scheduling.dto.ts ***!
  \******************************************************/
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
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
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

/***/ "./src/modules/scheduling/scheduling.module.ts":
/*!*****************************************************!*\
  !*** ./src/modules/scheduling/scheduling.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SchedulingModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const database_service_1 = __webpack_require__(/*! ../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
const scheduling_controller_1 = __webpack_require__(/*! ./controllers/scheduling.controller */ "./src/modules/scheduling/controllers/scheduling.controller.ts");
const appointment_management_service_1 = __webpack_require__(/*! ./services/appointment-management.service */ "./src/modules/scheduling/services/appointment-management.service.ts");
const doctor_availability_service_1 = __webpack_require__(/*! ./services/doctor-availability.service */ "./src/modules/scheduling/services/doctor-availability.service.ts");
const scheduling_service_1 = __webpack_require__(/*! ./services/scheduling.service */ "./src/modules/scheduling/services/scheduling.service.ts");
const slot_engine_service_1 = __webpack_require__(/*! ./services/slot-engine.service */ "./src/modules/scheduling/services/slot-engine.service.ts");
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


/***/ }),

/***/ "./src/modules/scheduling/services/appointment-management.service.ts":
/*!***************************************************************************!*\
  !*** ./src/modules/scheduling/services/appointment-management.service.ts ***!
  \***************************************************************************/
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
exports.AppointmentManagementService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const database_service_1 = __webpack_require__(/*! ../../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
const slot_engine_service_1 = __webpack_require__(/*! ./slot-engine.service */ "./src/modules/scheduling/services/slot-engine.service.ts");
let AppointmentManagementService = class AppointmentManagementService {
    constructor(db, slotEngine) {
        this.db = db;
        this.slotEngine = slotEngine;
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
            data: { status: 'CONFIRMED' },
            include: { patient: true },
        });
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
exports.AppointmentManagementService = AppointmentManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof slot_engine_service_1.SlotEngineService !== "undefined" && slot_engine_service_1.SlotEngineService) === "function" ? _b : Object])
], AppointmentManagementService);


/***/ }),

/***/ "./src/modules/scheduling/services/doctor-availability.service.ts":
/*!************************************************************************!*\
  !*** ./src/modules/scheduling/services/doctor-availability.service.ts ***!
  \************************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const database_service_1 = __webpack_require__(/*! ../../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
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


/***/ }),

/***/ "./src/modules/scheduling/services/scheduling.service.ts":
/*!***************************************************************!*\
  !*** ./src/modules/scheduling/services/scheduling.service.ts ***!
  \***************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const database_service_1 = __webpack_require__(/*! ../../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
const appointment_management_service_1 = __webpack_require__(/*! ./appointment-management.service */ "./src/modules/scheduling/services/appointment-management.service.ts");
const doctor_availability_service_1 = __webpack_require__(/*! ./doctor-availability.service */ "./src/modules/scheduling/services/doctor-availability.service.ts");
const slot_engine_service_1 = __webpack_require__(/*! ./slot-engine.service */ "./src/modules/scheduling/services/slot-engine.service.ts");
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
        });
        if (!schedule) {
            return {
                success: true,
                data: [],
                message: 'No schedule found for this date',
            };
        }
        const timeSlots = this.generateTimeSlotsForSchedule(schedule);
        return {
            success: true,
            data: timeSlots,
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
            data: schedule,
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

/***/ "./src/modules/scheduling/services/slot-engine.service.ts":
/*!****************************************************************!*\
  !*** ./src/modules/scheduling/services/slot-engine.service.ts ***!
  \****************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const schedule_1 = __webpack_require__(/*! @nestjs/schedule */ "@nestjs/schedule");
const database_service_1 = __webpack_require__(/*! ../../auth/services/database.service */ "./src/modules/auth/services/database.service.ts");
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

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/schedule":
/*!***********************************!*\
  !*** external "@nestjs/schedule" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ })

/******/ 	});
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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:8081',
            'http://localhost:19006',
            'http://192.168.100.110:3000',
            'http://192.168.100.40:3000',
            'http://10.0.2.2:3000',
            'http://10.0.2.15:3000'
        ],
        credentials: true,
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