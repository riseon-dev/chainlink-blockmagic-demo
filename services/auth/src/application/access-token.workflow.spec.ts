import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenWorkflow } from './access-token.workflow';
import { NonceRepository } from '../domain/repository/nonce.repository';

describe('AccessTokenWorkflow', () => {
  let service: AccessTokenWorkflow;
  let nonceRepository: NonceRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenWorkflow,
        {
          provide: NonceRepository,
          useValue: {
            generateNonce: jest.fn(),
            getNonce: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccessTokenWorkflow>(AccessTokenWorkflow);
    nonceRepository = module.get<NonceRepository>(NonceRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateNonce', () => {
    it('should generate a nonce', async () => {
      const publicAddress = '0x1234';
      const nonce = 'nonce';
      jest.spyOn(nonceRepository, 'generateNonce').mockResolvedValueOnce(nonce);

      const result = await service.generateNonce(publicAddress);
      expect(result).toEqual(nonce);
    });
  });

  describe.skip('verifySignatureAndGenerateToken', () => {
    it('should verify signature and generate a token', async () => {
      const publicAddress = '0x1234';
      const signature = '0x5678';
      const nonce = 'nonce';
      const token = 'token';
      jest.spyOn(nonceRepository, 'getNonce').mockResolvedValueOnce(nonce);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);

      const result = await service.verifySignatureAndGenerateToken(
        publicAddress,
        signature,
      );
      expect(result).toEqual(token);
    });
  });

  // Add more tests for other methods in the service
});
