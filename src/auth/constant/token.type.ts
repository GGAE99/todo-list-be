export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export interface JwtPayload {
    email: string;
}

export enum CookieKeys {
    ACCESS_TOKEN = 'TodoAT',
    REFRESH_TOKEN = 'TodoRT',
    EMAIL = 'TodoEmail',
}

type RefreshTokenObj = { refreshToken: string };
export type JwtPayloadWithRefreshToken = JwtPayload & RefreshTokenObj;