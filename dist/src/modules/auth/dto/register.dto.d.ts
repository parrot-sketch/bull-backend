import { UserRole } from '../../../common/enums/user-role.enum';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}
