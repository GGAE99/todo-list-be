import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { UserRepository } from 'src/user/user.repository';
import { BoardRepository } from './board.repository';
import { TypeOrmExModule } from 'src/typeorm-ex.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BoardRepository, 
      UserRepository
    ]),
    PassportModule.register({ defaultStrategy: 'jwt-access' }),
    JwtModule.register({}),
  ],
  controllers: [BoardController],
  providers: [
    BoardService,
    JwtService,
  ]
})
export class BoardModule {}
