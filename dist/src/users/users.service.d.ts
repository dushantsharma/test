import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Otp } from 'src/entities/otp.entity';
export declare class UsersService {
    private readonly UsersService;
    private readonly otpRepository;
    constructor(UsersService: Repository<User>, otpRepository: Repository<Otp>);
    findUserByEmail(email: string): Promise<User | undefined>;
    updateUser(user: User): Promise<void>;
    createUser(registerDto: RegisterDto): Promise<User>;
    saveResetToken(userId: string, token: string): Promise<void>;
    markResetTokenAsUsed(userId: string): Promise<void>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
    createOtp(email: string, code: string): Promise<Otp>;
}
