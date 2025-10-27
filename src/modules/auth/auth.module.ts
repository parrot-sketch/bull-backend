import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppointmentsController } from './controllers/appointments.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [AuthController, AppointmentsController],
  providers: [
    AuthService,
    DatabaseService,
    JwtStrategy,
  ],
  exports: [AuthService, DatabaseService],
})
export class AuthModule {}



