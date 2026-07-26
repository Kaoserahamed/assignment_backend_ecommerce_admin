import { PermissionsService } from './permissions.service';
import { CreatePermissionGroupDto } from './dto/create-permission-group.dto';
import { UpdatePermissionGroupDto } from './dto/update-permission-group.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    createPermissionGroup(dto: CreatePermissionGroupDto): Promise<{
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            groupId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllPermissionGroups(): Promise<({
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            groupId: string;
        }[];
        _count: {
            permissions: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getPermissionGroupById(id: string): Promise<{
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            groupId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updatePermissionGroup(id: string, dto: UpdatePermissionGroupDto): Promise<{
        permissions: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            groupId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePermissionGroup(id: string): Promise<{
        message: string;
    }>;
    createPermission(dto: CreatePermissionDto): Promise<{
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
    }>;
    getAllPermissions(groupId?: string): Promise<({
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
    getPermissionById(id: string): Promise<{
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
    }>;
    updatePermission(id: string, dto: Partial<CreatePermissionDto>): Promise<{
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
    }>;
    deletePermission(id: string): Promise<{
        message: string;
    }>;
}
