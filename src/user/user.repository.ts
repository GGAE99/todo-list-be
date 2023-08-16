import { CustomRepository } from "src/typeorm-ex.decorator";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { uuid } from "uuidv4";
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserErrorEnum } from "./error/user.error.enum";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async signup(createUserDto: CreateUserDto) : Promise<void> {
        const { email, password, username } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.create({
            user_id: uuid(),
            user_email: email,
            user_pass: hashedPassword,
            user_name: username,
            user_refresh: null,
        });

        if (!user) {
            throw new BadRequestException(UserErrorEnum.SIGN_UP_ERROR);
        }

        await this.save(user);
        return null;
    }

    async login(email:string) : Promise<void> {
        if( !email ){
            throw new BadRequestException(UserErrorEnum.NO_EMAIL_OR_PASSWORD);
        }
        const user = await this.findByEmail(email);
        return null;
    }

    async findByEmail(email: string) : Promise<User> {
        const found = await this.findOne({
            where: { user_email : email }
        });
        if (!found) {
            throw new NotFoundException(UserErrorEnum.NO_FOUND_USER);
        }
        return found;
    }

    async updateRefreshToken(email: string, refreshToken: string) {
        const user = await this.findByEmail(email)
        user.user_refresh = refreshToken;
        await this.save(user);
    }
}