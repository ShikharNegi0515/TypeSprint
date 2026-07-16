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
var AchievementsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = exports.ACHIEVEMENTS = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_achievement_entity_1 = require("./entities/user-achievement.entity");
exports.ACHIEVEMENTS = {
    first_test: { id: 'first_test', title: 'First Steps', description: 'Complete your first typing test', icon: '🎯', color: 'bg-blue-500/20 text-blue-500' },
    speed_demon: { id: 'speed_demon', title: 'Speed Demon', description: 'Reach 100 WPM', icon: '⚡', color: 'bg-yellow-500/20 text-yellow-500' },
    perfectionist: { id: 'perfectionist', title: 'Perfectionist', description: 'Finish a test with 100% accuracy', icon: '✨', color: 'bg-purple-500/20 text-purple-500' },
    marathon: { id: 'marathon', title: 'Marathon', description: 'Complete a 120-second test', icon: '🏃', color: 'bg-green-500/20 text-green-500' },
};
let AchievementsService = AchievementsService_1 = class AchievementsService {
    userAchievementRepository;
    logger = new common_1.Logger(AchievementsService_1.name);
    constructor(userAchievementRepository) {
        this.userAchievementRepository = userAchievementRepository;
    }
    async getUserAchievements(userId) {
        const records = await this.userAchievementRepository.find({
            where: { user: { id: userId } },
            order: { unlockedAt: 'DESC' },
        });
        return records.map(r => ({
            ...exports.ACHIEVEMENTS[r.achievementId],
            unlockedAt: r.unlockedAt,
        })).filter(a => a.id);
    }
    async checkAndAwardAchievements(userId, stats) {
        const existing = await this.userAchievementRepository.find({ where: { user: { id: userId } } });
        const unlockedIds = new Set(existing.map(e => e.achievementId));
        const newlyUnlocked = [];
        if (stats.totalTests >= 1 && !unlockedIds.has('first_test'))
            newlyUnlocked.push('first_test');
        if (stats.wpm >= 100 && !unlockedIds.has('speed_demon'))
            newlyUnlocked.push('speed_demon');
        if (stats.accuracy >= 100 && !unlockedIds.has('perfectionist'))
            newlyUnlocked.push('perfectionist');
        if (stats.duration >= 120 && !unlockedIds.has('marathon'))
            newlyUnlocked.push('marathon');
        if (newlyUnlocked.length > 0) {
            const entities = newlyUnlocked.map(id => this.userAchievementRepository.create({
                user: { id: userId },
                achievementId: id,
            }));
            await this.userAchievementRepository.save(entities);
            this.logger.log(`Awarded achievements [${newlyUnlocked.join(', ')}] to user ${userId}`);
        }
        return newlyUnlocked.map(id => exports.ACHIEVEMENTS[id]);
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = AchievementsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_achievement_entity_1.UserAchievement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map