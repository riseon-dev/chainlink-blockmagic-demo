export interface User {
  publicAddress: string;
}

export interface UsersService {
  findUserByAddress(address: string): Promise<User | null>;
}
