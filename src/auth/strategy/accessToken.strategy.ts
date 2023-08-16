import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { MyConfigType } from 'src/common/config/myconfig.type';
import { CookieKeys, JwtPayload } from '../constant/token.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    private configService: ConfigService<MyConfigType>,
  ) {
    super({
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req && req?.cookies[CookieKeys.ACCESS_TOKEN],
      ]),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userService.findByEmail(email);

    if (!user || !user.user_refresh) throw new UnauthorizedException();
    return user;
  }
}
