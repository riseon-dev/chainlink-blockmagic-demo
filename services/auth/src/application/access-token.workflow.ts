import { Inject, Injectable } from '@nestjs/common';
import { NonceRepository } from 'src/domain/repository/nonce.repository';
import { recoverMessageAddress, Signature } from 'viem';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenWorkflow {
  constructor(
    @Inject() private readonly nonceRepository: NonceRepository,
    private jwtService: JwtService,
  ) {}

  async generateNonce(publicAddress: string): Promise<string> {
    return this.nonceRepository.generateNonce(publicAddress);
  }

  async verifySignatureAndGenerateToken(
    publicAddress: `0x${string}`,
    signature: `0x${string}` | Uint8Array | Signature,
  ): Promise<string | null> {
    const nonce = this.nonceRepository.getNonce(publicAddress);
    if (!nonce) {
      return null;
    }

    const message = `${publicAddress}-${nonce}`;

    const address = await recoverMessageAddress({
      message,
      signature,
    });

    if (address !== publicAddress) {
      return null;
    }

    // generate jwt token
    const payload = {
      publicAddress: publicAddress as string,
    };

    return this.jwtService.sign(JSON.stringify(payload));
  }
}
