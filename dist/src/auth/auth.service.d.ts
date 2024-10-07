import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from '../emails/email.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, emailService: EmailService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        user: any;
        access_token: any;
    }>;
    register(registerDto: RegisterDto): Promise<any>;
    generateResetToken(email: string): Promise<string>;
    sendPasswordResetEmail(resetToken: any, email: any): Promise<any>;
    generatePasswordResetToken(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
