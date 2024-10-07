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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/user.entity");
const class_transformer_1 = require("class-transformer");
const email_service_1 = require("../emails/email.service");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(usersService, jwtService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findUserByEmail(email);
        if (user && bcrypt.compareSync(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id };
        const { password, ...userWithoutPassword } = user;
        return {
            user: (0, class_transformer_1.plainToInstance)(user_entity_1.User, userWithoutPassword),
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(registerDto) {
        const user = await this.usersService.createUser(registerDto);
        const token = this.jwtService.sign({ id: user.id, email: user.email });
        const { password, ...userWithoutPassword } = user;
        return { user: (0, class_transformer_1.plainToInstance)(user_entity_1.User, userWithoutPassword), token };
    }
    async generateResetToken(email) {
        const payload = { email };
        const secret = process.env.JWT_RESET_SECRET || 'your-secret-key';
        return jwt.sign(payload, secret, { expiresIn: '5m' });
    }
    async sendPasswordResetEmail(resetToken, email) {
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        try {
            return await this.emailService.sendMail({
                to: email,
                subject: 'Password Reset Request',
                text: `Please use this link to reset your password: ${resetLink}`,
                html: `<p>Please use this link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
            });
        }
        catch (error) {
            return {
                message: "Something went wrong",
                status: common_1.HttpStatus.BAD_REQUEST
            };
        }
    }
    async generatePasswordResetToken(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        try {
            const user = await this.usersService.findUserByEmail(email);
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            const payload = { email: user.email, sub: user.id };
            const token = this.jwtService.sign(payload, { expiresIn: '5m' });
            await this.usersService.saveResetToken(user.id, token);
            await this.sendPasswordResetEmail(token, email);
            return {
                status: common_1.HttpStatus.OK,
                message: "Email has been sent."
            };
        }
        catch (error) {
            return {
                status: common_1.HttpStatus.BAD_REQUEST,
                message: "Something went wrong."
            };
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findUserByEmail(payload.email);
            if (!user) {
                throw new common_1.NotFoundException('User not found.');
            }
            if (user.isTokenUsed || user.resetToken !== token) {
                throw new common_1.BadRequestException('Token has already been used or is invalid.');
            }
            await this.usersService.updatePassword(user.id, newPassword);
            await this.usersService.markResetTokenAsUsed(user.id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map