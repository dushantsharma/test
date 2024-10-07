import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/user.entity';
import { plainToInstance } from 'class-transformer'; // Import plainToInstance
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from '../emails/email.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;  // return user without password
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };

    // Create a new user instance without the password
    const { password, ...userWithoutPassword } = user;

    return {
      user: plainToInstance(User, userWithoutPassword),
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {

    const user = await this.usersService.createUser(registerDto); // Adjust according to your create method

    const token = this.jwtService.sign({ id: user.id, email: user.email });

    const { password, ...userWithoutPassword } = user; // Destructure to omit password

    return { user: plainToInstance(User, userWithoutPassword), token };

  }

  // Generate the reset token
  async generateResetToken(email: string): Promise<string> {
    const payload = { email }; // You can use user ID instead of email if preferred
    const secret = process.env.JWT_RESET_SECRET || 'your-secret-key';
    return jwt.sign(payload, secret, { expiresIn: '5m' }); // Token valid for 5 minutes
  }


  async sendPasswordResetEmail(resetToken, email): Promise<any>  {

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    try {

      return await this.emailService.sendMail({
        to: email,
        subject: 'Password Reset Request',
        text: `Please use this link to reset your password: ${resetLink}`,
        html: `<p>Please use this link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
      });
    } catch (error) {
      return  {
        message: "Something went wrong",
        status: HttpStatus.BAD_REQUEST
      }
    }

  }

  async generatePasswordResetToken(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    try {

      const user = await this.usersService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload, { expiresIn: '5m' });
      
      await this.usersService.saveResetToken(user.id, token);
      await this.sendPasswordResetEmail(token, email);

      return {
        status: HttpStatus.OK,
        message: "Email has been sent."
      }

    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: "Something went wrong."
      }
    }
    
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findUserByEmail(payload.email);
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      
      // Check if the token is already used
      if (user.isTokenUsed || user.resetToken !== token ) {
        throw new BadRequestException('Token has already been used or is invalid.');
      }

      // Update the user's password
      await this.usersService.updatePassword(user.id, newPassword);
      await this.usersService.markResetTokenAsUsed(user.id);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

}
