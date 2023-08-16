import { CustomRepository } from "src/typeorm-ex.decorator";
import { Board } from "./entities/board.entity";
import { Repository } from "typeorm";
import { UpdateBoardDto } from "./dto/update-bodard.dto";
import { CreateBoardDto } from "./dto/create-board.dto";
import { uuid } from "uuidv4";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
    async getBoardByDay(
        day: string,
        userId: string,
    ): Promise<Board[]> {
        return await this.find({
            where: {
                user_id: userId,
                board_day: day,
            }
        });
    }

    async createBoard(
        createBoardDto: CreateBoardDto,
        userId: string,
    ): Promise<void> {
        await this.save({
            board_id: uuid(),
            user_id: userId,
            board_title: createBoardDto.title,
            board_color: createBoardDto.color,
            board_day: createBoardDto.day,
            board_isdone: createBoardDto.isDone,
        });
    }

    async deleteBoard(
        postId: string,
        userId: string,
    ): Promise<void> {
        await this.delete({
            user_id: userId,
            board_id: postId,
        });
    }

    async updateBoard(
        postId: string,
        updateBoardDto: UpdateBoardDto,
        userId: string,
    ): Promise<void> {
        const { title, color, day, isDone } = updateBoardDto;
        this.update({
            user_id: userId,
            board_id: postId,
        }, {
            board_title: title,
            board_color: color,
            board_day: day,
            board_isdone: isDone,
        });
    }

    async getBoardByPostId(
        postId: string,
    ): Promise<Board> {
        return await this.findOne({
            where: {
                board_id: postId,
            }
        });
    }
}