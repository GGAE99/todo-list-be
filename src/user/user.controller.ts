import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenGuard } from 'src/auth/guard/refreshToken.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('signup')
    async signup(
        @Body() createUserDto: CreateUserDto,
    ): Promise<void> {
        await this.userService.signup(createUserDto);
    }

    @Post('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        await this.userService.login(loginUserDto, res);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        return await this.userService.refresh(req, res);
    }

    // @Get('logout')
    // async logout(
    //     @Req() req,
    //     @Res({ passthrough: true }) res: Response,
    // ): Promise<void>{
    //     await this.userService.logout(req, res);
    // }
}
