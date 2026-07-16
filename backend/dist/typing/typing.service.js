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
var TypingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const test_result_entity_1 = require("./entities/test-result.entity");
const typing_test_entity_1 = require("./entities/typing-test.entity");
const achievements_service_1 = require("../achievements/achievements.service");
let TypingService = TypingService_1 = class TypingService {
    testResultRepository;
    typingTestRepository;
    achievementsService;
    logger = new common_1.Logger(TypingService_1.name);
    constructor(testResultRepository, typingTestRepository, achievementsService) {
        this.testResultRepository = testResultRepository;
        this.typingTestRepository = typingTestRepository;
        this.achievementsService = achievementsService;
    }
    async saveResult(userId, createTestResultDto) {
        let test = null;
        if (createTestResultDto.testId) {
            test = await this.typingTestRepository.findOne({ where: { id: createTestResultDto.testId } });
        }
        const result = this.testResultRepository.create({
            ...createTestResultDto,
            user: { id: userId },
            test: test || undefined,
        });
        const savedResult = await this.testResultRepository.save(result);
        const totalTests = await this.testResultRepository.count({ where: { user: { id: userId } } });
        await this.achievementsService.checkAndAwardAchievements(userId, {
            wpm: createTestResultDto.wpm,
            accuracy: createTestResultDto.accuracy,
            duration: createTestResultDto.duration,
            totalTests,
        });
        return savedResult;
    }
    async getUserHistory(userId) {
        return this.testResultRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getTypingTestsByMode(mode) {
        return this.typingTestRepository.find({
            where: { mode },
        });
    }
    async getStats(userId) {
        const results = await this.testResultRepository.find({
            where: { user: { id: userId } },
        });
        if (results.length === 0) {
            return { totalTests: 0, averageWpm: 0, averageAccuracy: 0, personalBest: 0, timeSpent: 0 };
        }
        const totalTests = results.length;
        const averageWpm = results.reduce((acc, curr) => acc + Number(curr.wpm), 0) / totalTests;
        const averageAccuracy = results.reduce((acc, curr) => acc + Number(curr.accuracy), 0) / totalTests;
        const personalBest = Math.max(...results.map(r => Number(r.wpm)));
        const timeSpent = results.reduce((acc, curr) => acc + Number(curr.duration), 0);
        return {
            totalTests,
            averageWpm: Math.round(averageWpm),
            averageAccuracy: Math.round(averageAccuracy),
            personalBest: Math.round(personalBest),
            timeSpent,
        };
    }
    async getAnalytics(userId) {
        const results = await this.testResultRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'ASC' },
        });
        return results.map(r => ({
            date: r.createdAt.toLocaleDateString(),
            wpm: Number(r.wpm),
            accuracy: Number(r.accuracy),
            mistakes: Number(r.mistakes),
            rawWpm: Number(r.rawWpm),
        }));
    }
    async getLeaderboard(limit = 10) {
        const qb = this.testResultRepository.createQueryBuilder('result')
            .leftJoinAndSelect('result.user', 'user')
            .orderBy('result.wpm', 'DESC')
            .addOrderBy('result.accuracy', 'DESC')
            .take(limit);
        const topResults = await qb.getMany();
        return topResults.map(r => ({
            id: r.id,
            userId: r.user?.id,
            username: r.user?.username,
            wpm: Number(r.wpm),
            accuracy: Number(r.accuracy),
            date: r.createdAt,
        }));
    }
};
exports.TypingService = TypingService;
exports.TypingService = TypingService = TypingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(test_result_entity_1.TestResult)),
    __param(1, (0, typeorm_1.InjectRepository)(typing_test_entity_1.TypingTest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        achievements_service_1.AchievementsService])
], TypingService);
//# sourceMappingURL=typing.service.js.map