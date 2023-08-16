import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UpdateBoardDto } from './dto/update-bodard.dto';
import { Board } from './entities/board.entity';
import { BoardRepository } from './board.repository';
import { CookieKeys } from 'src/auth/constant/token.type';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/entities/user.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
    constructor(
        private readonly boardRepository: BoardRepository,
        private readonly userRepository: UserRepository,        
    ){}

    async getBoardByDay(
        day: string,
        req: Request
    ): Promise<Board[]> {
        const userId = await this.getUserFromEmailAndReturnUserId(req);
        return await this.boardRepository.getBoardByDay(day, userId);
    }

    async createBoard(
        createBoardDto: CreateBoardDto,
        req: Request
    ): Promise<void> {
        const userId = await this.getUserFromEmailAndReturnUserId(req);
        return await this.boardRepository.createBoard(createBoardDto, userId);
    }

    async deleteBoard(
        postId: string,
        req: Request
    ): Promise<void> {
        const userId = await this.getUserFromEmailAndReturnUserId(req);
        return await this.boardRepository.deleteBoard(postId, userId);
    }

    async updateBoard(
        postId: string,
        updateBoardDto : UpdateBoardDto,
        req: Request
    ): Promise<void> {
        const userId = await this.getUserFromEmailAndReturnUserId(req);
        return await this.boardRepository.updateBoard(postId, updateBoardDto, userId);
    }
    
    async getUserFromEmailAndReturnUserId(req: Request,): Promise<string> {
        const email = this.getEmailFromCookie(req);
        const user = await this.userRepository.findByEmail(email);
        return user.user_id;
    }

    getEmailFromCookie(req: Request): string {
        return req.cookies[CookieKeys.EMAIL];
    }
}
