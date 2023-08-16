import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: AuthService,
    ) { }
    
    async signup(createUserDto: CreateUserDto) : Promise<void> {
        await this.userRepository.signup(createUserDto);
    }

    async login(loginUserDto:LoginUserDto, res:Response) : Promise<void> {
        await this.authService.userLogin(loginUserDto, res);
        const { email } = loginUserDto;
        await this.userRepository.login(email);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findByEmail(email);
    }

    async refresh(req, res: Response): Promise<void> {
        return await this.authService.refresh(req.user, res);
    }
}
