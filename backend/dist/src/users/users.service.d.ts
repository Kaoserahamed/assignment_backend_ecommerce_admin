import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    createUser(dto: CreateUserDto): Promise<{
        role: {
            permissions: ({
                permission: {
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
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
    }>;
    getAllUsers(page?: number, limit?: number, search?: string, roleId?: string, active?: boolean): Promise<{
        data: {
            role: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                status: boolean;
            };
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            roleId: string;
            email: string;
            phone: string | null;
            gender: string | null;
            avatar: string | null;
            active: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<{
        role: {
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
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
    }>;
    updateUser(id: string, dto: UpdateUserDto, currentUserId: string): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: boolean;
        };
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
    }>;
    deleteUser(id: string, currentUserId: string): Promise<{
        message: string;
    }>;
}
