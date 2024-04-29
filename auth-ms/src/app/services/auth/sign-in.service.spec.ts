import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from './sign-in.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/infra/database/repositories/user-repository';
import { User } from 'src/domain/entities/user';
import { SignInDTO } from 'src/interface/auth/dtos';
import { HttpException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: (data: string, encrtypted: string) => data === encrtypted,
}));

describe('SignInService', () => {
  let signInService: SignInService,
    signAsync: jest.Func,
    findByEmail: jest.Func;

  const TOKEN = 'sometoken';
  const USERS = [
    {
      id: 'someuuid',
      email: 'test@mail.com',
      password: 'somepass',
      name: 'somename',
    },
  ];

  beforeEach(async () => {
    signAsync = jest.fn(() => TOKEN);
    findByEmail = jest.fn((email) => {
      const userFound = USERS.find((user) => user.email === email);
      return userFound ? new User(userFound as User) : null;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
        {
          provide: JwtService,
          useValue: {
            signAsync,
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail,
          },
        },
      ],
    }).compile();

    signInService = module.get<SignInService>(SignInService);
  });

  it('Should pass valid email and password to return token', async () => {
    const data: SignInDTO = {
      email: 'test@mail.com',
      password: 'somepass',
    };

    const response = await signInService.execute(data);

    expect(response).toBe(TOKEN);
    expect(findByEmail).toHaveBeenCalledWith(data.email);
    expect(signAsync).toHaveBeenCalledWith({
      id: USERS[0].id,
      name: USERS[0].name,
      email: USERS[0].email,
    });
  });

  it('Should pass valid email and wrong password to throw exception', async () => {
    const data: SignInDTO = {
      email: 'test@mail.com',
      password: '1234',
    };

    try {
      await signInService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByEmail).toHaveBeenCalledWith(data.email);
    expect(signAsync).not.toHaveBeenCalled();
  });

  it('Should pass wrong email and wrong password to throw exception', async () => {
    const data: SignInDTO = {
      email: 'other@mail.com',
      password: '1234',
    };

    try {
      await signInService.execute(data);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }

    expect(findByEmail).toHaveBeenCalledWith(data.email);
    expect(signAsync).not.toHaveBeenCalled();
  });
});
