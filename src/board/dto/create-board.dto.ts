import { IsNotEmpty } from "class-validator";

export class CreateBoardDto{
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    day: string;

    @IsNotEmpty()
    isDone: boolean;
}