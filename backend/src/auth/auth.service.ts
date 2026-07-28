import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateOAuthUser(profile: {
    googleId: string;
    email: string;
    username: string;
    avatar: string;
  }) {
    const user = await this.usersService.findByEmail(profile.email);

    if (user) {
      if (!user.googleId) {
        // Link the Google account to the existing user
        await this.usersService.updateGoogleId(user.id, profile.googleId);
      }
      return user;
    }

    return this.usersService.createOAuthUser({
      email: profile.email,
      username:
        profile.username.replace(/\s+/g, '').toLowerCase() +
        Math.floor(Math.random() * 1000),
      googleId: profile.googleId,
      avatar: profile.avatar,
    });
  }
}
