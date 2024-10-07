import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: any;
        access_token: any;
    }>;
    register(registerDto: RegisterDto): Promise<User>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
