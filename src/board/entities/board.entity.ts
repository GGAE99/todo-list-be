import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity'; // User 엔터티와의 관계 설정을 위해 import

@Entity()
export class Board {
    @PrimaryColumn({ type: 'varchar', length: 100 })
    board_id: string;

    @PrimaryColumn({ type: 'varchar', length: 30 })
    user_id: string;

    @Column({ type: 'varchar', length: 200 })
    board_title: string;

    @Column({ type: 'varchar', length: 30 })
    board_color: string;

    @Column({ type: 'date' })
    board_day: string;

    @Column({ type: 'tinyint', width: 1, default: 0 })
    board_isdone: boolean;

    @ManyToOne(() => User, user => user.boards) // User 엔터티와의 관계 설정
    @JoinColumn({ name: 'user_id' })
    user: User;
}