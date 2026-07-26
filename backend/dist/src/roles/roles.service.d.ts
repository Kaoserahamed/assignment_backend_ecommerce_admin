import { DatabaseService } from '../database/database.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
export declare class RolesService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    createRole(dto: CreateRoleDto): Promise<{
        permissions: ({
            permission: {
                group: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                groupId: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
    getAllRoles(includeInactive?: boolean): Promise<{
        permissionCount: number;
        userCount: number;
        permissions: ({
            permission: {
                group: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                groupId: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
        _count: {
            users: number;
        };
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }[]>;
    getRoleById(id: string): Promise<{
        permissionCount: number;
        userCount: number;
        permissions: ({
            permission: {
                group: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                groupId: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
        _count: {
            users: number;
        };
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<{
        permissions: ({
            permission: {
                group: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                groupId: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }>;
    deleteRole(id: string): Promise<{
        message: string;
    }>;
    assignPermissions(roleId: string, dto: AssignPermissionsDto): Promise<({
        permissions: ({
            permission: {
                group: {
                    id: string;
                    name: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                groupId: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: boolean;
    }) | null>;
    getRolePermissions(roleId: string): Promise<({
        group: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        groupId: string;
    })[]>;
}
