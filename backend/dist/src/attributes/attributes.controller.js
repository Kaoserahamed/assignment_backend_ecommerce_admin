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
exports.AttributesController = void 0;
const common_1 = require("@nestjs/common");
const attributes_service_1 = require("./attributes.service");
const create_attribute_dto_1 = require("./dto/create-attribute.dto");
const update_attribute_dto_1 = require("./dto/update-attribute.dto");
const create_value_dto_1 = require("./dto/create-value.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let AttributesController = class AttributesController {
    attributesService;
    constructor(attributesService) {
        this.attributesService = attributesService;
    }
    async createAttribute(dto) {
        return this.attributesService.createAttribute(dto);
    }
    async getAllAttributes() {
        return this.attributesService.getAllAttributes();
    }
    async getAttributeById(id) {
        return this.attributesService.getAttributeById(id);
    }
    async updateAttribute(id, dto) {
        return this.attributesService.updateAttribute(id, dto);
    }
    async deleteAttribute(id) {
        return this.attributesService.deleteAttribute(id);
    }
    async createAttributeValue(attributeId, dto) {
        return this.attributesService.createAttributeValue(attributeId, dto);
    }
    async getAttributeValues(attributeId) {
        return this.attributesService.getAttributeValues(attributeId);
    }
    async getAttributeValueById(attributeId, valueId) {
        return this.attributesService.getAttributeValueById(attributeId, valueId);
    }
    async updateAttributeValue(attributeId, valueId, dto) {
        return this.attributesService.updateAttributeValue(attributeId, valueId, dto);
    }
    async deleteAttributeValue(attributeId, valueId) {
        return this.attributesService.deleteAttributeValue(attributeId, valueId);
    }
};
exports.AttributesController = AttributesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('attributes.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_attribute_dto_1.CreateAttributeDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "createAttribute", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('attributes.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAllAttributes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAttributeById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_attribute_dto_1.UpdateAttributeDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "updateAttribute", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "deleteAttribute", null);
__decorate([
    (0, common_1.Post)(':id/values'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.create'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_value_dto_1.CreateAttributeValueDto]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "createAttributeValue", null);
__decorate([
    (0, common_1.Get)(':id/values'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAttributeValues", null);
__decorate([
    (0, common_1.Get)(':id/values/:valueId'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.view'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('valueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "getAttributeValueById", null);
__decorate([
    (0, common_1.Put)(':id/values/:valueId'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('valueId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "updateAttributeValue", null);
__decorate([
    (0, common_1.Delete)(':id/values/:valueId'),
    (0, permissions_decorator_1.RequirePermissions)('attributes.delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('valueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AttributesController.prototype, "deleteAttributeValue", null);
exports.AttributesController = AttributesController = __decorate([
    (0, common_1.Controller)('attributes'),
    __metadata("design:paramtypes", [attributes_service_1.AttributesService])
], AttributesController);
//# sourceMappingURL=attributes.controller.js.map