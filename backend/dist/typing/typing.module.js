"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typing_service_1 = require("./typing.service");
const typing_controller_1 = require("./typing.controller");
const typing_test_entity_1 = require("./entities/typing-test.entity");
const test_result_entity_1 = require("./entities/test-result.entity");
const achievements_module_1 = require("../achievements/achievements.module");
let TypingModule = class TypingModule {
};
exports.TypingModule = TypingModule;
exports.TypingModule = TypingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([typing_test_entity_1.TypingTest, test_result_entity_1.TestResult]), achievements_module_1.AchievementsModule],
        controllers: [typing_controller_1.TypingController],
        providers: [typing_service_1.TypingService],
        exports: [typing_service_1.TypingService],
    })
], TypingModule);
//# sourceMappingURL=typing.module.js.map