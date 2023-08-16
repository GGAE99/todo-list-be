import { Board } from "src/board/entities/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    user_id: string;

    @Column({ type: 'varchar', unique: true })
    user_email: string;

    @Column({ type: 'varchar' })
    user_pass: string;

    @Column({ type: 'varchar' })
    user_name: string;

    @Column({ type: 'varchar', nullable: true })
    user_refresh: string | null;

    @OneToMany(() => Board, board => board.user)
    boards: Board[];
}