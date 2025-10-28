"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const helmet_1 = require("helmet");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
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
//# sourceMappingURL=main.js.map