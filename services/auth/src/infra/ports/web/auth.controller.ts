import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import {
  AuthNonceRequestDto,
  AuthNonceResponseDto,
  AuthTokenRequestDto,
  AuthTokenResponseDto,
} from '@haru/shared-interfaces';
import { AccessTokenWorkflow } from 'src/application/access-token.workflow';

@Controller('auth')
export class AuthController {
  private logger: Logger = new Logger(AuthController.name);
  constructor(private readonly ordersWorkflow: AccessTokenWorkflow) {}

  @Post('nonce')
  async nonce(
    @Body() request: AuthNonceRequestDto,
  ): Promise<AuthNonceResponseDto> {
    this.logger.debug(`Generating nonce for ${request.address}`);

    const value = await this.ordersWorkflow.generateNonce(request.address);
    return {
      nonce: value,
    };
  }

  @Post('token')
  async token(
    @Body() request: AuthTokenRequestDto,
  ): Promise<AuthTokenResponseDto> {
    this.logger.debug(`Generating token for ${request.address}`);

    const value = await this.ordersWorkflow.verifySignatureAndGenerateToken(
      request.address as `0x${string}`,
      request.signature as `0x${string}`,
    );
    if (!value)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Invalid signature',
        },
        HttpStatus.FORBIDDEN,
      );

    return {
      jwt: value,
    };
  }
}
