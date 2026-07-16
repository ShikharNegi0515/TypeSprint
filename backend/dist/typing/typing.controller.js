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
exports.TypingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typing_service_1 = require("./typing.service");
const create_test_result_dto_1 = require("./dto/create-test-result.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let TypingController = class TypingController {
    typingService;
    constructor(typingService) {
        this.typingService = typingService;
    }
    async saveResult(user, createTestResultDto) {
        return this.typingService.saveResult(user.id, createTestResultDto);
    }
    async getHistory(user) {
        return this.typingService.getUserHistory(user.id);
    }
    async getTests(mode) {
        return this.typingService.getTypingTestsByMode(mode || 'words');
    }
    async getStats(user) {
        return this.typingService.getStats(user.id);
    }
    async getAnalytics(user) {
        return this.typingService.getAnalytics(user.id);
    }
    async getLeaderboard(limit) {
        const parsedLimit = limit ? parseInt(limit, 10) : 10;
        return this.typingService.getLeaderboard(parsedLimit);
    }
};
exports.TypingController = TypingController;
__decorate([
    (0, common_1.Post)('results'),
    (0, swagger_1.ApiOperation)({ summary: 'Save a typing test result' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_test_result_dto_1.CreateTestResultDto]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "saveResult", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user typing test history' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('tests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available typing tests by mode' }),
    __param(0, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getTests", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall user typing stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics data for charts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get global leaderboard' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getLeaderboard", null);
exports.TypingController = TypingController = __decorate([
    (0, swagger_1.ApiTags)('typing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('typing'),
    __metadata("design:paramtypes", [typing_service_1.TypingService])
], TypingController);
//# sourceMappingURL=typing.controller.js.map