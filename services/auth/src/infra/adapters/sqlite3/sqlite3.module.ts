import { Module } from '@nestjs/common';
import { Sqlite3UsersRepository } from './sqlite3-users.repository';
import { UsersRepository } from '../../../domain/repository/users.repository';
import { NonceRepository } from '../../../domain/repository/nonce.repository';
import { Sqlite3NonceRepository } from './sqlite3-nonce.repository';

const userRepository = {
  provide: UsersRepository,
  useClass: Sqlite3UsersRepository,
};

const nonceRepository = {
  provide: NonceRepository,
  useClass: Sqlite3NonceRepository,
};

@Module({
  imports: [],
  providers: [userRepository, nonceRepository],
  exports: [UsersRepository, NonceRepository],
})
export class Sqlite3Module {}
