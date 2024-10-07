import { Controller, Post, Body, UnauthorizedException, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';  // Ensure this DTO is correctly imported
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')  // This groups the routes under "auth" in Swagger
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully logged in.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }


  @Post('register') // Define the endpoint for registration
  @ApiOperation({ summary: 'Register a new user' }) // Swagger operation summary
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User registered successfully.', type: User }) // Successful registration response
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this email already exists.' }) // Conflict response for existing users
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }


  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link to the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset link sent successfully.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email does not exist.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
     return this.authService.generatePasswordResetToken(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset the user password using a token' })
  @ApiQuery({ name: 'token', description: 'Token sent to the user\'s email', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: {
          type: 'string',
          description: 'New password that the user wants to set',
          example: 'newSecurePassword123!',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password has been reset successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid token or bad request.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async resetPassword(
    @Query('token') token: string,
    @Body('newPassword') newPassword: string
  ) {
    await this.authService.resetPassword(token, newPassword);
    return { message: 'Password has been reset' };
  }

}
