import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findOne(id: string): Promise<User | null>;
    createOAuthUser(profile: {
        email: string;
        username: string;
        googleId: string;
        avatar?: string;
    }): Promise<User>;
}
