"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    const permissionData = [
        {
            group: 'Dashboard',
            description: 'Dashboard access',
            permissions: [
                { name: 'dashboard:watch', description: 'View dashboard' },
            ],
        },
        {
            group: 'Permission',
            description: 'Permission management',
            permissions: [
                { name: 'permission:watch', description: 'View permissions menu' },
                { name: 'permission:create', description: 'Create permissions' },
                { name: 'permission:read', description: 'Read permissions' },
                { name: 'permission:update', description: 'Update permissions' },
                { name: 'permission:delete', description: 'Delete permissions' },
            ],
        },
        {
            group: 'Role',
            description: 'Role management',
            permissions: [
                { name: 'role:watch', description: 'View roles menu' },
                { name: 'role:create', description: 'Create roles' },
                { name: 'role:read', description: 'Read roles' },
                { name: 'role:update', description: 'Update roles' },
                { name: 'role:delete', description: 'Delete roles' },
            ],
        },
        {
            group: 'User',
            description: 'User management',
            permissions: [
                { name: 'user:watch', description: 'View users menu' },
                { name: 'user:create', description: 'Create users' },
                { name: 'user:read', description: 'Read users' },
                { name: 'user:update', description: 'Update users' },
                { name: 'user:delete', description: 'Delete users' },
            ],
        },
        {
            group: 'Media',
            description: 'Media library management',
            permissions: [
                { name: 'media:watch', description: 'View media menu' },
                { name: 'media:read', description: 'Read media' },
                { name: 'media:upload', description: 'Upload media' },
                { name: 'media:write', description: 'Edit media' },
                { name: 'media:delete', description: 'Delete media' },
            ],
        },
        {
            group: 'Category',
            description: 'Category management',
            permissions: [
                { name: 'category:watch', description: 'View categories menu' },
                { name: 'category:create', description: 'Create categories' },
                { name: 'category:read', description: 'Read categories' },
                { name: 'category:update', description: 'Update categories' },
                { name: 'category:delete', description: 'Delete categories' },
            ],
        },
        {
            group: 'Brand',
            description: 'Brand management',
            permissions: [
                { name: 'brand:watch', description: 'View brands menu' },
                { name: 'brand:create', description: 'Create brands' },
                { name: 'brand:read', description: 'Read brands' },
                { name: 'brand:update', description: 'Update brands' },
                { name: 'brand:delete', description: 'Delete brands' },
            ],
        },
        {
            group: 'Attribute',
            description: 'Attribute management',
            permissions: [
                { name: 'attribute:watch', description: 'View attributes menu' },
                { name: 'attribute:create', description: 'Create attributes' },
                { name: 'attribute:read', description: 'Read attributes' },
                { name: 'attribute:update', description: 'Update attributes' },
                { name: 'attribute:delete', description: 'Delete attributes' },
            ],
        },
        {
            group: 'Product',
            description: 'Product management',
            permissions: [
                { name: 'product:watch', description: 'View products menu' },
                { name: 'product:create', description: 'Create products' },
                { name: 'product:read', description: 'Read products' },
                { name: 'product:update', description: 'Update products' },
                { name: 'product:delete', description: 'Delete products' },
            ],
        },
    ];
    const createdPermissions = [];
    for (const groupData of permissionData) {
        const group = await prisma.permissionGroup.upsert({
            where: { name: groupData.group },
            update: {},
            create: {
                name: groupData.group,
                description: groupData.description,
            },
        });
        for (const permData of groupData.permissions) {
            const permission = await prisma.permission.upsert({
                where: { name: permData.name },
                update: {},
                create: {
                    name: permData.name,
                    description: permData.description,
                    groupId: group.id,
                },
            });
            createdPermissions.push(permission);
        }
    }
    console.log(`✅ Created ${createdPermissions.length} permissions`);
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'Super Administrator' },
        update: {},
        create: {
            name: 'Super Administrator',
            description: 'Full system access with all permissions',
            status: true,
        },
    });
    for (const permission of createdPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: permission.id,
            },
        });
    }
    console.log('✅ Created Super Administrator role with all permissions');
    const catalogRole = await prisma.role.upsert({
        where: { name: 'Catalog Manager' },
        update: {},
        create: {
            name: 'Catalog Manager',
            description: 'Access to catalog management only',
            status: true,
        },
    });
    const catalogPermissionNames = [
        'dashboard:watch',
        'media:watch',
        'media:read',
        'media:upload',
        'media:write',
        'category:watch',
        'category:create',
        'category:read',
        'category:update',
        'brand:watch',
        'brand:create',
        'brand:read',
        'brand:update',
        'attribute:watch',
        'attribute:create',
        'attribute:read',
        'attribute:update',
        'product:watch',
        'product:create',
        'product:read',
        'product:update',
    ];
    const catalogPermissions = createdPermissions.filter((p) => catalogPermissionNames.includes(p.name));
    for (const permission of catalogPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: catalogRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: catalogRole.id,
                permissionId: permission.id,
            },
        });
    }
    console.log('✅ Created Catalog Manager role with limited permissions');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@ecommerce.com' },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'admin@ecommerce.com',
            password: hashedPassword,
            phone: '+1234567890',
            gender: 'Other',
            active: true,
            roleId: superAdminRole.id,
        },
    });
    console.log('✅ Created Super Administrator user');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: admin123');
    const catalogManager = await prisma.user.upsert({
        where: { email: 'catalog@ecommerce.com' },
        update: {},
        create: {
            name: 'Catalog Manager',
            email: 'catalog@ecommerce.com',
            password: hashedPassword,
            phone: '+1234567891',
            gender: 'Other',
            active: true,
            roleId: catalogRole.id,
        },
    });
    console.log('✅ Created Catalog Manager user');
    console.log('   Email: catalog@ecommerce.com');
    console.log('   Password: admin123');
    console.log('\n🎉 Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map