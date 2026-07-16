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
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_provider_interface_1 = require("./interfaces/ai-provider.interface");
const ai_enum_1 = require("./enums/ai.enum");
let AiService = AiService_1 = class AiService {
    aiProvider;
    logger = new common_1.Logger(AiService_1.name);
    constructor(aiProvider) {
        this.aiProvider = aiProvider;
    }
    async generateText(dto) {
        const category = dto.category || ai_enum_1.AiCategory.GENERAL;
        const difficulty = dto.difficulty || ai_enum_1.AiDifficulty.MEDIUM;
        this.logger.log(`Generating text: category=${category}, difficulty=${difficulty}`);
        const text = await this.aiProvider.generateText(category, difficulty);
        return { text, category, difficulty };
    }
    getCategories() {
        return Object.values(ai_enum_1.AiCategory);
    }
    getDifficulties() {
        return Object.values(ai_enum_1.AiDifficulty);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_provider_interface_1.AiProvider])
], AiService);
//# sourceMappingURL=ai.service.js.map