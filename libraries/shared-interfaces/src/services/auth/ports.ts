import { IsNotEmpty, IsString } from 'class-validator';

export class AuthNonceRequestDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class AuthNonceResponseDto {
  nonce: string;
}

export class AuthTokenRequestDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class AuthTokenResponseDto {
  jwt: string;
}
