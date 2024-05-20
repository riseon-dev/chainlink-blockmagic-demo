import { Injectable } from '@nestjs/common';
import {
  User,
  UsersRepository,
} from '../../../domain/repository/users.repository';

@Injectable()
export class Sqlite3UsersRepository implements UsersRepository {
  private readonly data: Map<string, User> = new Map();

  constructor() {}

  findByAccountAddress(accountAddress: string): Promise<User | null> {
    const user = this.data.get(accountAddress);
    return Promise.resolve(user || null);
  }
  save(user: User): Promise<void> {
    this.data.set(user.accountAddress, user);
    return Promise.resolve();
  }
}
