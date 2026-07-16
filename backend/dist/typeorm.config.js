"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./users/entities/user.entity");
const typing_test_entity_1 = require("./typing/entities/typing-test.entity");
const test_result_entity_1 = require("./typing/entities/test-result.entity");
const room_entity_1 = require("./rooms/entities/room.entity");
const room_participant_entity_1 = require("./rooms/entities/room-participant.entity");
const user_achievement_entity_1 = require("./achievements/entities/user-achievement.entity");
(0, dotenv_1.config)();
exports.dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'typesprint',
    entities: [user_entity_1.User, typing_test_entity_1.TypingTest, test_result_entity_1.TestResult, room_entity_1.Room, room_participant_entity_1.RoomParticipant, user_achievement_entity_1.UserAchievement],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=typeorm.config.js.map