export interface NonceRepository {
  generateNonce(publicAddress: string): Promise<string>;
  getNonce(publicAddress: string): Promise<string | null>;
}

export const NonceRepository = Symbol('NonceRepository');
