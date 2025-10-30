Authentication module — contract and data shapes

This README documents the authentication contract for the `auth` module. It is intentionally small and concrete so services/controllers have a clear, enterprise-grade contract to implement.

Endpoints (paths and shapes)

1. POST /auth/register
   - Purpose: Register a new user
   - Request body (application/json): RegisterDto
   - Success (201): { userId: string, email: string }
   - Error (400/409): Validation errors or user already exists

2. POST /auth/login
   - Purpose: Login and issue access/refresh tokens
   - Request body: LoginDto
   - Success (200): { accessToken: string, refreshToken: string, expiresIn: string }
   - Error (401): Invalid credentials, 423: locked account

3. POST /auth/refresh
   - Purpose: Exchange a refresh token for a new access token
   - Request body: RefreshDto
   - Success (200): { accessToken: string, refreshToken?: string }
   - Error (401/403): Invalid or expired refresh token

4. POST /auth/forgot-password
   - Purpose: Request a password reset link or token
   - Request body: ForgotPasswordDto
   - Success (200): { ok: true } (do not reveal whether the email exists)

5. POST /auth/reset-password
   - Purpose: Reset password using a token sent via email
   - Request body: ResetPasswordDto
   - Success (200): { ok: true }
   - Error (400/401): Invalid or expired token

Data shapes (DTOs)

- RegisterDto
  - email: string (email)
  - password: string (min 8, strong)
  - firstName: string
  - lastName: string
  - role?: UserRole (optional, server may ignore or validate)

- LoginDto
  - email: string
  - password: string
  - mfaCode?: string

- RefreshDto
  - refreshToken: string

- ForgotPasswordDto
  - email: string

- ResetPasswordDto
  - token: string
  - newPassword: string

Security considerations

- Access tokens: short-lived (e.g. 15m) JWT signed with JWT_SECRET
- Refresh tokens: long-lived (e.g. 7d) opaque tokens stored in DB and rotated on use
- Passwords: hashed with bcrypt (cost controlled by BCRYPT_ROUNDS)
- Rate-limit endpoints: login, forgot-password and reset-password
- Audit logging: critical actions (login success/failure, password reset, registration)

Errors

- Use consistent error shapes: { statusCode: number, message: string, details?: any }
- Avoid revealing whether an account exists in forgot-password responses

Next steps

- Implement typed DTOs (done in dto/) and wire into controller/service
- Implement repository methods and AuthService business logic
- Add tests for happy and edge cases
