import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID:
        configService.get<string>('GOOGLE_CLIENT_ID') || 'mock_client_id',
      clientSecret:
        configService.get<string>('GOOGLE_CLIENT_SECRET') ||
        'mock_client_secret',
      callbackURL:
        configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails, displayName, photos } = profile;
    const email = emails && emails[0] ? emails[0].value : '';
    const avatar = photos && photos[0] ? photos[0].value : undefined;

    const user = await this.authService.validateOAuthUser({
      googleId: id,
      email,
      username: displayName,
      avatar,
    });

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    return done(null, user);
  }
}
