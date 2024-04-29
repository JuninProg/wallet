import { Test, TestingModule } from '@nestjs/testing';
import { VerifyTokenService } from './verify-token.service';
import { JwtService } from '@nestjs/jwt';
import { VerifyTokenDTO } from 'src/interface/auth/dtos';
import { HttpException } from '@nestjs/common';

describe('VerifyTokenService', () => {
  let verifyTokenService: VerifyTokenService, verifyAsync: jest.Func;

  const TOKEN = 'sometoken';

  beforeEach(async () => {
    verifyAsync = jest.fn((token) => {
      if (token === TOKEN) return {};
      throw new Error('Invalid token');
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyTokenService,
        {
          provide: JwtService,
          useValue: {
            verifyAsync,
          },
        },
      ],
    }).compile();

    verifyTokenService = module.get<VerifyTokenService>(VerifyTokenService);
  });

  it('Should pass a valid token and return payload', async () => {
    const data: VerifyTokenDTO = {
      token: TOKEN,
    };

    const response = await verifyTokenService.execute(data);

    expect(response).toEqual({});
    expect(verifyAsync).toHaveBeenCalledWith(data.token);
  });

  it('Should pass an invalid token and throw exception', async () => {
    const data: VerifyTokenDTO = {
      token: 'othertoken',
    };

    try {
      await verifyTokenService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
    expect(verifyAsync).toHaveBeenCalledWith(data.token);
  });
});
