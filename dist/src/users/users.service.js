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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const otp_entity_1 = require("../entities/otp.entity");
let UsersService = class UsersService {
    constructor(UsersService, otpRepository) {
        this.UsersService = UsersService;
        this.otpRepository = otpRepository;
    }
    async findUserByEmail(email) {
        return this.UsersService.findOne({ where: { email } });
    }
    async updateUser(user) {
        await this.UsersService.save(user);
    }
    async createUser(registerDto) {
        const existingUser = await this.findUserByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists.');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newUser = this.UsersService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            isActive: true,
        });
        return this.UsersService.save(newUser);
    }
    async saveResetToken(userId, token) {
        await this.UsersService.update(userId, { resetToken: token, isTokenUsed: false });
    }
    async markResetTokenAsUsed(userId) {
        await this.UsersService.update(userId, { isTokenUsed: true });
    }
    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.UsersService.update(userId, { password: hashedPassword });
    }
    async createOtp(email, code) {
        const otp = this.otpRepository.create({ email, code });
        return await this.otpRepository.save(otp);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map