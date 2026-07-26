import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
    getSession(user: any): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        gender: string | null;
        avatar: string | null;
        role: {
            id: string;
            name: string;
        };
        permissions: string[];
    }>;
}
