"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const typing_module_1 = require("./typing/typing.module");
const user_entity_1 = require("./users/entities/user.entity");
const typing_test_entity_1 = require("./typing/entities/typing-test.entity");
const test_result_entity_1 = require("./typing/entities/test-result.entity");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const rooms_module_1 = require("./rooms/rooms.module");
const room_entity_1 = require("./rooms/entities/room.entity");
const room_participant_entity_1 = require("./rooms/entities/room-participant.entity");
const ai_module_1 = require("./ai/ai.module");
const achievements_module_1 = require("./achievements/achievements.module");
const user_achievement_entity_1 = require("./achievements/entities/user-achievement.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USER', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'typesprint'),
                    entities: [user_entity_1.User, typing_test_entity_1.TypingTest, test_result_entity_1.TestResult, room_entity_1.Room, room_participant_entity_1.RoomParticipant, user_achievement_entity_1.UserAchievement],
                    migrations: [__dirname + '/migrations/*{.ts,.js}'],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            typing_module_1.TypingModule,
            rooms_module_1.RoomsModule,
            ai_module_1.AiModule,
            achievements_module_1.AchievementsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map