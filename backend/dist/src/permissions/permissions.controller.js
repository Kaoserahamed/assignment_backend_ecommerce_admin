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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const create_permission_group_dto_1 = require("./dto/create-permission-group.dto");
const update_permission_group_dto_1 = require("./dto/update-permission-group.dto");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async createPermissionGroup(dto) {
        return this.permissionsService.createPermissionGroup(dto);
    }
    async getAllPermissionGroups() {
        return this.permissionsService.getAllPermissionGroups();
    }
    async getPermissionGroupById(id) {
        return this.permissionsService.getPermissionGroupById(id);
    }
    async updatePermissionGroup(id, dto) {
        return this.permissionsService.updatePermissionGroup(id, dto);
    }
    async deletePermissionGroup(id) {
        return this.permissionsService.deletePermissionGroup(id);
    }
    async createPermission(dto) {
        return this.permissionsService.createPermission(dto);
    }
    async getAllPermissions(groupId) {
        return this.permissionsService.getAllPermissions(groupId);
    }
    async getPermissionById(id) {
        return this.permissionsService.getPermissionById(id);
    }
    async updatePermission(id, dto) {
        return this.permissionsService.updatePermission(id, dto);
    }
    async deletePermission(id) {
        return this.permissionsService.deletePermission(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Post)('groups'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_group_dto_1.CreatePermissionGroupDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "createPermissionGroup", null);
__decorate([
    (0, common_1.Get)('groups'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getAllPermissionGroups", null);
__decorate([
    (0, common_1.Get)('groups/:id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getPermissionGroupById", null);
__decorate([
    (0, common_1.Put)('groups/:id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_permission_group_dto_1.UpdatePermissionGroupDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermissionGroup", null);
__decorate([
    (0, common_1.Delete)('groups/:id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "deletePermissionGroup", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('permissions.create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('permissions.view'),
    __param(0, (0, common_1.Query)('groupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.view'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getPermissionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('permissions.delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "deletePermission", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map