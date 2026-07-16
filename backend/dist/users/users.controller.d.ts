import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMyProfile(user: any): Promise<import("./entities/user.entity").User | null>;
    getUser(id: string): Promise<import("./entities/user.entity").User | null>;
}
