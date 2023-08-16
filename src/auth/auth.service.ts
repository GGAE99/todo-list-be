import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MyConfigType } from 'src/common/config/myconfig.type';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcrypt';
import { CookieKeys, JwtPayload, JwtPayloadWithRefreshToken, Tokens } from './constant/token.type';
import { AUTH_ERROR_MESSAGE } from './Error/auth.error.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService<MyConfigType>,
        private readonly userRepository: UserRepository,
    ) { }

    async userLogin(
        loginUserDto: LoginUserDto,
        res: Response,
    ): Promise<void> {
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findByEmail(email);
        const isValid = await bcrypt.compare(password, user.user_pass);

        if (user && isValid) {
            this.setEmailToCookie(res, user.user_email);
            const tokens = await this.getTokens(email);
            await this.updateRefreshToken(email, tokens.refreshToken);
            return this.setTokensToCookie(res, tokens);
        }
        throw new UnauthorizedException(AUTH_ERROR_MESSAGE.INVALID_CREDENTIAL);
    }

    async refresh(
        { email, refreshToken, }: Partial<JwtPayloadWithRefreshToken>,
        res: Response
    ): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.user_refresh) throw new ForbiddenException(AUTH_ERROR_MESSAGE.NOT_LOGINED);
        
        const isValid = await bcrypt.compare(refreshToken, user.user_refresh);
        if (!isValid) throw new ForbiddenException(AUTH_ERROR_MESSAGE.INVALID_TOKEN);

        const tokens = await this.getTokens(user.user_email);
        await this.updateRefreshToken(user.user_email, tokens.refreshToken);
        this.setTokensToCookie(res, tokens);
    }

    async getTokens(
        email: string,
    ): Promise<Tokens> {
        const payload: JwtPayload = { email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRE_SEC') + 's',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRE_SEC') + 's',
            }),
        ]);

        return { accessToken, refreshToken };
    }

    async updateRefreshToken(
        email: string,
        refreshToken: string
    ) {
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.updateRefreshToken(email, hashedRefresh);
    }

    setTokensToCookie(
        response: Response,
        tokens: Tokens
    ): void {
        response.cookie(CookieKeys.ACCESS_TOKEN, tokens.accessToken, {
            httpOnly: true,
            expires: this.getExpiredDate(
                this.configService.get('ACCESS_TOKEN_EXPIRE_SEC'),
            ),
        });
        response.cookie(CookieKeys.REFRESH_TOKEN, tokens.refreshToken, {
            httpOnly: true,
            expires: this.getExpiredDate(
                this.configService.get('REFRESH_TOKEN_EXPIRE_SEC'),
            ),
        });
    }

    setEmailToCookie(
        reponse: Response,
        email: string
    ): void {
        reponse.cookie(CookieKeys.EMAIL, email, {
            httpOnly: true,
            expires: this.getExpiredDate(
                this.configService.get('EMAIL_TOKEN_EXPIRE_SEC'),
            ),
        });
    }

    getExpiredDate(
        expireSec: number
    ): Date {
        return new Date(+new Date() + expireSec * 1000);
    }


}
