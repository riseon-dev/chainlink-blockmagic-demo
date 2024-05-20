export interface User {
  accountAddress: string;
  jwt: string;
}

export interface UsersRepository {
  findByAccountAddress(accountAddress: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export const UsersRepository = Symbol('UsersRepository');
