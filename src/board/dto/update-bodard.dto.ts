import { IsNotEmpty } from "class-validator";

export class UpdateBoardDto{
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    day: string;

    @IsNotEmpty()
    isDone: boolean;
}