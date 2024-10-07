"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const swagger_1 = require("@nestjs/swagger");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const user_entity_1 = require("../users/user.entity");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.authService.login(user);
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.generatePasswordResetToken(forgotPasswordDto);
    }
    async resetPassword(token, newPassword) {
        await this.authService.resetPassword(token, newPassword);
        return { message: 'Password has been reset' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'User successfully logged in.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'User registered successfully.', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CONFLICT, description: 'User with this email already exists.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send password reset link to the user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Password reset link sent successfully.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'User with this email does not exist.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset the user password using a token' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Token sent to the user\'s email', required: true }),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Password has been reset successfully.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid token or bad request.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'User not found.' }),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map