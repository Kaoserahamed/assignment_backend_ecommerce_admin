import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(dto: CreateUserDto): Promise<{
        role: {
            permissions: ({
                permission: {
                    id: string;
                    name: string;
                    description: string | null;
                    groupId: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        id: string;
        name: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(page?: number, limit?: number, search?: string, roleId?: string, active?: string): Promise<{
        data: {
            role: {
                id: string;
                name: string;
                description: string | null;
                status: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            id: string;
            name: string;
            email: string;
            phone: string | null;
            gender: string | null;
            avatar: string | null;
            active: boolean;
            roleId: string;
            createdAt: Date;
            updatedAt: Date;
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
                    groupId: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        id: string;
        name: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, dto: UpdateUserDto, user: any): Promise<{
        role: {
            id: string;
            name: string;
            description: string | null;
            status: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        id: string;
        name: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        active: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string, user: any): Promise<{
        message: string;
    }>;
}
