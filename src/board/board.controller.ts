import { Controller, UseGuards, Get, Post, Query, Param, Delete, Put, Body, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Request } from 'express';
import { UpdateBoardDto } from './dto/update-bodard.dto';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@UseGuards(AccessTokenGuard)
@Controller('board')
export class BoardController {
    constructor(
        private readonly boardService: BoardService,
    ){ }
    
    @Get('posts')
    async getBoardByDay(
        @Query('day') day: string,
        @Req() req: Request,
    ) : Promise<Board[]> {
        return await this.boardService.getBoardByDay(day, req);
    }

    @Post('posts')
    async createBoard(
        @Body() createBoardDto: CreateBoardDto,
        @Req() req: Request,
    ) : Promise<void> {
        await this.boardService.createBoard( createBoardDto, req);
    }

    @Delete('posts/:postId')
    async deleteBoard(
        @Param('postId') postId : string,
        @Req() req: Request,
    ) : Promise<void> {
        await this.boardService.deleteBoard(postId, req);
    }

    @Put('posts/:postId')
    async updateBoard(
        @Param('postId') postId : string,
        @Body () updateBoardDto: UpdateBoardDto,
        @Req() req: Request,
    ) : Promise<void> {
        await this.boardService.updateBoard(postId, updateBoardDto, req);
    }
}
