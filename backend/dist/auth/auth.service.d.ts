import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    }>;
    generateToken(user: any): {
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    };
    validateOAuthUser(profile: {
        googleId: string;
        email: string;
        username: string;
        avatar: string;
    }): Promise<import("../users/entities/user.entity").User>;
}
