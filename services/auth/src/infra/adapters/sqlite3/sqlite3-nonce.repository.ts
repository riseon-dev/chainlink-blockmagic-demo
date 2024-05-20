import { Injectable } from '@nestjs/common';
import { NonceRepository } from '../../../domain/repository/nonce.repository';
import { v4 as uuid } from 'uuid';

export type Nonce = {
  ts: number;
  nonce: string;
};

@Injectable()
export class Sqlite3NonceRepository implements NonceRepository {
  nonceRepository: Map<string, Nonce> = new Map<string, Nonce>();

  constructor() {}

  async generateNonce(publicAddress: string): Promise<string> {
    const nonce = uuid({}, Buffer.alloc(16)).toString('base64');

    this.nonceRepository.set(publicAddress, { ts: Date.now(), nonce });
    return Promise.resolve(nonce);
  }

  /**
   * Retrieves nonce, but can only do this once
   * @param publicAddress public wallet address
   */
  async getNonce(publicAddress: string): Promise<string | null> {
    const result = this.nonceRepository.get(publicAddress);
    if (!result) return null;
    this.nonceRepository.delete(publicAddress);

    if (Date.now() - result.ts > 300000) {
      return null;
    }

    return result.nonce;
  }
}
