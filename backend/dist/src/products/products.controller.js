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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const create_variant_dto_1 = require("./dto/create-variant.dto");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async createProduct(dto) {
        return this.productsService.createProduct(dto);
    }
    async getAllProducts(page = 1, limit = 20, search, categoryId, brandId, active, featured) {
        const activeBoolean = active === 'true' ? true : active === 'false' ? false : undefined;
        const featuredBoolean = featured === 'true' ? true : featured === 'false' ? false : undefined;
        return this.productsService.getAllProducts(page, limit, search, categoryId, brandId, activeBoolean, featuredBoolean);
    }
    async getProductById(id) {
        return this.productsService.getProductById(id);
    }
    async updateProduct(id, dto) {
        return this.productsService.updateProduct(id, dto);
    }
    async deleteProduct(id) {
        return this.productsService.deleteProduct(id);
    }
    async createVariant(productId, dto) {
        return this.productsService.createVariant(productId, dto);
    }
    async getProductVariants(productId) {
        return this.productsService.getProductVariants(productId);
    }
    async getVariantById(productId, variantId) {
        return this.productsService.getVariantById(productId, variantId);
    }
    async updateVariant(productId, variantId, dto) {
        return this.productsService.updateVariant(productId, variantId, dto);
    }
    async deleteVariant(productId, variantId) {
        return this.productsService.deleteVariant(productId, variantId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('product:create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('product:read'),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('categoryId')),
    __param(4, (0, common_1.Query)('brandId')),
    __param(5, (0, common_1.Query)('active')),
    __param(6, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('product:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('product:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('product:delete'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)(':id/variants'),
    (0, permissions_decorator_1.RequirePermissions)('product:create'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_variant_dto_1.CreateVariantDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "createVariant", null);
__decorate([
    (0, common_1.Get)(':id/variants'),
    (0, permissions_decorator_1.RequirePermissions)('product:read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductVariants", null);
__decorate([
    (0, common_1.Get)(':id/variants/:variantId'),
    (0, permissions_decorator_1.RequirePermissions)('product:read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getVariantById", null);
__decorate([
    (0, common_1.Put)(':id/variants/:variantId'),
    (0, permissions_decorator_1.RequirePermissions)('product:update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariant", null);
__decorate([
    (0, common_1.Delete)(':id/variants/:variantId'),
    (0, permissions_decorator_1.RequirePermissions)('product:delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteVariant", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map